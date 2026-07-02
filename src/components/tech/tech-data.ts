import type { AboutCard, TechItem } from "./types";

export const MARQUEE_SPEED = 12;
export const MARQUEE_REFERENCE_ITEMS = 4;

export function getMarqueeDuration(itemCount: number, columnSpan = 1) {
  return (MARQUEE_SPEED * (itemCount / MARQUEE_REFERENCE_ITEMS)) / columnSpan;
}

export const frontendTech: TechItem[] = [
  { name: "React", slug: "react" },
  { name: "Tailwind", slug: "tailwindcss" },
  { name: "TypeScript", slug: "typescript" },
  { name: "Vite", slug: "vite" },
];

export const backendTech: TechItem[] = [
  { name: "Express", slug: "express" },
  { name: "MongoDB", slug: "mongodb" },
  { name: "PostgreSQL", slug: "postgresql" },
  { name: "Kotlin", slug: "kotlin" },
  { name: "Rust", slug: "rust" },
  { name: "Python", slug: "python" },
  { name: "Java", slug: "java" },
];

export const otherTech: TechItem[] = [
  { name: "Docker", slug: "docker" },
  { name: "Git", slug: "git" },
  { name: "Debian", slug: "debian" },
  { name: "Nushell", slug: "nushell" },
  { name: "GitHub", slug: "github" },
  { name: "Coolify", slug: "coolify" },
  { name: "JetBrains", slug: "jetbrains" },
  { name: "Visual Studio Code", slug: "vscode" },
  { name: "Ghostty", slug: "ghostty" },
  { name: "Notion", slug: "notion" },
  { name: "Figma", slug: "figma" },
  { name: "OrbStack", slug: "orbstack" },
  { name: "Tailscale", slug: "tailscale" },
  { name: "Hetzner", slug: "hetzner" },
  { name: "Vercel", slug: "vercel" },
  { name: "Cloudflare", slug: "cloudflare" },
  { name: "AWS", slug: "aws" },
  { name: "Insomnia", slug: "insomnia" },
];

export const aboutCards: AboutCard[] = [
  {
    title: "Summary",
    text: "I am a student studying Cybersecurity in the United Kingdom. I like to create projects that i find useful in my own time. I have been programming for 5 years and believe i have advanced and embraced new technologies as they have become available.",
    span: 2,
  },
  {
    title: "Frontend",
    description:
      "I have over 2 years of experience creating frontend applications with the stack found below..",
    tech: frontendTech,
    span: 1,
  },
  {
    title: "Backend",
    description:
      "I have over 4 years of experience creating services with this stack. This is from bots to backend services.",
    tech: backendTech,
    span: 1,
  },
  {
    title: "Other Technologies",
    description: "Tools and platforms I use across the development process. This includes CI/CD, deployment, and monitoring.",
    tech: otherTech,
    span: 2,
  },
];
