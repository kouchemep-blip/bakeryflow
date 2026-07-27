// import type { Metadata } from "next";
// import { Geist, Geist_Mono, Open_Sans } from "next/font/google";
// import "../globals.css";
// import { DashboardNav } from "@/components/dashboard/sidebar";

import Hearder from "@/components/dashboard/header"
import { DashboardNav } from "@/components/dashboard/sidebar"

// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });

// const openSans = Open_Sans({
//   variable: "--font-open-sans",
//   subsets: ["latin"],
//   weight: ["400", "600", "700"],
// });

// export const metadata: Metadata = {
//   title: "BakeryFlow",
//   description: "Plateforme de commande de produits artisanaux",
// };

// export default function RootLayout({
//   children,
// }: Readonly<{
//   children: React.ReactNode;
// }>) {
//   return (
//     <html
//       lang="fr"
//       className={`${geistSans.variable} ${geistMono.variable} ${openSans.variable} h-full antialiased`}
//     >
//       <body className="min-h-full flex flex-col [@media(max-width:768px)]:overflow-x-hidden md:overflow-x-hidden">
//         <main className="flex min-h-screen">
//           <DashboardNav />
//         {children}
//         </main>
//       </body>
//     </html>
//   );
// }

export default function DashboardLayout ({
  children,
}: {
  children : React.ReactNode
}) {
  return (
    <div className="flex min-h-screen">
      <DashboardNav />
      <div className="flex flex-1 flex-col">
        <Hearder />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}