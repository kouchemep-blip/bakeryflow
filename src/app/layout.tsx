import type { Metadata } from "next";
import { Merienda } from "next/font/google";
import "./globals.css";

const merienda = Merienda({
  variable: "--font-merienda",
  subsets: ["latin"],
  weight: "300",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BakeryFlow",
  description: "Plateforme de commande de produits artisanaux",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="fr"
      className={`${merienda.variable} h-full antialiased`}
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
