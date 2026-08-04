import type { Metadata } from "next";
import "./globals.css";

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
      className="h-full antialiased"
    >
      <body className="flex min-h-full flex-col overflow-x-hidden">
        {children}
      </body>
    </html>
  );
}
