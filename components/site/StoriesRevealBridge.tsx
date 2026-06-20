"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";

function playVideo(video: HTMLVideoElement) {
  video.muted = true;
  const promise = video.play();

  if (promise) {
    promise.catch(() => undefined);
  }
}

function setReelsAvailability(layer: HTMLElement, isAvailable: boolean) {
  if (isAvailable) {
    layer.removeAttribute("aria-hidden");
    layer.removeAttribute("inert");
    return;
  }

  layer.setAttribute("aria-hidden", "true");
  layer.setAttribute("inert", "");
}

export function StoriesRevealBridge() {
  useEffect(() => {
    const videoStage = document.querySelector<HTMLElement>("[data-stories-video-stage]");
    const videoShell = document.querySelector<HTMLElement>("[data-stories-video-shell]");
    const reelsSection = document.querySelector<HTMLElement>("[data-stories-reels-section]");
    const phone = document.querySelector<HTMLElement>("[data-stories-phone]");
    const title = document.querySelector<HTMLElement>("[data-stories-type-title]");
    const reelsLayer = document.querySelector<HTMLElement>("[data-stories-reels-layer]");
    const reelItems = gsap.utils.toArray<HTMLElement>("[data-stories-reels] > .stories-bubble-btn");
    const video = document.querySelector<HTMLVideoElement>("[data-stories-video]");

    if (!videoStage || !reelsSection || !phone || !title || !reelsLayer || !video) return;

    const reducedMotion = window.matchMedia(REDUCED_MOTION_QUERY);
    if (reducedMotion.matches) {
      if (videoShell) gsap.set(videoShell, { autoAlpha: 1, scale: 1, y: 0 });
      gsap.set(phone, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(title, { autoAlpha: 1, y: 0, scale: 1 });
      gsap.set(reelsLayer, { autoAlpha: 1, y: 0, scale: 1, pointerEvents: "auto" });
      gsap.set(reelItems, { autoAlpha: 1, y: 0, scale: 1 });
      setReelsAvailability(reelsLayer, true);
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      let reelsAvailable = true;
      const updateReelsAvailability = (isAvailable: boolean) => {
        if (reelsAvailable === isAvailable) return;
        reelsAvailable = isAvailable;
        setReelsAvailability(reelsLayer, isAvailable);
      };

      // ── Video shell: cinematic enter-once reveal ──
      if (videoShell) {
        gsap.set(videoShell, { autoAlpha: 0, scale: 0.93, y: 22, force3D: false });

        ScrollTrigger.create({
          trigger: videoStage,
          start: "top 80%",
          once: true,
          onEnter: () => {
            gsap.to(videoShell, {
              autoAlpha: 1,
              scale: 1,
              y: 0,
              duration: 1.1,
              ease: "power3.out",
              force3D: false,
            });
          },
        });
      }

      // ── Phone: rises gracefully from below ──
      gsap.set(phone, {
        autoAlpha: 0,
        y: 64,
        scale: 0.88,
        force3D: false,
      });

      gsap.set(title, {
        autoAlpha: 0,
        y: 26,
        scale: 0.98,
        force3D: false,
      });

      gsap.set(reelsLayer, {
        autoAlpha: 0,
        y: 96,
        scale: 0.96,
        pointerEvents: "none",
        force3D: false,
      });

      gsap.set(reelItems, {
        autoAlpha: 0,
        y: 44,
        scale: 0.93,
        force3D: false,
      });

      updateReelsAvailability(false);

      // ── Video playback control (separate from shell reveal) ──
      ScrollTrigger.create({
        trigger: videoStage,
        start: "top 62%",
        end: "bottom 24%",
        onEnter: () => playVideo(video),
        onEnterBack: () => playVideo(video),
        onLeave: () => video.pause(),
        onLeaveBack: () => {
          video.pause();
          video.currentTime = 0;
        },
      });

      let hasRevealedReels = false;
      const revealReels = () => {
        if (hasRevealedReels) return;
        hasRevealedReels = true;
        reelsSection.classList.add("stories-reels-section--active");
        updateReelsAvailability(true);

        gsap
          .timeline({ defaults: { ease: "power3.out", force3D: false } })
          .to(phone, { autoAlpha: 1, y: 0, scale: 1, duration: 0.34 }, 0)
          .to(title, { autoAlpha: 1, y: 0, scale: 1, duration: 0.28 }, 0.05)
          .to(
            reelsLayer,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              pointerEvents: "auto",
              duration: 0.34,
            },
            0.10,
          )
          .to(
            reelItems,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              stagger: { each: 0.035 },
              duration: 0.28,
            },
            0.18,
          );
      };

      // ── Reels section: quick reveal once, then stay visible ──
      ScrollTrigger.create({
        trigger: reelsSection,
        start: "top 88%",
        once: true,
        onEnter: revealReels,
      });

      window.setTimeout(() => {
        ScrollTrigger.refresh();
        ScrollTrigger.update();
        const rect = reelsSection.getBoundingClientRect();

        if (rect.top < window.innerHeight && rect.bottom > 0) revealReels();
      }, 120);
    });

    return () => {
      video.pause();
      ctx.revert();
    };
  }, []);

  return null;
}
