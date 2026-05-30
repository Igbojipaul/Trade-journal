import type { Metadata } from "next";
import "./globals.css";
import Navbar from "@/components/Navbar";
import GoogleProvider from "@/components/GoogleProvider";


export const metadata: Metadata = {
  title: 'Trade Journal',
  description: 'Track. Analyze. Improve.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        <GoogleProvider>
          <Navbar />
          {children}
        </GoogleProvider>
      </body>
    </html>
  );
}
