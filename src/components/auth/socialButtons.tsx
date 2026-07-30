// Boutons sociaux réutilisés dans les deux formulaires
import { FaFacebookF, FaGoogle, FaTiktok } from "react-icons/fa";

export function SocialButtons() {
  return (
    <div className="flex">
      {[FaFacebookF, FaGoogle, FaTiktok].map((Icon, i) => (
        <a
          key={i}
          href="#"
          className="mx-[5px] flex h-10 w-10 items-center justify-center rounded-full border border-[#ddd] transition-colors duration-300 hover:border-[#4bb6b7]"
        >
          <Icon size={13} />
        </a>
      ))}
    </div>
  );
}