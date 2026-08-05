"use client";

import React, { useState } from "react";
import Image from "next/image";
import { 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft, 
  ChevronRight, 
  Heart,
  UtensilsCrossed,
  Pizza,
  Cake,
  Beef
} from "lucide-react";

// --- DONNÉES LOCALES (MOCK DATA) ---
const CATEGORIES = [
  { id: 1, label: "Burgers", icon: UtensilsCrossed },
  { id: 2, label: "Pizzas", icon: Pizza },
  { id: 3, label: "Desserts", icon: Cake },
  { id: 4, label: "Viandes", icon: Beef },
];

const PLAT_SUGGESTIONS = [
  {
    id: 1,
    title: "Ramen au Crabe",
    desc: "Épicé à l'ail sauvage",
    price: "24.00",
    image: "/crab-ramen.png", // Pensez à ajouter vos propres images dans /public
  },
  {
    id: 2,
    title: "Émincé de Poulet",
    desc: "Poulet véritable grillé",
    price: "12.00",
    image: "/chicken-slice.png",
  },
];

export function Hero() {
  const [panierCount, setPanierCount] = useState(2);

  return (
    <div className="relative min-h-screen bg-[#ede6dc] text-[#1a1a1a] font-sans antialiased overflow-x-hidden selection:bg-[#c5a880] p-4 md:p-8">
      
      {/* --- EN-TÊTE / PANIER --- */}
      <header className="flex justify-between items-center max-w-7xl mx-auto mb-8">
        <div className="flex flex-col">
          <span className="text-xl font-bold tracking-wider uppercase text-[#2c2c2c]">Taste</span>
          <span className="text-xs text-gray-500 font-medium">Restaurant & BBQ</span>
        </div>
        
        {/* Bouton Panier Flottant */}
        <button className="relative p-3 bg-black text-white rounded-2xl hover:bg-neutral-800 transition shadow-lg group">
          <ShoppingBag className="w-6 h-6 transition-transform group-hover:scale-110" />
          {panierCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white font-bold text-xs w-5 h-5 rounded-full flex items-center justify-center animate-pulse">
              {panierCount}
            </span>
          )}
        </button>
      </header>

      {/* --- CONTENU PRINCIPAL CONTENEUR --- */}
      <main className="max-w-7xl mx-auto bg-[#f5efe6] rounded-[40px] shadow-sm p-6 md:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center relative overflow-hidden">
        
        {/* --- COLONNE GAUCHE : TEXTES ET AVANT-PLAN --- */}
        <div className="lg:col-span-6 space-y-8 z-10">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-black leading-[1.1] tracking-tight">
              Une Cuisine <br />
              <span className="text-neutral-800">Exquise vous</span> <br />
              Attend Chez Vous
            </h1>
          </div>

          {/* Bouton d'Action */}
          <div>
            <button className="inline-flex items-center gap-3 bg-black text-white px-8 py-4 rounded-full font-semibold hover:bg-neutral-800 transition-all shadow-md group">
              Voir le Menu
              <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
            </button>
          </div>

          {/* Sélecteur de Catégories (Icônes Lucide) */}
          <div className="flex flex-wrap gap-4 pt-4">
            {CATEGORIES.map((cat) => {
              const IconComponent = cat.icon;
              return (
                <button
                  key={cat.id}
                  className="flex items-center justify-center p-4 bg-white/80 backdrop-blur-sm rounded-2xl hover:bg-white transition-all shadow-sm hover:shadow-md border border-neutral-200/50 group"
                  title={cat.label}
                >
                  <IconComponent className="w-6 h-6 text-neutral-700 group-hover:text-black transition-colors" />
                </button>
              );
            })}
          </div>

          {/* Carrousel de Suggestions du Bas */}
          <div className="pt-6 space-y-4">
            {/* Flèches de navigation du mini-carrousel */}
            <div className="flex gap-2">
              <button className="p-2 rounded-full border border-neutral-300 hover:bg-white transition bg-transparent">
                <ChevronLeft className="w-4 h-4 text-neutral-600" />
              </button>
              <button className="p-2 rounded-full border border-neutral-300 hover:bg-white transition bg-transparent">
                <ChevronRight className="w-4 h-4 text-neutral-600" />
              </button>
            </div>

            {/* Grille de cartes suggestions */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {PLAT_SUGGESTIONS.map((plat) => (
                <div 
                  key={plat.id} 
                  className="bg-white/90 backdrop-blur-sm p-4 rounded-[24px] border border-neutral-100 flex flex-col items-center text-center shadow-sm relative group hover:shadow-md transition"
                >
                  {/* Conteneur Image avec width et height imposés pour Next.js */}
                  <div className="relative w-28 h-28 mb-3 bg-neutral-100 rounded-full overflow-hidden flex items-center justify-center text-xs text-neutral-400">
                    <Image 
                      src={plat.image} 
                      alt={plat.title}
                      width={112}
                      height={112}
                      className="object-cover group-hover:scale-105 transition duration-300"
                      onError={(e) => {
                        // Remplacement visuel si l'image locale n'existe pas encore
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <span className="absolute inset-0 flex items-center justify-center font-medium bg-neutral-200 text-neutral-700 pointer-events-none group-hover:opacity-0 transition">
                      [Plat]
                    </span>
                  </div>

                  <h3 className="font-bold text-sm text-neutral-900">{plat.title}</h3>
                  <p className="text-xs text-neutral-500 mb-2">{plat.desc}</p>
                  <span className="font-extrabold text-sm text-neutral-900">${plat.price}</span>

                  {/* Bouton favori */}
                  <button className="absolute top-3 right-3 p-1.5 rounded-full bg-neutral-50 hover:bg-red-50 text-neutral-400 hover:text-red-500 transition">
                    <Heart className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* --- COLONNE DROITE : GRAND VISUEL ET ARGUMENTAIRE --- */}
        <div className="lg:col-span-6 flex flex-col justify-between h-full space-y-12 lg:space-y-0 lg:pl-6 relative">
          
          {/* Grand Plat Principal Centré */}
          <div className="flex justify-center items-center relative my-auto">
            <div className="relative w-[320px] h-[320px] sm:w-[400px] sm:h-[400px] md:w-[450px] md:h-[450px] drop-shadow-2xl rounded-full bg-neutral-200 flex items-center justify-center text-neutral-500 text-sm overflow-hidden">
              <Image
                src="/images/hero-plat.jpg" 
                alt="Plat principal délicieux"
                fill
                priority
                className="object-cover"
                sizes="(max-w-7xl) 100vw, 450px"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center bg-black/5 pointer-events-none">
                <span className="font-bold text-lg text-neutral-800">[ Image Principale du Plat ]</span>
                <span className="text-xs text-neutral-600 mt-1">Placez votre image transparente ici</span>
              </div>
            </div>
          </div>

          {/* Section Argumentaire en Bas à Droite */}
          <div className="space-y-4 lg:max-w-md lg:self-end text-left pt-6 border-t border-neutral-200/60">
            <h2 className="text-2xl md:text-3xl font-extrabold text-black leading-tight">
              Nous vous servons les plats les plus savoureux de la ville
            </h2>
            <p className="text-sm leading-relaxed text-neutral-600 font-medium">
              Chaque matin est une nouvelle opportunité de savourer des créations uniques, préparées avec passion à partir d&apos;ingrédients locaux minutieusement sélectionnés pour éveiller vos papilles.
            </p>
          </div>

        </div>
      </main>
    </div>
  );
}
