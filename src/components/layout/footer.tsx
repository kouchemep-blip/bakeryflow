// components/Footer.tsx
import React from 'react';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="relative w-full mt-[120px] font-serif">

      {/* Pizza qui dépasse au-dessus */}
      <Image
        src="/images/pizza.svg"
        alt="pizza"
        width={200}
        height={200}
        className="absolute top-[-120px] left-1/2 z-10 -translate-x-1/2"
      />

      {/* Vague du haut — SVG inline */}
      <div className="block w-full h-[80px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M0,40 
               C60,70 120,10 180,40 
               C240,70 300,10 360,40 
               C420,70 480,10 540,40 
               C600,70 660,10 720,40 
               C780,70 840,10 900,40 
               C960,70 1020,10 1080,40 
               C1140,70 1200,10 1260,40 
               C1320,70 1380,10 1440,40 
               L1440,0 L0,0 Z"
            fill="#f5efe0"
          />
        </svg>
      </div>

      {/* Zone crème */}
      <div className="bg-[#f5efe0] px-16 py-8 text-center">
        <h2 className="font-['Dancing_Script'] text-[3rem] text-[#8b1a1a]">Buon Appetito 🌿</h2>
        <p className="tracking-[0.3em] text-[0.8rem] text-[#555] mb-12">· ITALIAN KITCHEN ·</p>

        {/* Grille responsive : 1 col sur mobile, 4 cols sur grand écran */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mt-8">
          
          {/* About */}
          <div>
            <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">ABOUT US</h3>
            <p className="text-[#555] text-[0.9rem] leading-relaxed">
              Authentic Italian flavors, made with fresh ingredients and a passion for tradition.
            </p>
          </div>

          {/* Menu */}
          <div>
            <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">MENU</h3>
            <ul className="flex flex-col gap-2 text-[#555] text-[0.9rem]">
              <li>Pizzas</li>
              <li>Pasta</li>
              <li>Starters</li>
              <li>Salads</li>
              <li>Desserts</li>
            </ul>
          </div>

          {/* Customer Care */}
          <div>
            <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">CUSTOMER CARE</h3>
            <ul className="flex flex-col gap-2 text-[#555] text-[0.9rem]">
              <li>FAQ</li>
              <li>Delivery Information</li>
              <li>Returns & Refunds</li>
              <li>Reservations</li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">LET&apos;S CONNECT</h3>
            <div className="flex gap-2 mb-4">
              <a href="#" className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity">Insta</a>
              <a href="#" className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity">FB</a>
              <a href="#" className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity">Pin</a>
            </div>
            <p className="text-[#555] text-[0.9rem]">Stay updated! ♡</p>
            <div className="flex border border-[#ccc] rounded-md overflow-hidden mt-2">
              <input 
                type="email" 
                placeholder="Enter your email" 
                className="flex-1 p-2 border-none outline-none bg-white text-[0.85rem]"
              />
              <button className="px-3 py-2 bg-[#c0392b] text-white border-none cursor-pointer hover:bg-[#a93226] transition-colors">
                →
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Vague entre crème et vert — SVG */}
      <div className="-mt-[2px] block w-full h-[80px]">
        <svg viewBox="0 0 1440 80" preserveAspectRatio="none" className="w-full h-full block">
          <path
            d="M0,0 
               C60,40 120,70 180,40 
               C240,10 300,60 360,40 
               C420,20 480,60 540,40 
               C600,20 660,60 720,40 
               C780,20 840,60 900,40 
               C960,20 1020,60 1080,40 
               C1140,20 1200,60 1260,40 
               C1320,20 1380,60 1440,40 
               L1440,80 L0,80 Z"
            fill="#2d5a27"
          />
        </svg>
      </div>

      {/* Zone verte */}
      <div className="bg-[#2d5a27] text-white text-center p-8 flex flex-col items-center gap-2 border-b rounded-b-[100px]">
        <span className="text-xl">🍕</span>
        <p className="font-['Dancing_Script'] text-[1.8rem]">Good food, good mood.</p>
        <p className="text-[0.7rem] tracking-[0.1em] text-white/70 uppercase">
          © 2026 BUON APPETITO ITALIAN KITCHEN. ALL RIGHTS RESERVED.
        </p>
      </div>

    </footer>
  );
}
