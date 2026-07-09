import Navbar from "@/components/Navbar";

export default function Disclaimer() {
  return (
    <div style={{ minHeight: "100vh", fontFamily: "Inter, sans-serif", background: "#F8FAFC" }}>
      <Navbar />
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "48px 24px 80px" }}>
        <h1 style={{ fontSize: "36px", fontWeight: 800, color: "#0F172A", marginBottom: "8px", fontFamily: "Playfair Display, serif" }}>
          Disclaimer
        </h1>
        <p style={{ fontSize: "13px", color: "#94A3B8", marginBottom: "32px" }}>Last updated: July 2026</p>

        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #E2E8F0", padding: "32px", fontSize: "15px", color: "#334155", lineHeight: 1.8 }}>
          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>Platform Role</h2>
          <p style={{ margin: "0 0 24px" }}>
            SmartServ is an online marketplace that connects customers with independent service providers in Zimbabwe.
            SmartServ does not itself provide the services listed on the platform and is not the employer of any provider.
            Providers are independent contractors responsible for the quality, safety, and legality of the services they offer.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>Provider Verification</h2>
          <p style={{ margin: "0 0 24px" }}>
            SmartServ takes reasonable steps to verify providers who join the platform. However, verification does not
            constitute a guarantee, endorsement, or warranty of any provider's work. Customers should exercise their own
            judgement when engaging a provider, including reviewing ratings and communicating directly before booking.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>Payments</h2>
          <p style={{ margin: "0 0 24px" }}>
            Payments made through the platform are processed by Paynow Zimbabwe. SmartServ does not store your payment
            card or mobile money credentials. Any payment arrangements made outside the platform are at the customer's
            and provider's own risk.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>Limitation of Liability</h2>
          <p style={{ margin: "0 0 24px" }}>
            To the maximum extent permitted by the laws of Zimbabwe, SmartServ shall not be liable for any loss, damage,
            injury, or dispute arising from services arranged through the platform. Disputes between customers and
            providers should first be raised with the other party; SmartServ may assist in facilitating resolution but
            is not obligated to do so.
          </p>

          <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#0F172A", margin: "0 0 12px" }}>Contact</h2>
          <p style={{ margin: 0 }}>
            For questions about this disclaimer, contact us through the Help Center or via our official Facebook page.
          </p>
        </div>
      </div>
    </div>
  );
}
