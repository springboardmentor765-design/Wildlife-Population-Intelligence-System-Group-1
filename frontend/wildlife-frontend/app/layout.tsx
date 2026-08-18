import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Navigation from "../components/Navigation";
import SmoothScroll from "../components/SmoothScroll";
import { ClerkProvider } from "@clerk/nextjs";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "WildVision AI - Advanced Wildlife Tracking",
    template: "%s | WildVision AI"
  },
  description: "AI-Powered Wildlife Tracking & Conservation Platform using real-time computer vision and bioacoustics.",
  keywords: ["Wildlife", "AI", "Conservation", "Computer Vision", "YOLOv11", "Ecology", "Ashwin Chauhan"],
  authors: [{ name: "Ashwin Chauhan" }],
  creator: "Ashwin Chauhan",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://wildvision-ai.com",
    siteName: "WildVision AI",
    title: "WildVision AI - Conservation Intelligence",
    description: "Empowering conservation with state-of-the-art YOLOv11 tracking and analytics.",
    images: [
      {
        url: "/hero-banner.png",
        width: 1200,
        height: 630,
        alt: "WildVision AI Hero",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "WildVision AI",
    description: "Empowering conservation with AI tracking and analytics.",
    creator: "@AshwinChauhan",
    images: ["/hero-banner.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <html
        lang="en"
        className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
      >
        <body 
          className="min-h-full flex flex-col text-white"
          style={{
            backgroundColor: '#0a0a0a',
            backgroundImage: 'linear-gradient(rgba(10, 10, 10, 0.88), rgba(10, 10, 10, 0.95)), url("/dashboard-bg.png")',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundAttachment: 'fixed',
          }}
        >
          <SmoothScroll>
            <Navigation />
            <main className="flex-1">
              {children}
            </main>
            
            {/* Global Footer */}
            <footer className="border-t border-white/10 bg-[#050505] py-8 text-center mt-auto">
              <div className="max-w-7xl mx-auto px-4 flex flex-col items-center justify-center space-y-2">
                <p className="text-zinc-500 text-sm">
                  &copy; {new Date().getFullYear()} WildVision AI. All rights reserved.
                </p>
                <p className="text-zinc-400 font-medium">
                  Developed by <span className="text-green-500 font-bold tracking-wide">Ashwin Chauhan</span>
                </p>
              </div>
            </footer>
          </SmoothScroll>
        </body>
      </html>
    </ClerkProvider>
  );
}
