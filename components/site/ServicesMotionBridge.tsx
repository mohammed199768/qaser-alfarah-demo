"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SMALL_SCREEN_QUERY = "(max-width: 767px)";

/**
 * Per-world motion language. These values now drive the one-shot page settle
 * that happens after each service flip, instead of continuous horizontal slide.
 */
type WorldMotion = {
  bgX: number;
  floatX: number;
  floatY: number;
  glowX: number;
  glowY: number;
  rotate: number;
};

type FlipDirection = "forward" | "backward";

const WORLD_MOTION: Record<string, WorldMotion> = {
  hall: { bgX: 4, floatX: 0, floatY: -34, glowX: 24, glowY: -10, rotate: 0 },
  zaffa: { bgX: 6, floatX: 46, floatY: 0, glowX: 38, glowY: 0, rotate: 0 },
  food: { bgX: 3, floatX: 0, floatY: -22, glowX: 0, glowY: 18, rotate: 0 },
  photography: { bgX: 5, floatX: -32, floatY: 12, glowX: -26, glowY: 0, rotate: -4 },
  decoration: { bgX: 3, floatX: -14, floatY: 30, glowX: 12, glowY: 16, rotate: 14 },
  lighting: { bgX: 4, floatX: 0, floatY: -26, glowX: 18, glowY: -18, rotate: 0 },
  dj: { bgX: 5, floatX: 0, floatY: -18, glowX: -20, glowY: 12, rotate: 18 },
  car: { bgX: 6, floatX: 56, floatY: -8, glowX: 30, glowY: 0, rotate: 0 },
  "memory-book": { bgX: 2, floatX: 10, floatY: 18, glowX: 10, glowY: 10, rotate: -6 },
};

const DEFAULT_MOTION: WorldMotion = { bgX: 4, floatX: 0, floatY: -24, glowX: 20, glowY: 0, rotate: 0 };

function target<T extends Element>(element: T | null | undefined): T[] {
  return element ? [element] : [];
}

function toIf(
  timeline: gsap.core.Timeline,
  elements: Element[],
  vars: gsap.TweenVars,
  position?: gsap.Position,
) {
  if (elements.length === 0) return timeline;
  return timeline.to(elements, vars, position);
}

function toTargetIf(
  timeline: gsap.core.Timeline,
  element: Element | null,
  vars: gsap.TweenVars,
  position?: gsap.Position,
) {
  if (!element) return timeline;
  return timeline.to(element, vars, position);
}

function refreshScrollTrigger() {
  ScrollTrigger.refresh();
  ScrollTrigger.update();
}

function clampIndex(index: number, maxIndex: number) {
  return Math.min(Math.max(index, 0), maxIndex);
}

function cssVars(vars: Record<string, string | number>) {
  return vars as gsap.TweenVars;
}

