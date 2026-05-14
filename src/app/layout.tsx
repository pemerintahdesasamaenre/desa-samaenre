import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import ThemeToggle from "@/components/layout/ThemeToggle";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://profil-desa.id';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Website Resmi Desa Samaenre",
    template: "%s | Desa Samaenre"
  },
  description: "Portal informasi publik, statistik penduduk, transparansi anggaran, dan pelayanan desa digital yang mandiri dan inovatif di Desa Samaenre.",
  keywords: ["Desa Samaenre", "Profil Desa", "Pelayanan Publik", "Transparansi Anggaran", "Statistik Desa"],
  authors: [{ name: "Pemerintah Desa Samaenre" }],
  creator: "Pemerintah Desa Samaenre",
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon.png' },
    ],
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: appUrl,
    title: "Website Resmi Desa Samaenre",
    description: "Portal informasi publik, statistik, dan pelayanan digital Desa Samaenre.",
    siteName: "Desa Samaenre",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profil Desa Samaenre",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Website Resmi Desa Samaenre",
    description: "Portal informasi dan pelayanan digital Desa Samaenre.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <head>
        <link rel="dns-prefetch" href="https://jfjiotllfhujzigvxmpf.supabase.co" />
        <link rel="preconnect" href="https://jfjiotllfhujzigvxmpf.supabase.co" crossOrigin="anonymous" />
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <ThemeToggle />
        {children}
      </body>
    </html>
  );
}
