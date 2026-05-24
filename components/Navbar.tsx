"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { BiLogOut } from "react-icons/bi";
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
      className="border-b border-gray-800 bg-gray-950/80 backdrop-blur-sm
                    sticky top-0 z-50"
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div
            className="w-7 h-7 bg-blue-700 rounded-lg flex items-center
                          justify-center text-white font-bold text-sm"
          >
            TJ
          </div>
          <span className="font-bold text-white text-lg">Trade Journal</span>
        </Link>

        {/* Nav Links */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) =>
            link.label === "+ Log Trade" ? (
              <Link
                key={link.href}
                href={link.href}
                className="ml-2 bg-blue-800 hover:bg-blue-500 text-white text-sm
                           font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                {link.label}
              </Link>
            ) : (
              <Link
                key={link.href}
                href={link.href}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors
                  ${
                    pathname === link.href
                      ? "bg-gray-800 text-white"
                      : "text-gray-400 hover:text-white hover:bg-gray-800/50"
                  }`}
              >
                {link.label}
              </Link>
            ),
          )}
        </div>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="text-gray-400 hover:text-white text-sm transition-colors
                     flex items-center gap-2 px-3 py-2 rounded-lg
                     hover:bg-gray-800"
        >
          <BiLogOut />
          Logout
        </button>
      </div>

      {/* Mobile nav */}
      <div className="md:hidden flex border-t border-gray-800 px-6 py-2 gap-2">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex-1 text-center px-3 py-2 rounded-lg text-xs
                        font-medium transition-colors
              ${
                pathname === link.href
                  ? "bg-gray-800 text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            {link.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
