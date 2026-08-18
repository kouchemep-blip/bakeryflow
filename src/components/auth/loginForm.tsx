// Formulaire de connexion — panneau gauche (visible par défaut)
import type { FieldState } from "@/hooks/useAuthForm";
import { SocialButtons } from "./socialButtons";
import { DiscoverButton } from "../ui/DiscoverBtn";
import { FiLogIn } from "react-icons/fi";

type Props = {
  rightPanelActive: boolean;
  loginEmail: FieldState;
  loginPassword: FieldState;
  loginServerError: string;
  isLoggingIn: boolean;
  onEmailChange: (v: string) => void;
  onPasswordChange: (v: string) => void;
  onSubmit: (e: React.FormEvent) => void;
};

export function LoginForm({
  rightPanelActive,
  loginEmail,
  loginPassword,
  loginServerError,
  isLoggingIn,
  onEmailChange,
  onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <div
      className={`absolute left-0 top-0 z-[2] h-full w-full sm:w-1/2 transition-all duration-[600ms] ease-in-out ${
        rightPanelActive ? "translate-x-full" : "translate-x-0"
      }`}
    >
      <form
        onSubmit={onSubmit}
        className="relative flex h-full flex-col items-center justify-center overflow-y-auto bg-white px-5 pb-5 pt-[205px] text-center sm:px-14 sm:pb-0 sm:pt-8"
      >
        <div className="mb-6 flex flex-col items-center gap-1">
          
          <h1 className="text-2xl font-bold tracking-tight text-[#1e292b]">
            Bon retour
          </h1>
          <p className="text-sm text-gray-400">
            Connecte-toi pour accéder à ton espace
          </p>
        </div>

        {/* ── Email ── */}
        <div className="relative w-full mb-5">
          <label className="mb-1.5 block text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Adresse email
          </label>
          <div className="relative">
            <input
              type="email"
              placeholder="nom@exemple.com"
              value={loginEmail.value}
              onChange={(e) => onEmailChange(e.target.value)}
              className={`
                w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#1e292b]
                outline-none placeholder:text-gray-300
                transition-all duration-300
                focus:bg-white focus:shadow-[0_0_0_3px_rgba(210,249,157,0.4)]
                ${
                  loginEmail.error
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-[#1e292b]"
                }
              `}
            />
          </div>
          {loginEmail.error && (
            <small className="mt-1 block text-left text-xs text-red-500">
              {loginEmail.error}
            </small>
          )}
        </div>

        {/* ── Mot de passe ── */}
        <div className="relative w-full mb-2">
          <label className="mb-1.5 block text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
            Mot de passe
          </label>
          <div className="relative">
            <input
              type="password"
              placeholder="••••••••"
              value={loginPassword.value}
              onChange={(e) => onPasswordChange(e.target.value)}
              className={`
                w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#1e292b]
                outline-none placeholder:text-gray-300
                transition-all duration-300
                focus:bg-white focus:shadow-[0_0_0_3px_rgba(210,249,157,0.4)]
                ${
                  loginPassword.error
                    ? "border-red-400 focus:border-red-400"
                    : "border-gray-200 focus:border-[#1e292b]"
                }
              `}
            />
          </div>
          {loginPassword.error && (
            <small className="mt-1 block text-left text-xs text-red-500">
              {loginPassword.error}
            </small>
          )}
        </div>

        {/* ── Se souvenir + mot de passe oublié ── */}
        <div className="flex w-full items-center justify-between mb-20">
          <label className="flex cursor-pointer items-center gap-2 select-none">
            <div className="relative">
              <input type="checkbox" id="checkbox" className="peer sr-only" />
              <div className="h-4 w-4 rounded border-2 border-gray-300 bg-white peer-checked:border-[#1e292b] peer-checked:bg-[#1e292b] transition-all duration-200" />
              <svg
                className="pointer-events-none absolute inset-0 m-auto hidden h-2.5 w-2.5 text-white peer-checked:block"
                fill="none"
                viewBox="0 0 12 10"
              >
                <path
                  d="M1 5l3.5 3.5L11 1"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <span className="text-xs text-gray-500">Se souvenir de moi</span>
          </label>
          <a
            href="#"
            className="text-xs font-medium text-gray-400 transition-colors duration-200 hover:text-[#1e292b]"
          >
            Mot de passe oublié ?
          </a>
        </div>

        {/* ── Erreur serveur ── */}
        {loginServerError && (
          <div className="-mt-4 w-full rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-left">
            <p className="text-xs text-red-600">{loginServerError}</p>
          </div>
        )}

        {/* ── Bouton submit ── */}
        <div className="mb-3 flex w-full justify-center sm:-mt-10">
          <DiscoverButton
            label={isLoggingIn ? "CONNEXION..." : "SE CONNECTER"}
            icon={FiLogIn}
            type="submit"
            disabled={isLoggingIn}
          />
        </div>

        {/* ── Séparateur ── */}
        <div className="flex w-full items-center gap-3 mb-3">
          <div className="h-px flex-1 bg-gray-100" />
          <span className="text-xs text-gray-400">ou continue avec</span>
          <div className="h-px flex-1 bg-gray-100" />
        </div>

        {/* ── Boutons sociaux ── */}
        <SocialButtons />
      </form>
    </div>
  );
}
