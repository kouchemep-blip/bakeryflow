import AuthForm from "@/components/auth/authForms";
import { Navbar } from "@/components/layout/navbar";

export default function Authentification() {
  return (
    // pt-32 (ou pt-[25vh]) crée la zone de sécurité sous votre Navbar fixe
    <div className="min-h-screen w-screen flex flex-col pt-32 items-center justify-start bg-gray-50">
      <Navbar />
      
      {/* Conteneur pour centrer et espacer le formulaire */}
      <div className="mt-12 w-full z-0 px-4">
        <AuthForm />
      </div>
    </div>
  );
}
