import { ArrowUpRight, Mail, MapPin, Phone } from "lucide-react";
import { Reveal } from "./Motion";
import { GlowSparkle, Sparkle } from "./DarkBackdrop";
import { assetUrl } from "@/lib/api";

const BLUE = "bg-[#1D4ED8]";

const Pill = ({ children }) => (
  <span className={`inline-flex rounded-full ${BLUE} px-3.5 py-1 text-xs font-bold text-white`}>{children}</span>
);

const SkillList = ({ items }) => (
  <ul className="mt-5 space-y-2.5">
    {items.map((s) => (
      <li key={s.id} className="flex items-start gap-2.5 text-sm font-medium text-gray-800">
        <Sparkle size={10} className="mt-1 shrink-0 text-purple-500" />
        {s.name}
      </li>
    ))}
  </ul>
);

export const About = ({ profile, skills, tools }) => {
  const hard = skills.filter((s) => s.type === "hard");
  const soft = skills.filter((s) => s.type === "soft");

  return (
    <section id="about" data-testid="about-section" className="mx-auto max-w-7xl px-6 py-16 lg:px-10 lg:py-28">
      <div className="grid grid-cols-1 gap-5 md:grid-cols-12">
        <Reveal className="md:col-span-8">
          <div className="card-soft relative h-full overflow-hidden p-7 md:p-9">
            <GlowSparkle size={72} color="text-blue-500" className="-right-1 -top-4 opacity-90" />
            <GlowSparkle size={22} color="text-purple-400" className="right-16 top-10" />
            <Pill>About</Pill>
            <p data-testid="about-bio" className="mt-6 max-w-2xl text-sm leading-relaxed text-gray-700 sm:text-base md:text-lg">
              {profile.bio}
            </p>
          </div>
        </Reveal>

        <Reveal delay={0.08} className="md:col-span-4">
          <div className="card-soft card-hover flex h-full items-center justify-center p-7">
            <div className={`relative aspect-square w-full max-w-[260px] overflow-hidden rounded-full ${BLUE}`}>
              <img
                data-testid="about-photo"
                src={assetUrl(profile.photo_url)}
                alt={profile.name}
                className="h-full w-full object-cover object-top transition-transform duration-700 hover:scale-105"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.12} className="md:col-span-12">
          <div data-testid="about-name-card" className={`relative overflow-hidden rounded-3xl ${BLUE} p-7 text-white md:p-10`}>
            <div className="pointer-events-none absolute -right-20 -top-24 h-72 w-72 rounded-full bg-white/10" />
            <div className="pointer-events-none absolute -bottom-32 left-1/3 h-80 w-80 rounded-full bg-blue-400/30 blur-2xl" />
            <a
              href={`mailto:${profile.email}`}
              data-testid="about-name-card-cta"
              aria-label="Contact me"
              className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/15 text-white transition-[background-color,transform] duration-300 hover:-translate-y-0.5 hover:bg-white/30 md:right-8 md:top-8"
            >
              <ArrowUpRight size={18} />
            </a>
            <div className="relative flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div className="min-w-0">
                <p className="break-words text-4xl font-black uppercase leading-[0.9] tracking-tight sm:text-6xl lg:text-7xl">{profile.name}</p>
                <p className="mt-4 text-sm text-blue-100 sm:text-base">{profile.role}</p>
              </div>
              <ul className="space-y-2.5 text-sm text-blue-50/90 md:pr-16">
                {profile.email && <li className="flex items-center gap-3"><Mail size={14} className="text-blue-200" />{profile.email}</li>}
                {profile.phone && <li className="flex items-center gap-3"><Phone size={14} className="text-blue-200" />{profile.phone}</li>}
                {profile.location && <li className="flex items-center gap-3"><MapPin size={14} className="text-blue-200" />{profile.location}</li>}
              </ul>
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.05} data-testid="hard-skills-card" className="card-soft card-hover p-7 md:col-span-4">
          <Pill>Hard Skills</Pill>
          <SkillList items={hard} />
        </Reveal>
        <Reveal delay={0.1} data-testid="soft-skills-card" className="card-soft card-hover p-7 md:col-span-4">
          <Pill>Soft Skills</Pill>
          <SkillList items={soft} />
        </Reveal>
        <Reveal delay={0.15} data-testid="tools-card" className="card-soft card-hover relative overflow-hidden p-7 md:col-span-4">
          <GlowSparkle size={40} color="text-purple-400" className="right-4 top-4" />
          <Pill>Tools</Pill>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {tools.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3 py-2.5 text-sm font-medium text-gray-800">
                {t.icon ? (
                  <img src={assetUrl(t.icon)} alt="" className="h-8 w-8 shrink-0 rounded-lg object-contain" />
                ) : (
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gradient-to-br from-brand-blue to-brand-purple text-xs font-black text-white">
                    {t.name[0]}
                  </span>
                )}
                <span className="truncate">{t.name}</span>
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};
