"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

export function Header() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`site-header${scrolled ? " is-scrolled" : ""}`}>
      <a className="logo" href="#top" aria-label="Signature accueil">
        <span className="logo-mark">
          <Image
            src="/logo-signature.png"
            alt=""
            fill
            sizes="48px"
            priority
          />
        </span>
        <span className="logo-copy">
          <span className="logo-text">Signature</span>
          <span className="logo-sub">Cafe Restaurant</span>
        </span>
      </a>
      <nav className="nav" aria-label="Navigation principale">
        <a href="#experience">L’expérience</a>
        <a href="#plats">Plats</a>
        <a href="#menu">Menu</a>
        <a href="#visite">Visite</a>
      </nav>
      <span className="header-spacer" aria-hidden="true" />
    </header>
  );
}
