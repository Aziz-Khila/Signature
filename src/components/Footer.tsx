import Image from "next/image";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <span className="footer-logo">
          <Image
            src="/logo-signature.png"
            alt=""
            fill
            sizes="40px"
          />
        </span>
        <div className="footer-brand-copy">
          <p>Signature</p>
          <span>Cafe Restaurant · Borj Cédria</span>
        </div>
      </div>
      <p className="footer-note">Photos : @signature_byrs</p>
    </footer>
  );
}
