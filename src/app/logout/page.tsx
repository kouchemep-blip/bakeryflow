"use client"
export default function Deconnexion () {
    async function logout () {
        await fetch ("/api/auth/logout", {
            method : "POST"
        });
        window.location.href="/";
    }
    return (
        <button onClick={logout} className="mt-2.5 ml-3 p-2 bg-blue-500 text-4xl">Se déconnecter</button>
    )
}