export default function ServicesMotionBridge() {
  useEffect(() => {
    const root = document.querySelector<HTMLElement>("[data-services-page]");
    if (!root) return;
    const pageRoot = root;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches) {
      pageRoot.setAttribute("data-services-static", "reduced-motion");
      return () => pageRoot.removeAttribute("data-services-static");
    }

    const smallScreen = window.matchMedia(SMALL_SCREEN_QUERY);
    if (smallScreen.matches) {
      pageRoot.setAttribute("data-services-static", "mobile");
      return () => pageRoot.removeAttribute("data-services-static");
    }

    gsap.registerPlugin(ScrollTrigger);

    const imageCleanups: Array<() => void> = [];

    const ctx = gsap.context(() => {
      const horizontal = pageRoot.querySelector<HTMLElement>("[data-services-horizontal]");
      const stage = pageRoot.querySelector<HTMLElement>("[data-services-flip-stage]");
      const track = pageRoot.querySelector<HTMLElement>("[data-services-track]");
      const panels = Array.from(pageRoot.querySelectorAll<HTMLElement>("[data-services-flip-page]"));

      if (!horizontal || !stage || !track || panels.length < 2) return;

      const maxIndex = panels.length - 1;
      const viewportWidth = () => document.documentElement.clientWidth || window.innerWidth;
      const scrollDistance = () => Math.max(viewportWidth(), viewportWidth() * maxIndex);
      const snapStep = maxIndex > 0 ? 1 / maxIndex : 1;

      let activeIndex = 0;
      let requestedIndex = 0;
      let isFlipping = false;
      let flipDelay: gsap.core.Tween | null = null;

      const panelFace = (panel: HTMLElement) =>
        panel.querySelector<HTMLElement>("[data-services-page-face]");
      const panelEdge = (panel: HTMLElement) =>
        panel.querySelector<HTMLElement>("[data-services-page-edge]");

      const setOnlyActive = (index: number) => {
        panels.forEach((panel, panelIndex) => {
          const active = panelIndex === index;
          panel.setAttribute("data-services-active", active ? "true" : "false");
          panel.setAttribute("aria-hidden", active ? "false" : "true");
          gsap.set(panel, {
            autoAlpha: active ? 1 : 0,
            pointerEvents: active ? "auto" : "none",
            rotateY: 0,
            xPercent: 0,
            scale: 1,
            zIndex: active ? 3 : 0,
          });

          const face = panelFace(panel);
          const edge = panelEdge(panel);
          if (face) {
            gsap.set(face, cssVars({ "--services-page-shadow": 0, "--services-page-curl": 0 }));
          }
          if (edge) {
            gsap.set(edge, cssVars({ "--services-page-edge-opacity": 0 }));
          }
        });

        pageRoot.setAttribute("data-services-active-index", String(index));
      };

      const revealPanel = (panel: HTMLElement) => {
        if (panel.dataset.servicesRevealed === "true") return;
        panel.dataset.servicesRevealed = "true";

        const titleLines = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-service-title-line]"),
        );
        const revealItems = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll(
            "[data-services-hero-kicker], [data-services-hero-divider], [data-services-hero-body], [data-services-hero-actions], [data-services-hero-stats], [data-service-kicker], [data-service-body], [data-service-meta], [data-service-cta]",
          ),
        );
        const heroStage = target(panel.querySelector<HTMLElement>("[data-services-hero-stage]"));
        const heroBackdrop = target(panel.querySelector<HTMLElement>("[data-services-hero-backdrop]"));
        const heroCards = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-services-hero-card]"),
        );
        const worldMedia = target(panel.querySelector<HTMLElement>("[data-world-media]"));

        const reveal = gsap.timeline({ defaults: { ease: "power3.out" } });
        toIf(reveal, revealItems.slice(0, 1), { autoAlpha: 1, y: 0, duration: 0.42 });
        toIf(reveal, titleLines, { yPercent: 0, duration: 0.7, stagger: 0.065 }, 0.08);
        toIf(reveal, revealItems.slice(1), { autoAlpha: 1, y: 0, duration: 0.56, stagger: 0.06 }, 0.22);
        toIf(reveal, heroBackdrop, { autoAlpha: 1, scale: 1, duration: 0.72 }, 0.08);
        toIf(reveal, heroStage, { autoAlpha: 1, y: 0, scale: 1, duration: 0.72 }, 0.1);
        toIf(
          reveal,
          heroCards,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.75,
            stagger: { each: 0.06, from: "random" },
          },
          0.16,
        );
        toIf(reveal, worldMedia, { autoAlpha: 1, y: 0, scale: 1, duration: 0.85 }, 0.12);
      };

      const settleWorld = (
        timeline: gsap.core.Timeline,
        panel: HTMLElement,
        direction: FlipDirection,
        position: gsap.Position,
      ) => {
        const worldId = panel.dataset.serviceWorld ?? "";
        const motion = WORLD_MOTION[worldId] ?? DEFAULT_MOTION;
        const intensity = Number.parseFloat(panel.dataset.worldIntensity ?? "1") || 1;
        const dir = direction === "forward" ? 1 : -1;

        const bgImage = panel.querySelector<HTMLElement>("[data-world-bg] img");
        const mediaImage = panel.querySelector<HTMLElement>("[data-world-media] img");
        const glowLayers = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-world-glow]"),
        );
        const ornament = target(panel.querySelector<HTMLElement>("[data-world-ornament]"));
        const floats = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-world-float]"),
        );

        if (bgImage) {
          timeline.fromTo(
            bgImage,
            { scale: 1.08, xPercent: motion.bgX * intensity * dir, force3D: true },
            { scale: 1.02, xPercent: 0, duration: 1.05, ease: "power2.out" },
            position,
          );
        }
        if (mediaImage) {
          timeline.fromTo(
            mediaImage,
            { scale: 1.05, force3D: true },
            { scale: 1, duration: 0.95, ease: "power2.out" },
            position,
          );
        }
        if (glowLayers.length > 0) {
          timeline.fromTo(
            glowLayers,
            {
              x: motion.glowX * intensity * dir,
              y: motion.glowY * intensity,
            },
            {
              x: 0,
              y: 0,
              duration: 1,
              ease: "power2.out",
            },
            position,
          );
        }
        if (ornament.length > 0) {
          timeline.fromTo(
            ornament,
            { x: 12 * dir },
            { x: 0, duration: 1.05, ease: "power2.out" },
            position,
          );
        }
        if (floats.length > 0) {
          timeline.fromTo(
            floats,
            {
              x: (i: number) => -motion.floatX * intensity * dir * 0.22 * (1 + (i % 3) * 0.25),
              y: (i: number) => -motion.floatY * intensity * 0.22 * (1 + (i % 2) * 0.35),
              rotation: (i: number) => -motion.rotate * dir * 0.25 * (i % 2 ? 1 : -1),
            },
            {
              x: 0,
              y: 0,
              rotation: 0,
              duration: 1,
              stagger: 0.025,
              ease: "power2.out",
            },
            position,
          );
        }
      };

      function scheduleFlip() {
        if (isFlipping || requestedIndex === activeIndex) return;

        flipDelay?.kill();
        flipDelay = gsap.delayedCall(0.08, () => {
          flipDelay = null;
          if (isFlipping || requestedIndex === activeIndex) return;
          runFlip(requestedIndex);
        });
      }

      function updateRequestedIndex(progress: number) {
        const targetIndex = clampIndex(Math.round(progress * maxIndex), maxIndex);
        if (targetIndex === requestedIndex) return;

        requestedIndex = targetIndex;
        pageRoot.setAttribute("data-services-target-index", String(targetIndex));
        scheduleFlip();
      }

      function runFlip(nextIndex: number) {
        const fromPanel = panels[activeIndex];
        const toPanel = panels[clampIndex(nextIndex, maxIndex)];
        if (!fromPanel || !toPanel || fromPanel === toPanel) return;

        const toIndex = panels.indexOf(toPanel);
        const direction: FlipDirection = toIndex > activeIndex ? "forward" : "backward";
        const fromFace = panelFace(fromPanel);
        const toFace = panelFace(toPanel);
        const fromEdge = panelEdge(fromPanel);
        const toEdge = panelEdge(toPanel);
        const hinge = direction === "forward" ? "left center" : "right center";
        const edgeSide = direction === "forward" ? "right" : "left";
        const rotateAway = direction === "forward" ? -88 : 88;

        isFlipping = true;

        fromPanel.setAttribute("data-services-active", "true");
        fromPanel.setAttribute("aria-hidden", "false");
        toPanel.setAttribute("data-services-active", "true");
        toPanel.setAttribute("aria-hidden", "false");

        gsap.killTweensOf([fromPanel, toPanel, fromFace, toFace, fromEdge, toEdge].filter(Boolean));

        gsap.set(toPanel, {
          autoAlpha: 1,
          pointerEvents: "none",
          rotateY: 0,
          xPercent: direction === "forward" ? 1.5 : -1.5,
          scale: 0.992,
          transformOrigin: "50% 50%",
          zIndex: 2,
        });
        gsap.set(fromPanel, {
          autoAlpha: 1,
          pointerEvents: "none",
          rotateY: 0,
          xPercent: 0,
          scale: 1,
          transformOrigin: hinge,
          zIndex: 4,
        });

        if (fromFace) {
          gsap.set(
            fromFace,
            cssVars({ "--services-page-shadow": 0, "--services-page-curl": 0 }),
          );
        }
        if (toFace) {
          gsap.set(toFace, cssVars({ "--services-page-shadow": 0.14, "--services-page-curl": 0 }));
        }
        if (fromEdge) {
          gsap.set(
            fromEdge,
            cssVars({
              "--services-page-edge-opacity": 0,
              left: edgeSide === "left" ? 0 : "auto",
              right: edgeSide === "right" ? 0 : "auto",
            }),
          );
        }
        if (toEdge) {
          gsap.set(toEdge, cssVars({ "--services-page-edge-opacity": 0 }));
        }

        const timeline = gsap.timeline({
          defaults: { ease: "power3.inOut" },
          onComplete: () => {
            activeIndex = toIndex;
            setOnlyActive(activeIndex);
            revealPanel(toPanel);
            isFlipping = false;

            if (requestedIndex !== activeIndex) {
              scheduleFlip();
            }
          },
        });

        timeline.add(() => revealPanel(toPanel), 0.2);
        toTargetIf(
          timeline,
          fromFace,
          cssVars({
            "--services-page-shadow": 0.62,
            "--services-page-curl": 0.34,
            duration: 0.28,
            ease: "power2.out",
          }),
          0,
        );
        toTargetIf(
          timeline,
          fromEdge,
          cssVars({
            "--services-page-edge-opacity": 1,
            duration: 0.24,
            ease: "power2.out",
          }),
          0.04,
        );
        timeline
          .to(
            fromPanel,
            {
              rotateY: rotateAway,
              xPercent: direction === "forward" ? -1.2 : 1.2,
              duration: 0.78,
              ease: "power3.inOut",
            },
            0,
          )
          .to(
            toPanel,
            {
              xPercent: 0,
              scale: 1,
              duration: 0.7,
              ease: "power2.out",
            },
            0.06,
          );
        toTargetIf(
          timeline,
          toFace,
          cssVars({
            "--services-page-shadow": 0,
            "--services-page-curl": 0.1,
            duration: 0.52,
            ease: "power2.out",
          }),
          0.24,
        );
        toTargetIf(
          timeline,
          fromFace,
          cssVars({
            "--services-page-shadow": 0,
            "--services-page-curl": 0,
            duration: 0.28,
            ease: "power2.out",
          }),
          0.54,
        );
        toTargetIf(
          timeline,
          fromEdge,
          cssVars({
            "--services-page-edge-opacity": 0,
            duration: 0.22,
            ease: "power2.out",
          }),
          0.56,
        );
        timeline.to(fromPanel, { autoAlpha: 0, duration: 0.16, ease: "power1.out" }, 0.66);

        settleWorld(timeline, toPanel, direction, 0.08);
      }

      gsap.set(stage, { perspective: 1800, transformStyle: "preserve-3d" });
      gsap.set(track, { x: 0, clearProps: "transform", transformStyle: "preserve-3d" });

      panels.forEach((panel, index) => {
        const titleLines = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-service-title-line]"),
        );
        const revealItems = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll(
            "[data-services-hero-kicker], [data-services-hero-divider], [data-services-hero-body], [data-services-hero-actions], [data-services-hero-stats], [data-service-kicker], [data-service-body], [data-service-meta], [data-service-cta]",
          ),
        );
        const heroStage = target(panel.querySelector<HTMLElement>("[data-services-hero-stage]"));
        const heroBackdrop = target(panel.querySelector<HTMLElement>("[data-services-hero-backdrop]"));
        const heroCards = gsap.utils.toArray<HTMLElement>(
          panel.querySelectorAll("[data-services-hero-card]"),
        );
        const worldMedia = target(panel.querySelector<HTMLElement>("[data-world-media]"));
        const face = panelFace(panel);
        const edge = panelEdge(panel);
        const isActive = index === activeIndex;

        if (titleLines.length > 0) gsap.set(titleLines, { yPercent: 112, force3D: false });
        if (revealItems.length > 0) gsap.set(revealItems, { autoAlpha: 0, y: 26, force3D: false });
        if (heroStage.length > 0) gsap.set(heroStage, { autoAlpha: 0, y: 42, scale: 0.96, force3D: false });
        if (heroBackdrop.length > 0) gsap.set(heroBackdrop, { autoAlpha: 0, scale: 0.94, force3D: false });
        if (heroCards.length > 0) {
          gsap.set(heroCards, {
            autoAlpha: 0,
            y: 52,
            scale: 0.9,
            transformOrigin: "50% 50%",
            force3D: false,
          });
        }
        if (worldMedia.length > 0) {
          gsap.set(worldMedia, {
            autoAlpha: 0,
            y: 30,
            scale: 0.85,
            transformOrigin: "50% 60%",
            force3D: false,
          });
        }
        if (face) {
          gsap.set(face, cssVars({ "--services-page-shadow": 0, "--services-page-curl": 0 }));
        }
        if (edge) {
          gsap.set(edge, cssVars({ "--services-page-edge-opacity": 0 }));
        }

        panel.setAttribute("data-services-active", isActive ? "true" : "false");
        panel.setAttribute("aria-hidden", isActive ? "false" : "true");
        gsap.set(panel, {
          autoAlpha: isActive ? 1 : 0,
          pointerEvents: isActive ? "auto" : "none",
          rotateY: 0,
          xPercent: 0,
          scale: 1,
          transformOrigin: "left center",
          zIndex: isActive ? 3 : 0,
          force3D: true,
        });
      });

      const firstPanel = panels[0];
      if (firstPanel) {
        gsap.delayedCall(0.08, () => revealPanel(firstPanel));
      }

      ScrollTrigger.create({
        trigger: horizontal,
        start: "top top",
        end: () => `+=${scrollDistance()}`,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        fastScrollEnd: true,
        snap: {
          snapTo: snapStep,
          inertia: false,
          duration: { min: 0.22, max: 0.48 },
          delay: 0.06,
          ease: "power2.out",
        },
        onUpdate: (self) => updateRequestedIndex(self.progress),
        onRefresh: (self) => updateRequestedIndex(self.progress),
      });
    }, pageRoot);

    const refreshTimer = window.setTimeout(refreshScrollTrigger, 150);

    pageRoot.querySelectorAll("img").forEach((image) => {
      if (image.complete) return;

      const refresh = () => refreshScrollTrigger();
      image.addEventListener("load", refresh, { once: true });
      image.addEventListener("error", refresh, { once: true });
      imageCleanups.push(() => {
        image.removeEventListener("load", refresh);
        image.removeEventListener("error", refresh);
      });
    });

    return () => {
      window.clearTimeout(refreshTimer);
      imageCleanups.forEach((cleanup) => cleanup());
      ctx.revert();
    };
  }, []);

  return null;
}
