// Formulaire d'inscription — panneau gauche (visible quand rightPanelActive = true)
import type { FieldState } from "@/hooks/useAuthForm";
import { SocialButtons } from "./socialButtons";
import { DiscoverButton } from "../ui/DiscoverBtn";
import { MdAppRegistration } from "react-icons/md";

type Props = {
  rightPanelActive: boolean;
  regFirstName: FieldState;
  regLastName: FieldState;
  regEmail: FieldState;
  regPhone: FieldState;
  regPassword: FieldState;
  registerServerError: string;
  registerSuccess: string;
  isRegistering: boolean;
  onFirstNameChange: (v: string) => void;
  onLastNameChange:  (v: string) => void;
  onEmailChange:     (v: string) => void;
  onPhoneChange:     (v: string) => void;
  onPasswordChange:  (v: string) => void;
  onSubmit:          (e: React.FormEvent) => void;
};

// ─── Champ générique stylisé ──────────────────────────────────────────────────
function Field({
  type = "text",
  label,
  placeholder,
  value,
  error,
  onChange,
  className = "",
}: {
  type?: string;
  label: string;
  placeholder: string;
  value: string;
  error: string;
  onChange: (v: string) => void;
  className?: string;
}) {
  return (
    <div className={`w-full ${className}`}>
      <label className="mb-1.5 block text-left text-xs font-semibold tracking-wide text-gray-500 uppercase">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={`
          w-full rounded-xl border bg-gray-50 px-4 py-3 text-sm text-[#1e292b]
          outline-none placeholder:text-gray-300
          transition-all duration-300
          focus:bg-white focus:shadow-[0_0_0_3px_rgba(210,249,157,0.4)]
          ${error
            ? "border-red-400 focus:border-red-400"
            : "border-gray-200 focus:border-[#1e292b]"
          }
        `}
      />
      {error && (
        <small className="mt-1 block text-left text-xs text-red-500">
          {error}
        </small>
      )}
    </div>
  );
}

export function RegisterForm({
  rightPanelActive,
  regFirstName, regLastName, regEmail, regPhone, regPassword,
  registerServerError, registerSuccess, isRegistering,
  onFirstNameChange, onLastNameChange, onEmailChange, onPhoneChange, onPasswordChange,
  onSubmit,
}: Props) {
  return (
    <div
      className={`absolute left-0 top-0 h-full w-full sm:w-1/2 transition-all duration-[600ms] ease-in-out ${
        rightPanelActive
          ? "z-[5] translate-x-0 opacity-100 animate-show sm:translate-x-full"
          : "z-[1] translate-x-0 opacity-0"
      }`}
    >
      <form
        onSubmit={onSubmit}
        className="relative flex h-full flex-col items-center justify-center overflow-y-auto overflow-x-hidden bg-white px-5 pb-5 pt-[205px] text-center [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-[#C3B9B1] [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar]:w-[4px] sm:px-14 sm:pb-0 sm:pt-8"
      >
        <div className="mb-3 flex flex-col items-center gap-1">
         
          <h1 className="text-2xl font-bold tracking-tight text-[#1e292b]">
            Crée ton compte
          </h1>
          <p className="text-sm text-gray-400">
            Rejoins-nous en quelques secondes
          </p>
        </div>

        {/* ── Prénom + Nom (côte à côte) ── */}
        <div className="flex w-full flex-col gap-3 sm:flex-row">
          <Field
            label="Prénom"
            placeholder="Jean"
            value={regFirstName.value}
            error={regFirstName.error}
            onChange={onFirstNameChange}
            className="flex-1"
          />
          <Field
            label="Nom"
            placeholder="Dupont"
            value={regLastName.value}
            error={regLastName.error}
            onChange={onLastNameChange}
            className="flex-1"
          />
        </div>

        {/* ── Email ── */}
        <Field
          type="email"
          label="Adresse email"
          placeholder="nom@exemple.com"
          value={regEmail.value}
          error={regEmail.error}
          onChange={onEmailChange}
          className="mb-4"
        />

        {/* ── Téléphone ── */}
        <Field
          type="tel"
          label="Téléphone"
          placeholder="+33 6 00 00 00 00"
          value={regPhone.value}
          error={regPhone.error}
          onChange={onPhoneChange}
          className="mb-4"
        />

        {/* ── Mot de passe ── */}
        <Field
          type="password"
          label="Mot de passe"
          placeholder="••••••••"
          value={regPassword.value}
          error={regPassword.error}
          onChange={onPasswordChange}
          className=""
        />

        {/* ── Bouton submit ── */}
        <div className="mb-4 flex w-full flex-col items-center justify-center">
          {registerServerError && (
            <p className="mb-2 w-full text-left text-xs text-red-600">{registerServerError}</p>
          )}
          {registerSuccess && (
            <p className="mb-2 w-full text-left text-xs text-green-600">{registerSuccess}</p>
          )}
          <DiscoverButton
            label={isRegistering ? "INSCRIPTION..." : "S'INSCRIRE"}
            icon={MdAppRegistration}
            type="submit"
            disabled={isRegistering}
          />
        </div>

        {/* ── Séparateur ── */}
        <div className="flex w-full items-center ">
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
