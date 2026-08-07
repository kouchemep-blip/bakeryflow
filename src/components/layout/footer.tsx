"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Twitter,
  Instagram,
  Facebook,
  Linkedin,
  ArrowRight,
  Wheat,
} from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { label: "ACCUEIL", href: "/" },
      { label: "A VENIR", href: "/coming-soon" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "NOUS TROUVER", href: "/find-us" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions Légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative min-h-[82vh] overflow-hidden bg-[#F5EFE6] text-neutral-800">
      <div className="relative z-10 mx-auto flex w-full rounded-[10vw] border border-white/40 bg-white/40 backdrop-blur-md max-w-7xl flex-col gap-12 px-6 py-16 md:px-10 lg:px-16">
        <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr_auto] lg:items-start">
          <div className="max-w-md">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EA580C] shadow-lg shadow-orange-500/20">
                <Wheat className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <div>
                <p className="text-[15px] font-semibold tracking-tight text-black">
                  BakeryFlow
                </p>
                <p className="text-xs text-neutral-500">Fresh bakery experience</p>
              </div>
            </div>

            <p className="max-w-sm text-sm leading-7 text-neutral-600">
              Une expérience culinaire unique au cœur de Cotonou. Des produits frais,
              locaux et de saison, préparés avec soin pour chaque moment de la journée.
            </p>

            <div className="mt-8 flex items-center gap-3">
              <Link
                href="/reservation"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#EA580C] px-5 py-3 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-neutral-900"
              >
                Réserver une table
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>

              <Link
                href="/coming-soon"
                className="inline-flex items-center rounded-2xl border border-neutral-300 bg-white/70 px-5 py-3 text-xs font-semibold uppercase tracking-wider text-neutral-700 transition hover:bg-white"
              >
                Découvrir
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-1">
            {FOOTER_LINKS.map((group) => (
              <div key={group.title}>
                <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                  {group.title}
                </h3>
                <ul className="flex flex-col gap-3">
                  {group.links.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm font-medium text-neutral-700 transition hover:text-[#EA580C]"
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="lg:justify-self-end">
            <div className="rounded-3xl border border-white/60 bg-white/70 p-5 shadow-sm backdrop-blur-md">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-neutral-500">
                Suivez-nous
              </p>
              <div className="mt-4 flex items-center gap-4 text-neutral-500">
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 bg-white p-3 transition hover:border-[#EA580C] hover:text-[#EA580C]"
                >
                  <Twitter className="h-4 w-4" />
                </a>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 bg-white p-3 transition hover:border-[#EA580C] hover:text-[#EA580C]"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 bg-white p-3 transition hover:border-[#EA580C] hover:text-[#EA580C]"
                >
                  <Facebook className="h-4 w-4" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="rounded-full border border-neutral-200 bg-white p-3 transition hover:border-[#EA580C] hover:text-[#EA580C]"
                >
                  <Linkedin className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-200 pt-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-col gap-1">
              <span className="text-xs font-semibold text-neutral-500">
                © {currentYear} Bakeryflow. Tous droits réservés.
              </span>
              <span className="text-[10px] font-medium tracking-[0.14em] text-neutral-400 uppercase">
                Fait maison avec passion.
              </span>
            </div>

            <div className="flex flex-wrap gap-4 text-sm text-neutral-500">
              <Link href="/mentions-legales" className="transition hover:text-[#EA580C]">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="transition hover:text-[#EA580C]">
                Confidentialité
              </Link>
              <Link href="/faqs" className="transition hover:text-[#EA580C]">
                FAQs
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}