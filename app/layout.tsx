"use client";

import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import * as React from "react";
import { Inconsolata } from "next/font/google";
import "leaflet/dist/leaflet.css";
import Header from "@/components/Header";

const inconsolata = Inconsolata({
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en" className={inconsolata.className}>
        <body>
          <Header />
          <main>{children}</main>
        </body>
      </html>
    </ClerkProvider>
  );
}
