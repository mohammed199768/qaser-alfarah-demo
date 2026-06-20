"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

export default function CatalogTicketBridge() {
  useEffect(() => {
    const section = document.querySelector<HTMLElement>("[data-catalog-section]");
    const ticket = document.querySelector<HTMLElement>("[data-catalog-ticket]");
    const header = document.querySelector<HTMLElement>("[data-catalog-header]");
    const stage = document.querySelector<HTMLElement>("[data-catalog-stage]");

    if (!section || !ticket || !header || !stage) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches) return;

    gsap.registerPlugin(ScrollTrigger);

    let removeCatalogReadyListener = () => {};

    const ctx = gsap.context(() => {
      let shouldOpenBook = false;
      let didOpenBook = false;
      const openBook = () => {
        if (didOpenBook || !shouldOpenBook) return;

        const nextButton = document.getElementById("catalog-flip-next") as HTMLButtonElement | null;
        if (!nextButton || nextButton.disabled) return;

        didOpenBook = true;
        nextButton.click();
      };

      const onCatalogReady = () => openBook();
      window.addEventListener("catalog-flip-ready", onCatalogReady);
      removeCatalogReadyListener = () => {
        window.removeEventListener("catalog-flip-ready", onCatalogReady);
      };

      gsap.set(ticket, {
        autoAlpha: 0,
        y: -110,
        scale: 0.78,
        rotation: -6,
        force3D: false,
      });

      gsap.set([header, stage], {
        autoAlpha: 0,
        y: 56,
        scale: 0.95,
        force3D: false,
      });

      const timeline = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: section,
          start: "top 86%",
          end: "top 14%",
          scrub: 0.75,
          invalidateOnRefresh: true,
          fastScrollEnd: true,
          onUpdate: (self) => {
            shouldOpenBook = self.progress >= 0.70;
            openBook();
          },
        },
      });

      timeline
        // Ticket lands elegantly
        .to(
          ticket,
          {
            autoAlpha: 1,
            y: 24,
            scale: 1.02,
            rotation: 2,
            duration: 0.32,
          },
          0,
        )
        // Ticket settles and dissolves (shrinks, doesn't zoom toward camera)
        .to(
          ticket,
          {
            y: 52,
            scale: 0.88,
            autoAlpha: 0,
            rotation: 4,
            duration: 0.24,
          },
          0.32,
        )
        // Header fades in as ticket recedes
        .to(
          header,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.34,
          },
          0.30,
        )
        // Stage follows header
        .to(
          stage,
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            duration: 0.44,
          },
          0.44,
        );

      window.setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
      }, 120);

    }, section);

    return () => {
      removeCatalogReadyListener();
      ctx.revert();
    };
  }, []);

  return null;
}
