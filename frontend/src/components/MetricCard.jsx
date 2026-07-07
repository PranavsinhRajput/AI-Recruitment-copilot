import { motion } from "framer-motion";

export function MetricCard({ label, value }) {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="rounded-md border border-line bg-panel p-4 shadow-soft"
    >
      <p className="text-xs font-semibold uppercase tracking-widest text-muted">{label}</p>
      <p className="mt-2 text-3xl font-bold text-ink">{value}</p>
    </motion.div>
  );
}
