import { useLocation } from "wouter";
import { Facebook } from "lucide-react";

// TODO: replace with your actual SmartServ Facebook page URL
const FACEBOOK_URL = "https://www.facebook.com/YOUR_PAGE_HERE";

export default function Footer() {
  const [, setLocation] = useLocation();

  const go = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    e.preventDefault();
    setLocation(href);
    window.scrollTo(0, 0);
  };

  return (
    <footer style={{ background: "#0F172A", padding: "48px 0 24px" }}>
      <style>{`
        .sfooter-grid { display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 32px; margin-bottom: 40px; }
        .sfooter-link { display: block; font-size: 14px; color: #94A3B8; margin-bottom: 10px; text-decoration: none; }
        .sfooter-link:hover { color: #fff; }
        @media (max-width: 768px) {
          .sfooter-grid { grid-template-columns: repeat(2, 1fr); gap: 24px; }
        }
      `}</style>
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px" }}>
        <div className="sfooter-grid">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
              <div style={{ width: "28px", height: "28px", background: "linear-gradient(135deg, #3B82F6, #6366F1)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "12px" }}>SS</div>
              <span style={{ color: "#fff", fontWeight: 700, fontSize: "15px" }}>SmartServ</span>
            </div>
            <p style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.7, margin: 0, maxWidth: "260px" }}>
              Zimbabwe's marketplace for trusted local services. Find vetted providers or grow your business.
            </p>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Explore</div>
            <a className="sfooter-link" href="/" onClick={(e) => go(e, "/")}>Home</a>
            <a className="sfooter-link" href="/services" onClick={(e) => go(e, "/services")}>Browse Services</a>
            <a className="sfooter-link" href="/provider/onboarding" onClick={(e) => go(e, "/provider/onboarding")}>Become a Provider</a>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Legal</div>
            <a className="sfooter-link" href="/disclaimer" onClick={(e) => go(e, "/disclaimer")}>Disclaimer</a>
          </div>
          <div>
            <div style={{ fontSize: "13px", fontWeight: 700, color: "#fff", marginBottom: "14px", textTransform: "uppercase", letterSpacing: "0.05em" }}>Connect</div>
            <a href={FACEBOOK_URL} target="_blank" rel="noopener noreferrer" aria-label="SmartServ on Facebook" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: "38px", height: "38px", borderRadius: "10px", background: "#1E293B", color: "#94A3B8", textDecoration: "none" }}>
              <Facebook size={18} />
            </a>
          </div>
        </div>
        <div style={{ borderTop: "1px solid #1E293B", paddingTop: "20px", textAlign: "center" }}>
          <span style={{ fontSize: "13px", color: "#64748B" }}>© 2026 SmartServ. All rights reserved.</span>
        </div>
      </div>
    </footer>
  );
}
