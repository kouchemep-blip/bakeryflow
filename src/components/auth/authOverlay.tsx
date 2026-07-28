// Panneau overlay central (fond photo + boutons bascule connexion/inscription)
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";

type Props = {
  rightPanelActive: boolean;
  onShowLogin:    () => void;
  onShowRegister: () => void;
};

export function AuthOverlay({ rightPanelActive, onShowLogin, onShowRegister }: Props) {
  return (
    <div
      className={`absolute left-0 top-0 z-[100] h-[190px] w-full overflow-hidden transition-transform duration-[600ms] ease-in-out sm:left-1/2 sm:h-full sm:w-1/2 ${
        rightPanelActive ? "translate-x-0 sm:-translate-x-full" : "translate-x-0"
      }`}
    >
      {/* Fond photo pleine largeur (200%) + dégradé overlay */}
      <div
        className={`relative -left-full h-full w-[200%] bg-cover bg-[position:0_0] bg-no-repeat text-white transition-transform duration-[600ms] ease-in-out before:absolute before:inset-0 before:bg-gradient-to-t before:from-[rgba(46,94,109,0.4)] before:to-transparent before:content-[''] ${
          rightPanelActive ? "translate-x-1/2" : "translate-x-0"
        }`}
        style={{
          backgroundImage:
            "url('/images/bg.jpg')",
        }}
      >
        {/* ── Panneau gauche overlay (déjà inscrit → connexion) ── */}
        <div
          className={`absolute top-0 flex h-full w-1/2 flex-col items-center justify-center px-5 text-center transition-transform duration-[600ms] ease-in-out sm:px-10 ${
            rightPanelActive ? "translate-x-0" : "-translate-x-[20%]"
          }`}
        >
          <h1 className="text-2xl font-bold leading-tight sm:text-[45px] sm:leading-[45px] sm:tracking-[-1.5px] [text-shadow:0_0_10px_rgba(16,64,74,0.5)]">
            Salut <br /> les amis
          </h1>
          <p className="my-2 text-xs leading-4 sm:my-5 sm:text-sm sm:leading-5 sm:tracking-wide [text-shadow:0_0_10px_rgba(16,64,74,0.5)]">
            Si tu as déjà un compte, connecte-toi ici et régale-toi
          </p>
          <button
            type="button"
            onClick={onShowLogin}
            className="relative flex cursor-pointer items-center gap-2 rounded-[20px] border-2 border-white bg-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-in-out hover:tracking-[1.9px] active:scale-95 sm:gap-3 sm:px-18 sm:py-3 sm:text-sm"
          >
            <FaArrowLeft />
            Se connecter
          </button>
        </div>

        {/* ── Panneau droit overlay (pas encore inscrit → inscription) ── */}
        <div
          className={`absolute right-0 top-0 flex h-full w-1/2 flex-col items-center justify-center px-5 text-center transition-transform duration-[600ms] ease-in-out sm:px-10 ${
            rightPanelActive ? "translate-x-[20%]" : "translate-x-0"
          }`}
        >
          <h1 className="text-2xl font-bold leading-tight sm:text-[45px] sm:leading-[45px] sm:tracking-[-1.5px] [text-shadow:0_0_10px_rgba(16,64,74,0.5)]">
            Commence ton <br /> aventure maintenant
          </h1>
          <p className="my-2 text-xs leading-4 sm:my-5 sm:text-sm sm:leading-5 sm:tracking-wide [text-shadow:0_0_10px_rgba(16,64,74,0.5)]">
            Si tu n&apos;as pas encore de compte, rejoins-nous et commence ton aventure
          </p>
          <button
            type="button"
            onClick={onShowRegister}
            className="relative flex cursor-pointer items-center gap-2 rounded-[20px] border-2 border-white bg-white/20 px-5 py-2 text-xs font-bold uppercase tracking-wider transition-all duration-300 ease-in-out hover:tracking-[1.9px] active:scale-95 sm:gap-3 sm:px-18 sm:py-3 sm:text-sm"
          >
            S&apos;inscrire
            <FaArrowRight />
          </button>
        </div>
      </div>
    </div>
  );
}
