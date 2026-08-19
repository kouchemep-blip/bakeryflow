// "use client";

// import { useEffect, useState, useRef } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { CakeSlice, Sparkles, ChevronRight } from "lucide-react";

// gsap.registerPlugin(useGSAP);

// const DEFAULT_MESSAGE = "Préparation de votre expérience...";
// const LONG_WAIT_MESSAGE = "Encore quelques instants, nous préparons tout avec soin...";

// function AnimatedDots() {
//   const dot1 = useRef<HTMLSpanElement | null>(null);
//   const dot2 = useRef<HTMLSpanElement | null>(null);
//   const dot3 = useRef<HTMLSpanElement | null>(null);

//   useGSAP(() => {
//     const dots = [dot1.current, dot2.current, dot3.current].filter(Boolean) as HTMLSpanElement[];
//     if (!dots.length) return;

//     const ctx = gsap.context(() => {
//       gsap.to(dots, {
//         opacity: 0.2,
//         y: 0,
//         repeat: -1,
//         yoyo: true,
//         stagger: 0.18,
//         duration: 0.6,
//         ease: "sine.inOut",
//       });
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <span className="inline-flex items-center gap-1.5">
//       <span ref={dot1} className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
//       <span ref={dot2} className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
//       <span ref={dot3} className="h-1.5 w-1.5 rounded-full bg-[#EA580C]" />
//     </span>
//   );
// }

// function LoadingMark() {
//   const ringRef = useRef<HTMLDivElement | null>(null);
//   const innerRef = useRef<HTMLDivElement | null>(null);
//   const iconRef = useRef<HTMLDivElement | null>(null);

//   useGSAP(() => {
//     const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//     if (reduceMotion) return;

//     const ctx = gsap.context(() => {
//       gsap.to(ringRef.current, {
//         rotation: 360,
//         duration: 3.2,
//         repeat: -1,
//         ease: "none",
//         transformOrigin: "50% 50%",
//       });

//       gsap.to(innerRef.current, {
//         rotation: -360,
//         duration: 5.2,
//         repeat: -1,
//         ease: "none",
//         transformOrigin: "50% 50%",
//       });

//       gsap.to(iconRef.current, {
//         y: -2,
//         scale: 1.03,
//         duration: 1.4,
//         repeat: -1,
//         yoyo: true,
//         ease: "sine.inOut",
//       });
//     });

//     return () => ctx.revert();
//   }, []);

//   return (
//     <div className="relative flex h-24 w-24 items-center justify-center">
//       <div className="absolute inset-0 rounded-full border border-[#EA580C]/15 bg-white/35 backdrop-blur-sm" />
//       <div
//         ref={ringRef}
//         className="absolute inset-2 rounded-full border border-[#EA580C]/25 border-t-[#EA580C] border-r-transparent border-b-transparent border-l-transparent"
//       />
//       <div
//         ref={innerRef}
//         className="absolute inset-5 rounded-full border border-[#EA580C]/10 border-b-[#EA580C]/40 border-l-transparent border-r-transparent border-t-transparent"
//       />
//       <div
//         ref={iconRef}
//         className="relative z-10 flex h-11 w-11 items-center justify-center rounded-2xl bg-[#FFF7F0] text-[#EA580C] shadow-sm"
//       >
//         <CakeSlice className="h-5 w-5" />
//       </div>
//     </div>
//   );
// }

// function SkeletonCard({ delay = 0 }: { delay?: number }) {
//   return (
//     <div className="rounded-[1.5rem] border border-white/50 bg-white/45 p-4 backdrop-blur-xl">
//       <div className="h-36 rounded-[1.1rem] bg-[#EA580C]/8" />
//       <div className="mt-4 space-y-2">
//         <div className="h-3.5 w-3/5 rounded-full bg-[#EA580C]/10" />
//         <div className="h-2.5 w-4/5 rounded-full bg-black/5" />
//         <div className="h-2.5 w-2/3 rounded-full bg-black/5" />
//       </div>
//     </div>
//   );
// }

// export default function Loading() {
//   const [showLongWait, setShowLongWait] = useState(false);
//   const titleRef = useRef<HTMLDivElement | null>(null);
//   const panelRef = useRef<HTMLDivElement | null>(null);
//   const hintRef = useRef<HTMLDivElement | null>(null);

