"use client";

import {
  forwardRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import dynamic from "next/dynamic";
import { Reveal } from "@/components/Reveal";

const HTMLFlipBook = dynamic(() => import("react-pageflip"), {
  ssr: false,
  loading: () => <div className="menu-flip-skeleton" aria-hidden="true" />,
});

const menuDishes = [
  {
    src: "/dish-pizza-transparent.png",
    alt: "Pizza Signature",
    name: "Pizza Signature",
    ingredients:
      "Sauce tomate, mozzarella, olives noires, poivrons, poulet assaisonné, basilic frais — cuite au four à bois.",
    price: "28 DT",
  },
  {
    src: "/dish-pasta-transparent.png",
    alt: "Pâtes Signature",
    name: "Pâtes Signature",
    ingredients:
      "Penne, crème d’herbes, noisettes torréfiées, parmesan, tuile croustillante.",
    price: "24 DT",
  },
  {
    src: "/dish-dessert-transparent.png",
    alt: "Dessert Signature",
    name: "Dessert Signature",
    ingredients:
      "Pancake maison, sauce chocolat, coulis de fruits rouges, amandes effilées.",
    price: "14 DT",
  },
  {
    src: "/dish-tradition-transparent.png",
    alt: "Plat traditionnel Signature",
    name: "Plat traditionnel",
    ingredients:
      "Recette maison mijotée, accompagnements du jour, présentation généreuse.",
    price: "26 DT",
  },
] as const;

function CoverFace() {
  return (
    <div className="flip-cover-inner">
      <div className="flip-cover-frame" aria-hidden="true" />
      <div className="flip-cover-brand">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-signature.png"
          alt=""
          className="flip-cover-logo"
          draggable={false}
        />
        <h2 className="flip-cover-title">Signature</h2>
        <p className="flip-cover-sub">Cafe Restaurant</p>
      </div>
      <div className="flip-cover-footer">
        <div className="flip-cover-rule" aria-hidden="true">
          <span />
          <i />
          <span />
        </div>
        <p className="flip-cover-menu-label">Menu</p>
        <p>Organic &amp; Fresh · By BC</p>
      </div>
    </div>
  );
}

const LogoPage = forwardRef<HTMLDivElement>(function LogoPage(_, ref) {
  return (
    <div className="flip-page flip-logo-page" ref={ref}>
      <div className="flip-page-frame" aria-hidden="true" />
      <div className="flip-logo-engrave">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/logo-signature.png"
          alt=""
          className="flip-logo-mark"
          draggable={false}
        />
      </div>
    </div>
  );
});

const DishPage = forwardRef<HTMLDivElement, (typeof menuDishes)[number]>(
  function DishPage({ src, alt, name, ingredients, price }, ref) {
    return (
      <div className="flip-page flip-dish" ref={ref}>
        <div className="flip-page-frame" aria-hidden="true" />
        <div className="flip-dish-inner">
          <div className="flip-dish-photo">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={src}
              alt={alt}
              className="flip-dish-photo-img"
              draggable={false}
            />
          </div>
          <div className="flip-dish-copy">
            <p className="flip-dish-kicker">Signature</p>
            <h3>{name}</h3>
            <div className="flip-dish-rule" aria-hidden="true">
              <span />
              <i />
              <span />
            </div>
            <p className="flip-dish-ingredients">{ingredients}</p>
            <p className="flip-dish-price">{price}</p>
          </div>
        </div>
      </div>
    );
  }
);

type FlipApi = {
  pageFlip: () => {
    flipNext: (corner?: "top" | "bottom") => void;
    flipPrev: (corner?: "top" | "bottom") => void;
    flip: (page: number, corner?: "top" | "bottom") => void;
    turnToPage: (page: number) => void;
    turnToNextPage: () => void;
    turnToPrevPage: () => void;
    getCurrentPageIndex: () => number;
    getPageCount: () => number;
    getBoundsRect: () => {
      left: number;
      top: number;
      width: number;
      height: number;
      pageWidth: number;
    };
    getFlipController: () => {
      flip: (pos: { x: number; y: number }) => void;
    };
  };
};

type Gate = "closed" | "open" | "ended";
type CoverMotion = "idle" | "opening" | "closing" | "to-end" | "from-end";

function useBookSize() {
  const [size, setSize] = useState({
    pageW: 520,
    pageH: 770,
    shellW: 1040,
    coverW: 480,
    coverH: 710,
    isPortrait: false,
  });

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      const vh = window.innerHeight;
      const isPortrait = vw < 720;

      if (isPortrait) {
        const pageW = Math.round(
          Math.min(vw - 24, 380, Math.max(280, (vh * 0.6) / 1.48))
        );
        const pageH = Math.round(pageW * 1.48);
        setSize({
          pageW,
          pageH,
          shellW: pageW,
          coverW: pageW,
          coverH: pageH,
          isPortrait: true,
        });
        return;
      }

      const maxByWidth = Math.min(
        560,
        Math.max(168, Math.min(1280, vw - 36) / 2)
      );
      const maxByHeight = Math.floor((vh * 0.78) / 1.48);
      const pageW = Math.round(Math.min(maxByWidth, Math.max(168, maxByHeight)));
      const pageH = Math.round(pageW * 1.48);
      const coverW = Math.round(
        Math.min(pageW * 1.12, Math.min(580, vw - 48), (vh * 0.8) / 1.48)
      );
      const coverH = Math.round(coverW * 1.48);
      setSize({ pageW, pageH, shellW: pageW * 2, coverW, coverH, isPortrait: false });
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return size;
}

export function MenuBook() {
  const bookRef = useRef<FlipApi | null>(null);
  const [page, setPage] = useState(0);
  const [ready, setReady] = useState(false);
  const [gate, setGate] = useState<Gate>("closed");
  const [coverMotion, setCoverMotion] = useState<CoverMotion>("idle");
  const { pageW, pageH, shellW, coverW, coverH, isPortrait } = useBookSize();

  // Desktop: logo + dish spreads. Mobile: dish pages only (no logo fillers).
  const innerPageCount = isPortrait
    ? menuDishes.length
    : menuDishes.length * 2;
  const lastContentIndex = isPortrait ? innerPageCount - 1 : innerPageCount - 2;

  const isBusy = coverMotion !== "idle";
  const isOpening = coverMotion === "opening";
  const isClosing = coverMotion === "closing";
  const isToEnd = coverMotion === "to-end";
  const isFromEnd = coverMotion === "from-end";

  const isClosed = gate === "closed" && !isBusy;
  const isEnded = gate === "ended" && !isBusy;
  const bookInteractive = gate === "open" && !isBusy;

  const showFrontCover =
    (gate === "closed" || isOpening || isClosing) && !isToEnd && !isFromEnd;
  const showEndCover =
    (gate === "ended" || isToEnd || isFromEnd) && !isOpening && !isClosing;
  const showOpenShell =
    gate === "open" || isOpening || isClosing || isToEnd || isFromEnd;

  const dishIndex =
    gate !== "open" && !isFromEnd
      ? 0
      : isPortrait
        ? Math.min(menuDishes.length, page + 1)
        : Math.min(menuDishes.length, Math.floor(page / 2) + 1);

  const finishMotion = useCallback((nextGate: Gate) => {
    setGate(nextGate);
    setCoverMotion("idle");
  }, []);

  const closeBook = useCallback(() => {
    if (isBusy) return;
    const api = bookRef.current?.pageFlip();
    api?.turnToPage(0);
    setPage(0);
    setCoverMotion("closing");
  }, [isBusy]);

  const openBook = useCallback(() => {
    if (!ready || isBusy || gate === "open") return;
    const api = bookRef.current?.pageFlip();
    if (!api) return;
    api.turnToPage(0);
    setPage(0);
    setCoverMotion("opening");
  }, [ready, isBusy, gate]);

  const goToEnd = useCallback(() => {
    if (isBusy) return;
    const api = bookRef.current?.pageFlip();
    api?.turnToPage(lastContentIndex);
    setPage(lastContentIndex);
    setCoverMotion("to-end");
  }, [isBusy, lastContentIndex]);

  const reopenFromEnd = useCallback(() => {
    if (!ready || isBusy) return;
    const api = bookRef.current?.pageFlip();
    if (!api) return;
    api.turnToPage(lastContentIndex);
    setPage(lastContentIndex);
    setCoverMotion("from-end");
  }, [ready, isBusy, lastContentIndex]);

  useEffect(() => {
    if (!isBusy) return;
    const nextGate: Gate =
      coverMotion === "opening" || coverMotion === "from-end"
        ? "open"
        : coverMotion === "closing"
          ? "closed"
          : "ended";
    const timer = window.setTimeout(() => finishMotion(nextGate), 560);
    return () => window.clearTimeout(timer);
  }, [isBusy, coverMotion, finishMotion]);

  const getFlipApi = useCallback(() => {
    try {
      return bookRef.current?.pageFlip() ?? null;
    } catch {
      return null;
    }
  }, []);

  const syncPageFromApi = useCallback(() => {
    const api = getFlipApi();
    if (!api) return;
    const idx = api.getCurrentPageIndex?.();
    if (typeof idx === "number" && Number.isFinite(idx)) {
      setPage(idx);
    }
  }, [getFlipApi]);

  const onFlip = useCallback(
    (e: { data: number }) => {
      const next = typeof e?.data === "number" ? e.data : 0;
      setPage(Math.max(0, Math.min(next, innerPageCount - 1)));
      setGate("open");
    },
    [innerPageCount]
  );

  const flipNext = useCallback(() => {
    if (gate === "closed") {
      openBook();
      return;
    }
    if (gate === "ended" || isBusy) return;

    const api = getFlipApi();
    if (!api) return;

    const current = api.getCurrentPageIndex?.() ?? page;
    const spread = isPortrait ? current : Math.floor(current / 2);
    const lastSpread = isPortrait
      ? innerPageCount - 1
      : Math.floor(lastContentIndex / 2);

    if (spread >= lastSpread) {
      goToEnd();
      return;
    }

    try {
      api.flipNext("top");
    } catch {
      api.turnToNextPage();
      syncPageFromApi();
    }
  }, [
    gate,
    isBusy,
    openBook,
    getFlipApi,
    page,
    isPortrait,
    innerPageCount,
    lastContentIndex,
    goToEnd,
    syncPageFromApi,
  ]);

  const flipPrev = useCallback(() => {
    if (gate === "ended") {
      reopenFromEnd();
      return;
    }
    if (gate === "closed" || isBusy) return;

    const api = getFlipApi();
    if (!api) return;

    const apiIndex = api.getCurrentPageIndex?.();
    const current =
      typeof apiIndex === "number" && Number.isFinite(apiIndex)
        ? apiIndex
        : page;
    const spread = isPortrait ? current : Math.floor(current / 2);

    if (spread <= 0) {
      closeBook();
      return;
    }

    // StPageFlip.flipPrev() hardcodes x:10 (window), which fails when the book is centered.
    // Drive the same animation from the book's actual left edge.
    try {
      const rect = api.getBoundsRect();
      api.getFlipController().flip({
        x: rect.left + 12,
        y: rect.top + 8,
      });
    } catch {
      const target = isPortrait ? current - 1 : (spread - 1) * 2;
      api.turnToPage(target);
      setPage(target);
    }
  }, [gate, isBusy, reopenFromEnd, getFlipApi, page, isPortrait, closeBook]);

  const bookKey = useMemo(
    () => `${pageW}x${pageH}-${isPortrait ? "p" : "l"}`,
    [pageW, pageH, isPortrait]
  );

  useEffect(() => {
    setReady(false);
    setPage(0);
  }, [bookKey]);

  const spreadPages = useMemo(
    () =>
      isPortrait
        ? menuDishes.map((dish) => (
            <DishPage key={`dish-m-${dish.name}`} {...dish} />
          ))
        : menuDishes.flatMap((dish) => [
            <LogoPage key={`logo-${dish.name}`} />,
            <DishPage key={`dish-${dish.name}`} {...dish} />,
          ]),
    [isPortrait]
  );

  const frontCoverClass = [
    "menu-cover-gate",
    isOpening ? "is-opening" : "",
    isClosing ? "is-closing" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const endCoverClass = [
    "menu-cover-gate",
    "menu-cover-gate-end",
    isToEnd ? "is-to-end" : "",
    isFromEnd ? "is-from-end" : "",
  ]
    .filter(Boolean)
    .join(" ");

  const shellClass = [
    "menu-flip-shell",
    showOpenShell ? "is-open" : "is-gated",
    isOpening || isFromEnd ? "is-revealing" : "",
    isClosing || isToEnd ? "is-exiting" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <section id="menu" className="section menu-book-section">
      <div className="section-inner menu-book-inner">
        <div className="menu-book-intro">
          <Reveal as="p" className="eyebrow">
            La carte
          </Reveal>
          <Reveal as="h2">Notre menu.</Reveal>
          <Reveal as="p" className="lead" delay={90}>
            Ouvrez le menu et tournez les pages — chaque plat, ses ingrédients,
            son prix.
          </Reveal>
        </div>

        <Reveal className="menu-book-stage" delay={100}>
          <div
            className="menu-flip-frame"
            style={{ minHeight: Math.max(coverH, pageH) }}
          >
            {showFrontCover && (
              <button
                type="button"
                className={frontCoverClass}
                style={{ width: coverW, height: coverH } as CSSProperties}
                onClick={openBook}
                aria-label="Ouvrir le menu Signature"
                disabled={isBusy}
              >
                <div className="flip-page flip-cover menu-cover-gate-face">
                  <CoverFace />
                </div>
              </button>
            )}

            {showEndCover && (
              <button
                type="button"
                className={endCoverClass}
                style={{ width: coverW, height: coverH } as CSSProperties}
                onClick={reopenFromEnd}
                aria-label="Revenir au menu"
                disabled={isBusy}
              >
                <div className="flip-page flip-cover menu-cover-gate-face">
                  <CoverFace />
                </div>
              </button>
            )}

            <div
              className={shellClass}
              data-lenis-prevent
              aria-hidden={!bookInteractive}
              style={{ width: shellW, height: pageH }}
            >
              {bookInteractive && (
                <>
                  <button
                    type="button"
                    className="menu-side-hit menu-side-hit-left"
                    onClick={flipPrev}
                    aria-label="Page précédente"
                  />
                  <button
                    type="button"
                    className="menu-side-hit menu-side-hit-right"
                    onClick={flipNext}
                    aria-label="Page suivante"
                  />
                </>
              )}
              <HTMLFlipBook
                key={bookKey}
                ref={bookRef as never}
                className="menu-flipbook"
                style={{}}
                width={pageW}
                height={pageH}
                size="fixed"
                minWidth={240}
                maxWidth={600}
                minHeight={340}
                maxHeight={900}
                drawShadow
                flippingTime={900}
                usePortrait={isPortrait}
                startZIndex={0}
                autoSize={false}
                maxShadowOpacity={0.35}
                showCover={false}
                mobileScrollSupport={false}
                clickEventForward={false}
                useMouseEvents={false}
                swipeDistance={30}
                showPageCorners={false}
                disableFlipByClick
                startPage={0}
                onFlip={onFlip}
                onInit={() => {
                  setReady(true);
                  setPage(0);
                }}
              >
                {spreadPages}
              </HTMLFlipBook>
            </div>
          </div>

          <div className="menu-book-controls">
            <button
              type="button"
              className="menu-nav-btn"
              onClick={flipPrev}
              disabled={!ready || isClosed || isBusy}
            >
              Précédent
            </button>
            <p className="menu-book-hint">
              {isClosed || isOpening || isClosing
                ? "Cliquez pour ouvrir"
                : isEnded || isToEnd || isFromEnd
                  ? "Fin du menu — cliquez pour revenir"
                  : `Plat ${dishIndex} / ${menuDishes.length}`}
            </p>
            <button
              type="button"
              className={`menu-nav-btn${isClosed || isOpening ? " menu-nav-btn-primary" : ""}`}
              onClick={flipNext}
              disabled={!ready || isEnded || isBusy}
            >
              {isClosed || isOpening ? "Ouvrir" : "Suivant"}
            </button>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
