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
  Mail,
} from "lucide-react";

const FOOTER_LINKS = [
  {
    title: "Navigation",
    links: [
      { label: "Accueil", href: "/" },
      { label: "À venir", href: "/coming-soon" },
    ],
  },
  {
    title: "Support",
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "Nous trouver", href: "/find-us" },
    ],
  },
  {
    title: "Légal",
    links: [
      { label: "Mentions légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

const SOCIALS = [
  { icon: Twitter, href: "https://twitter.com", label: "Twitter" },
  { icon: Instagram, href: "https://instagram.com", label: "Instagram" },
  { icon: Facebook, href: "https://facebook.com", label: "Facebook" },
  { icon: Linkedin, href: "https://linkedin.com", label: "LinkedIn" },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-[#2B1B17] text-white">
      {/* Image de fond — remplace le noir plein. Adapte le chemin à ton asset. */}
      <Image
        src="/images/bg.jpg"
        alt="footer image"
        fill
        className="object-cover"
      />
      {/* Voile teinté à l'identité (pas un noir générique) pour garder le texte lisible */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#2B1B17]/20 via-[#2B1B17]/50 to-[#2B1B17]" />

      <div className="relative z-10 mx-auto flex w-full max-w-7xl flex-col gap-16 px-6 pb-10 pt-20 md:px-10 lg:px-16">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.1fr_0.7fr_0.7fr_0.7fr_1fr]">
          {/* Marque */}
          <div>
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#EA580C] shadow-lg shadow-orange-500/20">
                <Wheat className="h-5 w-5 text-white" strokeWidth={2.5} />
              </div>
              <p className="text-[15px] font-semibold tracking-tight">
                BakeryFlow
              </p>
            </div>
            <p className="max-w-xs text-sm leading-7 text-white/60">
              Une expérience culinaire unique au cœur de Cotonou. Des produits
              frais, locaux et de saison, préparés avec soin pour chaque moment
              de la journée.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {SOCIALS.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="rounded-full border border-white/15 p-2.5 text-white/60 transition hover:border-[#EA580C] hover:text-[#EA580C]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Colonnes de liens */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
                {group.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {group.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm font-medium text-white/75 transition hover:text-[#EA580C]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div>
            <h3 className="mb-4 text-xs font-bold uppercase tracking-[0.18em] text-white/40">
              Nos nouveautés
            </h3>
            <p className="mb-4 text-sm leading-6 text-white/60">
              Nouveaux produits et offres, directement dans votre boîte mail.
            </p>
            <form className="flex items-center gap-2">
              <div className="flex flex-1 items-center gap-2 rounded-xl border border-white/15 bg-white/5 px-3 py-2.5">
                <Mail className="h-4 w-4 shrink-0 text-white/40" />
                <input
                  type="email"
                  placeholder="Votre email"
                  className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
                />
              </div>
              <button
                type="submit"
                className="shrink-0 rounded-xl bg-[#EA580C] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-white transition hover:bg-white hover:text-[#2B1B17]"
              >
                OK
              </button>
            </form>
            <Link
              href="/reservation"
              className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-white/75 transition hover:text-[#EA580C]"
            >
              Réserver une table
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>

        {/* Wordmark géant */}
        <div className="flex items-center gap-4 sm:gap-6 lg:gap-8">
          <Wheat
            className="h-16 w-16 shrink-0 text-[#EA580C] sm:h-20 sm:w-20 lg:h-28 lg:w-28"
            strokeWidth={1.75}
          />
          <p className="select-none text-[clamp(2.75rem,11vw,8rem)] font-black uppercase leading-none tracking-tight text-white">
            BakeryFlow
          </p>
        </div>

        {/* Bas de page */}
        <div className="border-t border-white/10 pt-6">
          <div className="flex flex-col gap-4 text-center sm:flex-row sm:items-center sm:justify-between sm:text-left">
            <span className="text-xs font-semibold text-white/40">
              © {currentYear} BakeryFlow. Tous droits réservés.
            </span>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-white/50 sm:justify-end">
              <Link
                href="/mentions-legales"
                className="transition hover:text-[#EA580C]"
              >
                Mentions légales
              </Link>
              <Link
                href="/confidentialite"
                className="transition hover:text-[#EA580C]"
              >
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
