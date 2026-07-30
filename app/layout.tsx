import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SplashProvider } from "@/components/providers/SplashProvider";
import { PremiumBackground } from "@/components/adl/system/PremiumBackground";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0A0D14",
};

export const metadata: Metadata = {
  title: "Ascend AI | The Hall of Ascension",
  description: "Discipline builds what motivation only begins. Ascend your physical and mental state.",
  metadataBase: new URL("https://ascend-ai.vercel.app"),
  openGraph: {
    title: "Ascend AI | The Hall of Ascension",
    description: "Discipline builds what motivation only begins. Ascend your physical and mental state.",
    url: "https://ascend-ai.vercel.app",
    siteName: "Ascend AI",
    images: [
      {
        url: "/images/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "Ascend AI Preview",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Ascend AI | The Hall of Ascension",
    description: "Discipline builds what motivation only begins.",
    images: ["/images/og-image.jpg"],
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' }
    ],
    apple: [
      { url: '/apple-touch-icon.png' }
    ]
  },
  manifest: '/site.webmanifest'
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} h-full antialiased`}
    >
      <head>
        {/* Preload handled via Next.js or ReactDOM implicitly where needed */}
      </head>
      <body className="min-h-full flex flex-col">
        <Providers>
          <ThemeProvider>
            <PremiumBackground />
            <SplashProvider>
              <AuthProvider>{children}</AuthProvider>
            </SplashProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
