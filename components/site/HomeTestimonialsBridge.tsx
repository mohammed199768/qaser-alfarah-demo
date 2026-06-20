"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export function HomeTestimonialsBridge() {
  useEffect(() => {
    const header = document.querySelector<HTMLElement>("[data-testimonials-header]");
    const featured = document.querySelector<HTMLElement>("[data-testimonials-featured]");
    const cards = gsap.utils.toArray<HTMLElement>("[data-testimonials-card]");

    if (!header && !featured && cards.length === 0) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches) {
      if (header) gsap.set(header, { clearProps: "all" });
      if (featured) gsap.set(featured, { clearProps: "all" });
      if (cards.length > 0) gsap.set(cards, { clearProps: "all" });
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      // Section header — gentle upward reveal
      if (header) {
        ScrollTrigger.create({
          trigger: header,
          start: "top 86%",
          once: true,
          onEnter: () => {
            gsap.to(header, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 0.85,
              ease: "power3.out",
              force3D: false,
            });
          },
        });
      }

      // Featured DM card — slightly deeper reveal
      if (featured) {
        ScrollTrigger.create({
          trigger: featured,
          start: "top 84%",
          once: true,
          onEnter: () => {
            gsap.to(featured, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1.0,
              ease: "power3.out",
              force3D: false,
            });
          },
        });
      }

      // Smaller cards — staggered cascade
      const firstCard = cards[0];
      if (cards.length > 0 && firstCard) {
        ScrollTrigger.create({
          trigger: firstCard,
          start: "top 88%",
          once: true,
          onEnter: () => {
            gsap.to(cards, {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.10, from: "start" },
              duration: 0.80,
              ease: "power3.out",
              force3D: false,
            });
          },
        });
      }

      window.setTimeout(() => ScrollTrigger.refresh(), 100);
    });

    return () => ctx.revert();
  }, []);

  return null;
}
