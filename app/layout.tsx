import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Virtual Gallery Fauzan | Artspace 3D",
  description: "Jelajahi pameran karya seni virtual 3D interaktif berbasis WebGL.",
  metadataBase: new URL("https://virtual-gallery-fauzan.hostifame.id/"), // Sesuaikan domain publik Vercel Anda
  openGraph: {
    title: "Virtual Gallery Fauzan | Artspace 3D",
    description: "Jelajahi pameran karya seni virtual 3D interaktif berbasis WebGL.",
    url: "https://virtual-gallery-fauzan.hostifame.id/",
    siteName: "Virtual Gallery Fauzan",
    images: [
      {
        url: "/artworks/room1-1.jpg", // Path ke gambar banner di folder public/
        width: 1200,
        height: 630,
        alt: "Virtual Gallery 3D Preview",
      },
    ],
    locale: "id_ID",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Virtual Gallery Fauzan | Artspace 3D",
    description: "Jelajahi pameran karya seni virtual 3D interaktif berbasis WebGL.",
    images: ["/artworks/room1-1.jpg"],
  },
};
export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body>{children}</body>
    </html>
  );
}


