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

  const cardClassName = [
    "relative overflow-hidden rounded-[1.25rem] border bg-white/[0.03] p-0 backdrop-blur-[20px] backdrop-saturate-[1.2] transition-[border-color,box-shadow] duration-300",
    hovered
      ? "border-white/[0.14] shadow-[0_8px_32px_rgba(0,0,0,0.35),inset_0_1px_0_rgba(255,255,255,0.08)]"
      : "border-white/[0.08] shadow-[0_8px_32px_rgba(0,0,0,0.3),inset_0_1px_0_rgba(255,255,255,0.05)]",
    className.includes("h-full") ? "h-full" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      ref={ref}
      className={cardClassName}
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
