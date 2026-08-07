"use client";

import { ChangeEvent, FormEvent, useState } from "react";
import Image from "next/image";
import { Loader2, Upload, User2, Mail, Phone, Lock } from "lucide-react";

type Profile = {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  avatar: string | null;
};

export function ProfileForm({ profile }: { profile: Profile }) {
  const [form, setForm] = useState({ ...profile, password: "" });
  const [message, setMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  async function uploadAvatar(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    setMessage(null);

    const body = new FormData();
    body.append("image", file);

    try {
      const response = await fetch("/api/customer/avatar", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm((current) => ({ ...current, avatar: data.url }));
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : "L'avatar n'a pas pu être envoyé.",
      );
    } finally {
      setUploading(false);
    }
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setSaving(true);
    setMessage(null);

    try {
      const response = await fetch("/api/customer/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      setForm((current) => ({ ...current, ...data, password: "" }));
      setMessage("Profil enregistré.");
    } catch (error) {
      setMessage(
        error instanceof Error ? error.message : "La mise à jour a échoué.",
      );
    } finally {
      setSaving(false);
    }
  }

  const change =
    (key: keyof typeof form) => (event: ChangeEvent<HTMLInputElement>) =>
      setForm({ ...form, [key]: event.target.value });

  const initials =
    `${form.firstName?.[0] ?? ""}${form.lastName?.[0] ?? ""}`.toUpperCase();

  return (
    <form
      onSubmit={submit}
      className="grid gap-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-3"
    >
      {/* Colonne avatar */}
      <div className="space-y-4 lg:col-span-1">
        <div className="relative mx-auto flex h-28 w-28 items-center justify-center overflow-hidden rounded-[2rem] border-4 border-white bg-slate-100 text-3xl font-bold uppercase text-slate-700 shadow-lg">
          {form.avatar ? (
            <Image
              src={form.avatar}
              alt="Avatar"
              fill
              sizes="112px"
              className="object-cover"
            />
          ) : (
            initials || "AD"
          )}
        </div>

        <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-700 transition hover:bg-slate-100">
          <Upload className="h-4 w-4" />
          <span>{uploading ? "Envoi…" : "Changer l'avatar"}</span>
          <input
            className="sr-only"
            type="file"
            accept="image/*"
            onChange={uploadAvatar}
            disabled={uploading}
          />
        </label>

        {message && (
          <p
            className={`text-center text-sm ${
              message === "Profil enregistré."
                ? "text-emerald-600"
                : "text-rose-600"
            }`}
          >
            {message}
          </p>
        )}
      </div>

      {/* Colonne champs */}
      <div className="space-y-5 lg:col-span-2">
        <div className="grid gap-5 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Prénom
            </label>
            <div className="relative">
              <input
                value={form.firstName}
                onChange={change("firstName")}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Nom
            </label>
            <div className="relative">
              <input
                value={form.lastName}
                onChange={change("lastName")}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <User2 className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Téléphone
            </label>
            <div className="relative">
              <input
                value={form.phone}
                onChange={change("phone")}
                required
                className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
              />
              <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
              Email
            </label>
            <div className="relative">
              <input
                value={form.email}
                disabled
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 pl-10 text-sm font-medium text-slate-500"
              />
              <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>
        </div>

        <div className="max-w-md space-y-2">
          <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">
            Nouveau mot de passe{" "}
            <span className="font-normal text-slate-400">
              (facultatif, 8 caractères minimum)
            </span>
          </label>
          <div className="relative">
            <input
              value={form.password}
              onChange={change("password")}
              type="password"
              minLength={8}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 pl-10 text-sm font-medium text-slate-900 outline-none transition focus:border-orange-400 focus:ring-4 focus:ring-orange-100"
            />
            <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          </div>
        </div>

        <div className="pt-2">
          <button
            disabled={saving || uploading}
            className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-sm font-semibold text-white transition hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
          >
            {saving && <Loader2 size={16} className="animate-spin" />}
            Enregistrer les modifications
          </button>
        </div>
      </div>
    </form>
  );
}
