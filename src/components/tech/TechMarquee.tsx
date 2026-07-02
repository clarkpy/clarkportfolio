import {
  animate,
  motion,
  useAnimationFrame,
  useMotionValue,
} from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import { TechChip } from "./TechChip";
import { getMarqueeDuration } from "./tech-data";
import type { TechItem } from "./types";

const MAX_CYCLE_REPEATS = 32;

function wrapOffset(value: number, loopWidth: number) {
  if (loopWidth <= 0) return value;
  let wrapped = value % loopWidth;
  if (wrapped > 0) wrapped -= loopWidth;
  return wrapped;
}

function getMinCycleRepeats(itemCount: number, columnSpan: number) {
  const targetVisible = columnSpan >= 2 ? 6 : 4;
  return Math.max(2, Math.ceil((targetVisible * 2) / itemCount));
}

function buildCycle(items: TechItem[], repeatCount: number) {
  return Array.from({ length: repeatCount }, () => items).flat();
}

export function TechMarquee({
  items,
  columnSpan = 1,
  reverse = false,
}: {
  items: TechItem[];
  columnSpan?: number;
  reverse?: boolean;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const loopWidthRef = useRef(0);
  const pixelsPerSecondRef = useRef(0);
  const dragStartRef = useRef({ pointerX: 0, offsetX: 0 });
  const velocityRef = useRef(0);
  const lastPointerXRef = useRef(0);
  const lastMoveTimeRef = useRef(0);
  const prefersReducedMotionRef = useRef(false);

  const [repeatCount, setRepeatCount] = useState(() =>
    getMinCycleRepeats(items.length, columnSpan),
  );

  const cycle = useMemo(
    () => buildCycle(items, repeatCount),
    [items, repeatCount],
  );
  const loop = useMemo(() => [...cycle, ...cycle], [cycle]);
  const cycleDuration = getMarqueeDuration(cycle.length);

  const x = useMotionValue(0);
  const [isDragging, setIsDragging] = useState(false);
  const isDraggingRef = useRef(false);
  const isHoveredRef = useRef(false);
  const isPausedRef = useRef(false);

  useEffect(() => {
    isDraggingRef.current = isDragging;
  }, [isDragging]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => {
      prefersReducedMotionRef.current = media.matches;
    };

    updatePreference();
    media.addEventListener("change", updatePreference);
    return () => media.removeEventListener("change", updatePreference);
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const track = trackRef.current;
    if (!container || !track) return;

    const syncLoop = () => {
      const containerWidth = container.clientWidth;
      const cycleWidth = track.scrollWidth / 2;

      if (cycleWidth <= 0 || containerWidth <= 0) return;

      if (
        cycleWidth < containerWidth &&
        repeatCount < MAX_CYCLE_REPEATS
      ) {
        setRepeatCount((count) => count + 1);
        return;
      }

      loopWidthRef.current = cycleWidth;
      pixelsPerSecondRef.current = cycleWidth / cycleDuration;
      x.set(wrapOffset(x.get(), cycleWidth));
    };

    syncLoop();

    const observer = new ResizeObserver(syncLoop);
    observer.observe(container);
    observer.observe(track);
    return () => observer.disconnect();
  }, [cycle.length, cycleDuration, loop.length, repeatCount, x]);

  useAnimationFrame((_, delta) => {
    if (
      isDraggingRef.current ||
      isHoveredRef.current ||
      isPausedRef.current ||
      prefersReducedMotionRef.current ||
      loopWidthRef.current <= 0
    ) {
      return;
    }

    const direction = reverse ? 1 : -1;
    const distance = pixelsPerSecondRef.current * (delta / 1000);
    x.set(wrapOffset(x.get() + direction * distance, loopWidthRef.current));
  });

  function handlePointerDown(event: React.PointerEvent<HTMLDivElement>) {
    if (event.button !== 0) return;
    event.currentTarget.setPointerCapture(event.pointerId);
    isDraggingRef.current = true;
    isPausedRef.current = true;
    setIsDragging(true);
    velocityRef.current = 0;
    lastPointerXRef.current = event.clientX;
    lastMoveTimeRef.current = performance.now();
    dragStartRef.current = {
      pointerX: event.clientX,
      offsetX: x.get(),
    };
  }

  function handlePointerMove(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;

    const now = performance.now();
    const elapsed = now - lastMoveTimeRef.current;
    if (elapsed > 0) {
      velocityRef.current = (event.clientX - lastPointerXRef.current) / elapsed;
    }

    lastPointerXRef.current = event.clientX;
    lastMoveTimeRef.current = now;

    const delta = event.clientX - dragStartRef.current.pointerX;
    x.set(
      wrapOffset(
        dragStartRef.current.offsetX + delta,
        loopWidthRef.current,
      ),
    );
  }

  function finishDrag(event: React.PointerEvent<HTMLDivElement>) {
    if (!isDragging) return;

    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId);
    }

    setIsDragging(false);
    isDraggingRef.current = false;

    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0 || prefersReducedMotionRef.current) {
      isPausedRef.current = false;
      return;
    }

    const momentum = velocityRef.current * 180;
    const target = wrapOffset(x.get() + momentum, loopWidth);

    animate(x, target, {
      type: "spring",
      stiffness: 140,
      damping: 24,
      mass: 0.8,
      onComplete: () => {
        isPausedRef.current = false;
      },
    });
  }

  const isWide = columnSpan >= 2;

  return (
    <div
      ref={containerRef}
      className={`tech-marquee ${isWide ? "tech-marquee-wide" : ""} ${isDragging ? "tech-marquee-dragging" : ""}`}
      onContextMenu={(event) => event.preventDefault()}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrag}
      onPointerCancel={finishDrag}
      onMouseEnter={() => {
        isHoveredRef.current = true;
      }}
      onMouseLeave={() => {
        isHoveredRef.current = false;
        if (!isDraggingRef.current) {
          isPausedRef.current = false;
        }
      }}
    >
      <motion.div
        ref={trackRef}
        className="tech-marquee-track"
        style={{ x }}
      >
        {loop.map((item, index) => (
          <TechChip key={`${item.slug}-${index}`} item={item} />
        ))}
      </motion.div>
    </div>
  );
}
