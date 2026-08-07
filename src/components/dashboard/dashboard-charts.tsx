// components/dashboard/dashboard-charts.tsx
"use client";

import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { motion } from "framer-motion";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  CONFIRMED: "Confirmée",
  PREPARING: "Préparation",
  READY: "Prête",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#E8B54A",
  CONFIRMED: "#5B8DEF",
  PREPARING: "#EA580C",
  READY: "#8B6FD9",
  DELIVERED: "#4FA37B",
  CANCELLED: "#D9534F",
};

type SalesPoint = { date: string; total: number };
type StatusSlice = { status: string; count: number };
type ProductBar = { name: string; sold: number };
type RevenueMonth = { month: string; revenue: number };

function ChartCard({
  title,
  subtitle,
  children,
  delay = 0,
}: {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay, ease: "easeOut" }}
      className="rounded-2xl border border-black/[0.06] bg-white p-5 shadow-sm dark:border-white/[0.06] dark:bg-white/[0.03] sm:p-6"
    >
      <div className="mb-4">
        <h3 className="text-[15px] font-semibold text-[#161310] dark:text-[#F5F1EA]">
          {title}
        </h3>
        {subtitle && <p className="text-xs text-[#807A72]">{subtitle}</p>}
      </div>
      {children}
    </motion.div>
  );
}

export function SalesEvolutionChart({ data }: { data: SalesPoint[] }) {
  return (
    <ChartCard
      title="Évolution des ventes"
      subtitle="14 derniers jours"
      delay={0}
    >
      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ left: -20, right: 10 }}>
          <defs>
            <linearGradient id="salesFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#EA580C" stopOpacity={0.35} />
              <stop offset="100%" stopColor="#EA580C" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid vertical={false} stroke="#00000010" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 11, fill: "#A8A29B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#A8A29B" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #00000010",
              fontSize: 12,
            }}
            formatter={(value) => [
              `${Number(value ?? 0).toLocaleString()} FCFA`,
              "Ventes",
            ]}
          />
          <Area
            type="monotone"
            dataKey="total"
            stroke="#EA580C"
            strokeWidth={2.5}
            fill="url(#salesFill)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function OrderStatusChart({ data }: { data: StatusSlice[] }) {
  const total = data.reduce((s, d) => s + d.count, 0);
  return (
    <ChartCard
      title="Répartition des commandes"
      subtitle={`${total} commande(s) au total`}
      delay={0.08}
    >
      <div className="flex items-center gap-4">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              dataKey="count"
              nameKey="status"
              innerRadius={55}
              outerRadius={80}
              paddingAngle={3}
            >
              {data.map((d) => (
                <Cell
                  key={d.status}
                  fill={STATUS_COLORS[d.status] ?? "#A8A29B"}
                  stroke="none"
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value, name) => [
                value ?? 0,
                STATUS_LABELS[String(name)] ?? String(name),
              ]}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="mt-2 grid grid-cols-2 gap-2">
        {data.map((d) => (
          <li
            key={d.status}
            className="flex items-center gap-2 text-xs text-[#807A72]"
          >
            <span
              className="h-2 w-2 rounded-full"
              style={{ backgroundColor: STATUS_COLORS[d.status] }}
            />
            {STATUS_LABELS[d.status] ?? d.status} · {d.count}
          </li>
        ))}
      </ul>
    </ChartCard>
  );
}

export function TopProductsChart({ data }: { data: ProductBar[] }) {
  return (
    <ChartCard
      title="Produits populaires"
      subtitle="Top 5 par quantité vendue"
      delay={0.16}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart
          data={data}
          layout="vertical"
          margin={{ left: 10, right: 20 }}
        >
          <CartesianGrid horizontal={false} stroke="#00000010" />
          <XAxis
            type="number"
            tick={{ fontSize: 11, fill: "#A8A29B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            type="category"
            dataKey="name"
            width={110}
            tick={{ fontSize: 11, fill: "#807A72" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #00000010",
              fontSize: 12,
            }}
            formatter={(value) => [`${value ?? 0} vendu(s)`, ""]}
          />
          <Bar
            dataKey="sold"
            radius={[0, 6, 6, 0]}
            fill="#EA580C"
            barSize={16}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

export function MonthlyRevenueChart({ data }: { data: RevenueMonth[] }) {
  return (
    <ChartCard
      title="Revenus mensuels"
      subtitle="6 derniers mois · commandes livrées"
      delay={0.24}
    >
      <ResponsiveContainer width="100%" height={220}>
        <BarChart data={data} margin={{ left: -20, right: 10 }}>
          <CartesianGrid vertical={false} stroke="#00000010" />
          <XAxis
            dataKey="month"
            tick={{ fontSize: 11, fill: "#A8A29B" }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fontSize: 11, fill: "#A8A29B" }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              borderRadius: 12,
              border: "1px solid #00000010",
              fontSize: 12,
            }}
            formatter={(value) => [
              `${Number(value ?? 0).toLocaleString()} FCFA`,
              "Revenu",
            ]}
          />
          <Bar
            dataKey="revenue"
            radius={[6, 6, 0, 0]}
            fill="#EA580C"
            barSize={28}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}
