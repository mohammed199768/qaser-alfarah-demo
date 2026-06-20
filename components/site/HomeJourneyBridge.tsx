"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const SMALL_SCREEN_QUERY = "(max-width: 767px)";

/**
 * Home journey motion island.
 *
 * 1. Hero scene depth: the atmospheric photo backdrop, light beams, and gold
 *    dust drift at different rates as the hero scrolls away (one trigger).
 * 2. Champagne path: each journey gap's line draws downward into its diamond
 *    node as it enters the viewport (one trigger per gap, three gaps).
 *
 * Without JS, on mobile, or with reduced motion everything renders fully
 * visible and static — GSAP only ever *adds* motion, never hides content
 * except the path line whose hidden state is also set here.
 */
export default function HomeJourneyBridge() {
  useEffect(() => {
    if (window.matchMedia(REDUCED_MOTION_QUERY).matches) return;
    if (window.matchMedia(SMALL_SCREEN_QUERY).matches) return;

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // ── Hero scene depth ──
      const hero = document.querySelector<HTMLElement>(".hero-awards");
      const sceneImg = hero?.querySelector<HTMLElement>("[data-hero-scene-img]");
      const beams = gsap.utils.toArray<HTMLElement>(".hero-scene-beam");
      const particles = gsap.utils.toArray<HTMLElement>("[data-hero-particles] span");

      if (hero && sceneImg) {
        const heroDepth = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: hero,
            start: "top top",
            end: "bottom top",
            scrub: 0.7,
            invalidateOnRefresh: true,
          },
        });

        heroDepth.fromTo(
          sceneImg,
          { y: 0, scale: 1.06 },
          { y: 90, scale: 1.13, force3D: true },
          0,
        );
        if (beams.length > 0) {
          heroDepth.to(beams, { xPercent: -7, autoAlpha: 0.45, force3D: false }, 0);
        }
        if (particles.length > 0) {
          heroDepth.to(
            particles,
            {
              y: (index: number) => -44 - (index % 3) * 24,
              autoAlpha: 0.35,
              force3D: false,
            },
            0,
          );
        }
      }

      // ── Champagne path draw-in per journey gap ──
      gsap.utils.toArray<HTMLElement>("[data-journey-gap]").forEach((gap) => {
        const line = gap.querySelector<HTMLElement>("[data-journey-line]");
        const node = gap.querySelector<HTMLElement>("[data-journey-node]");
        if (!line) return;

        gsap.set(line, { scaleY: 0 });
        if (node) gsap.set(node, { scale: 0.2, autoAlpha: 0 });

        const draw = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: gap,
            start: "top 94%",
            end: "bottom 52%",
            scrub: 0.6,
            invalidateOnRefresh: true,
          },
        });

        draw.to(line, { scaleY: 1, duration: 0.62 }, 0);
        if (node) {
          draw.to(node, { scale: 1, autoAlpha: 1, duration: 0.3, ease: "power2.out" }, 0.58);
        }
      });
    });

    const refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 150);

    return () => {
      window.clearTimeout(refreshTimer);
      ctx.revert();
    };
  }, []);

  return null;
}
