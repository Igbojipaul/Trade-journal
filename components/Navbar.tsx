"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { navLinks } from "@/constants";

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token");
    router.push("/login");
  };

  if (pathname === "/login" || pathname === "/register") return null;

  return (
    <nav
      style={{
        background: "#0a0a0a",
        borderBottom: "1px solid #1e1e1e",
        position: "sticky",
        top: 0,
        zIndex: 50,
      }}
    >
      {/* Top bar */}
      <div
        style={{
          borderBottom: "1px solid #1e1e1e",
          padding: "4px 24px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <p style={{ color: "#333", fontSize: "10px", letterSpacing: "2px" }}>
          TRADEJOURNAL v1.0.0
        </p>
        <p style={{ color: "#333", fontSize: "10px" }}>
          {new Date().toUTCString().toUpperCase()}
        </p>
      </div>

      {/* Main nav */}
      <div
        style={{
          padding: "0 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          height: "48px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            color: "#00ff88",
            fontWeight: 700,
            fontSize: "14px",
            letterSpacing: "3px",
            textDecoration: "none",
          }}
        >
          TJ//
        </Link>

        {/* Links */}
        <div style={{ display: "flex", gap: "0", alignItems: "center" }}>
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const isNew = link.label === "+ NEW TRADE";
            return (
              <Link
                key={link.href}
                href={link.href}
                style={{
                  padding: "0 16px",
                  height: "48px",
                  display: "flex",
                  alignItems: "center",
                  fontSize: "11px",
                  letterSpacing: "1.5px",
                  fontWeight: isActive ? 600 : 400,
                  color: isNew ? "#00ff88" : isActive ? "#e8e8e8" : "#555",
                  textDecoration: "none",
                  borderBottom: isActive
                    ? "2px solid #00ff88"
                    : "2px solid transparent",
                  borderLeft: isNew ? "1px solid #1e1e1e" : "none",
                  marginLeft: isNew ? "8px" : "0",
                  transition: "color 0.1s",
                }}
              >
                {link.label}
              </Link>
            );
          })}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          style={{
            background: "none",
            border: "1px solid #1e1e1e",
            color: "#555",
            fontSize: "11px",
            letterSpacing: "1.5px",
            padding: "6px 14px",
            cursor: "pointer",
            transition: "all 0.1s",
          }}
          onMouseEnter={(e) => {
            (e.target as HTMLElement).style.color = "#ff3b3b";
            (e.target as HTMLElement).style.borderColor = "#ff3b3b";
          }}
          onMouseLeave={(e) => {
            (e.target as HTMLElement).style.color = "#555";
            (e.target as HTMLElement).style.borderColor = "#1e1e1e";
          }}
        >
          LOGOUT
        </button>
      </div>
    </nav>
  );
}
