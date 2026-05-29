import Link from "next/link";
import DashboardStats from "@/components/DashboardStats";
import RecentTrades from "@/components/RecentTrades";

export default function Home() {
  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        padding: "24px",
      }}
    >
      <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
        {/* Header */}
        <div
          className="page-header"
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: "24px",
            paddingBottom: "24px",
            borderBottom: "1px solid #1e1e1e",
          }}
        >
          <div>
            <div
              style={{
                color: "#333",
                fontSize: "10px",
                letterSpacing: "3px",
                marginBottom: "4px",
              }}
            >
              PORTFOLIO OVERVIEW
            </div>
            <h1
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#e8e8e8",
                letterSpacing: "2px",
                margin: 0,
              }}
            >
              TRADE JOURNAL
            </h1>
          </div>
          <Link
            href="/trades/new"
            style={{
              background: "#00ff88",
              color: "#000",
              fontSize: "11px",
              fontWeight: 700,
              letterSpacing: "2px",
              padding: "10px 20px",
              textDecoration: "none",
              display: "inline-block",
            }}
          >
            + NEW TRADE
          </Link>
        </div>

        <DashboardStats />
        <RecentTrades />
      </div>
    </main>
  );
}
