import { motion } from "framer-motion";
import { TechIcon } from "./TechIcon";
import type { TechItem } from "./types";

export function TechChip({ item }: { item: TechItem }) {
  return (
    <motion.div
      className="tech-chip"
      aria-hidden="true"
      whileHover={{ y: -2, scale: 1.03 }}
      transition={{ type: "spring", stiffness: 420, damping: 28 }}
    >
      <TechIcon slug={item.slug} />
      <span className="tech-chip-label">{item.name}</span>
    </motion.div>
  );
}
