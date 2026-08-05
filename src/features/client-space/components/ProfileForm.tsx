"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { Loader2, Upload } from "lucide-react";

type Profile = { firstName: string; lastName: string; email: string; phone: string; avatar: string | null };

export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ ...profile, password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;
    setUploading(true); setMessage(null);
    const body = new FormData(); body.append("image", file);
    try {
      const response = await fetch("/api/customer/avatar", { method: "POST", body });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm((current) => ({ ...current, avatar: data.url }));
    } catch (error) { setMessage(error instanceof Error ? error.message : "L'avatar n'a pas pu être envoyé."); }
    finally { setUploading(false); }
  }

  async function submit(event: FormEvent) {
    event.preventDefault(); setSaving(true); setMessage(null);
    try {
      const response = await fetch("/api/customer/profile", { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm((current) => ({ ...current, ...data, password: "" }));
      setMessage("Profil enregistré.");
    } catch (error) { setMessage(error instanceof Error ? error.message : "La mise à jour a échoué."); }
    finally { setSaving(false); }
  }

  const change = (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: event.target.value });
  return <form onSubmit={submit} className="space-y-6 rounded-2xl border bg-white p-6 shadow-sm">
    <div className="flex items-center gap-5"><div className="relative flex h-20 w-20 items-center justify-center overflow-hidden rounded-full bg-orange-100 text-2xl font-bold text-orange-600">{form.avatar ? <Image src={form.avatar} alt="Avatar" fill sizes="80px" className="object-cover" /> : `${form.firstName[0] ?? ""}${form.lastName[0] ?? ""}`}</div><label className="inline-flex cursor-pointer items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium hover:bg-gray-50"><Upload size={16} /> {uploading ? "Envoi…" : "Ajouter un avatar"}<input className="sr-only" type="file" accept="image/*" onChange={uploadAvatar} disabled={uploading} /></label></div>
    <div className="grid gap-5 md:grid-cols-2"><label className="space-y-1 text-sm font-medium">Prénom<input value={form.firstName} onChange={change("firstName")} required className="w-full rounded-lg border p-3 font-normal" /></label><label className="space-y-1 text-sm font-medium">Nom<input value={form.lastName} onChange={change("lastName")} required className="w-full rounded-lg border p-3 font-normal" /></label><label className="space-y-1 text-sm font-medium">Téléphone<input value={form.phone} onChange={change("phone")} required className="w-full rounded-lg border p-3 font-normal" /></label><label className="space-y-1 text-sm font-medium">Email<input value={form.email} disabled className="w-full rounded-lg border bg-gray-50 p-3 font-normal text-gray-500" /></label></div>
    <label className="block max-w-md space-y-1 text-sm font-medium">Nouveau mot de passe <span className="font-normal text-gray-400">(facultatif, 8 caractères minimum)</span><input value={form.password} onChange={change("password")} type="password" minLength={8} className="w-full rounded-lg border p-3 font-normal" /></label>
    {message && <p className={message === "Profil enregistré." ? "text-sm text-green-600" : "text-sm text-red-600"}>{message}</p>}
    <button disabled={saving || uploading} className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-5 py-3 font-medium text-white hover:bg-orange-600 disabled:opacity-60">{saving && <Loader2 size={16} className="animate-spin" />} Enregistrer les modifications</button>
  </form>;
}
