"use client";

import { useEffect, useRef } from "react";

type Bubble = {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  phase: number;
  poppedUntil: number;
};

type Spark = {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  life: number;
  ttl: number;
};

const TARGET_FPS = 30;
const FRAME_INTERVAL = 1000 / TARGET_FPS;
const MAX_SPARKS = 72;

const clamp = (value: number, min: number, max: number) =>
  Math.min(max, Math.max(min, value));

const randomBetween = (min: number, max: number) =>
  min + Math.random() * (max - min);

export default function HeroBubbleField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const hero = canvas?.parentElement;
    if (!canvas || !hero) return;

    const context = canvas.getContext("2d", { alpha: true });
    if (!context) return;

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const lowCoreDevice = (navigator.hardwareConcurrency || 4) <= 4;
    const bubbles: Bubble[] = [];
    const sparks: Spark[] = [];
    const pointer = { x: -1000, y: -1000, active: false };

    let width = 0;
    let height = 0;
    let sectionTop = 0;
    let pageScrollY = window.scrollY;
    let scrollProgress = 0;
    let targetScrollProgress = 0;
    let animationFrame = 0;
    let lastFrame = 0;
    let isVisible = true;
    let pageVisible = document.visibilityState === "visible";

    const bubbleCount = () => {
      if (width < 640) return lowCoreDevice ? 8 : 10;
      return lowCoreDevice ? 12 : 17;
    };

    const resetBubble = (bubble: Bubble, anywhere = false) => {
      const mobile = width < 640;
      bubble.radius = randomBetween(mobile ? 24 : 34, mobile ? 56 : 92);
      bubble.x = randomBetween(-bubble.radius * 0.15, width + bubble.radius * 0.15);
      bubble.y = anywhere
        ? randomBetween(-bubble.radius, height * 0.9)
        : randomBetween(-bubble.radius * 2.5, -bubble.radius);
      bubble.vx = randomBetween(-7, 7);
      bubble.vy = randomBetween(mobile ? 7 : 5, mobile ? 14 : 12);
      bubble.phase = randomBetween(0, Math.PI * 2);
      bubble.poppedUntil = 0;
    };

    const syncBubbleCount = () => {
      const count = bubbleCount();
      while (bubbles.length < count) {
        const bubble: Bubble = {
          x: 0,
          y: 0,
          radius: 0,
          vx: 0,
          vy: 0,
          phase: 0,
          poppedUntil: 0,
        };
        resetBubble(bubble, true);
        bubbles.push(bubble);
      }
      bubbles.length = count;
    };

    const resize = () => {
      const rect = hero.getBoundingClientRect();
      width = Math.max(1, Math.round(rect.width));
      height = Math.max(1, Math.round(rect.height));
      sectionTop = rect.top + window.scrollY;

      const dpr = Math.min(window.devicePixelRatio || 1, lowCoreDevice ? 1 : 1.35);
      canvas.width = Math.round(width * dpr);
      canvas.height = Math.round(height * dpr);
      canvas.style.width = `${width}px`;
      canvas.style.height = `${height}px`;
      context.setTransform(dpr, 0, 0, dpr, 0, 0);
      syncBubbleCount();
    };

    const addBurst = (bubble: Bubble, drawY: number) => {
      const sparkCount = width < 640 ? 6 : 8;
      const allowed = Math.max(0, MAX_SPARKS - sparks.length);
      const count = Math.min(sparkCount, allowed);

      for (let index = 0; index < count; index += 1) {
        const angle = (Math.PI * 2 * index) / count + randomBetween(-0.18, 0.18);
        const speed = randomBetween(42, 86);
        sparks.push({
          x: bubble.x + Math.cos(angle) * bubble.radius * 0.72,
          y: drawY + Math.sin(angle) * bubble.radius * 0.72,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          radius: randomBetween(1.5, 3.2),
          life: 0,
          ttl: randomBetween(0.32, 0.5),
        });
      }

      bubble.poppedUntil = performance.now() + 620;
    };

    const drawBubble = (bubble: Bubble, drawY: number) => {
      context.beginPath();
      context.arc(bubble.x, drawY, bubble.radius, 0, Math.PI * 2);
      context.fillStyle = "rgba(206, 151, 87, 0.055)";
      context.fill();
      context.lineWidth = bubble.radius > 62 ? 1.5 : 1.1;
      context.strokeStyle = "rgba(157, 103, 48, 0.34)";
      context.stroke();

      context.beginPath();
      context.arc(
        bubble.x - bubble.radius * 0.18,
        drawY - bubble.radius * 0.17,
        bubble.radius * 0.68,
        Math.PI * 1.03,
        Math.PI * 1.48,
      );
      context.lineWidth = Math.max(1.5, bubble.radius * 0.035);
      context.lineCap = "round";
      context.strokeStyle = "rgba(255, 255, 255, 0.72)";
      context.stroke();
    };

    const drawSparks = (deltaSeconds: number) => {
      for (let index = sparks.length - 1; index >= 0; index -= 1) {
        const spark = sparks[index];
        if (!spark) continue;

        spark.life += deltaSeconds;
        if (spark.life >= spark.ttl) {
          sparks.splice(index, 1);
          continue;
        }

        spark.x += spark.vx * deltaSeconds;
        spark.y += spark.vy * deltaSeconds;
        spark.vy += 34 * deltaSeconds;
        const alpha = 1 - spark.life / spark.ttl;

        context.beginPath();
        context.arc(spark.x, spark.y, spark.radius * alpha, 0, Math.PI * 2);
        context.fillStyle = `rgba(181, 119, 54, ${alpha * 0.72})`;
        context.fill();
      }
    };

    const renderStatic = () => {
      context.clearRect(0, 0, width, height);
      bubbles.forEach((bubble) => drawBubble(bubble, bubble.y));
    };

    const animate = (time: number) => {
      animationFrame = 0;
      if (!isVisible || !pageVisible || reducedMotion.matches) return;

      const elapsed = time - lastFrame;
      if (elapsed < FRAME_INTERVAL) {
        animationFrame = requestAnimationFrame(animate);
        return;
      }

      lastFrame = time - (elapsed % FRAME_INTERVAL);
      const deltaSeconds = Math.min(elapsed / 1000, 0.05);
      scrollProgress += (targetScrollProgress - scrollProgress) * 0.14;
      context.clearRect(0, 0, width, height);

      for (const bubble of bubbles) {
        if (bubble.poppedUntil > 0) {
          if (time >= bubble.poppedUntil) resetBubble(bubble);
          continue;
        }

        bubble.phase += deltaSeconds * 0.52;
        bubble.x += (bubble.vx + Math.sin(bubble.phase) * 3.2) * deltaSeconds;
        bubble.y += bubble.vy * deltaSeconds;

        if (bubble.x < -bubble.radius) bubble.x = width + bubble.radius;
        if (bubble.x > width + bubble.radius) bubble.x = -bubble.radius;
        if (bubble.y > height + bubble.radius) resetBubble(bubble);

        const drop = scrollProgress * scrollProgress;
        const drawY = Math.min(
          height + bubble.radius * 0.2,
          bubble.y + (height - bubble.y) * drop * 0.88,
        );

        if (pointer.active) {
          const dx = pointer.x - bubble.x;
          const dy = pointer.y - drawY;
          const hitRadius = bubble.radius + 10;
          if (dx * dx + dy * dy <= hitRadius * hitRadius) {
            addBurst(bubble, drawY);
            continue;
          }
        }

        drawBubble(bubble, drawY);
      }

      drawSparks(deltaSeconds);
      animationFrame = requestAnimationFrame(animate);
    };

    const start = () => {
      if (animationFrame || !isVisible || !pageVisible || reducedMotion.matches) return;
      lastFrame = performance.now();
      animationFrame = requestAnimationFrame(animate);
    };

    const onScroll = () => {
      pageScrollY = window.scrollY;
      targetScrollProgress = clamp(
        (pageScrollY - sectionTop) / Math.max(1, height * 0.82),
        0,
        1,
      );
    };

    const onPointerMove = (event: PointerEvent) => {
      pointer.x = event.clientX;
      pointer.y = event.clientY - (sectionTop - window.scrollY);
      pointer.active = pointer.y >= 0 && pointer.y <= height;
    };

    const onPointerLeave = () => {
      pointer.active = false;
    };

    const onVisibilityChange = () => {
      pageVisible = document.visibilityState === "visible";
      if (!pageVisible && animationFrame) {
        cancelAnimationFrame(animationFrame);
        animationFrame = 0;
      } else {
        start();
      }
    };

    const onReducedMotionChange = () => {
      if (reducedMotion.matches) {
        if (animationFrame) cancelAnimationFrame(animationFrame);
        animationFrame = 0;
        renderStatic();
      } else {
        start();
      }
    };

    const intersectionObserver = new IntersectionObserver(
      ([entry]) => {
        isVisible = Boolean(entry?.isIntersecting);
        if (!isVisible && animationFrame) {
          cancelAnimationFrame(animationFrame);
          animationFrame = 0;
        } else {
          start();
        }
      },
      { rootMargin: "80px 0px" },
    );

    const resizeObserver = new ResizeObserver(() => {
      resize();
      onScroll();
      if (reducedMotion.matches) renderStatic();
    });

    resize();
    onScroll();
    intersectionObserver.observe(hero);
    resizeObserver.observe(hero);
    hero.addEventListener("pointermove", onPointerMove, { passive: true });
    hero.addEventListener("pointerleave", onPointerLeave);
    window.addEventListener("scroll", onScroll, { passive: true });
    document.addEventListener("visibilitychange", onVisibilityChange);
    reducedMotion.addEventListener("change", onReducedMotionChange);

    if (reducedMotion.matches) renderStatic();
    else start();

    return () => {
      if (animationFrame) cancelAnimationFrame(animationFrame);
      intersectionObserver.disconnect();
      resizeObserver.disconnect();
      hero.removeEventListener("pointermove", onPointerMove);
      hero.removeEventListener("pointerleave", onPointerLeave);
      window.removeEventListener("scroll", onScroll);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      reducedMotion.removeEventListener("change", onReducedMotionChange);
    };
  }, []);

  return <canvas ref={canvasRef} className="hero-bubble-field" aria-hidden="true" />;
}
