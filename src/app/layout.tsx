import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Navbar } from '@/components/navbar';
import { Footer } from '@/components/footer';
import { GlobalAssistantDrawer } from '@/components/global-assistant-drawer';
import { SpeedInsights } from '@vercel/speed-insights/next';

export const metadata: Metadata = {
  title: 'POLAR SENSE AI — Polar Research Intelligence & AI Teaching',
  description:
    'An integrated polar science platform that transforms research into grounded knowledge, interactive AI lessons, teaching experiences and outreach content.',
  keywords: [
    'Polar Science',
    'Antarctica',
    'Arctic',
    'Polar Research',
    'NCPOR',
    'Grounded RAG',
    'AI Teaching Room',
    'Bharati Station',
    'Maitri Station',
    'Himadri Station',
    'IndARC',
  ],
  authors: [{ name: 'Polar Sense AI Research Team' }],
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#0b1329',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className="aurora-bg text-slate-100 antialiased flex flex-col min-h-screen">
        <Navbar />
        <main className="flex-1 w-full">{children}</main>
        <GlobalAssistantDrawer />
        <Footer />
        <SpeedInsights />
      </body>
    </html>
  );
}