//   useEffect(() => {
//     const timer = setTimeout(() => setShowLongWait(true), 2000);
//     return () => clearTimeout(timer);
//   }, []);

//   useGSAP(
//     () => {
//       const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
//       if (reduceMotion) return;

//       const ctx = gsap.context(() => {
//         gsap.fromTo(
//           titleRef.current,
//           { opacity: 0, y: -14 },
//           { opacity: 1, y: 0, duration: 0.7, ease: "power3.out" },
//         );

//         gsap.fromTo(
//           panelRef.current,
//           { opacity: 0, y: 18, scale: 0.985 },
//           { opacity: 1, y: 0, scale: 1, duration: 0.8, delay: 0.08, ease: "power3.out" },
//         );

//         gsap.fromTo(
//           hintRef.current,
//           { opacity: 0, y: 10 },
//           { opacity: 1, y: 0, duration: 0.6, delay: 0.22, ease: "power2.out" },
//         );
//       });

//       return () => ctx.revert();
//     },
//     { scope: titleRef },
//   );

//   return (
//     <div className="fixed inset-0 z-[9999] overflow-hidden bg-[#F5EFE6] text-black">
//       <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,255,255,0.92),transparent_35%),radial-gradient(circle_at_top_right,rgba(234,88,12,0.12),transparent_25%),linear-gradient(180deg,rgba(255,255,255,0.35),rgba(255,255,255,0))]" />
//       <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#EA580C]/25 to-transparent" />
//       <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[#EA580C]/15 to-transparent" />

//       <div className="relative z-10 mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-6 py-10 md:px-10 lg:px-16">
//         <div className="grid items-center gap-12 lg:grid-cols-[1.02fr_0.98fr]">
//           <div ref={titleRef} className="max-w-2xl">
//             <div className="mb-5 inline-flex items-center rounded-full border border-black/10 bg-white/55 px-4 py-2 text-xs font-medium uppercase tracking-[0.22em] text-black/55 backdrop-blur-md">
//               BakeryFlow
//             </div>

//             <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-black md:text-6xl lg:text-7xl">
//               Préparation
//               <br />
//               de votre
//               <span className="text-[#EA580C]"> expérience</span>
//             </h1>

//             <p className="mt-6 max-w-lg text-base leading-8 text-black/65 md:text-lg">
//               Nous chargeons vos produits, vos pages et vos informations avec soin.
//             </p>

//             <div ref={hintRef} className="mt-8 flex items-center gap-3 text-sm text-black/60">
//               <span className="inline-flex items-center gap-2 rounded-full border border-black/10 bg-white/45 px-4 py-2 backdrop-blur-sm">
//                 <Sparkles className="h-4 w-4 text-[#EA580C]" />
//                 <span>{DEFAULT_MESSAGE}</span>
//                 <AnimatedDots />
//               </span>
//             </div>

//             <div className="mt-6 text-sm text-black/45">
//               {showLongWait && (
//                 <p className="inline-flex items-center gap-2">
//                   <ChevronRight className="h-4 w-4 text-[#EA580C]" />
//                   {LONG_WAIT_MESSAGE}
//                 </p>
//               )}
//             </div>
//           </div>

//           <div ref={panelRef} className="relative">
//             <div className="absolute -left-8 top-10 hidden h-24 w-24 rounded-full bg-[#EA580C]/10 blur-3xl md:block" />
//             <div className="relative overflow-hidden rounded-[2rem] border border-white/55 bg-white/45 p-6 shadow-[0_24px_100px_rgba(0,0,0,0.08)] backdrop-blur-2xl md:p-8">
//               <div className="flex items-center justify-between">
//                 <div>
//                   <p className="text-xs font-medium uppercase tracking-[0.2em] text-black/45">
//                     Chargement en cours
//                   </p>
//                   <p className="mt-2 text-xl font-semibold text-black">
//                     Tout est presque prêt
//                   </p>
//                 </div>
//                 <LoadingMark />
//               </div>

