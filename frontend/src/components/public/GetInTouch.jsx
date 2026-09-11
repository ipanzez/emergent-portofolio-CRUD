import { ArrowUpRight, Download, Mail, MapPin, Phone } from "lucide-react";
import { DarkBackdrop } from "./DarkBackdrop";
import { Reveal } from "./Motion";
import { assetUrl } from "@/lib/api";

export const GetInTouch = ({ profile }) => (
  <section id="contact" data-testid="contact-section" className="relative overflow-hidden text-white">
    <DarkBackdrop />
    <div className="relative mx-auto max-w-7xl px-6 pb-12 pt-28 lg:px-10 lg:pt-40">
      <Reveal>
        <p className="eyebrow text-white/50">Get In Touch</p>
        <h2 className="mt-4 max-w-4xl text-4xl font-black leading-[0.95] tracking-tighter sm:text-5xl lg:text-7xl">
          Let&apos;s create something <span className="gradient-text inline-block">remarkable</span> together.
        </h2>
      </Reveal>
      <div className="mt-16 grid gap-10 lg:grid-cols-12">
        <Reveal delay={0.1} className="lg:col-span-7">
          <a
            data-testid="contact-email-cta"
            href={`mailto:${profile.email}`}
            className="group inline-flex flex-wrap items-center gap-3 text-2xl font-bold tracking-tight text-white sm:text-3xl md:text-4xl"
          >
            <span className="border-b border-white/20 pb-1 transition-colors group-hover:border-blue-400">{profile.email}</span>
            <ArrowUpRight className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
          </a>
          <div className="mt-10 flex flex-wrap gap-3">
            <a data-testid="contact-mail-btn" href={`mailto:${profile.email}`} className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-bold text-gray-900 transition-transform duration-300 hover:-translate-y-0.5">
              <Mail size={16} /> Say Hello
            </a>
            {profile.cv_url && (
              <a data-testid="contact-download-cv-btn" href={assetUrl(profile.cv_url)} target="_blank" rel="noreferrer" className="dark-glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-white/85 transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-white/10">
                <Download size={16} /> Download CV
              </a>
            )}
          </div>
        </Reveal>
        <Reveal delay={0.2} className="dark-glass rounded-3xl p-8 lg:col-span-5">
          <ul className="space-y-4 text-sm text-white/75">
            {profile.phone && <li className="flex items-center gap-3"><Phone size={15} className="text-blue-300" /><span data-testid="contact-phone">{profile.phone}</span></li>}
            {profile.location && <li className="flex items-center gap-3"><MapPin size={15} className="text-blue-300" /><span data-testid="contact-location">{profile.location}</span></li>}
          </ul>
          {profile.social_links?.length > 0 && (
            <div className="mt-8 border-t border-white/10 pt-6">
              <p className="text-xs uppercase tracking-[0.25em] text-white/40">Social</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {profile.social_links.map((s) => (
                  <a key={s.label} data-testid={`social-link-${s.label.toLowerCase()}`} href={s.url} target="_blank" rel="noreferrer" className="rounded-full border border-white/15 px-4 py-2 text-sm text-white/80 transition-[background-color,border-color] hover:border-blue-400/60 hover:bg-white/5">
                    {s.label}
                  </a>
                ))}
              </div>
            </div>
          )}
        </Reveal>
      </div>
      <footer className="mt-24 flex flex-col gap-3 border-t border-white/10 pt-8 text-xs text-white/40 sm:flex-row sm:items-center sm:justify-between">
        <span>© {new Date().getFullYear()} {profile.name}. All rights reserved.</span>
        <span>Designed & built with care.</span>
      </footer>
    </div>
  </section>
);
