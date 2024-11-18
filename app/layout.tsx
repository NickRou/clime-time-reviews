import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import { Inconsolata } from "next/font/google";
import "leaflet/dist/leaflet.css";

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
    <ClerkProvider dynamic>
      <html lang="en" className={inconsolata.className}>
        <body>{children}</body>
      </html>
    </ClerkProvider>
  );
}
