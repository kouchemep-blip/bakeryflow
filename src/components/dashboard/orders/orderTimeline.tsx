type Step = {
  key: string;
  label: string;
  date: Date | null;
};

type Props = {
  status: string;
  stepsData?: Step[]; // optionnel, si tu as l'historique avec dates
};

const defaultSteps = [
  { key: "PENDING", label: "En attente", date: null },
  { key: "CONFIRMED", label: "Confirmée", date: null },
  { key: "PREPARING", label: "En préparation", date: null },
  { key: "READY", label: "Prête", date: null },
  { key: "DELIVERED", label: "Livrée", date: null },
];

export default function OrderTimeline({ status, stepsData }: Props) {
  const steps = stepsData ?? defaultSteps;
  const current = steps.findIndex((s) => s.key === status);

  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)]">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-500">
        Suivi
      </p>
      <h2 className="mt-1 text-xl font-semibold tracking-tight text-slate-900">
        Progression de la commande
      </h2>

      <div className="relative mt-10">
        {/* Ligne de fond */}
        <div className="absolute inset-x-2 top-[19px] h-1.5 -translate-y-1/2 rounded-full bg-slate-200" />

        {/* Ligne de progression */}
        <div
          className="absolute inset-x-2 top-[19px] h-1.5 -translate-y-1/2 rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 shadow-[0_0_12px_rgba(16,185,129,0.35)] transition-all duration-700"
          style={{
            width: `${(current / (steps.length - 1)) * 100}%`,
          }}
        />

        {/* Étapes */}
        <div className="relative z-10 flex justify-between">
          {steps.map((step, index) => {
            const isCompleted = index < current;
            const isCurrent = index === current;

            const formattedDate = step.date
              ? new Date(step.date).toLocaleString("fr-FR", {
                  day: "2-digit",
                  month: "short",
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : null;

            return (
              <div key={step.key} className="flex flex-col items-center gap-2">
                <div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isCompleted || isCurrent
                      ? "border-emerald-500 bg-white"
                      : "border-slate-200 bg-slate-50"
                  }`}
                >
                  <span
                    className={`h-3 w-3 rounded-full transition-all duration-300 ${
                      isCompleted || isCurrent
                        ? "bg-emerald-500"
                        : "bg-slate-300"
                    }`}
                  />

                  {isCompleted && (
                    <span className="absolute inset-0 rounded-full border-2 border-emerald-200/60" />
                  )}
                </div>

                <div className="text-center">
                  <p
                    className={`text-xs font-semibold ${
                      isCompleted || isCurrent
                        ? "text-slate-900"
                        : "text-slate-400"
                    }`}
                  >
                    {step.label}
                  </p>

                  {formattedDate ? (
                    <p className="text-[10px] text-slate-500">{formattedDate}</p>
                  ) : (
                    <p className="text-[10px] text-slate-400">{step.key}</p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}