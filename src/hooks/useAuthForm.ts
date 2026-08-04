"use client";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────
export type FieldState = {
  value: string;
  error: string;
};

// ─── Validateurs ──────────────────────────────────────────────────────────────
const checkEmail = (v: string) =>
  /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v);
const checkPhone = (v: string) => /^[0-9+\s().-]{6,20}$/.test(v);

// ─── Hook principal — toute la logique métier du formulaire ───────────────────
export function useAuthForm() {

  // ── État du panneau actif (connexion / inscription) ──────────────────────
  const [rightPanelActive, setRightPanelActive] = useState(false);

  // ── Champs inscription ───────────────────────────────────────────────────
  const [regFirstName, setRegFirstName] = useState<FieldState>({ value: "", error: "" });
  const [regLastName,  setRegLastName]  = useState<FieldState>({ value: "", error: "" });
  const [regEmail,     setRegEmail]     = useState<FieldState>({ value: "", error: "" });
  const [regPhone,     setRegPhone]     = useState<FieldState>({ value: "", error: "" });
  const [regPassword,  setRegPassword]  = useState<FieldState>({ value: "", error: "" });
  const [registerServerError, setRegisterServerError] = useState("");
  const [registerSuccess, setRegisterSuccess] = useState("");
  const [isRegistering, setIsRegistering] = useState(false);

  // ── Handlers inscription ─────────────────────────────────────────────────
  const handleFirstNameChange = (v: string) => {
    let error = "";
    if (v.length > 0 && v.length < 2)  error = "*Le prénom doit contenir au moins 2 caractères.";
    else if (v.length > 30)             error = "*Le prénom doit contenir moins de 30 caractères.";
    setRegFirstName({ value: v, error });
  };

  const handleLastNameChange = (v: string) => {
    let error = "";
    if (v.length > 0 && v.length < 2)  error = "*Le nom doit contenir au moins 2 caractères.";
    else if (v.length > 30)             error = "*Le nom doit contenir moins de 30 caractères.";
    setRegLastName({ value: v, error });
  };

  const handleRegEmailChange = (v: string) => {
    const error = v.length > 0 && !checkEmail(v) ? "*L'email n'est pas valide" : "";
    setRegEmail({ value: v, error });
  };

  const handlePhoneChange = (v: string) => {
    const error = v.length > 0 && !checkPhone(v) ? "*Le numéro de téléphone n'est pas valide" : "";
    setRegPhone({ value: v, error });
  };

  const handleRegPasswordChange = (v: string) => {
    let error = "";
    if (v.length > 0 && v.length < 8)  error = "*Le mot de passe doit contenir au moins 8 caractères.";
    else if (v.length > 20)             error = "*Le mot de passe doit contenir moins de 20 caractères.";
    setRegPassword({ value: v, error });
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterServerError("");
    setRegisterSuccess("");
    const fields: [FieldState, (f: FieldState) => void, string][] = [
      [regFirstName, setRegFirstName, "Prénom"],
      [regLastName,  setRegLastName,  "Nom"],
      [regEmail,     setRegEmail,     "Email"],
      [regPhone,     setRegPhone,     "Numéro de téléphone"],
      [regPassword,  setRegPassword,  "Mot de passe"],
    ];
    let hasRequiredError = false;
    fields.forEach(([field, setField, label]) => {
      if (field.value.trim() === "") {
        hasRequiredError = true;
        setField({ ...field, error: `*${label} est requis` });
      }
    });
    if (hasRequiredError || fields.some(([field]) => field.error)) return;

    try {
      setIsRegistering(true);
      const response = await fetch("/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: regFirstName.value,
          lastName:  regLastName.value,
          email:     regEmail.value,
          phone:     regPhone.value,
          password:  regPassword.value,
        }),
      });
      const data = await response.json().catch(() => null);
      if (!response.ok) {
        setRegisterServerError(data?.message || "*Impossible de créer le compte. Réessaie plus tard.");
        return;
      }
      setRegisterSuccess("Compte créé. Tu peux maintenant te connecter.");
      setRightPanelActive(false);
    } catch {
      setRegisterServerError("*Impossible de joindre le serveur. Réessaie plus tard.");
    } finally {
      setIsRegistering(false);
    }
  };

  // ── Champs connexion ─────────────────────────────────────────────────────
  const [loginEmail,       setLoginEmail]       = useState<FieldState>({ value: "", error: "" });
  const [loginPassword,    setLoginPassword]    = useState<FieldState>({ value: "", error: "" });
  const [loginServerError, setLoginServerError] = useState("");
  const [isLoggingIn,      setIsLoggingIn]      = useState(false);

  // ── Handlers connexion ───────────────────────────────────────────────────
  const handleLoginEmailChange = (v: string) => {
    const error = v.length > 0 && !checkEmail(v) ? "*L'email n'est pas valide" : "";
    setLoginEmail({ value: v, error });
  };

  const handleLoginPasswordChange = (v: string) => {
    let error = "";
    if (v.length > 0 && v.length < 8)  error = "*Le mot de passe doit contenir au moins 8 caractères.";
    else if (v.length > 20)             error = "*Le mot de passe doit contenir moins de 20 caractères.";
    setLoginPassword({ value: v, error });
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginServerError("");
    let hasRequiredError = false;
    if (loginEmail.value.trim() === "") {
      hasRequiredError = true;
      setLoginEmail({ ...loginEmail, error: "*Veuillez renseigner ce champ" });
    }
    if (loginPassword.value.trim() === "") {
      hasRequiredError = true;
      setLoginPassword({ ...loginPassword, error: "*Veuillez renseigner ce champ" });
    }
    if (hasRequiredError) return;
    try {
      setIsLoggingIn(true);
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ email: loginEmail.value, password: loginPassword.value }),
      });
      if (!response.ok) {
        const data = await response.json().catch(() => null);
        setLoginServerError(data?.message || "*Email ou mot de passe incorrect");
        return;
      }
      const data = await response.json();
      window.location.href = data.user.role === "CLIENT" ? "/customers" : "/dashboard";
    } catch {
      setLoginServerError("*Impossible de se connecter au serveur, réessaie plus tard");
    } finally {
      setIsLoggingIn(false);
    }
  };

  return {
    // Panneau
    rightPanelActive, setRightPanelActive,
    // Inscription
    regFirstName, regLastName, regEmail, regPhone, regPassword,
    registerServerError, registerSuccess, isRegistering,
    handleFirstNameChange, handleLastNameChange, handleRegEmailChange,
    handlePhoneChange, handleRegPasswordChange, handleRegisterSubmit,
    // Connexion
    loginEmail, loginPassword, loginServerError, isLoggingIn,
    handleLoginEmailChange, handleLoginPasswordChange, handleLoginSubmit,
  };
}
