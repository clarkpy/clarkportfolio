import { motion, useMotionTemplate, useMotionValue } from "framer-motion";
import { useRef, useState } from "react";

export function GlowCard({
  children,
  className = "",
  subtle = false,
}: {
  children: React.ReactNode;
  className?: string;
  subtle?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const [hovered, setHovered] = useState(false);

  const spotlight = useMotionTemplate`
    radial-gradient(260px circle at ${mouseX}px ${mouseY}px, rgba(255, 255, 255, ${subtle ? 0.06 : 0.1}), transparent 72%)
  `;

  function handleMouseMove(event: React.MouseEvent<HTMLDivElement>) {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    mouseX.set(event.clientX - rect.left);
    mouseY.set(event.clientY - rect.top);
  }

  return (
    <div
      ref={ref}
      className={`card ${hovered ? "card-hovered" : ""} ${className.includes("h-full") ? "h-full" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        animate={{ opacity: hovered ? 1 : 0 }}
        transition={{ duration: 0.25 }}
        style={{ background: spotlight }}
      />
      <div className={`relative ${className}`}>{children}</div>
    </div>
  );
}
