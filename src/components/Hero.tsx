"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, createTimeline, onScroll } from "animejs";
import { useLenis } from "lenis/react";
import { prefersReducedMotion } from "@/lib/motion";

/** ~px per second — steady tour pace through the page */
const AUTO_SCROLL_SPEED = 90;
/** Ignore interrupt gestures right after starting (click/touch release). */
const IGNORE_MS = 400;

export function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const autoScrolling = useRef(false);
  const ignoreUntil = useRef(0);
  const lenis = useLenis();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const brand = root.querySelector<HTMLElement>("[data-hero='brand']");
    const title = root.querySelector<HTMLElement>("[data-hero='title']");
    const headline = root.querySelector<HTMLElement>("[data-hero='headline']");
    const tagline = root.querySelector<HTMLElement>("[data-hero='tagline']");
    const actions = root.querySelector<HTMLElement>("[data-hero='actions']");
    const media = root.querySelector<HTMLElement>("[data-hero='media']");

    if (prefersReducedMotion()) {
      [brand, title, headline, tagline, actions].forEach((el) => {
        if (el) {
          el.style.opacity = "1";
          el.style.transform = "none";
        }
      });
      return;
    }

    const timeline = createTimeline({
      defaults: { ease: "out(3)" },
    });

    if (media) {
      timeline.add(
        media,
        { scale: [1.08, 1], duration: 2200, ease: "out(2)" },
        0
      );
    }
    if (brand) {
      timeline.add(brand, { opacity: [0, 1], y: [20, 0], duration: 850 }, 80);
    }
    if (title) {
      timeline.add(title, { opacity: [0, 1], y: [32, 0], duration: 1050 }, 160);
    }
    if (headline) {
      timeline.add(headline, { opacity: [0, 1], y: [20, 0], duration: 850 }, 260);
    }
    if (tagline) {
      timeline.add(tagline, { opacity: [0, 1], y: [18, 0], duration: 800 }, 340);
    }
    if (actions) {
      timeline.add(actions, { opacity: [0, 1], y: [14, 0], duration: 750 }, 420);
    }

    let parallax: ReturnType<typeof animate> | undefined;
    if (media) {
      parallax = animate(media, {
        y: [0, 40],
        ease: "linear",
        autoplay: onScroll({
          target: root,
          sync: 0.35,
          enter: "top top",
          leave: "bottom top",
        }),
      });
    }

    return () => {
      timeline.pause();
      timeline.revert();
      parallax?.pause();
      parallax?.revert();
    };
  }, []);

  useEffect(() => {
    if (!lenis) return;

    const stopAutoScroll = (immediate = false) => {
      if (!autoScrolling.current) return;
      if (performance.now() < ignoreUntil.current) return;
      autoScrolling.current = false;
      if (immediate) {
        lenis.scrollTo(lenis.scroll, { immediate: true });
      }
    };

    const unsub = lenis.on("virtual-scroll", () => stopAutoScroll(false));

    const onKeyDown = (event: KeyboardEvent) => {
      const keys = new Set([
        "ArrowDown",
        "ArrowUp",
        "PageDown",
        "PageUp",
        "Home",
        "End",
        " ",
      ]);
      if (keys.has(event.key)) stopAutoScroll(true);
    };

    window.addEventListener("keydown", onKeyDown, { passive: true });

    return () => {
      unsub();
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [lenis]);

  const startAutoScroll = () => {
    const run = (instance: NonNullable<typeof lenis>) => {
      if (prefersReducedMotion()) {
        instance.scrollTo(instance.limit, { immediate: true });
        return;
      }

      const remaining = Math.max(0, instance.limit - instance.scroll);
      if (remaining < 8) return;

      autoScrolling.current = true;
      ignoreUntil.current = performance.now() + IGNORE_MS;
      const duration = Math.min(36, Math.max(8, remaining / AUTO_SCROLL_SPEED));

      instance.scrollTo(instance.limit, {
        duration,
        easing: (t) => t,
        lock: false,
        programmatic: true,
        onComplete: () => {
          autoScrolling.current = false;
        },
      });
    };

    if (lenis) {
      run(lenis);
      return;
    }

    // Lenis not ready yet — fall back to native continuous-ish scroll to bottom
    const top = document.documentElement.scrollHeight - window.innerHeight;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <section className="hero" ref={rootRef}>
      <div className="hero-media" aria-hidden="true" data-hero="media">
        <Image
          src="/hero-pizza.png"
          alt=""
          fill
          priority
          sizes="100vw"
          className="hero-img"
        />
        <div className="hero-veil" />
      </div>

      <div className="hero-shell">
        <div className="hero-copy">
          <p className="brand-line hero-enter" data-hero="brand">
            Cafe Restaurant · Borj Cédria
          </p>
          <h1 className="brand hero-enter" data-hero="title">
            Signature
          </h1>
          <p className="hero-headline hero-enter" data-hero="headline">
            Ambiance parfaite &amp; cuisine d’exception
          </p>
          <p className="hero-tagline hero-enter" data-hero="tagline">
            Satisfaites vos envies avec des pizzas au feu de bois, des pâtes
            généreuses et une expérience chaleureuse à partager.
          </p>
          <div className="hero-actions hero-enter" data-hero="actions">
            <button
              type="button"
              className="btn btn-primary btn-hero"
              onClick={startAutoScroll}
            >
              Découvrir
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
