import { motion, useScroll, useSpring } from "framer-motion";
import { ArrowUpRight, Code2, Mail } from "lucide-react";
import { useEffect, useState } from "react";
import { GitHubIcon } from "./components/GitHubIcon";
import { GlowCard } from "./components/GlowCard";
import {
  TechCard,
  TechMarquee,
  aboutCards,
  otherTech,
} from "./components/tech";

const navSections = ["hero", "about", "experience", "projects", "contact"] as const;

{/* change when i get a change */}
const experience = [
  {
    role: "Engineer",
    company: "Vandal",
    period: "2024-2025",
    text: "Created a series of services for security, performance and management.",
    link: "#",
    tech: otherTech,
  },
];

const projects = [
  {
    name: "ClarkPass",
    description: "A self-hosted, private, secure password manager.",
    tags: ["React", "Electron", "Rust"],
    link: "https://pass.clarklab.tech",
    source: "#",
    meta: "Unavailable"
  },
  {
    name: "This Site",
    description: "A basic site to show off my stuff.",
    tags: ["React", "Tailwind", "Framer Motion"],
    link: "https://clarklab.tech",
    source: "https://github.com/clarkpy/portfolio",
    meta: "clarkportfolio",
  },
  {
    name: "ClarkLab",
    description: "A personal deployment platform for hosting apps.",
    tags: ["React", "Rust", "Docker"],
    link: "https://app.clarklab.tech",
    source: "https://github.com/clarkpy/clarklab-global",
    fullWidth: true,
    screenshot: "public/clarklab.png",
    meta: "clarklab-global|clarklab-frontend|clarklab-api|clarklab-agent|clarklab"
  },
] as const;

const projectLinkClass =
  "flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:scale-105 hover:text-white";

function ProjectSourceLink({ source }: { source: string }) {
  if (source === "#") {
    return (
      <span
        className={`${projectLinkClass} cursor-not-allowed opacity-40 hover:scale-100`}
        title="Unavailable"
        aria-label="Source unavailable"
      >
        <GitHubIcon size={16} />
      </span>
    );
  }

  return (
    <a
      href={source}
      className={projectLinkClass}
      target="_blank"
      rel="noreferrer"
      aria-label="View source on GitHub"
    >
      <GitHubIcon size={16} />
    </a>
  );
}

async function getTimeSpentFromHackatime() {
  const response = await fetch("https://hackatime.hackclub.com/api/v1/users/ajclark/project/clarkportfolio");
  const data = await response.json();
  const seconds = data.total_seconds as number;
  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function getTodayDateRange() {
  const now = new Date();

  const startOfToday = new Date(now);
  startOfToday.setHours(0, 0, 0, 0);

  return {
    start_date: startOfToday.toISOString(),
    end_date: now.toISOString(),
  };
}

async function getTimeSpentFromHackatimeToday() {
  const { start_date, end_date } = getTodayDateRange();

  const url = new URL(
    "https://hackatime.hackclub.com/api/v1/users/ajclark/stats"
  );

  url.searchParams.set("start_date", start_date);
  url.searchParams.set("end_date", end_date);

  const response = await fetch(url.toString());

  if (!response.ok) {
    throw new Error(`Hackatime request failed: ${response.status}`);
  }

  const json = await response.json();

  const seconds = json.data.total_seconds as number;

  const totalMinutes = Math.floor(seconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  return `${hours}h ${minutes}m`;
}

async function fetchHackatimeFor(projectSlug: string) {
  const projectSlugs = projectSlug.split("|");
  let totalSeconds = 0;

  await Promise.all(projectSlugs.map(async (slug) => {
    const response = await fetch(
      `https://hackatime.hackclub.com/api/v1/users/ajclark/project/${slug}`,
    );
    const data = await response.json();
    totalSeconds += data.total_seconds as number;
  }));

  const totalMinutes = Math.floor(totalSeconds / 60);
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;
  return `${hours}h ${minutes}m`;
}

function ProjectMeta({ projectHackatimeHandle }: { projectHackatimeHandle: string }) {
  const [time, setTime] = useState<string | null>(null);
  const unavailable =
    !projectHackatimeHandle || projectHackatimeHandle === "Unavailable";

  useEffect(() => {
    if (unavailable) return;

    fetchHackatimeFor(projectHackatimeHandle)
      .then(setTime)
      .catch(() => setTime(null));
  }, [projectHackatimeHandle, unavailable]);

  if (unavailable) {
    return (
      <span className="shrink-0 text-sm text-zinc-500 flex justify-end w-full">
        Time unavailable
      </span>
    );
  }

  if (!time) return null;

  return (
    <span className="shrink-0 text-sm text-zinc-500 flex justify-end w-full">
      Made in {time}
    </span>
  );
}

function FadeIn({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.65, delay, ease: [0.39, 0.21, 0.12, 0.96] }}
    >
      {children}
    </motion.div>
  );
}

