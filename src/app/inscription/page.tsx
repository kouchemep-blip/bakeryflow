import AuthForm from "@/components/auth/authForms";

export default function Authentification() {
  return (
    // pt-32 (ou pt-[25vh]) crée la zone de sécurité sous votre Navbar fixe
    <div className="min-h-screen w-screen flex items-center justify-start">
      <div className="w-full z-0 px-4">
        <AuthForm />
      </div>
    </div>
  );
}
