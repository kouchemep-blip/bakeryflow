"use client";
// FoodHero.jsx — Section Hero Food
// Données importées depuis hero.data.ts
// Reproduit fidèlement le design Dribbble (layout 2 colonnes, floating dish, app mockup)

import { HERO_DATA } from "@/features/landing/hero.data";

// ─── Icône panier ─────────────────────────────────────────────────────────────
type HeroData = typeof HERO_DATA;
type Category = HeroData["categories"][number];
type CarouselItem = HeroData["carouselItems"][number];
type AppItem = HeroData["appMockup"]["items"][number];

function CartIcon({ count = 2 }: { count?: number }) {
  return (
    <div className="relative">
      <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center shadow-lg">
        <svg viewBox="0 0 24 24" className="w-5 h-5 text-white fill-none stroke-white stroke-2">
          <path strokeLinecap="round" strokeLinejoin="round"
            d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 0 0-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.03-7.078A4.5 4.5 0 0 0 16.5 3.75H7.5L5.106 5.272M7.5 14.25 5.106 5.272m0 0-.617 2.318" />
        </svg>
      </div>
      <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 rounded-full text-white text-[10px] font-bold flex items-center justify-center">
        {count}
      </span>
    </div>
  );
}

// ─── Badge "Taste" flottant ────────────────────────────────────────────────────
function TasteBadge({ badge }: { badge: HeroData["badge"] }) {
  return (
    <div className="absolute top-6 left-6 bg-white rounded-2xl px-4 py-2 shadow-md z-10">
      <p className="text-xs text-gray-400 font-medium">{badge.label}</p>
      <p className="text-sm font-bold text-gray-800">{badge.price}</p>
    </div>
  );
}

// ─── Catégories (icônes rondes) ────────────────────────────────────────────────
function CategoryIcons({ categories }: { categories: Category[] }) {
  return (
    <div className="flex gap-3 mt-6">
      {categories.map((cat) => (
        <button
          key={cat.id}
          className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-xl hover:shadow-md hover:scale-105 transition-all duration-200"
          aria-label={cat.label}
        >
          {cat.icon}
        </button>
      ))}
    </div>
  );
}

// ─── Carousel bas (cartes produits) ───────────────────────────────────────────
function CarouselCard({ item }: { item: CarouselItem }) {
  return (
    <div className="bg-white rounded-2xl p-3 shadow-md w-36 flex-shrink-0">
      <div className="w-full h-20 bg-amber-50 rounded-xl flex items-center justify-center text-4xl mb-2">
        {item.image}
      </div>
      <p className="font-bold text-gray-800 text-sm">{item.name}</p>
      <p className="text-xs text-gray-400">{item.description}</p>
      <div className="flex items-center justify-between mt-2">
        <span className="text-sm font-bold text-gray-900">{item.price}</span>
        <button className="w-7 h-7 bg-gray-900 rounded-full flex items-center justify-center text-white text-sm hover:bg-orange-500 transition-colors duration-200">
          +
        </button>
      </div>
    </div>
  );
}

// ─── Mockup mobile ─────────────────────────────────────────────────────────────
function AppMockup({ data }: { data: HeroData["appMockup"] }) {
  return (
    <div className="bg-white rounded-3xl shadow-2xl p-4 w-52 z-10">
      {/* Header mockup */}
      <div className="flex items-center justify-between mb-3">
        <p className="font-bold text-gray-800 text-sm">{data.heading}</p>
        <div className="w-7 h-7 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs">
          🛒
        </div>
      </div>
      {/* Icônes catégories mini */}
      <div className="flex gap-2 mb-3">
        {["🍔","🍕","🥤","🍜"].map((icon, i) => (
          <div key={i} className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center text-sm">
            {icon}
          </div>
        ))}
      </div>
      {/* Liste plats */}
      {data.items.map((item: AppItem) => (
        <div key={item.id} className="flex items-center gap-2 mb-2 p-2 bg-gray-50 rounded-xl">
          <div className="w-10 h-10 bg-amber-100 rounded-xl flex items-center justify-center text-xl flex-shrink-0">
            {item.image}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-gray-800 truncate">{item.name}</p>
            <div className="flex items-center justify-between mt-0.5">
              <span className="text-xs text-gray-500">{item.price}</span>
              <button className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center text-white text-[10px]">+</button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Boutons store ─────────────────────────────────────────────────────────────
function StoreButton({ label, icon }: { label: string; icon: string }) {
  return (
    <a
      href="#"
      className="flex items-center gap-2 bg-gray-900 text-white rounded-xl px-4 py-2.5 hover:bg-gray-700 transition-colors duration-200"
    >
      <span className="text-lg">{icon}</span>
      <div>
        <p className="text-[9px] text-gray-400 leading-none">Download on the</p>
        <p className="text-xs font-bold leading-tight">{label}</p>
      </div>
    </a>
  );
}

// ─── Hero principal ────────────────────────────────────────────────────────────
export function Hero() {
  const d = HERO_DATA;

  return (
    <section className="relative min-h-screen overflow-hidden bg-[#f5efe6] pt-20 sm:pt-28">
      <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-8 px-4 py-10 sm:gap-12 sm:px-6 sm:py-16 lg:grid-cols-2 lg:px-16">
        <div>
          <span className="inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-orange-600 shadow-sm">{d.badge.label}</span>
          <h1 className="mt-6 text-4xl font-black leading-tight text-gray-900 sm:text-5xl md:text-7xl">
            {d.title.line1}<br />{d.title.line2}<br /><span className="text-orange-500">{d.title.line3}</span>
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-8 text-gray-600">{d.rightSection.tagline}</p>
          <a href={d.cta.href} className="mt-8 inline-flex rounded-xl bg-gray-900 px-6 py-4 font-bold text-white transition-colors hover:bg-orange-500">{d.cta.label}</a>
          <CategoryIcons categories={d.categories} />
        </div>
        <div className="relative rounded-[2rem] bg-orange-100 p-4 shadow-xl sm:p-8">
          <TasteBadge badge={d.badge} />
          <div className="absolute right-6 top-6"><CartIcon /></div>
          <div className="pt-16 text-center text-8xl" aria-label={d.mainDish.alt} role="img">🍞</div>
          <p className="mx-auto mt-6 max-w-md text-center text-gray-600">{d.rightSection.subtext}</p>
          <div className="mt-8 flex gap-4 overflow-x-auto pb-2">
            {d.carouselItems.map((item) => <CarouselCard key={item.id} item={item} />)}
          </div>
          <div className="mt-8 flex flex-col items-center gap-6 sm:flex-row sm:items-start">
            <AppMockup data={d.appMockup} />
            <div>
              <h2 className="text-2xl font-bold text-gray-900">{d.appSection.title}</h2>
              <p className="mt-2 text-sm leading-6 text-gray-600">{d.appSection.description}</p>
              <div className="mt-4 flex flex-wrap gap-3">
                <StoreButton label={d.appSection.appStore.label} icon="" />
                <StoreButton label={d.appSection.googlePlay.label} icon="▶" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
