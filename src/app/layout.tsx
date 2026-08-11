import type { Metadata } from "next";
import "./globals.css";
import { Merienda } from 'next/font/google'

export const metadata: Metadata = {
  title: "BakeryFlow",
  description: "Plateforme de commande de plats frais en ligne",
};

// Configuration de la police Merienda en version Light
const merienda = Merienda({
  subsets: ['latin'],
  weight: '300', // Force le poids Light par défaut
  variable: '--font-merienda', // Variable CSS utile pour Tailwind ou CSS pur
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className="h-full scroll-smooth antialiased"
    >
      <body className={`flex min-h-full flex-col overflow-x-hidden ${merienda.variable}`}>
        {children}
      </body>
    </html>
  );
}
