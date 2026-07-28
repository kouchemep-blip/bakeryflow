// components/Footer.tsx
import React from "react";
import Image from "next/image";

export default function Footer() {
  return (
    <footer className="relative top-20 w-full sm:top-35">
      {/* Pizza qui dépasse au-dessus */}
      <Image
        src="/images/pizza.svg"
        alt="pizza"
        width={200}
        height={200}
        className="absolute top-[-120px] left-1/2 z-10 -translate-x-1/2"
      />

      {/* Vague du haut — SVG inline */}

      {/* Zone crème */}
      <div className="bg-[#f5efe0] relative">
        <div className="block relative w-full h-15 top-[-38vh]">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
            <path
              fill="#f5efe0"
              fill-opacity="1"
              d="M0,224L10,218.7C20,213,40,203,60,192C80,181,100,171,120,181.3C140,192,160,224,180,234.7C200,245,220,235,240,197.3C260,160,280,96,300,90.7C320,85,340,139,360,170.7C380,203,400,213,420,197.3C440,181,460,139,480,122.7C500,107,520,117,540,144C560,171,580,213,600,234.7C620,256,640,256,660,229.3C680,203,700,149,720,112C740,75,760,53,780,85.3C800,117,820,203,840,218.7C860,235,880,181,900,160C920,139,940,149,960,138.7C980,128,1000,96,1020,80C1040,64,1060,64,1080,101.3C1100,139,1120,213,1140,224C1160,235,1180,181,1200,165.3C1220,149,1240,171,1260,176C1280,181,1300,171,1320,176C1340,181,1360,203,1380,224C1400,245,1420,267,1430,277.3L1440,288L1440,320L1430,320C1420,320,1400,320,1380,320C1360,320,1340,320,1320,320C1300,320,1280,320,1260,320C1240,320,1220,320,1200,320C1180,320,1160,320,1140,320C1120,320,1100,320,1080,320C1060,320,1040,320,1020,320C1000,320,980,320,960,320C940,320,920,320,900,320C880,320,860,320,840,320C820,320,800,320,780,320C760,320,740,320,720,320C700,320,680,320,660,320C640,320,620,320,600,320C580,320,560,320,540,320C520,320,500,320,480,320C460,320,440,320,420,320C400,320,380,320,360,320C340,320,320,320,300,320C280,320,260,320,240,320C220,320,200,320,180,320C160,320,140,320,120,320C100,320,80,320,60,320C40,320,20,320,10,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="px-5 py-8 text-center sm:px-16">
          <h2 className="text-3xl text-[#8b1a1a] sm:text-[3rem]">
            Buon Appetito 🌿
          </h2>
          <p className="tracking-[0.3em] text-[0.8rem] text-[#555] mb-12">
            · ITALIAN KITCHEN ·
          </p>

          {/* Grille responsive : 1 col sur mobile, 4 cols sur grand écran */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-left mt-8">
            {/* About */}
            <div>
              <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">
                ABOUT US
              </h3>
              <p className="text-[#555] text-[0.9rem] leading-relaxed">
                Authentic Italian flavors, made with fresh ingredients and a
                passion for tradition.
              </p>
            </div>

            {/* Menu */}
            <div>
              <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">
                MENU
              </h3>
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
              <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">
                CUSTOMER CARE
              </h3>
              <ul className="flex flex-col gap-2 text-[#555] text-[0.9rem]">
                <li>FAQ</li>
                <li>Delivery Information</li>
                <li>Returns & Refunds</li>
                <li>Reservations</li>
              </ul>
            </div>

            {/* Connect */}
            <div>
              <h3 className="font-extrabold text-[0.85rem] tracking-[0.1em] mb-4 text-[#222]">
                LET&apos;S CONNECT
              </h3>
              <div className="flex gap-2 mb-4">
                <a
                  href="#"
                  className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity"
                >
                  Insta
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity"
                >
                  FB
                </a>
                <a
                  href="#"
                  className="w-9 h-9 bg-[#222] color-white rounded-full flex items-center justify-content-center text-[0.7rem] no-underline text-white hover:opacity-80 transition-opacity"
                >
                  Pin
                </a>
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
      </div>

      {/* Vague entre crème et vert — SVG */}
      <div className="-mt-[2px] block w-full h-[80px]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320">
          <path
            fill="#f5efe0"
            fill-opacity="1"
            d="M0,192L10,192C20,192,40,192,60,181.3C80,171,100,149,120,149.3C140,149,160,171,180,176C200,181,220,171,240,186.7C260,203,280,245,300,224C320,203,340,117,360,80C380,43,400,53,420,96C440,139,460,213,480,208C500,203,520,117,540,101.3C560,85,580,139,600,149.3C620,160,640,128,660,144C680,160,700,224,720,245.3C740,267,760,245,780,197.3C800,149,820,75,840,64C860,53,880,107,900,144C920,181,940,203,960,176C980,149,1000,75,1020,53.3C1040,32,1060,64,1080,101.3C1100,139,1120,181,1140,218.7C1160,256,1180,288,1200,272C1220,256,1240,192,1260,170.7C1280,149,1300,171,1320,160C1340,149,1360,107,1380,101.3C1400,96,1420,128,1430,144L1440,160L1440,0L1430,0C1420,0,1400,0,1380,0C1360,0,1340,0,1320,0C1300,0,1280,0,1260,0C1240,0,1220,0,1200,0C1180,0,1160,0,1140,0C1120,0,1100,0,1080,0C1060,0,1040,0,1020,0C1000,0,980,0,960,0C940,0,920,0,900,0C880,0,860,0,840,0C820,0,800,0,780,0C760,0,740,0,720,0C700,0,680,0,660,0C640,0,620,0,600,0C580,0,560,0,540,0C520,0,500,0,480,0C460,0,440,0,420,0C400,0,380,0,360,0C340,0,320,0,300,0C280,0,260,0,240,0C220,0,200,0,180,0C160,0,140,0,120,0C100,0,80,0,60,0C40,0,20,0,10,0L0,0Z"
          ></path>
        </svg>
      </div>

      {/* Zone verte */}
      <div className="-mt-10 flex min-h-[220px] flex-col items-center gap-2 rounded-b-[60px] bg-[#2d5a27] p-8 text-center text-white sm:h-[45vh] sm:rounded-b-[100px]">
        <span className="text-xl">🍕</span>
        <p className="text-2xl sm:text-[1.8rem]">
          Good food, good mood.
        </p>
        <p className="text-[0.7rem] tracking-[0.1em] text-white/70 uppercase">
          © 2026 BUON APPETITO ITALIAN KITCHEN. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
