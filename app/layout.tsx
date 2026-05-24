import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GoogleProvider from "@/components/GoogleProvider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "TradeJournal",
  description: "Track. Analyze. Improve.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-950 antialiased`}>
        <GoogleProvider>
          <Navbar />
          {children}
        </GoogleProvider>
      </body>
    </html>
  );
}
