"use client";

import Image from "next/image";
import { DiscoverButton } from "../ui/DiscoverBtn";
import { Utensils } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

// Variants pour le conteneur du titre : orchestre l'apparition des lignes
const titleContainer = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

// Chaque ligne remonte avec un effet "masqué" (clip-path) + fade
const lineVariant = {
  hidden: { y: "100%", opacity: 0 },
  visible: {
    y: "0%",
    opacity: 1,
    transition: {
      duration: 0.9,
      ease: [0.22, 1, 0.36, 1], // easing "expo-out" doux
    },
  },
};

export function Hero() {
  return (
    <div className="relative min-h-screen bg-[#F5EFE6] overflow-x-hidden selection:bg-[#EA580C] p-2">
      <main className="relative mx-auto my-20 grid min-h-screen max-w-7xl grid-cols-1 gap-12 overflow-hidden rounded-[15px] px-6 shadow-sm lg:grid-cols-12 lg:rounded-[30px] md:py-12 lg:py-16">
        <motion.div
          className="absolute inset-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <Image
            src={"/images/bg.jpg"}
            fill
            alt="background"
            className="object-cover"
            sizes="100vw"
          />
        </motion.div>

        {/* Colonne Gauche : Titre */}
        <div className="lg:col-span-6 space-y-8 z-10 lg:-ml-22 md:px-25 mt-10 md:mt-0">
          <motion.div
            className="space-y-1"
            initial="hidden"
            animate="visible"
            variants={titleContainer}
          >
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-white leading-[1.1] tracking-tight">
              <span className="block overflow-hidden">
                <motion.span variants={lineVariant} className="block">
                  Une Cuisine
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span
                  variants={lineVariant}
                  className="block text-[#F5EFE6]"
                >
                  Exquise vous
                </motion.span>
              </span>
              <span className="block overflow-hidden">
                <motion.span variants={lineVariant} className="block">
                  Attend Chez Vous
                </motion.span>
              </span>
            </h1>
          </motion.div>
        </div>

        {/* Colonne Droite : Bouton */}
        <div className="lg:col-span-6 flex flex-col items-end justify-between h-full z-10">
          <div className="hidden lg:block"></div>

          <motion.div
            className="w-full lg:max-w-md text-left pt-6 border-t border-neutral-200/60"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.9, ease: [0.22, 1, 0.36, 1] }}
          >
            <Link href="/#plats" className="flex justify-end jund">
              <DiscoverButton icon={Utensils} label="Découvrir nos plats" />
            </Link>
          </motion.div>
        </div>
      </main>
    </div>
  );
}
