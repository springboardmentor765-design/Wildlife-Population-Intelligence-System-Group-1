import type { Metadata } from "next";
import "@/styles/globals.css";
export const metadata: Metadata = { title: "Wildlife Population Intelligence System", description: "AI-powered wildlife population intelligence for conservation teams." };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) { return <html lang="en"><body>{children}</body></html>; }
