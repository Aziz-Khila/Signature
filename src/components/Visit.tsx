import Image from "next/image";
import { Reveal } from "@/components/Reveal";

const MAPS_URL = "https://maps.app.goo.gl/qehKeKpsFHsQ7ZCZA";
const INSTAGRAM_URL = "https://www.instagram.com/signature_byrs/";

export function Visit() {
  return (
    <section id="visite" className="section visit">
      <div className="section-inner visit-layout">
        <div className="visit-copy">
          <Reveal as="p" className="eyebrow">
            Nous rendre visite
          </Reveal>
          <Reveal as="h2">Borj Cédria vous attend.</Reveal>
          <Reveal as="p" className="lead" delay={90}>
            Cité Erriadh — juste en face de la Banque Azzaytouna.
            <br />
            Fermé le dimanche.
          </Reveal>

          <Reveal as="ul" className="visit-details" delay={120}>
            <li>
              <span>Adresse</span>
              <strong>Cité Erriadh, Borj Cédria, Ben Arous</strong>
            </li>
            <li>
              <span>Téléphone</span>
              <strong>
                <a href="tel:+21646613260">+216 46 613 260</a>
              </strong>
            </li>
            <li>
              <span>Instagram</span>
              <strong>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  @signature_byrs
                </a>
              </strong>
            </li>
          </Reveal>

          <Reveal className="visit-actions" delay={180}>
            <a
              className="btn btn-primary"
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Ouvrir dans Maps
            </a>
            <a
              className="btn btn-ghost"
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
            >
              Instagram
            </a>
          </Reveal>
        </div>

        <Reveal className="map-panel" delay={120}>
          <Image
            src="/visit-facade.png"
            alt="Façade Signature à Borj Cédria"
            fill
            sizes="(max-width: 900px) 100vw, 45vw"
            className="map-photo"
          />
          <div className="map-veil" aria-hidden="true" />

          <a
            className="map-card"
            href={MAPS_URL}
            target="_blank"
            rel="noopener noreferrer"
          >
            <div className="map-card-top">
              <span className="map-card-kicker">Localisation</span>
              <span className="map-card-arrow" aria-hidden="true">
                ↗
              </span>
            </div>
            <strong className="map-card-title">Signature</strong>
            <p className="map-card-text">
              Cité Erriadh · en face de Banque Azzaytouna
            </p>
            <span className="map-card-cta">Voir l’itinéraire</span>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
