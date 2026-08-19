"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import {
  CalendarDays,
  CakeSlice,
  HeartHandshake,
  Mail,
  PartyPopper,
  Sparkles,
  Building2,
  Send,
  X,
} from "lucide-react";
import ScrollMaskReveal from "@/components/common/Scrollmaskreveal";
import { DiscoverButton } from "../ui/DiscoverBtn";
import { FaWhatsapp } from "react-icons/fa";
import { HERO_SLIDES, HeroSlider } from "./contactSlide";
import { useHeroSlider } from "@/hooks/useContactSlider";

const PHRASES = [
  { a: "célébrations nuptiales", icon: HeartHandshake },
  { a: "cérémonies", icon: CalendarDays },
  { a: "anniversaires", icon: PartyPopper },
  { a: "moments en famille", icon: CakeSlice },
  { a: "réceptions privées", icon: Sparkles },
  { a: "événements pro", icon: Building2 },
];

const HOLD_DURATION = 1800;
const EXIT_DURATION = 0.45;
const ENTER_DURATION = 0.55;
const BLUR_AMOUNT = 8;

const HEADLINE_LINES = [
  { text: "Vous voulez" },
  { text: "plutôt faire", color: "text-black/50" },
  { text: "une réservation ?", color: "text-[#EA580C]" },
];

const EMAIL = "maximaineh@gmail.com";
const WHATSAPP_URL = "https://wa.me/22962354400";

