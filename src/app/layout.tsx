import type { Metadata } from "next";
import { 
  Inter, 
  Space_Grotesk, 
  Outfit, 
  Syne, 
  Bebas_Neue 
} from "next/font/google";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Providers } from "@/components/providers";
import { Footer } from "@/components/layout/footer";
import { Toaster } from "@/components/ui/toaster-provider";
import { ContentWrapper } from "@/components/layout/content-wrapper";
import { MovingBackground } from "@/components/layout/moving-background";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
});

const bebas = Bebas_Neue({
  variable: "--font-bebas",
  weight: "400",
  subsets: ["latin"],
});

import type { Viewport, Metadata } from "next";

export const viewport: Viewport = {
  themeColor: "#0D0D0D",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export const metadata: Metadata = {
  title: "AcheiAqui | Marketplace Premium",
  description: "Marketplace de alta performance com design premium.",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "AcheiAqui",
  },
  formatDetection: {
    telephone: false,
  },
};
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={cn(
        "dark antialiased", 
        inter.variable, 
        spaceGrotesk.variable, 
        outfit.variable, 
        syne.variable, 
        bebas.variable
      )}
    >
      <body className="min-h-screen bg-background text-foreground flex flex-col relative">
        {/* Decorative Green Lines - Top Corner */}
        <div className="fixed top-0 left-0 w-64 h-px bg-gradient-to-r from-primary/30 to-transparent z-0" />
        <div className="fixed top-0 left-0 w-px h-64 bg-gradient-to-b from-primary/30 to-transparent z-0" />
        
        {/* Decorative Green Lines - Bottom Corner */}
        <div className="fixed bottom-0 right-0 w-64 h-px bg-gradient-to-l from-primary/30 to-transparent z-0" />
        <div className="fixed bottom-0 right-0 w-px h-64 bg-gradient-to-t from-primary/30 to-transparent z-0" />

        <Providers>
          <Toaster />
          <MovingBackground />
          <ContentWrapper>
            {children}
          </ContentWrapper>
          <Footer />
        </Providers>
      </body>
    </html>
  );
}
