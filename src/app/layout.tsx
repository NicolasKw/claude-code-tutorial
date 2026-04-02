import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Claude Code Mastery - Tutorial Interactivo',
  description: 'Aprende los 7 niveles de Claude Code construyendo tu propio bot de gestion personal',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
