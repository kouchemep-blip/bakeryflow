"use client";

import React from "react";
import { MapPin, Clock, Phone, Navigation, Compass } from "lucide-react";

const CONTACT_INFO = [
  {
    icon: <MapPin className="w-5 h-5 text-[#EA580C]" />,
    title: "Notre Adresse",
    value: "Bakeryflow - Cotonou Dégakon",
    description: "Cotonou, Bénin",
  },
  {
    icon: <Clock className="w-5 h-5 text-[#EA580C]" />,
    title: "Horaires d'ouverture",
    value: "11h30 - 23h00",
    description: "7 jours / 7 en continu",
  },
  {
    icon: <Phone className="w-5 h-5 text-[#EA580C]" />,
    title: "Réservations & Commandes",
    value: "+229 XX XX XX XX", // Ajustez avec votre numéro
    description: "Appel direct ou WhatsApp",
  },
];

export default function FindUsPage() {
  return (
    <main className="min-h-screen bg-[#F5EFE6] pt-[20vh] md:pt-[25vh] pb-20 px-4 sm:px-6 md:px-12 xl:px-24 overflow-x-hidden relative">
      {/* Formes d'arrière-plan douces adaptées à la charte beige */}
      <div className="hidden lg:block absolute left-0 bottom-0 w-[35vw] h-[35vw] bg-[#F5EFE6] rounded-full -translate-x-1/4 translate-y-1/4 pointer-events-none opacity-60" />

      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-stretch relative z-10">
        {/* ── COLONNE GAUCHE : STATS & INFOS DE CONTACT (45% de largeur environ) ── */}
        <div className="col-span-1 lg:col-span-5 flex flex-col justify-between gap-8">
          {/* En-tête de la page */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              <Compass className="w-4 h-4 animate-spin-slow" />
              Nous trouver
            </span>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-neutral-900 tracking-tight leading-tight">
              Venez nous <br />
              <span className="text-[#EA580C]">visiter</span>
            </h1>
            <p className="text-sm md:text-base text-neutral-500 leading-relaxed mt-2 max-w-sm">
              Découvrez l&apos;ambiance chaleureuse de notre restaurant situé au cœur
              de Cotonou.
            </p>
          </div>

          {/* Liste des cartes d'informations (Style blocs statistiques de gauche de votre image) */}
          <div className="flex flex-col gap-4 my-auto">
            {CONTACT_INFO.map((info, index) => (
              <div
                key={index}
                className="bg-white border border-[#F5EFE6] rounded-2xl p-5 shadow-sm flex flex-row items-center gap-5 hover:shadow-md transition-shadow duration-300"
              >
                {/* Icône enveloppée */}
                <div className="p-3.5 bg-[#FFF7ED] rounded-xl shrink-0">
                  {info.icon}
                </div>

                {/* Textes */}
                <div className="flex flex-col">
                  <span className="text-xs text-neutral-400 font-semibold uppercase tracking-wider">
                    {info.title}
                  </span>
                  <span className="text-base font-bold text-neutral-800 mt-0.5">
                    {info.value}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {info.description}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Petit bloc d'action "Y aller" pour inciter l'utilisateur */}
          <a
            href="https://google.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 bg-neutral-900 hover:bg-[#EA580C] text-white font-bold text-xs uppercase py-4 rounded-2xl transition-colors duration-300 shadow-sm"
          >
            <Navigation className="w-4 h-4" />
            Ouvrir dans Google Maps
          </a>
        </div>

        {/* ── COLONNE DROITE : LA CARTE GOOGLE MAPS (Remplace le globe) ── */}
        <div className="col-span-1 lg:col-span-7 min-h-[450px] lg:min-h-full relative flex flex-col">
          {/* Conteneur stylisé pour encadrer la carte proprement */}
          <div className="w-full h-full flex-1 bg-white border border-[#F5EFE6] rounded-3xl p-3 shadow-md relative overflow-hidden group">
            {/* Votre iframe Google Maps nettoyée pour s'adapter à 100% du bloc parent */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3965.190247743372!2d2.4756269749916493!3d6.369420693620777!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103cab2ae6c59081%3A0x8939e1d6e11e762a!2sLino's%20Food%20-%20Cotonou%20D%C3%A9gakon!5e0!3m2!1sfr!2sbj!4v1785947526961!5m2!1sfr!2sbj"
              className="w-full h-full min-h-[400px] lg:h-full rounded-2xl border-0 grayscale-[10%] group-hover:grayscale-0 transition-all duration-500"
              allowFullScreen={true}
              loading="lazy"
              referrerPolicy="strict-origin-when-cross-origin"
            />

            {/* Badge flottant décoratif en haut à droite */}
            <div className="absolute top-6 right-6 bg-white/90 backdrop-blur-sm border border-[#F5EFE6] py-1.5 px-3 rounded-full text-[10px] font-black uppercase text-neutral-800 pointer-events-none shadow-sm">
              📍 Cotonou, Bénin
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
