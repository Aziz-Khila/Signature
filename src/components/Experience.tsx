"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, onScroll } from "animejs";
import { Reveal } from "@/components/Reveal";
import { prefersReducedMotion } from "@/lib/motion";

export function Experience() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const mediaWrap = mediaRef.current;
    if (!section || !mediaWrap || prefersReducedMotion()) return;

    const media = mediaWrap.querySelector("img");
    if (!media) return;

    const parallax = animate(media, {
      y: ["-6%", "6%"],
      ease: "linear",
      autoplay: onScroll({
        target: section,
        sync: true,
        enter: "top bottom",
        leave: "bottom top",
      }),
    });

    return () => {
      parallax.pause();
      parallax.revert();
    };
  }, []);

  return (
    <section id="experience" className="section experience" ref={sectionRef}>
      <div className="section-inner experience-grid">
        <div className="experience-copy">
          <Reveal as="p" className="eyebrow">
            L’esprit Signature
          </Reveal>
          <Reveal as="h2">Une cuisine ouverte, des créations sous vos yeux.</Reveal>
          <Reveal as="p" className="lead" delay={90}>
            Chez Signature, l’open kitchen laisse voir le geste : four à bois,
            préparations soignées et plats qui naissent devant vous — pour une
            expérience sincère, généreuse et chaleureuse.
          </Reveal>
        </div>
        <Reveal as="figure" className="experience-visual" delay={120}>
          <span className="experience-media" ref={mediaRef}>
            <Image
              src="/experience-kitchen.png"
              alt="Open kitchen Signature — l’équipe en cuisine"
              fill
              sizes="(max-width: 900px) 100vw, 45vw"
              className="experience-img"
            />
          </span>
        </Reveal>
      </div>
    </section>
  );
}
