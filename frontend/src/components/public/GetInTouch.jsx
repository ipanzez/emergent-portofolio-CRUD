import { Download, Link as LinkIcon, Mail, MapPin, Phone } from "lucide-react";
import { GlowSparkle, LightBackdrop } from "./DarkBackdrop";
import { Reveal } from "./Motion";
import { assetUrl } from "@/lib/api";

const Chip = ({ href, icon: Icon, children, testId, dark = false, external = false }) => (
  <a
    href={href}
    data-testid={testId}
    {...(external ? { target: "_blank", rel: "noreferrer" } : {})}
    className={`inline-flex max-w-full items-center gap-2 rounded-full px-4 py-2 text-sm transition-[transform,box-shadow,background-color] duration-300 hover:-translate-y-0.5 ${
      dark ? "bg-gray-900 font-bold text-white hover:bg-gray-700" : "bg-white text-gray-700 shadow-soft ring-1 ring-gray-100 hover:ring-blue-300"
    }`}
  >
    <Icon size={14} className={dark ? "text-white" : "text-blue-600"} />
    <span className="truncate">{children}</span>
  </a>
);

export const GetInTouch = ({ profile }) => (
  <section id="contact" data-testid="contact-section" className="relative overflow-hidden text-gray-900">
    <LightBackdrop />
    <div className="relative mx-auto max-w-5xl px-6 pb-10 pt-24 lg:pt-36">
      <Reveal className="relative">
        <GlowSparkle size={44} color="text-purple-500" className="right-0 -top-6 sm:right-6 sm:-top-8" />
        <GlowSparkle size={18} color="text-purple-400" className="right-12 top-8 sm:right-20" />
        <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
          <span className="text-gray-400">/</span>Thank You!<span className="h-px w-7 bg-gray-800" />
        </p>
        <h2 className="mt-3 max-w-3xl bg-gradient-to-r from-blue-600 via-indigo-500 to-purple-500 bg-clip-text pb-2 text-3xl font-black leading-[1.05] tracking-tight text-transparent sm:text-5xl lg:text-6xl">
          Let&apos;s Create Something Amazing Together!
        </h2>
        <p className="mt-5 max-w-2xl text-sm leading-relaxed text-gray-600 sm:text-base">
          If my vision and approach align with the product challenges you are facing, let&apos;s discuss how my experience can have a real impact on your company&apos;s business goals.
        </p>
      </Reveal>

      <Reveal delay={0.1} className="mt-10">
        <p className="text-sm font-bold text-gray-900">Let&apos;s Connect</p>
        <div className="mt-4 flex flex-wrap gap-3">
          {profile.email && <Chip href={`mailto:${profile.email}`} icon={Mail} testId="contact-email-cta">{profile.email}</Chip>}
          {profile.social_links?.map((s) => (
            <Chip key={s.label} href={s.url} icon={LinkIcon} external testId={`social-link-${s.label.toLowerCase()}`}>{s.label}</Chip>
          ))}
          {profile.phone && <Chip href={`tel:${profile.phone.replace(/\s+/g, "")}`} icon={Phone} testId="contact-phone">{profile.phone}</Chip>}
          {profile.location && <Chip href="#contact" icon={MapPin} testId="contact-location">{profile.location}</Chip>}
          {profile.cv_url && <Chip href={assetUrl(profile.cv_url)} icon={Download} external dark testId="contact-download-cv-btn">Download CV</Chip>}
        </div>
      </Reveal>

      <footer className="mt-24 flex flex-col gap-2 border-t border-gray-200 pt-6 text-xs text-gray-400 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span>Designed &amp; built with care.</span>
      </footer>
    </div>
  </section>
);
