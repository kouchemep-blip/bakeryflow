"use client";

import React from "react";
import Link from "next/link";
import {
  Calendar,
  Ticket,
  Clock,
  Utensils,
  Star,
  ArrowRight,
} from "lucide-react";

// Données des événements (Section 1)
const UPCOMING_EVENTS = [
  {
    id: "01",
    title: "Soirée Jazz & Accords Mets-Vins",
    date: "Vendredi 15 Octobre • 19h30",
    description:
      "Un menu dégustation exclusif en 5 services élaboré par notre Chef, accompagné d'une sélection de grands crus et rythmé par un trio de jazz live.",
    price: "85€ / pers.",
    badge: "Places limitées",
  },
  {
    id: "02",
    title: "Brunch Spécial Terroir & Truffes",
    date: "Dimanche 24 Octobre • 11h00",
    description:
      "Redécouvrez les classiques du brunch dominical revisités à la truffe fraîche locale. Buffet de douceurs faites maison et bar à cocktails signatures.",
    price: "45€ / pers.",
    badge: "Populaire",
  },
  {
    id: "03",
    title: "Cours de Cuisine : Les Secrets du Chef",
    date: "Samedi 6 Novembre • 15h00",
    description:
      "Passez derrière les fourneaux. Un atelier immersif de 2 heures suivi d'une dégustation privée pour maîtriser l'art des sauces et des cuissons.",
    price: "120€ / pers.",
    badge: "Nouveau",
  },
];

// Données des statistiques incitatives (Section 2)
const STATS = [
  { value: "100%", label: "Produits Frais & Locaux" },
  { value: "24", label: "Places max par événement" },
  { value: "4.9/5", label: "Note moyenne des convives" },
];

export default function AVenirPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] pt-[25vh] pb-20 px-6 md:px-12 xl:px-24 overflow-hidden relative">
      {/* ── ARRIÈRE-PLAN GÉOMÉTRIQUE (Inspiré de l'image) ── */}
      <div className="absolute right-0 top-0 w-[50vw] h-[50vw] bg-[#F5EFE6] rounded-full translate-x-1/3 -translate-y-1/4 pointer-events-none opacity-60" />
      <div className="absolute right-[10vw] top-[15vw] w-6 h-6 bg-[#EA580C]/20 rounded-full pointer-events-none" />
      <div className="absolute left-[-5vw] bottom-[10vw] w-[30vw] h-[30vw] bg-[#FFF7ED] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-start relative z-10">
        {/* ── SECTION 1 : LES CARTES ÉVÉNEMENTS (Côté gauche - Layout asymétrique) ── */}
        <div className="col-span-1 lg:col-span-6 flex flex-col gap-8 order-2 lg:order-1">
          {UPCOMING_EVENTS.map((event) => (
            <div
              key={event.id}
              className="group relative bg-white border border-[#F5EFE6] rounded-2xl p-6 md:p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ease-out flex flex-col md:flex-row gap-6 items-start"
            >
              {/* Grand numéro d'identification en arrière-plan */}
              <span className="absolute right-6 top-2 text-7xl font-black text-[#F5EFE6]/70 group-hover:text-[#FFF7ED] transition-colors duration-300 pointer-events-none select-none">
                {event.id}
              </span>

              {/* Contenu textuel de la carte */}
              <div className="flex-1 flex flex-col gap-2 relative z-10">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="px-3 py-1 bg-[#FFF7ED] text-[#EA580C] text-xs font-bold uppercase tracking-wider rounded-full">
                    {event.badge}
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-amber-800 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    {event.date}
                  </div>
                </div>

                <h3 className="text-xl font-bold text-neutral-800 mt-1 group-hover:text-[#EA580C] transition-colors duration-300">
                  {event.title}
                </h3>

                <p className="text-sm text-neutral-500 leading-relaxed max-w-md mt-1">
                  {event.description}
                </p>

                {/* Footer de la carte avec prix et bouton d'action */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t border-[#F5EFE6]">
                  <div className="flex flex-col">
                    <span className="text-xs text-neutral-400 uppercase font-medium">
                      Tarif
                    </span>
                    <span className="text-lg font-black text-neutral-800">
                      {event.price}
                    </span>
                  </div>

                  <Link
                    href={`/reservation?event=${event.id}`}
                    className="inline-flex items-center gap-2 bg-[#EA580C] text-white font-bold text-xs uppercase px-4 py-2.5 rounded-xl hover:bg-neutral-900 transition-colors duration-300 shadow-sm"
                  >
                    Réserver
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ── SECTION 2 : ACCROCHE TEXTUELLE & STATS (Côté droit - Contenu fixe) ── */}
        <div className="col-span-1 lg:col-span-6 flex flex-col justify-center order-1 lg:order-2 lg:pl-12 lg:sticky lg:top-[28vh]">
          {/* Titre principal asymétrique */}
          <h1 className="text-4xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-none mb-6">
            Vivez des moments <br />
            <span className="text-[#EA580C] inline-block mt-2 relative">
              uniques chez nous
              <span className="absolute bottom-1 left-0 w-full h-2 bg-[#FFF7ED] -z-10 rounded" />
            </span>
          </h1>

          {/* Description persuasive pour inciter à l'achat */}
          <p className="text-neutral-600 text-sm md:text-base leading-relaxed mb-10 max-w-lg">
            Nos soirées thématiques et ateliers gastronomiques sont conçus pour
            éveiller vos sens. Les places sont volontairement limitées afin de
            préserver l&apos;intimité et la qualité de l&apos;échange avec notre
            Chef. Ne manquez pas l&apos;opportunité de vous créer des souvenirs
            mémorables.
          </p>

          {/* Grid de données chiffrées / Preuve sociale (Style similaire à la maquette) */}
          <div className="grid grid-cols-3 gap-4 border-t border-[#F5EFE6] pt-8">
            {STATS.map((stat, index) => (
              <div key={index} className="flex flex-col gap-1">
                <span className="text-2xl md:text-3xl font-black text-neutral-900 tracking-tight flex items-center gap-1">
                  {stat.value === "4.9/5" && (
                    <Star className="w-5 h-5 fill-[#EA580C] text-[#EA580C] hidden md:inline" />
                  )}
                  {stat.value}
                </span>
                <span className="text-xs text-neutral-400 font-medium leading-tight">
                  {stat.label}
                </span>
              </div>
            ))}
          </div>

          {/* Alerte de rareté en bas pour accentuer le FOMO */}
          <div className="mt-8 p-4 bg-[#FFF7ED] border border-[#FFEDD5] rounded-xl flex items-center gap-3 max-w-lg">
            <div className="p-2 bg-[#EA580C] rounded-lg text-white shrink-0">
              <Clock className="w-4 h-4" />
            </div>
            <p className="text-xs text-amber-900 leading-normal">
              <strong>Conseil du Chef :</strong> Les réservations ferment
              généralement 48 heures avant chaque événement pour nous permettre
              d&apos;ajuster les approvisionnements frais auprès de nos
              maraîchers.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
