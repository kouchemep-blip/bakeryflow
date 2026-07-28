// hero.data.ts — données de la section Hero Food

export const HERO_DATA = {
  badge: {
    label: "Taste",
    price: "From $8,00",
  },

  title: {
    line1: "Delicious",
    line2: "Food is Waiting",
    line3: "For you",
  },

  cta: {
    label: "View Menu",
    href: "#",
  },

  categories: [
    { id: 1, icon: "🍔", label: "Burger" },
    { id: 2, icon: "🍕", label: "Pizza" },
    { id: 3, icon: "🥤", label: "Drinks" },
    { id: 4, icon: "🍜", label: "Noodles" },
  ],

  carouselItems: [
    {
      id: 1,
      name: "Crab Ramen",
      description: "Spicy with garlic",
      price: "$ 26.00",
      image: "🍜",
    },
    {
      id: 2,
      name: "Chicken Slice",
      description: "Real chicken",
      price: "$ 12.00",
      image: "🍗",
    },
  ],

  rightSection: {
    tagline: "Our team of registered nurses and skilled healthcare professionals provide in-home nursing.",
    subtext: "Our Specialist in yoga you can book with them your Classes dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make.",
  },

  appSection: {
    title: "App is Available",
    description: "Download our app is available on App Store for Both platform Android and iOS Our Specialist unknown printer took a galley of type and scrambled it to make.",
    appStore: { label: "App Store", href: "#" },
    googlePlay: { label: "Google Play", href: "#" },
  },

  appMockup: {
    heading: "Delicious Food",
    items: [
      { id: 1, name: "Crab Ramen", price: "$ 14.00", image: "🦀" },
      { id: 2, name: "Chicken Slice", price: "$ 12.00", image: "🍗" },
      { id: 3, name: "Eggs Curry", price: "$ 16.00", image: "🥚" },
    ],
  },

  mainDish: {
    alt: "Plat principal — bowl garni",
    // Remplace par une vraie image : src: "/images/main-dish.png"
  },

  sideDish: {
    alt: "Plat secondaire — salade",
    // src: "/images/side-dish.png"
  },
};
