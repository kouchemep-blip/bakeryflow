export default function Hearder () {
    return (
        <header className="flex items-center justify-between border-b px-6 py-4">
        <div>
            <h1 className="text-2xl font-bold">Bonjour</h1>
            <p className="text-sm text-gray-500">Bienvenue sur votre tableau de bord.</p>

        </div>
        <div className="flex items-center gap-4">
            <button>🔔</button>
            <button>👤</button>
        </div>
        </header>
    )
}