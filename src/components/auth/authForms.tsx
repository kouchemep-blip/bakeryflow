"use client";
// Composant racine — orchestre les 3 panneaux + injecte le hook
// Ne contient plus aucune logique métier ni JSX de formulaire

import { useAuthForm } from "@/hooks/useAuthForm";
import { RegisterForm } from "./registerForm";
import { LoginForm }    from "./loginForm";
import { AuthOverlay }  from "./authOverlay";

export default function AuthForm() {
  const auth = useAuthForm();

  return (
    <div className="flex min-h-[100dvh] items-center justify-center bg-white p-0 sm:p-6">
      {/* Keyframe @keyframes show — requis pour l'animation du panneau inscription */}
      <style jsx>{`
        @keyframes show {
          0%,  49.99% { opacity: 0; z-index: 1; }
          50%, 100%   { opacity: 1; z-index: 5; }
        }
        .animate-show { animation: show 0.6s; }
      `}</style>

      <div className="relative h-[100dvh] min-h-[620px] w-full overflow-hidden bg-white sm:h-[620px] sm:max-w-[768px] sm:rounded-[25px] sm:shadow-[0_14px_28px_rgba(0,0,0,0.25),0_0_10px_rgba(0,0,0,0.22)]">

        {/* Panneau inscription */}
        <RegisterForm
          rightPanelActive={auth.rightPanelActive}
          regFirstName={auth.regFirstName}
          regLastName={auth.regLastName}
          regEmail={auth.regEmail}
          regPhone={auth.regPhone}
          regPassword={auth.regPassword}
          registerServerError={auth.registerServerError}
          registerSuccess={auth.registerSuccess}
          isRegistering={auth.isRegistering}
          onFirstNameChange={auth.handleFirstNameChange}
          onLastNameChange={auth.handleLastNameChange}
          onEmailChange={auth.handleRegEmailChange}
          onPhoneChange={auth.handlePhoneChange}
          onPasswordChange={auth.handleRegPasswordChange}
          onSubmit={auth.handleRegisterSubmit}
        />

        {/* Panneau connexion */}
        <LoginForm
          rightPanelActive={auth.rightPanelActive}
          loginEmail={auth.loginEmail}
          loginPassword={auth.loginPassword}
          loginServerError={auth.loginServerError}
          isLoggingIn={auth.isLoggingIn}
          onEmailChange={auth.handleLoginEmailChange}
          onPasswordChange={auth.handleLoginPasswordChange}
          onSubmit={auth.handleLoginSubmit}
        />

        {/* Overlay central (photo + boutons bascule) */}
        <AuthOverlay
          rightPanelActive={auth.rightPanelActive}
          onShowLogin={() => auth.setRightPanelActive(false)}
          onShowRegister={() => auth.setRightPanelActive(true)}
        />

      </div>
    </div>
  );
}
