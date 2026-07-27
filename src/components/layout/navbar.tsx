// import { ChevronDown, Linkedin, Instagram, Search } from "lucide-react";
const NAV_LINK = ["Services", "Sites", "About", "Contact", "Ressource"];

export function Navbar() {
  return (
    <div className="fixed inset-0 z-50 flex h-[23vh] items-center border-t-4 border-t-white">
      <div className="relative left-8 h-full w-[26vw] shrink-0 text-white">
        <svg
          xmlns="http://w3.org"
          viewBox="0 0 450 420"
          className="h-full w-full"
          preserveAspectRatio="none"
        >
          <path
            d="M 0,0 
               L 450,0 
               Q 370,0 370,80 
               L 370,190 
               Q 370,270 290,270
               L 180,270 
               Q 40,270 0,420 
               Z"
            fill="currentColor"
          />
        </svg>
      </div>
      <div className="bg-white/10 backdrop-blur-xl backdrop-saturate-150 border-b border-white/15 shadow-[0_4px_30px_rgba(0,0,0,0.1)] w-[60%] h-[10vh] absolute left-[25%] top-4 rounded-full flex items-center justify-center">
        <ul className="flex flex-row gap-20 w-full items-center justify-center">
          {NAV_LINK.map((link) => (
            <li key={link.length} className="text-ls">
              {link}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
