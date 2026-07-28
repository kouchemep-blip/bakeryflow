export default function Hearder () {
    return (
        <header className="flex items-center justify-between gap-3 border-b px-4 py-4 sm:px-6">
        <div>
            <h1 className="text-xl font-bold sm:text-2xl">Bonjour</h1>
            <p className="text-xs text-gray-500 sm:text-sm">Bienvenue sur votre tableau de bord.</p>

        </div>
        <div className="flex items-center gap-4">
            <button>🔔</button>
            <button>👤</button>
        </div>
        </header>
    )
}
