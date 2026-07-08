import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { TechIcon } from "./TechIcon";
import type { TechItem } from "./types";

function useTypewriter(text: string, enabled: boolean) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    const reset = window.setTimeout(() => {
      setDisplayed("");
    }, 0);

    if (!enabled) {
      return () => {
        window.clearTimeout(reset);
      };
    }

    let index = 0;
    const interval = window.setInterval(() => {
      index += 1;
      setDisplayed(text.slice(0, index));

      if (index >= text.length) {
        window.clearInterval(interval);
      }
    }, 24);

    return () => {
      window.clearTimeout(reset);
      window.clearInterval(interval);
    };
  }, [text, enabled]);

  return displayed;
}

function TechTooltip({
  item,
  position,
  visible,
}: {
  item: TechItem;
  position: { x: number; y: number };
  visible: boolean;
}) {
  const text = useMemo(() => {
    return `I've been using ${item.name} for ${item.usingFor}.`;
  }, [item.name, item.usingFor]);

  const typedText = useTypewriter(text, visible);

  if (typeof document === "undefined") return null;

  return createPortal(
    <AnimatePresence>
      {visible ? (
        <motion.div
          className="tech-tooltip"
          style={{
            left: position.x,
            top: position.y,
          }}
          initial={{
            opacity: 0,
            y: 12,
            scale: 0.92,
            filter: "blur(8px)",
          }}
          animate={{
            opacity: 1,
            y: 0,
            scale: 1,
            filter: "blur(0px)",
          }}
          exit={{
            opacity: 0,
            y: 8,
            scale: 0.96,
            filter: "blur(6px)",
          }}
          transition={{
            type: "spring",
            stiffness: 420,
            damping: 30,
            mass: 0.7,
          }}
        >
          <motion.div
            className="tech-tooltip-glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.08, duration: 0.2 }}
          />

          <div className="tech-tooltip-header">
            <div className="tech-tooltip-icon">
              <TechIcon slug={item.slug} />
            </div>

            <div>
              <p className="tech-tooltip-eyebrow"></p>
              <h4>{item.name}</h4>
            </div>
          </div>

          <p className="tech-tooltip-text">
            {typedText}
          </p>

          {item.note ? (
            <motion.p
              className="tech-tooltip-note"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.28, duration: 0.25 }}
            >
              {item.note}
            </motion.p>
          ) : null}
        </motion.div>
      ) : null}
    </AnimatePresence>,
    document.body,
  );
}

export function TechChip({ item }: { item: TechItem }) {
  const [isHovered, setIsHovered] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const isStrong = item.strong === true;
  const hasTooltip = Boolean(item.usingFor?.trim());

  function updateTooltipPosition(e: React.MouseEvent<HTMLDivElement>) {
    setPosition({ x: e.clientX + 18, y: e.clientY + 18 });
  }

  return (
    <>
      <motion.div
        className={`tech-chip${isStrong ? " tech-chip-strong" : ""}`}
        onMouseEnter={(event) => {
          if (!hasTooltip) return;

          updateTooltipPosition(event);
          setIsHovered(true);
        }}
        onMouseMove={(event) => {
          if (!hasTooltip) return;

          updateTooltipPosition(event);
        }}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{
          y: -4,
          scale: 1.04,
          rotate: -0.35
        }}
        transition={{
          type: "spring",
          stiffness: 420,
          damping: 28,
        }}
      >
        <TechIcon slug={item.slug} />
        <span className="tech-chip-label">{item.name}</span>
      </motion.div>

      {hasTooltip ? (
        <TechTooltip item={item} position={position} visible={isHovered} />
      ) : null}
    </>
  )
}