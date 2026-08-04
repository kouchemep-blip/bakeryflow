type Props = {
  status: string;
};

const steps = ["PENDING", "CONFIRMED", "PREPARING", "READY", "DELIVERED"];

export default function OrderTimeline({ status }: Props) {
  const current = steps.indexOf(status);

  return (
    <div className="rounded-xl border p-6">
      <h2 className="mb-6 text-xl font-semibold">Suivi de la commande</h2>

      <div className="space-y-5">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-4">
            <div
              className={`h-4 w-4 rounded-full ${
                index <= current ? "bg-green-500" : "bg-gray-300"
              }`}
            />

            <span>{step}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
