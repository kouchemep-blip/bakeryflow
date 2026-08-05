"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, Minus, PhoneCall } from "lucide-react";

const FAQ_ITEMS = [
  {
    question: "Comment puis-je réserver pour un événement spécial ?",
    answer: "Vous pouvez réserver directement en ligne depuis notre page 'À venir' en sélectionnant l'événement de votre choix. Les paiements sont sécurisés et vous recevrez instantanément vos billets par e-mail.",
  },
  {
    question: "Proposez-vous des options végétariennes ou adaptées aux allergies ?",
    answer: "Absolument. Pour chaque événement ou menu classique, notre Chef conçoit des alternatives adaptées. Veuillez simplement nous préciser vos restrictions alimentaires ou allergies dans la section 'Notes' lors de votre réservation.",
  },
  {
    question: "Quelle est votre politique d'annulation pour les soirées spéciales ?",
    answer: "Les places pour nos événements exclusifs étant très limitées, les annulations sont remboursables intégralement jusqu'à 48 heures avant le début de l'événement. Passé ce délai, aucun remboursement ne pourra être effectué.",
  },
  {
    question: "Puis-je privatiser le restaurant pour un événement privé ?",
    answer: "Oui, notre salle et notre équipe peuvent être entièrement privatisées pour des mariages, anniversaires ou événements d'entreprise. Contactez notre équipe via le bouton d'appel pour obtenir un devis sur-mesure.",
  },
  {
    question: "Y a-t-il un parking ou un accès facile à proximité ?",
    answer: "Le restaurant dispose d'un espace de stationnement réservé à notre clientèle juste devant l'établissement. La liste complète des accès et des transports en commun est disponible sur notre page 'Nous trouver'.",
  },
];

export default function FaqsPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleAccordion = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <main className="min-h-screen bg-[#FDFBF7] pt-[20vh] md:pt-[25vh] pb-20 px-4 sm:px-6 md:px-12 xl:px-24 overflow-x-hidden relative">
      
      {/* Cercles décoratifs d'arrière-plan masqués sur mobile pour éviter les bugs visuels */}
      <div className="hidden md:block absolute right-0 top-0 w-[40vw] h-[40vw] bg-[#FFF7ED] rounded-full translate-x-1/4 -translate-y-1/4 pointer-events-none opacity-70" />
      <div className="hidden md:block absolute left-[-10vw] bottom-0 w-[30vw] h-[30vw] bg-[#F5EFE6] rounded-full pointer-events-none opacity-50" />

      <div className="max-w-7xl mx-auto flex flex-col lg:grid lg:grid-cols-12 gap-8 lg:gap-16 items-start relative z-10">
        
        {/* ── COLONNE GAUCHE : TITRE & ENCADRÉ D'APPEL ── */}
        <div className="w-full lg:col-span-5 flex flex-col gap-6 md:gap-8 lg:sticky lg:top-[28vh]">
          
          {/* Badge & Titre responsive */}
          <div className="flex flex-col gap-2">
            <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[#EA580C]">
              <span className="w-2 h-2 rounded-full bg-[#EA580C]" />
              FAQs
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-5xl font-extrabold text-neutral-900 tracking-tight leading-tight">
              Questions fréquemment posées
            </h1>
          </div>

          {/* Encadré d'appel (Masqué sur tout petit écran, ou placé judicieusement) */}
          <div className="w-full bg-white border border-[#F5EFE6] rounded-3xl p-5 md:p-8 shadow-sm flex flex-col gap-5 relative overflow-hidden">
            <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#FFF7ED] rounded-full filter blur-xl opacity-80" />

            <div className="relative z-10 flex flex-col gap-4">
              <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#EA580C]/20 bg-[#F5EFE6]">
                <Image
                  src="/logo.jpg"
                  alt="Responsable de salle"
                  fill
                  className="object-cover"
                />
              </div>

              <div>
                <h3 className="text-lg md:text-xl font-bold text-neutral-900">
                  Besoin d&apos;un échange ?
                </h3>
                <p className="text-xs md:text-sm text-neutral-500 leading-relaxed mt-1">
                  Si vous avez une demande particulière ou des questions concernant une privatisation, réservez un appel avec notre responsable.
                </p>
              </div>

              <Link
                href="/contact"
                className="w-full inline-flex items-center justify-center gap-2 bg-[#EA580C] hover:bg-neutral-900 text-white font-bold text-xs uppercase py-3.5 rounded-xl transition-all duration-300 shadow-md shadow-orange-600/10"
              >
                <PhoneCall className="w-3.5 h-3.5" />
                Planifier un appel gratuit
              </Link>
            </div>
          </div>

        </div>

        {/* ── COLONNE DROITE : L'ACCORDÉON DE QUESTIONS ── */}
        <div className="w-full lg:col-span-7 flex flex-col gap-4">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={index}
                className="bg-white border border-[#F5EFE6] rounded-2xl overflow-hidden shadow-sm transition-all duration-300"
              >
                {/* En-tête cliquable de la question */}
                <button
                  onClick={() => toggleAccordion(index)}
                  className="w-full flex items-center justify-between gap-4 p-5 md:p-6 text-left transition-colors duration-200"
                >
                  <span className={`text-sm md:text-base font-bold transition-colors duration-200 ${
                    isOpen ? "text-[#EA580C]" : "text-neutral-800"
                  }`}>
                    {item.question}
                  </span>
                  
                  {/* Icône dynamique +/- */}
                  <div className={`p-1.5 rounded-full shrink-0 transition-transform duration-300 ${
                    isOpen ? "bg-[#FFF7ED] text-[#EA580C] rotate-180" : "bg-neutral-50 text-neutral-400"
                  }`}>
                    {isOpen ? <Minus className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  </div>
                </button>

                {/* Conteneur d'animation CSS ultra-fluide pour le texte (sans coupure) */}
                <div
                  className={`grid transition-all duration-300 ease-in-out ${
                    isOpen ? "grid-rows-[1fr] border-t border-[#FDFBF7]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="overflow-hidden">
                    <p className="p-5 md:p-6 text-xs md:text-sm text-neutral-500 leading-relaxed bg-neutral-50/50">
                      {item.answer}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </main>
  );
}
