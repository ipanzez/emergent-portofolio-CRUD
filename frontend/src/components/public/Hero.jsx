import { motion } from "framer-motion";
import { ArrowDown, ArrowUpRight, Download } from "lucide-react";
import { DarkBackdrop, Sparkle } from "./DarkBackdrop";
import { assetUrl, experienceLabel } from "@/lib/api";

const item = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

export const Hero = ({ profile }) => {
  const exp = experienceLabel(profile.experience_start, profile.experience_end);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section data-testid="hero-section" className="relative flex min-h-[100svh] items-center overflow-hidden text-white lg:min-h-0">
      <DarkBackdrop />
      <div className="relative mx-auto w-full max-w-7xl px-6 pb-20 pt-28 lg:px-10 lg:pb-16 lg:pt-32">
        <motion.div {...item(0)} className="flex flex-wrap items-center gap-3">
          <span data-testid="hero-role-badge" className="dark-glass inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-sm text-white/85">
            <Sparkle size={12} className="text-blue-300" />
            {profile.role}
          </span>
          <span data-testid="hero-experience-badge" className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-1.5 text-sm text-white/60">
            <span className="h-1.5 w-1.5 rounded-full bg-blue-400" />
            {exp.range} · {exp.years}
          </span>
        </motion.div>

        <motion.h1 {...item(0.12)} data-testid="hero-title" className="mt-8 max-w-4xl break-words text-[2.6rem] font-black leading-[0.95] tracking-tighter sm:text-6xl lg:mt-10 lg:text-7xl">
          {profile.hero_greeting}
          <br />
          <span className="gradient-text inline-block pb-2">{profile.hero_title}</span>
        </motion.h1>

        <motion.p {...item(0.24)} data-testid="hero-subtitle" className="mt-8 max-w-xl text-base leading-relaxed text-white/60 md:text-lg">
          {profile.hero_subtitle}
        </motion.p>

        <motion.div {...item(0.36)} className="mt-12 flex flex-wrap items-center gap-4">
          <button
            data-testid="hero-selected-project-btn"
            onClick={() => scrollTo("projects")}
            className="group inline-flex items-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-gray-900 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-blue-50"
          >
            Selected Project
            <ArrowUpRight size={16} className="transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </button>
          {profile.cv_url && (
            <a
              data-testid="hero-download-cv-btn"
              href={assetUrl(profile.cv_url)}
              target="_blank"
              rel="noreferrer"
              className="dark-glass inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-sm font-medium text-white/85 transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/10"
            >
              <Download size={16} /> Download CV
            </a>
          )}
        </motion.div>

        <motion.div {...item(0.5)} className="mt-16 flex items-center gap-6 text-white/40 lg:mt-14">
          <button onClick={() => scrollTo("about")} data-testid="hero-scroll-btn" className="grid h-10 w-10 place-items-center rounded-full border border-white/15 transition-colors hover:border-white/40 hover:text-white">
            <ArrowDown size={16} className="animate-bounce" />
          </button>
          <span className="text-xs uppercase tracking-[0.25em]">Scroll to explore</span>
        </motion.div>
      </div>
    </section>
  );
};
