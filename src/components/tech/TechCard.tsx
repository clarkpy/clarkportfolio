import { GlowCard } from "../GlowCard";
import { TechMarquee } from "./TechMarquee";
import type { TechItem } from "./types";

export function TechCard({
  title,
  description,
  tech,
  columnSpan = 1,
  reverse = false,
}: {
  title: string;
  description: string;
  tech: TechItem[];
  columnSpan?: number;
  reverse?: boolean;
}) {
  return (
    <GlowCard className="h-full" subtle>
      <div className="flex h-full min-h-[260px] flex-col px-6 pb-0 pt-8 text-center">
        <h3 className="text-xl font-bold tracking-tight text-white">{title}</h3>
        <p className="mx-auto mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
          {description}
        </p>
        <div className="mt-auto border-t border-white/[0.06] pt-5">
          <TechMarquee
            key={tech.map((item) => item.slug).join("-")}
            items={tech}
            columnSpan={columnSpan}
            reverse={reverse}
          />
        </div>
      </div>
    </GlowCard>
  );
}