export default function Contact() {
  const [index, setIndex] = useState(0);
  const wordRef = useRef<HTMLSpanElement | null>(null);
  const isFirstRender = useRef(true);

  const [showForm, setShowForm] = useState(false); // État pour afficher/masquer le formulaire

  const formRef = useRef<HTMLDivElement | null>(null); // Référence GSAP pour le formulaire

  useEffect(() => {
    const interval = setInterval(
      () => {
        const target = wordRef.current;
        if (!target) return;

        gsap.to(target, {
          filter: `blur(${BLUR_AMOUNT}px)`,
          opacity: 0,
          y: -6,
          duration: EXIT_DURATION,
          ease: "power2.in",
          onComplete: () => {
            setIndex((i) => (i + 1) % PHRASES.length);
          },
        });
      },
      HOLD_DURATION + EXIT_DURATION * 1000 + ENTER_DURATION * 1000,
    );

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    const target = wordRef.current;
    if (!target) return;

    gsap.fromTo(
      target,
      {
        filter: `blur(${BLUR_AMOUNT}px)`,
        opacity: 0,
        y: isFirstRender.current ? 0 : 8,
      },
      {
        filter: "blur(0px)",
        opacity: 1,
        y: 0,
        duration: ENTER_DURATION,
        ease: "power3.out",
      },
    );

    isFirstRender.current = false;
  }, [index]);

  const current = PHRASES[index];
  const CurrentIcon = current.icon;

  const { activeIndex } = useHeroSlider();

  // Animation d'apparition du formulaire avec GSAP
  useEffect(() => {
    if (showForm && formRef.current) {
      gsap.fromTo(
        formRef.current,
        {
          opacity: 0,
          y: -20,
          filter: "blur(6px)",
          height: 0,
        },
        {
          opacity: 1,
          y: 0,
          filter: "blur(0px)",
          height: "auto",
          duration: 0.5,
          ease: "power3.out",
        },
      );
    }
  }, [showForm]);

  // Animation de fermeture du formulaire avant de le retirer du DOM
  const handleCloseForm = () => {
    if (formRef.current) {
      gsap.to(formRef.current, {
        opacity: 0,
        y: -15,
        filter: "blur(6px)",
        height: 0,
        duration: 0.35,
        ease: "power3.in",
        onComplete: () => setShowForm(false),
      });
    } else {
      setShowForm(false);
    }
  };

  return (
    <main
      className="bg-[#F5EFE6] text-black"
      style={{ "--reveal-mask-bg": "#F5EFE6" } as React.CSSProperties}
    >
      <section className="relative mx-auto my-20 min-h-screen max-w-7xl overflow-hidden rounded-[15px] px-6 py-8 shadow-sm lg:rounded-[30px] md:px-10 md:py-12 lg:px-16 lg:py-16">
        <div className="pointer-events-none absolute inset-0 z-0 " />
        <div className="hidden md:absolute inset-0">
          <HeroSlider slides={HERO_SLIDES} activeIndex={activeIndex} />
        </div>
        <div className="mx-auto grid min-h-[calc(100vh-4rem)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:gap-12">
          <div className="relative z-10 rounded-[2.25rem] border border-white/55 bg-[#F5EFE6] p-6 shadow-[0_24px_110px_rgba(0,0,0,0.1)] backdrop-blur-2xl md:p-8">
            {/* Optionnel : Micro-badge d'introduction pour donner un style éditorial haut de gamme */}
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#EA580C]/10 text-[#EA580C] rounded-full text-xs font-semibold uppercase tracking-wider mb-6">
              nous joindre
            </div>
            <ScrollMaskReveal
              lines={HEADLINE_LINES}
              className="max-w-3xl"
              lineClassName="text-4xl font-semibold tracking-tight leading-[1.02] md:text-6xl lg:text-7xl"
              stagger={0.16}
              duration={0.95}
              start="top 75%"
              end="bottom 45%"
              scrub={0.6}
            />

            {/* Description courte pour combler le vide visuel avant les actions (Recommandé) */}
            <p className="mt-6 text-neutral-500 text-sm md:text-base max-w-xl font-medium leading-relaxed">
              Choisissez le canal qui vous convient le mieux. Notre équipe vous
              répond en moins de 15 minutes pour confirmer votre table.
            </p>

            <div className="mt-15 flex flex-wrap items-center gap-4">
              <DiscoverButton
                icon={Mail}
                label="Par mail"
                onClick={() => setShowForm(true)}
              />
              <div className="hidden md:block">
                <DiscoverButton
                  icon={FaWhatsapp}
                  label="Sur WhatsApp"
                  onClick={() =>
                    window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
                  }
                />
              </div>

              {/* FORMULAIRE DE CONTACT RAPIDE AVEC ANIMATION GSAP */}
              {showForm && (
                <div
                  ref={formRef}
                  className="mt-6 overflow-hidden rounded-2xl border border-black/10 bg-white/80 p-5 shadow-inner backdrop-blur-md"
                >
                  <div className="flex items-center justify-between border-b border-black/5 pb-3">
                    <div className="flex items-center gap-2 text-sm font-semibold text-neutral-800">
                      <Mail className="h-4 w-4 text-[#EA580C]" />
                      Formulaire de contact
                    </div>
                    <button
                      onClick={handleCloseForm}
                      className="rounded-full p-1 text-neutral-400 hover:bg-black/5 hover:text-black transition"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form
                    className="mt-4 space-y-4"
                    onSubmit={(e) => e.preventDefault()}
                  >
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">
                          Nom complet
                        </label>
                        <input
                          type="text"
                          placeholder="Ex: John Doe"
                          className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm focus:border-[#EA580C] focus:outline-none transition"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-neutral-500 mb-1">
                          Adresse Email
                        </label>
                        <input
                          type="email"
                          placeholder="Ex: john@example.com"
                          className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm focus:border-[#EA580C] focus:outline-none transition"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-neutral-500 mb-1">
                        Votre message
                      </label>
                      <textarea
                        rows={3}
                        placeholder="Décrivez votre besoin, la date de l’événement et le nombre
                  d’invités. Nous revenons vers vous avec une proposition
                  claire."
                        className="w-full rounded-xl border border-black/10 bg-white p-3 text-sm focus:border-[#EA580C] focus:outline-none transition resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="flex w-full items-center justify-center gap-2 rounded-xl bg-black py-3 text-sm font-semibold text-white hover:bg-neutral-800 transition active:scale-[0.99]"
                    >
                      <Send className="h-4 w-4" />
                      Envoyer ma demande
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          <div className="relative z-10">
            <div className="relative overflow-hidden rounded-[2.25rem] border border-white/55 bg-white/45 p-6 shadow-[0_24px_110px_rgba(0,0,0,0.1)] backdrop-blur-2xl md:p-8">
              <div className="mb-6 flex items-start justify-between gap-4">
                <div>
                  <p className="text-xs font-medium uppercase tracking-[0.24em] text-black/45">
                    Pour vos événements
                  </p>
                  <h2 className="mt-2 text-2xl font-semibold tracking-tight text-black md:text-3xl">
                    Nous vous assistons également pour vos{" "}
                    <span className="inline-flex items-center gap-2 text-[#EA580C]">
                      <span
                        ref={wordRef}
                        className="inline-block will-change-transform"
                      >
                        {current.a}
                      </span>
                      <CurrentIcon className="h-5 w-5 mt-1" />
                    </span>
                  </h2>
                <div className="md:hidden block mt-7">
                  <DiscoverButton
                    icon={FaWhatsapp}
                    label="Sur WhatsApp"
                    onClick={() =>
                      window.open(WHATSAPP_URL, "_blank", "noopener,noreferrer")
                    }
                  />
                </div>
                </div>
              </div>

              <div className="hidden md:grid gap-4 sm:grid-cols-2">
                {[
                  {
                    title: "Réservations",
                    text: "Organisez votre demande en quelques instants.",
                  },
                  {
                    title: "Créations sur mesure",
                    text: "Des pièces adaptées à votre occasion.",
                  },
                  {
                    title: "Réponse rapide",
                    text: "Contact direct par email ou WhatsApp.",
                  },
                  {
                    title: "Événements privés",
                    text: "Mariages, anniversaires, cérémonies et plus.",
                  },
                ].map((item) => (
                  <div
                    key={item.title}
                    className="rounded-[1.35rem] border border-white/55 bg-white/55 p-5"
                  >
                    <p className="text-sm font-medium text-black/50">
                      {item.title}
                    </p>
                    <p className="mt-2 text-sm leading-7 text-black/75">
                      {item.text}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
