import type { Metadata } from 'next';
import './globals.css';
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";
import { LanguageProvider } from '@/lib/i18n/context';
import { FeedbackWidget } from '@/components/FeedbackWidget';

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  title: 'Claude Code Mastery - Tutorial Interactivo',
  description: 'Aprende los 7 niveles de Claude Code construyendo tu propio agente de investigación de startups',
  icons: {
    icon: '/zalesmachine isologo.png',
    apple: '/zalesmachine isologo.png',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={cn("font-sans", geist.variable)}>
      <body className="antialiased">
        <LanguageProvider>
          {children}
          <FeedbackWidget />
        </LanguageProvider>
      </body>
    </html>
  );
}
