import { useState } from "react";
import { Check, Copy } from "lucide-react";
import { Reveal } from "./Motion";

const isLight = (hex) => {
  const h = hex.replace("#", "");
  if (h.length < 6) return true;
  const r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
  return (r * 299 + g * 587 + b * 114) / 1000 > 160;
};

const Swatch = ({ hex, index }) => {
  const [copied, setCopied] = useState(false);
  const copy = () => {
    navigator.clipboard?.writeText(hex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1200);
  };
  const light = isLight(hex);
  return (
    <Reveal delay={index * 0.06}>
      <button
        onClick={copy}
        data-testid={`palette-swatch-${index}`}
        className="group relative flex aspect-square w-full flex-col justify-end rounded-3xl border border-gray-100 p-4 text-left shadow-soft transition-[transform,box-shadow] duration-300 hover:-translate-y-1.5 hover:shadow-lift"
        style={{ backgroundColor: hex }}
      >
        <span className={`font-mono text-sm font-bold uppercase ${light ? "text-gray-900" : "text-white"}`}>{hex}</span>
        <span className={`absolute right-3 top-3 grid h-8 w-8 place-items-center rounded-full opacity-0 transition-opacity group-hover:opacity-100 ${light ? "bg-black/10 text-gray-900" : "bg-white/20 text-white"}`}>
          {copied ? <Check size={14} /> : <Copy size={14} />}
        </span>
      </button>
    </Reveal>
  );
};

export const ColorPalette = ({ colors }) => (
  <section className="mt-24" data-testid="project-palette">
    <Reveal>
      <p className="eyebrow">Color Palette</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Warna yang membentuk identitas.</h2>
    </Reveal>
    <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
      {colors.map((c, i) => <Swatch key={c + i} hex={c} index={i} />)}
    </div>
  </section>
);

export const TypographyShowcase = ({ items }) => (
  <section className="mt-24" data-testid="project-typography">
    <Reveal>
      <p className="eyebrow">Typography</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Huruf yang berbicara.</h2>
    </Reveal>
    <div className="mt-8 grid gap-6 md:grid-cols-2">
      {items.map((t, i) => (
        <Reveal key={t.name + i} delay={i * 0.08} className="card-soft card-hover flex items-center gap-8 p-8">
          <span className="text-7xl font-black leading-none tracking-tighter text-gray-900" style={{ fontFamily: `'${t.name}', Roboto, sans-serif` }}>Aa</span>
          <div>
            <p className="text-xl font-bold text-gray-900">{t.name}</p>
            {t.usage && <p className="mt-1 text-sm text-gray-500">{t.usage}</p>}
            <p className="mt-3 flex gap-3 text-xs text-gray-400"><span className="font-light">Light</span><span className="font-normal">Regular</span><span className="font-medium">Medium</span><span className="font-bold">Bold</span><span className="font-black">Black</span></p>
          </div>
        </Reveal>
      ))}
    </div>
  </section>
);
