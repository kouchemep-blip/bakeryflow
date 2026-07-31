"use client";
// Modale auth légère — s'affiche quand l'utilisateur tente de valider
// le panier sans être connecté. Le panier reste intact pendant tout le flow.

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Loader2, Eye, EyeOff } from "lucide-react";
import { useCurrentUser } from "@/features/auth/hooks/useCurrentUser";

type AuthGateProps = {
  // Appelé après connexion réussie — CartDrawer reprend le flow commande
  onAuthSuccess: () => void;
  onClose: () => void;
};

type AuthMode = "login" | "register";

export function AuthGate({ onAuthSuccess, onClose }: AuthGateProps) {
  const [mode, setMode] = useState<AuthMode>("login");

  return (
    <AnimatePresence>
      {/* Overlay */}
      <motion.div
        key="auth-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
        aria-hidden="true"
        className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm"
      />

      {/* Modale */}
      <motion.div
        key="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={mode === "login" ? "Connexion" : "Création de compte"}
        initial={{ opacity: 0, scale: 0.95, y: 16 }}
        animate={{ opacity: 1, scale: 1,    y: 0  }}
        exit={{ opacity: 0, scale: 0.95, y: 16    }}
        transition={{ type: "spring", stiffness: 380, damping: 32 }}
        className={[
          "fixed z-[70] bg-white rounded-2xl shadow-2xl",
          "w-full max-w-sm mx-auto",
          // Centré verticalement desktop, ancré en bas mobile
          "top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2",
          "max-sm:top-auto max-sm:bottom-0 max-sm:left-0 max-sm:translate-x-0 max-sm:translate-y-0",
          "max-sm:rounded-b-none max-sm:rounded-t-3xl max-sm:max-w-full",
        ].join(" ")}
      >
        {/* ── Header ──────────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-gray-100">
          <div>
            <h2 className="text-base font-bold text-gray-900">
              {mode === "login" ? "Connecte-toi" : "Crée ton compte"}
            </h2>
            <p className="text-xs text-gray-400 mt-0.5">
              {mode === "login"
                ? "Pour valider ta commande, connecte-toi d'abord."
                : "Rejoins-nous pour passer ta commande."}
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Fermer"
            className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* ── Formulaire selon le mode ────────────────────────────────────── */}
        <div className="px-6 py-5">
          <AnimatePresence mode="wait" initial={false}>
            {mode === "login" ? (
              <motion.div
                key="login"
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0   }}
                exit={{ opacity: 0, x: 16      }}
                transition={{ duration: 0.25 }}
              >
                <LoginInline
                  onSuccess={() => {
                    onAuthSuccess();
                    onClose();
                  }}
                />
              </motion.div>
            ) : (
              <motion.div
                key="register"
                initial={{ opacity: 0, x: 16  }}
                animate={{ opacity: 1, x: 0   }}
                exit={{ opacity: 0, x: -16    }}
                transition={{ duration: 0.25 }}
              >
                <RegisterInline
                  onSuccess={() => setMode("login")}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Toggle login / register */}
          <p className="text-center text-xs text-gray-400 mt-5">
            {mode === "login" ? (
              <>
                Pas encore de compte ?{" "}
                <button
                  onClick={() => setMode("register")}
                  className="text-amber-500 font-semibold hover:underline"
                >
                  S&apos;inscrire
                </button>
              </>
            ) : (
              <>
                Déjà un compte ?{" "}
                <button
                  onClick={() => setMode("login")}
                  className="text-amber-500 font-semibold hover:underline"
                >
                  Se connecter
                </button>
              </>
            )}
          </p>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

// ─── Formulaire connexion inline ──────────────────────────────────────────────

type LoginInlineProps = {
  onSuccess: () => void;
};

function LoginInline({ onSuccess }: LoginInlineProps) {
  const { refetch } = useCurrentUser();

  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd]   = useState(false);
  const [error, setError]       = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Tous les champs sont requis.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Email ou mot de passe incorrect.");
        return;
      }

      // Cookie posé par l'API — recheck session puis callback
      await refetch();
      onSuccess();
    } catch {
      setError("Impossible de se connecter. Réessaie plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gate-email" className="text-xs font-medium text-gray-600">
          Email
        </label>
        <input
          id="gate-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          autoComplete="email"
          className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent"
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gate-password" className="text-xs font-medium text-gray-600">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="gate-password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            autoComplete="current-password"
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent pr-8"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Masquer" : "Afficher"}
            className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
          >
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isLoading}
        className={[
          "w-full py-3 rounded-full text-sm font-semibold",
          "bg-gray-900 text-white",
          "hover:bg-amber-500 transition-colors duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
        ].join(" ")}
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        {isLoading ? "Connexion..." : "Se connecter"}
      </motion.button>
    </form>
  );
}

