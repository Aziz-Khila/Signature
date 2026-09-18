"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, onScroll } from "animejs";
import { Reveal } from "@/components/Reveal";
import { prefersReducedMotion } from "@/lib/motion";

export function Atmosphere() {
  const sectionRef = useRef<HTMLElement>(null);
  const mediaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const media = mediaRef.current;
    if (!section || !media || prefersReducedMotion()) return;

    const drift = animate(media, {
      y: ["-4%", "8%"],
      scale: [1.06, 1.14],
      ease: "linear",
      autoplay: onScroll({
        target: section,
        sync: true,
        enter: "top bottom",
        leave: "bottom top",
      }),
    });

    return () => {
      drift.pause();
      drift.revert();
    };
  }, []);

  return (
    <section className="section atmosphere" ref={sectionRef}>
      <div className="atmosphere-media" aria-hidden="true" ref={mediaRef}>
        <Image
          src="/atmosphere-entrance.png"
          alt=""
          fill
          sizes="100vw"
          className="atmosphere-photo"
        />
        <div className="atmosphere-veil" />
      </div>
      <Reveal as="blockquote" className="atmosphere-quote">
        <p>“Your new favorite food spot is now open.”</p>
        <cite>Signature · Borj Cédria</cite>
      </Reveal>
    </section>
  );
}