//               <div className="mt-8 grid gap-4 sm:grid-cols-2">
//                 <div className="rounded-[1.35rem] border border-white/55 bg-white/60 p-4">
//                   <div className="h-3.5 w-20 rounded-full bg-[#EA580C]/10" />
//                   <div className="mt-4 h-36 rounded-[1rem] bg-[#EA580C]/8" />
//                   <div className="mt-4 space-y-2">
//                     <div className="h-3 w-3/5 rounded-full bg-black/5" />
//                     <div className="h-2.5 w-4/5 rounded-full bg-black/5" />
//                   </div>
//                 </div>

//                 <div className="space-y-4">
//                   {[
//                     "Produits",
//                     "Commandes",
//                     "Espace client",
//                     "Réservation",
//                   ].map((label, i) => (
//                     <div
//                       key={label}
//                       className="rounded-[1.15rem] border border-white/55 bg-white/50 p-4"
//                       style={{ opacity: 0.98 - i * 0.05 }}
//                     >
//                       <div className="flex items-center justify-between">
//                         <span className="text-sm font-medium text-black/70">
//                           {label}
//                         </span>
//                         <span className="h-2.5 w-2.5 rounded-full bg-[#EA580C]" />
//                       </div>
//                       <div className="mt-3 h-2.5 w-5/6 rounded-full bg-black/5" />
//                     </div>
//                   ))}
//                 </div>
//               </div>

//               <div className="mt-6 rounded-[1.35rem] border border-black/5 bg-[#111827] p-5 text-white">
//                 <p className="text-sm font-medium text-white/70">BakeryFlow</p>
//                 <p className="mt-2 text-base leading-7 text-white/90">
//                   Une expérience simple, élégante et rapide, en harmonie avec votre univers.
//                 </p>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }


"use client";

export default function Loader() {
  return (
    <div className="loader-wrapper">
      <div className="loader">
        <div className="loaf">
          <div className="loaf-slit" />
          <div className="steam one" />
          <div className="steam two" />
          <div className="steam three" />
        </div>
        <p className="label">
          Préparation<span className="dots">...</span>
        </p>
      </div>

      <style jsx>{`
        .loader-wrapper {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 100%;
          height: 100%;
          min-height: 220px;
        }
        .loader {
          position: relative;
          width: 120px;
          height: 100px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .loaf {
          position: absolute;
          width: 30px;
          height: 20px;
          background: #f5efe6;
          border: 1px solid #ea580c;
          border-radius: 4px 4px 12px 12px;
          animation: expansion 6s infinite ease-in-out;
          transform-origin: center;
          box-shadow: inset 0 -4px 0 rgba(234, 88, 12, 0.15);
        }
        .loaf-slit {
          position: absolute;
          top: 4px;
          left: 50%;
          width: 60%;
          height: 2px;
          transform: translateX(-50%);
          background: rgba(234, 88, 12, 0.35);
          border-radius: 2px;
        }
        .steam {
          position: absolute;
          bottom: 100%;
          left: 50%;
          width: 16px;
          height: 26px;
          background: rgba(234, 88, 12, 0.25);
          border-radius: 50%;
          transform: translateX(-50%);
          animation: rise 6s infinite ease-in-out;
          filter: blur(8px);
        }
        .steam.one {
          animation-delay: 0s;
        }
        .steam.two {
          animation-delay: 1s;
        }
        .steam.three {
          animation-delay: 2s;
        }
        .label {
          position: absolute;
          top: 62px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.02em;
          color: #a94f10;
        }
        .dots {
          display: inline-block;
          width: 1em;
          overflow: hidden;
          vertical-align: bottom;
          animation: dots 1.4s steps(4, end) infinite;
        }

        @keyframes expansion {
          0% {
            width: 30px;
            transform: translateX(0);
          }
          40% {
            width: 110px;
            transform: translateX(0);
          }
          80% {
            width: 30px;
            transform: translateX(80px);
          }
          90% {
            width: 110px;
            transform: translateX(0);
          }
          100% {
            width: 30px;
            transform: translateX(0);
          }
        }
        @keyframes rise {
          0% {
            transform: translate(-50%, 0) scale(0.4);
            opacity: 0;
          }
          30% {
            opacity: 0.6;
          }
          60% {
            opacity: 0.3;
          }
          100% {
            transform: translate(-50%, -120px) scale(1);
            opacity: 0;
          }
        }
        @keyframes dots {
          0% {
            width: 0;
          }
          100% {
            width: 1em;
          }
        }
      `}</style>
    </div>
  );
}