import { motion } from "framer-motion";

export function MetricCard({ label, value }: { label: string; value: string }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-md border border-slate-200 bg-white p-4 shadow-soft"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </motion.div>
  );
}