function SectionTitle({
  eyebrow,
  title,
}: {
  eyebrow: string;
  title: string;
}) {
  return (
    <FadeIn>
      <div className="mb-10 text-center">
        <p className="text-clark-accent mb-3 flex items-center justify-center gap-2 text-sm font-medium uppercase tracking-[0.3em]">
          {eyebrow}
        </p>
        <h2 className="text-3xl font-black tracking-tight text-white sm:text-5xl">
          {title}
        </h2>
      </div>
    </FadeIn>
  );
}

function ProjectCard({
  project,
}: {
  project: (typeof projects)[number];
}) {
  const content = (
    <>
      <div className="flex items-start justify-between gap-4">
        <h3 className="text-2xl font-bold text-white">{project.name}</h3>
        <div className="flex shrink-0 items-center gap-2">
          <ProjectSourceLink source={project.source} />
          <a
            href={project.link}
            className={projectLinkClass}
            target={project.link.startsWith("http") ? "_blank" : undefined}
            rel={project.link.startsWith("http") ? "noreferrer" : undefined}
            aria-label={`Open ${project.name}`}
          >
            <ArrowUpRight size={16} />
          </a>
        </div>
      </div>
      <p className="mt-3 flex-1 leading-relaxed text-zinc-300">
        {project.description}
      </p>
      <div className="mt-5 flex flex-wrap gap-2">
        {project.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
      {"meta" in project ? (
        <ProjectMeta projectHackatimeHandle={project.meta} />
      ) : null}
 
    </>
  );

  if ("screenshot" in project && project.screenshot) {
    return (
      <GlowCard className="flex h-full flex-col overflow-hidden p-0">
        <img
          src={project.screenshot}
          alt={`${project.name} screenshot`}
          className="project-screenshot"
        />
        <div className="flex flex-1 flex-col p-6">{content}</div>
      </GlowCard>
    );
  }

  return <GlowCard className="flex h-full flex-col p-6">{content}</GlowCard>;
}

function scrollTo(id: string) {
  const element = document.getElementById(id);
  if (!element) return;
  const top = element.getBoundingClientRect().top + window.scrollY - 80;
  window.scrollTo({ top, behavior: "smooth" });
}

export default function App() {
  const [activeSection, setActiveSection] = useState<string>("hero");
  const [timeSpent, setTimeSpent] = useState<string | null>(null);
  const [timeSpentToday, setTimeSpentToday] = useState<string | null>(null);
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 120,
    damping: 30,
    restDelta: 0.001,
  });

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: "-35% 0px -55% 0px", threshold: 0 },
    );

    navSections.forEach((id) => {
      const element = document.getElementById(id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    getTimeSpentFromHackatime()
      .then(setTimeSpent)
      .catch(() => setTimeSpent(null));
  }, []);

  useEffect(() => {
    getTimeSpentFromHackatimeToday()
      .then(setTimeSpentToday)
      .catch(() => setTimeSpentToday(null));
  }, []);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--clark-bg)] text-white">
      <motion.div
        className="fixed left-0 right-0 top-0 z-50 h-1 origin-left bg-[var(--clark-accent)]"
        style={{ scaleX }}
      />

      <div className="pointer-events-none fixed inset-0 z-0 grid-pattern" />

      <div className="pointer-events-none fixed inset-0 z-0 bg-[color-mix(in_srgb,var(--clark-accent)_10%,transparent)]" />

      <motion.div
        className="blob left-[12%] top-[20%] bg-[var(--clark-accent)]/20"
        animate={{ y: [0, -20, 0], x: [0, 15, 0] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />

      <motion.div
        className="blob right-[14%] bottom-[18%] bg-[var(--clark-accent)]/15"
        animate={{ y: [0, 25, 0], x: [0, -18, 0] }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut" }}
      />

      <div className="navbar-shell">
        <motion.nav
          className="navbar"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.39, 0.21, 0.12, 0.96] }}
        >
          <div className="navbar-inner">
            <button
              type="button"
              onClick={() => scrollTo("hero")}
              className="navbar-brand"
            >
            <div className="navbar-brand-icon">
               {/* find a nice pfp for nav bar :)*/}
            </div>
            <div>
              <p className="navbar-eyebrow">clarklab.tech</p>
              <p className="navbar-title">
                AJ<span className="text-clark-accent">.</span>
              </p>
            </div>
          </button>

          <div className="navbar-links">
            <button
              type="button"
              className={`nav-link ${activeSection === "about" ? "nav-link-active" : ""}`}
              onClick={() => scrollTo("about")}
            >
              About
            </button>
            <button
              type="button"
              className={`nav-link ${activeSection === "experience" ? "nav-link-active" : ""}`}
              onClick={() => scrollTo("experience")}
            >
              Experience
            </button>
            <button
              type="button"
              className={`nav-link ${activeSection === "projects" ? "nav-link-active" : ""}`}
              onClick={() => scrollTo("projects")}
            >
              Projects
            </button>
          </div>

          <button
            type="button"
            onClick={() => scrollTo("contact")}
            className="btn btn-primary btn-sm cursor-pointer"
          >
            Contact
          </button>
        </div>
        </motion.nav>
      </div>

      <section
        id="hero"
        className="relative z-10 mx-auto flex min-h-screen max-w-6xl flex-col items-center justify-center px-6 pt-28 text-center"
      >
        <FadeIn>
          <div className="mb-6 rounded-full border border-[var(--clark-border)] bg-white/[0.05] px-4 py-2 text-sm text-zinc-300 shadow-[0_25px_50px_-12px_color-mix(in_srgb,var(--clark-accent)_15%,transparent)] backdrop-blur-xl">
            Student Cybersecurity Analyst
          </div>
        </FadeIn>

        <FadeIn delay={0.1}>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-6xl">
            Hey, I'm AJ<span className="text-clark-accent">.</span>
          </h1>
        </FadeIn>

        <FadeIn delay={0.2}>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-zinc-300 sm:text-xl">
            I built software I am interested in and will use. Like me style?
            Shoot me an email for services!
          </p>
          <p className="mt-4 text-sm text-zinc-500">
            I've been coding for{" "}
            <span className="text-clark-accent">{timeSpentToday}</span>
            {" "}today.
          </p>
        </FadeIn>

        <FadeIn delay={0.3} className="mt-8 flex flex-wrap items-center justify-center gap-4">
          <button
            type="button"
            className="btn btn-primary cursor-pointer"
            onClick={() => scrollTo("projects")}
          >
            View Projects
          </button>
          <button
            type="button"
            className="btn cursor-pointer"
            onClick={() => scrollTo("contact")}
          >
            Contact Me
          </button>
        </FadeIn>

        <FadeIn delay={0.4} className="mt-8 flex items-center justify-center gap-4">
          <a
            href="https://github.com/clarkpy"
            target="_blank"
            rel="noreferrer"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:scale-105 hover:text-white"
            aria-label="Code"
          >
            <Code2 size={18} />
          </a>
          <a
            href="mailto:aj@clarklab.tech"
            className="flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/[0.06] text-zinc-300 transition hover:scale-105 hover:text-white"
            aria-label="Email"
          >
            <Mail size={18} />
          </a>
        </FadeIn>
      </section>

      <section id="about" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionTitle eyebrow="About" title="Who Are You?" />

        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {aboutCards.map((card, index) => (
            <FadeIn
              key={card.title}
              delay={index * 0.08}
              className={card.span === 2 ? "md:col-span-2" : ""}
            >
              {"text" in card ? (
                <GlowCard className="h-full px-6 py-8 text-center" subtle>
                  <h3 className="text-xl font-bold text-white">{card.title}</h3>
                  <p className="mx-auto mt-3 max-w-2xl leading-relaxed text-zinc-400">
                    {card.text}
                  </p>
                </GlowCard>
              ) : (
                <TechCard
                  title={card.title}
                  description={card.description}
                  tech={card.tech}
                  columnSpan={card.span}
                />
              )}
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="experience" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionTitle eyebrow="Experience" title="What I've Done" />

        <div className="grid grid-cols-1 gap-6">
          {experience.map((item, index) => (
            <FadeIn key={item.company} delay={index * 0.1}>
              <GlowCard className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <p className="text-clark-accent text-sm font-medium uppercase tracking-wider">
                    {item.role}
                  </p>
                  <h3 className="mt-1 text-2xl font-bold text-white">
                    {item.company}
                    <span className="ml-2 text-base font-normal text-zinc-400">
                      | {item.period}
                    </span>
                  </h3>
                  <p className="mt-3 max-w-2xl leading-relaxed text-zinc-400">
                    {item.text}
                  </p>
                  {item.tech ? (
                    <div className="mt-5 border-t border-white/[0.06] pt-4">
                      <TechMarquee
                        key={item.tech.map((tech) => tech.slug).join("-")}
                        items={item.tech}
                        columnSpan={2}
                      />
                    </div>
                  ) : null}
                </div>
                {item.link && (
                  <a
                    href={item.link}
                    className="btn shrink-0 self-start"
                    target={item.link.startsWith("http") ? "_blank" : undefined}
                    rel={item.link.startsWith("http") ? "noreferrer" : undefined}
                  >
                    Visit
                    <ArrowUpRight size={16} />
                  </a>
                )}
              </GlowCard>
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="projects" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionTitle eyebrow="Projects" title="Stuff I'm Working On" />

        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {projects.map((project, index) => (
            <FadeIn
              key={project.name}
              delay={index * 0.1}
              className={"fullWidth" in project && project.fullWidth ? "md:col-span-2" : ""}
            >
              <ProjectCard project={project} />
            </FadeIn>
          ))}
        </div>
      </section>

      <section id="contact" className="relative z-10 mx-auto max-w-6xl px-6 py-24">
        <SectionTitle eyebrow="Contact" title="Found a bug?" />

        <FadeIn delay={0.1}>
          <GlowCard className="mx-auto max-w-2xl p-6 text-center">
            <p className="text-lg leading-relaxed text-zinc-300">
              I'm always open to bug reports, feature requests, or
              feedback on my projects.
            </p>
            <a href="mailto:aj@clarklab.tech" className="btn btn-primary mt-8">
              <Mail size={16} />
              Say Hello
            </a>
          </GlowCard>
        </FadeIn>
      </section>

      <footer className="relative z-10 border-t border-[var(--clark-border)] px-6 py-8 text-center text-sm text-zinc-500">
        <p>
          Made by AJ<br />check out the{" "}
          <a
            href="https://github.com/clarkpy/portfolio"
            className="text-clark-accent hover:underline"
          >
            source code
          </a>
          {timeSpent && (
            <>
              {" | Built in "}
              <a href="https://hackati.me/ajclark" className="text-clark-accent hover:underline">{timeSpent}</a>
            </>
          )}
        </p>
   
      </footer>
    </main>
  );
}
