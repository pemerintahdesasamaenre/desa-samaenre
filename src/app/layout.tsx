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

const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://profil-desa.id';

export const metadata: Metadata = {
  metadataBase: new URL(appUrl),
  title: {
    default: "Profil Resmi Desa Digital",
    template: "%s | Desa Digital"
  },
  description: "Portal informasi publik, statistik penduduk, transparansi anggaran, dan pelayanan desa digital yang mandiri dan inovatif.",
  keywords: ["desa digital", "profil desa", "pelayanan publik", "transparansi anggaran", "statistik desa"],
  authors: [{ name: "KKN 78 UINAM" }],
  creator: "Desa Digital",
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
    title: "Profil Resmi Desa Digital",
    description: "Informasi publik, statistik, dan pelayanan desa digital.",
    siteName: "Desa Digital",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Profil Desa Digital",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Profil Resmi Desa Digital",
    description: "Portal informasi dan pelayanan desa digital.",
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
        {children}
      </body>
    </html>
  );
}
