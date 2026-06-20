"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const ROTATIONS = [-8, -3, 2, 6, 10];
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function pageRect(element: HTMLElement) {
  const rect = element.getBoundingClientRect();

  return {
    left: rect.left + window.scrollX,
    top: rect.top + window.scrollY,
    width: rect.width,
    height: rect.height,
  };
}

export function HeroArcScrollBridge() {
  useEffect(() => {
    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      const hero = document.querySelector<HTMLElement>(".hero-awards");
      const reels = document.querySelector<HTMLElement>("[data-reels-anchor]");
      const cards = gsap.utils.toArray<HTMLElement>("[data-hero-arc-card]");
      const heroCopy = hero?.querySelector<HTMLElement>("[data-hero-copy]");
      const heroStage = hero?.querySelector<HTMLElement>(".hero-arc-stage");
      const scrollHint = hero?.querySelector<HTMLElement>("[data-hero-scroll-hint]");

      if (!hero || !reels || cards.length === 0) return;

      gsap.set(cards, {
        transformOrigin: "50% 50%",
        force3D: false,
        willChange: "auto",
        filter: "blur(0px)",
      });

      const cardX = (index: number, card: HTMLElement) => {
        const cardBox = pageRect(card);
        const reelsBox = pageRect(reels);
        const cardCenter = cardBox.left + cardBox.width / 2;
        const reelsCenter = reelsBox.left + reelsBox.width / 2;
        const spread = Math.min(86, Math.max(48, reelsBox.width / (cards.length + 1.8)));
        const finalCenter = reelsCenter + (index - (cards.length - 1) / 2) * spread;

        return finalCenter - cardCenter;
      };

      const cardY = (_index: number, card: HTMLElement) => {
        const cardBox = pageRect(card);
        const reelsBox = pageRect(reels);
        const cardCenter = cardBox.top + cardBox.height / 2;
        const finalCenter = reelsBox.top - cardBox.height * 0.62;

        return finalCenter - cardCenter;
      };

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          endTrigger: reels,
          end: "top 22%",
          scrub: 0.55,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onToggle: (self) => {
            cards.forEach((card) => {
              card.classList.toggle("hero-arc-card--scrolling", self.isActive);
            });
          },
          onLeave: () => {
            cards.forEach((card) => card.classList.remove("hero-arc-card--scrolling"));
          },
          onLeaveBack: () => {
            cards.forEach((card) => card.classList.remove("hero-arc-card--scrolling"));
          },
        },
      });

      // Staggered scatter offsets so cards dissolve organically rather than uniformly
      const SCATTER_Y = [0, 18, -14, 12, -8];
      const SCATTER_X = [12, -8, 16, -14, 6];

      timeline
        .to(
          cards,
          {
            x: cardX,
            y: cardY,
            rotation: (index: number) => ROTATIONS[index % ROTATIONS.length] ?? 0,
            scale: 0.84,
            autoAlpha: 0.95,
            force3D: false,
            duration: 0.68,
          },
          0,
        )
        .to(
          cards,
          {
            x: (index: number) => `+=${SCATTER_X[index % SCATTER_X.length] ?? 0}`,
            y: (index: number) => `+=${SCATTER_Y[index % SCATTER_Y.length] ?? 0}`,
            scale: 0.48,
            autoAlpha: 0,
            stagger: { each: 0.028, from: "center" },
            force3D: false,
            duration: 0.32,
          },
          0.68,
        );

      // Cinematic hero exit: copy and stage recede at different rates so the
      // hero gains depth as the visitor moves into the stories world.
      // Same ScrollTrigger — no extra triggers, transform/opacity only.
      if (heroCopy) {
        timeline.to(heroCopy, { y: -42, autoAlpha: 0.5, duration: 0.55, force3D: false }, 0.1);
      }
      if (heroStage) {
        timeline.to(heroStage, { y: -22, scale: 0.985, duration: 0.68, force3D: false }, 0);
      }
      if (scrollHint) {
        timeline.to(scrollHint, { autoAlpha: 0, duration: 0.1, force3D: false }, 0);
      }

      window.setTimeout(() => ScrollTrigger.refresh(), 100);
    });

    return () => ctx.revert();
  }, []);

  return null;
}