// ─── Formulaire inscription inline ────────────────────────────────────────────

type RegisterInlineProps = {
  // Après inscription réussie → bascule sur login
  onSuccess: () => void;
};

function RegisterInline({ onSuccess }: RegisterInlineProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName,  setLastName]  = useState("");
  const [email,     setEmail]     = useState("");
  const [phone,     setPhone]     = useState("");
  const [password,  setPassword]  = useState("");
  const [showPwd,   setShowPwd]   = useState(false);
  const [error,     setError]     = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!firstName || !lastName || !email || !phone || !password) {
      setError("Tous les champs sont requis.");
      return;
    }
    if (password.length < 8) {
      setError("Mot de passe : 8 caractères minimum.");
      return;
    }

    try {
      setIsLoading(true);
      const res = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, phone, password }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        setError(data?.message || "Erreur lors de la création du compte.");
        return;
      }

      // Inscription réussie → bascule sur connexion
      onSuccess();
    } catch {
      setError("Impossible de créer le compte. Réessaie plus tard.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-3">
      {/* Prénom + Nom */}
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label htmlFor="gate-firstname" className="text-xs font-medium text-gray-600">
            Prénom
          </label>
          <input
            id="gate-firstname"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="Marie"
            className="border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="gate-lastname" className="text-xs font-medium text-gray-600">
            Nom
          </label>
          <input
            id="gate-lastname"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Dupont"
            className="border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent"
          />
        </div>
      </div>

      {/* Email */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gate-reg-email" className="text-xs font-medium text-gray-600">
          Email
        </label>
        <input
          id="gate-reg-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ton@email.com"
          autoComplete="email"
          className="border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent"
        />
      </div>

      {/* Téléphone */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gate-phone" className="text-xs font-medium text-gray-600">
          Téléphone
        </label>
        <input
          id="gate-phone"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+229 00 00 00 00"
          className="border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent"
        />
      </div>

      {/* Mot de passe */}
      <div className="flex flex-col gap-1">
        <label htmlFor="gate-reg-password" className="text-xs font-medium text-gray-600">
          Mot de passe
        </label>
        <div className="relative">
          <input
            id="gate-reg-password"
            type={showPwd ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="8 caractères minimum"
            autoComplete="new-password"
            className="w-full border-b border-gray-200 py-2 text-sm outline-none focus:border-amber-400 transition-colors bg-transparent pr-8"
          />
          <button
            type="button"
            onClick={() => setShowPwd((v) => !v)}
            aria-label={showPwd ? "Masquer" : "Afficher"}
            className="absolute right-0 top-2 text-gray-400 hover:text-gray-600"
          >
            {showPwd ? <EyeOff size={15} /> : <Eye size={15} />}
          </button>
        </div>
      </div>

      {/* Erreur */}
      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}

      {/* Submit */}
      <motion.button
        whileTap={{ scale: 0.97 }}
        type="submit"
        disabled={isLoading}
        className={[
          "w-full py-3 rounded-full text-sm font-semibold mt-1",
          "bg-gray-900 text-white",
          "hover:bg-amber-500 transition-colors duration-200",
          "disabled:opacity-60 disabled:cursor-not-allowed",
          "flex items-center justify-center gap-2",
        ].join(" ")}
      >
        {isLoading && <Loader2 size={14} className="animate-spin" />}
        {isLoading ? "Création..." : "Créer mon compte"}
      </motion.button>
    </form>
  );
}