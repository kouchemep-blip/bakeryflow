// Boutons sociaux réutilisés dans les deux formulaires
import { FaFacebookF, FaGoogle, FaTiktok } from "react-icons/fa";

export function SocialButtons() {
  return (
    <div className="flex">
      <button type="button" disabled aria-label="Connexion Facebook bientôt disponible" className="mx-[5px] flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-[#ddd] opacity-50">
        <FaFacebookF size={13} />
      </button>
      <a href="/api/auth/google" aria-label="Continuer avec Google" className="mx-[5px] flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd] transition-colors duration-300 hover:border-[#4bb6b7]">
        <FaGoogle size={13} />
      </a>
      <button type="button" disabled aria-label="Connexion TikTok bientôt disponible" className="mx-[5px] flex h-10 w-10 cursor-not-allowed items-center justify-center rounded-full border border-[#ddd] opacity-50">
        <FaTiktok size={13} />
      </button>
    </div>
  );
}
