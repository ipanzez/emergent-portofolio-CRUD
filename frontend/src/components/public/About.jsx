import { Mail, MapPin, Phone } from "lucide-react";
import { Reveal, SectionHeading } from "./Motion";
import { Sparkle } from "./DarkBackdrop";
import { assetUrl, experienceLabel } from "@/lib/api";

const Chip = ({ children, tone = "gray" }) => {
  const tones = {
    gray: "bg-gray-50 text-gray-700 border-gray-100",
    blue: "bg-blue-50 text-blue-700 border-blue-100",
    rose: "bg-rose-soft/60 text-rose-deep border-rose-soft",
  };
  return <span className={`rounded-full border px-3.5 py-1.5 text-sm font-medium ${tones[tone]}`}>{children}</span>;
};

export const About = ({ profile, skills, tools }) => {
  const hard = skills.filter((s) => s.type === "hard");
  const soft = skills.filter((s) => s.type === "soft");
  const years = experienceLabel(profile.experience_start, profile.experience_end).years.split(" ")[0];

  return (
    <section id="about" data-testid="about-section" className="mx-auto max-w-7xl px-6 py-28 lg:px-10 lg:py-36">
      <SectionHeading eyebrow="About Me" title="Desain yang dimulai dari empati, diakhiri dengan kejelasan." />
      <div className="grid grid-cols-1 gap-6 md:grid-cols-12">
        <Reveal className="md:col-span-4">
          <div className="group relative mb-8 mr-4 sm:mr-6">
            <div className="absolute -inset-4 -z-10 rounded-[2.5rem] bg-gradient-to-br from-blue-500/25 via-purple-500/10 to-rose-soft blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-70" />
            <div className="absolute -left-3 -top-3 -z-10 h-full w-full rounded-[2rem] border border-dashed border-gray-300 transition-transform duration-500 group-hover:-translate-x-1 group-hover:-translate-y-1" />
            <div className="card-soft relative overflow-hidden rounded-[2rem] transition-[transform,box-shadow] duration-500 group-hover:-translate-y-1 group-hover:shadow-lift">
              <div className="aspect-[4/5] overflow-hidden">
                <img
                  data-testid="about-photo"
                  src={assetUrl(profile.photo_url)}
                  alt={profile.name}
                  className="h-full w-full object-cover object-top transition-[transform,filter] duration-700 group-hover:scale-105 group-hover:saturate-[1.1]"
                />
              </div>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent p-6 pt-20 text-white">
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white/60">{profile.role}</p>
                <p className="mt-1 text-2xl font-black tracking-tight">{profile.name}</p>
              </div>
              {profile.location && (
                <span className="glass absolute left-4 top-4 inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold text-gray-800">
                  <MapPin size={12} className="text-brand-blue" /> {profile.location}
                </span>
              )}
            </div>
            <div data-testid="about-years-badge" className="absolute -bottom-6 -right-4 flex items-center gap-3 rounded-2xl bg-ink px-5 py-3.5 text-white shadow-lift sm:-right-6">
              <Sparkle size={14} className="text-blue-300" />
              <div>
                <p className="text-2xl font-black leading-none tracking-tight">{years}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-white/60">Years exp</p>
              </div>
            </div>
          </div>
        </Reveal>

        <div className="flex flex-col gap-6 md:col-span-8">
          <Reveal delay={0.1} className="card-soft flex-1 p-8 md:p-10">
            <p className="eyebrow">Bio</p>
            <p data-testid="about-bio" className="mt-4 text-base leading-relaxed text-gray-600 md:text-lg">
              {profile.bio}
            </p>
          </Reveal>
          <Reveal delay={0.18} data-testid="about-name-card" className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-10">
            <div className="absolute -right-10 -top-16 h-56 w-56 rounded-full bg-blue-600/40 blur-[80px]" />
            <div className="absolute -bottom-16 left-1/3 h-48 w-48 rounded-full bg-purple-600/30 blur-[80px]" />
            <div className="relative grid gap-6 sm:grid-cols-2">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-white/40">Name Card</p>
                <h3 className="mt-3 text-2xl font-black tracking-tight">{profile.name}</h3>
                <p className="mt-1 text-sm text-blue-300">{profile.role}</p>
              </div>
              <ul className="space-y-2.5 text-sm text-white/75">
                {profile.email && <li className="flex items-center gap-3"><Mail size={15} className="text-blue-300" />{profile.email}</li>}
                {profile.phone && <li className="flex items-center gap-3"><Phone size={15} className="text-blue-300" />{profile.phone}</li>}
                {profile.location && <li className="flex items-center gap-3"><MapPin size={15} className="text-blue-300" />{profile.location}</li>}
              </ul>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.05} data-testid="hard-skills-card" className="card-soft card-hover p-8 md:col-span-4">
          <p className="eyebrow">Hard Skills</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {hard.map((s) => <Chip key={s.id} tone="blue">{s.name}</Chip>)}
          </div>
        </Reveal>
        <Reveal delay={0.12} data-testid="soft-skills-card" className="card-soft card-hover p-8 md:col-span-4">
          <p className="eyebrow">Soft Skills</p>
          <div className="mt-5 flex flex-wrap gap-2">
            {soft.map((s) => <Chip key={s.id} tone="rose">{s.name}</Chip>)}
          </div>
        </Reveal>
        <Reveal delay={0.19} data-testid="tools-card" className="card-soft card-hover p-8 md:col-span-4">
          <p className="eyebrow">Tools</p>
          <ul className="mt-5 grid grid-cols-2 gap-3">
            {tools.map((t) => (
              <li key={t.id} className="flex items-center gap-3 rounded-2xl bg-gray-50 px-3.5 py-3 text-sm font-medium text-gray-800">
                {t.icon ? (
                  <img src={assetUrl(t.icon)} alt="" className="h-6 w-6 rounded-md object-contain" />
                ) : (
                  <span className="grid h-6 w-6 place-items-center rounded-md bg-gradient-to-br from-brand-blue to-brand-purple text-[10px] font-black text-white">
                    {t.name[0]}
                  </span>
                )}
                {t.name}
              </li>
            ))}
          </ul>
        </Reveal>
      </div>
    </section>
  );
};
