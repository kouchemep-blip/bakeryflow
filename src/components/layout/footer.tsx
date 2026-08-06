"use client";

import React from "react";
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
    column: [
      { label: "ACCUEIL", href: "/" },
      { label: "A VENIR", href: "/coming-soon" },
    ],
  },
  {
    column: [
      { label: "FAQs", href: "/faqs" },
      { label: "NOUS TROUVER", href: "/find-us" },
    ],
  },
  {
    column: [
      { label: "Mentions Légales", href: "/mentions-legales" },
      { label: "Confidentialité", href: "/confidentialite" },
    ],
  },
];

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative w-full min-h-[50vh] flex flex-col justify-end text-neutral-800 bg-[#FDFBF7] overflow-hidden pt-20">
      {/* ── IMAGE DE FOND EN LOCAL ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/bg.jpg"
          alt="Arrière-plan footer"
          fill
          priority
          className="object-cover object-bottom"
        />
        {/* Voile beige semi-transparent pour adoucir l'image et l'intégrer à votre charte graphique */}
        <div className="absolute inset-0 bg-[#FDFBF7]/85 backdrop-blur-[2px]" />
      </div>

      {/* ── CONTENU PRINCIPAL ── */}
      <div className="max-w-7xl w-full mx-auto px-6 md:px-12 xl:px-24 relative z-10 flex flex-col gap-12">
        {/* Section haute : Logo, Liens et CTA */}
        <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-10 md:gap-6">
          {/* Bloc Marque / Slogan */}
          <div className="flex flex-col gap-4 max-w-xs">
            <div className="mb-8 hidden items-center gap-2 px-2 md:flex">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#C2703D]">
                <Wheat className="h-5 w-5 text-[#161310]" strokeWidth={2.5} />
              </div>
              <span className="text-[15px] font-semibold tracking-tight text-black">
                BakeryFlow
              </span>
            </div>
            <p className="text-sm font-medium text-neutral-600 leading-relaxed">
              Une expérience culinaire unique au cœur de Cotonou. Des produits
              frais, locaux et de saison.
            </p>
          </div>

          {/* Grille de liens centrale (Structure calquée sur l'image d'inspiration) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-x-12 gap-y-6 md:gap-x-16">
            {FOOTER_LINKS.map((group, colIndex) => (
              <ul key={colIndex} className="flex flex-col gap-3">
                {group.column.map((link, linkIndex) => (
                  <li key={linkIndex}>
                    <Link
                      href={link.href}
                      className="text-xs font-bold tracking-wider text-neutral-600 hover:text-[#EA580C] uppercase transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            ))}
          </div>

          {/* Bouton d'action à droite (CTA) */}
          <div className="shrink-0">
            <Link
              href="/reservation"
              className="inline-flex items-center gap-2 bg-[#EA580C] hover:bg-neutral-900 text-white font-bold text-xs uppercase px-6 py-4 rounded-xl transition-all duration-300 shadow-md shadow-orange-600/10 hover:shadow-none"
            >
              Réserver une table
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* ── BARRE INFÉRIEURE : SÉPARATION & RÉSEAUX ── */}
        <div className="w-full flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 pb-8 border-t border-neutral-200">
          {/* Copyright et Slogan bas */}
          <div className="flex flex-col items-center sm:items-start gap-1">
            <span className="text-xs font-semibold text-neutral-500">
              © {currentYear} Bakeryflow. Tous droits réservés.
            </span>
            <span className="text-[10px] text-neutral-400 font-medium tracking-wide">
              Fait maison avec passion.
            </span>
          </div>

          {/* Icônes Réseaux Sociaux (Alignées à droite comme sur l'image) */}
          <div className="flex items-center gap-5 text-neutral-500">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EA580C] transition-colors duration-200"
            >
              <Twitter className="w-4 h-4" />
            </a>
            <a
              href="https://instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EA580C] transition-colors duration-200"
            >
              <Instagram className="w-4 h-4" />
            </a>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EA580C] transition-colors duration-200"
            >
              <Facebook className="w-4 h-4" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#EA580C] transition-colors duration-200"
            >
              <Linkedin className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
