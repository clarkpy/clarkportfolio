import type { IconifyLogoIcon } from "./types";
import logoIcons from "./logo-icons.json";
import { simpleTechIcons } from "./simple-tech-icons";
import { siNextdotjs } from "simple-icons";

const coloredLogos = logoIcons as Record<string, IconifyLogoIcon>;

const imageIcons: Record<string, string> = {
  orbstack: "/orbstack-icon.png",
  codex: "/codex-icon.png",
  paper: "/paper-icon.png",
  "intellij-idea": "/intellij-idea-icon.png",
  pterodactyl: "/pterodactyl-icon.png",
  "shadcn-ui": "/shadcn-icon.svg",
};

const brandIcons: Record<string, typeof siNextdotjs> = {
  nextjs: siNextdotjs,
};

function getBrandFill(hex: string) {
  const red = Number.parseInt(hex.slice(0, 2), 16);
  const green = Number.parseInt(hex.slice(2, 4), 16);
  const blue = Number.parseInt(hex.slice(4, 6), 16);
  const luminance = 0.299 * red + 0.587 * green + 0.114 * blue;
  return luminance < 72 ? "#ffffff" : `#${hex}`;
}

export function TechIcon({ slug }: { slug: string }) {
  const imageSrc = imageIcons[slug];
  if (imageSrc) {
    return (
      <img
        src={imageSrc}
        alt=""
        className="tech-chip-icon"
        draggable={false}
        aria-hidden="true"
      />
    );
  }

  const colored = coloredLogos[slug];
  if (colored) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${colored.width} ${colored.height}`}
        className="tech-chip-icon"
        aria-hidden="true"
        dangerouslySetInnerHTML={{ __html: colored.body }}
      />
    );
  }

  const brand = brandIcons[slug];
  if (brand) {
    return (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        className="tech-chip-icon"
        aria-hidden="true"
      >
        <path d={brand.path} fill={`#${brand.hex}`} />
      </svg>
    );
  }

  const simple = simpleTechIcons[slug];
  if (simple) {
    return (
      <svg
        role="img"
        viewBox="0 0 24 24"
        xmlns="http://www.w3.org/2000/svg"
        className="tech-chip-icon"
        aria-hidden="true"
      >
        <path d={simple.path} fill={getBrandFill(simple.hex)} />
      </svg>
    );
  }

  return (
    <span className="tech-chip-fallback" aria-hidden="true">
      {slug.charAt(0).toUpperCase()}
    </span>
  );
}
