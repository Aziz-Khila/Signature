"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";
import { animate, stagger, onScroll } from "animejs";
import { prefersReducedMotion } from "@/lib/motion";
import { Reveal } from "@/components/Reveal";

const dishes = [
  {
    src: "/dish-pizza.png",
    alt: "Pizza Signature aux olives et basilic",
    title: "Pizzas",
    text: "Napolitaines et créations maison, cuites au four à bois.",
  },
  {
    src: "/dish-pasta.png",
    alt: "Pâtes Signature à la crème d’herbes",
    title: "Pâtes",
    text: "Assiettes généreuses, sauces soignées, geste précis.",
  },
  {
    src: "/dish-dessert.png",
    alt: "Dessert Signature au chocolat et amandes",
    title: "Desserts",
    text: "Douceurs maison pour clôturer le repas.",
  },
  {
    src: "/dish-tradition.png",
    alt: "Plat traditionnel Signature",
    title: "Tradition",
    text: "Classiques généreux, mijotés avec soin.",
  },
] as const;

export function Dishes() {
  const stripRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip || prefersReducedMotion()) return;

    const cards = strip.querySelectorAll<HTMLElement>("[data-dish]");
    if (!cards.length) return;

    const animation = animate(cards, {
      opacity: [0, 1],
      y: [40, 0],
      duration: 900,
      delay: stagger(100),
      ease: "out(3)",
      autoplay: onScroll({
        target: strip,
        repeat: false,
        enter: "bottom-=12%",
      }),
    });

    return () => {
      animation.pause();
      animation.revert();
    };
  }, []);

  return (
    <section id="plats" className="section dishes">
      <div className="section-inner dishes-inner">
        <div className="dishes-intro">
          <Reveal as="p" className="eyebrow">
            Sur la table
          </Reveal>
          <Reveal as="h2">Ce qui fait notre signature.</Reveal>
          <Reveal as="p" className="lead" delay={90}>
            Quatre familles de plats, préparés chez Signature.
          </Reveal>
        </div>

        <div className="dish-strip" ref={stripRef}>
          {dishes.map((dish) => (
            <article className="dish dish-enter" data-dish key={dish.title}>
              <div className="dish-image">
                <Image
                  src={dish.src}
                  alt={dish.alt}
                  fill
                  sizes="(max-width: 700px) 100vw, 50vw"
                />
              </div>
              <div className="dish-meta">
                <h3>{dish.title}</h3>
                <p>{dish.text}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
