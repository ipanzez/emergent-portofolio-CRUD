import { motion } from "framer-motion";
import { ArrowUpRight, Download } from "lucide-react";
import { GlowSparkle, LightBackdrop, Sparkle } from "./DarkBackdrop";
import { assetUrl } from "@/lib/api";

const splitTitle = (title) => {
  const t = (title || "").trim();
  const i = t.indexOf(" ");
  if (i > 0) return [t.slice(0, i), t.slice(i + 1)];
  const mid = Math.floor(t.length / 2);
  return [t.slice(0, mid), t.slice(mid)];
};

const item = (delay) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] },
});

const TITLE = "text-[3.75rem] sm:text-[6.5rem] lg:text-[8.5rem]";

export const Hero = ({ profile }) => {
  const [top, bottom] = splitTitle(profile.hero_title);
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  return (
    <section data-testid="hero-section" className="relative flex items-center overflow-hidden text-gray-900">
      <LightBackdrop />
      <div className="relative mx-auto w-full max-w-5xl px-6 pb-20 pt-28 lg:pb-20 lg:pt-36">
        <div className="relative mx-auto max-w-3xl">
          <GlowSparkle size={52} color="text-blue-500" className="-left-4 top-[44%] sm:-left-16 sm:top-[46%]" />
          <GlowSparkle size={28} color="text-purple-400" className="right-2 -top-8 sm:right-10 sm:-top-10" />
          <GlowSparkle size={20} color="text-purple-500" className="-right-1 top-[50%] sm:-right-8" />

          <motion.p {...item(0)} data-testid="hero-greeting" className="flex items-center gap-2 text-sm text-gray-700 sm:text-base">
            <span className="text-gray-400">/</span>
            {profile.hero_greeting}
            <span className="h-px w-7 bg-gray-800" />
          </motion.p>

          <motion.h1 {...item(0.1)} data-testid="hero-title" className="mt-1 font-black leading-[0.9] tracking-tighter">
            <span className={`block text-gray-900 ${TITLE}`}>{top}</span>
            <span className={`block bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text pb-3 pl-[22%] text-transparent ${TITLE}`}>{bottom}</span>
          </motion.h1>

          <motion.button
            {...item(0.3)}
            type="button"
            data-testid="hero-selected-project-btn"
            onClick={() => scrollTo("projects")}
            className="ml-auto mt-4 flex w-fit -rotate-6 items-center gap-1 rounded-md bg-white px-3 py-1.5 text-xs font-medium text-gray-700 shadow-lift ring-1 ring-gray-100 transition-[transform,box-shadow] duration-300 hover:-translate-y-0.5 hover:rotate-0 sm:absolute sm:-right-10 sm:bottom-[10%] sm:mt-0 sm:text-sm"
          >
            Selected Project <ArrowUpRight size={14} className="text-gray-400" />
          </motion.button>
        </div>

        <motion.div {...item(0.2)} className="mt-3 flex justify-center">
          <span data-testid="hero-role-badge" className="inline-flex items-center gap-2 rounded-full border-2 border-blue-500 bg-white px-5 py-2 text-sm font-medium text-blue-600 shadow-[0_12px_30px_-12px_rgba(37,99,235,0.6)]">
            {profile.role}
            <Sparkle size={12} className="text-blue-500" />
          </span>
        </motion.div>

        {profile.hero_subtitle && (
          <motion.p {...item(0.3)} data-testid="hero-subtitle" className="mx-auto mt-8 max-w-md text-center text-sm leading-relaxed text-gray-500">
            {profile.hero_subtitle}
          </motion.p>
        )}

        <motion.div {...item(0.4)} className="mt-12 flex flex-col items-center gap-1 text-center">
          <span className="text-xs text-gray-400">Experience</span>
          <span data-testid="hero-experience-badge" className="text-sm font-bold text-gray-800">
            {profile.experience_start} – {profile.experience_end}
          </span>
        </motion.div>

        {profile.cv_url && (
          <motion.div {...item(0.5)} className="mt-8 flex justify-center">
            <a
              data-testid="hero-download-cv-btn"
              href={assetUrl(profile.cv_url)}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-gray-900 px-5 py-2.5 text-xs font-bold text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-gray-700"
            >
              <Download size={14} /> Download CV
            </a>
          </motion.div>
        )}
      </div>
    </section>
  );
};
