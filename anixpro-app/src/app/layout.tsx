import type { Metadata } from 'next'
import './globals.css'
import { Inter } from "next/font/google";
import { cn } from "@/lib/utils";

const inter = Inter({ subsets: ['latin'], variable: '--font-sans' });

export const metadata: Metadata = {
  title: 'AnixPro — AI Life Dashboard',
  description:
    'Your intelligent life dashboard. Track habits, journal, manage projects, and get AI-powered insights — all in one place.',
  keywords: ['productivity', 'AI dashboard', 'habit tracker', 'journal', 'life planner'],
  authors: [{ name: 'AnixPro' }],
  openGraph: {
    title: 'AnixPro — AI Life Dashboard',
    description: 'Your intelligent life dashboard powered by AI.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning className={cn("font-sans", inter.variable)}>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
