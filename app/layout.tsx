import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { AuthProvider } from "@/components/providers/AuthProvider";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { SplashProvider } from "@/components/providers/SplashProvider";
import { AmbientBackground } from "@/components/layout/AmbientBackground";
import { Toaster } from "@/components/notifications/Toaster";
import { InitAudio } from "@/components/providers/InitAudio";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#0A0D14",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  viewportFit: "cover",
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
      suppressHydrationWarning
    >
      <head>
        {/* Preload handled via Next.js or ReactDOM implicitly where needed */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                let theme = 'system';
                const localStr = localStorage.getItem('ascend-settings-storage');
                if (localStr) {
                  const parsed = JSON.parse(localStr);
                  if (parsed && parsed.state && parsed.state.appearance && parsed.state.appearance.theme) {
                    theme = parsed.state.appearance.theme;
                  }
                }
                
                let effectiveTheme = theme;
                if (theme === 'system') {
                  effectiveTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                }
                
                document.documentElement.setAttribute('data-theme', effectiveTheme);
                document.documentElement.style.colorScheme = effectiveTheme;
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-full flex flex-col">
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js').then(function(registration) {
                    console.log('ServiceWorker registration successful with scope: ', registration.scope);
                  }, function(err) {
                    console.log('ServiceWorker registration failed: ', err);
                  });
                });
              }
            `,
          }}
        />
        <Providers>
          <ThemeProvider>
            <AuthProvider>
              <SplashProvider>
                <InitAudio />
                <AmbientBackground />
                {children}
                <Toaster />
              </SplashProvider>
            </AuthProvider>
          </ThemeProvider>
        </Providers>
      </body>
    </html>
  );
}
