import { useEffect, useState } from "react";
import { ArrowLeft, ArrowRight, Check, Copy } from "lucide-react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { assetUrl } from "@/lib/api";
import { Reveal } from "./Motion";

export const GallerySlider = ({ images, title }) => {
  const [api, setApi] = useState(null);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;
    const onSelect = () => setCurrent(api.selectedScrollSnap());
    onSelect();
    api.on("select", onSelect);
    return () => api.off("select", onSelect);
  }, [api]);

  return (
    <section className="mt-24" data-testid="project-gallery">
      <Reveal className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Gallery</p>
          <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Geser untuk melihat layar.</h2>
        </div>
        <div className="flex items-center gap-3">
          <span data-testid="gallery-counter" className="font-mono text-sm text-gray-500">{String(current + 1).padStart(2, "0")} / {String(images.length).padStart(2, "0")}</span>
          <button type="button" data-testid="gallery-prev-btn" onClick={() => api?.scrollPrev()} aria-label="Previous" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-700 transition-[background-color,color] hover:bg-ink hover:text-white"><ArrowLeft size={16} /></button>
          <button type="button" data-testid="gallery-next-btn" onClick={() => api?.scrollNext()} aria-label="Next" className="grid h-10 w-10 place-items-center rounded-full border border-gray-200 text-gray-700 transition-[background-color,color] hover:bg-ink hover:text-white"><ArrowRight size={16} /></button>
        </div>
      </Reveal>
      <Reveal delay={0.1} className="mt-8">
        <Carousel setApi={setApi} opts={{ loop: images.length > 1, align: "start" }} className="w-full">
          <CarouselContent className="-ml-4">
            {images.map((g, i) => (
              <CarouselItem key={g + i} className="basis-[88%] pl-4 md:basis-[70%]">
                <div className={`card-soft overflow-hidden transition-[opacity,transform] duration-500 ${i === current ? "opacity-100" : "opacity-60 md:scale-[0.97]"}`}>
                  <img src={assetUrl(g)} alt={`${title} screenshot ${i + 1}`} loading="lazy" draggable={false} className="aspect-[16/10] w-full select-none object-cover" />
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
        </Carousel>
        <div className="mt-6 flex justify-center gap-2">
          {images.map((_, i) => (
            <button key={i} type="button" data-testid={`gallery-dot-${i}`} aria-label={`Go to slide ${i + 1}`} onClick={() => api?.scrollTo(i)} className={`h-1.5 rounded-full transition-[width,background-color] duration-300 ${i === current ? "w-8 bg-rose" : "w-2 bg-gray-300 hover:bg-gray-400"}`} />
          ))}
        </div>
      </Reveal>
    </section>
  );
};

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

export const CaseStudy = ({ project }) => {
  const hasBrief = project.problem || project.goal;
  const hasProcess = project.process?.length > 0;
  const hasKpis = project.kpis?.length > 0;
  if (!hasBrief && !hasProcess && !hasKpis) return null;
  return (
    <section className="mt-24" data-testid="project-case-study">
      {hasBrief && (
        <div className="grid gap-6 md:grid-cols-2">
          {project.problem && (
            <Reveal data-testid="project-problem" className="card-soft card-hover relative overflow-hidden p-8 md:p-10">
              <span className="absolute -right-6 -top-8 text-[120px] font-black leading-none text-rose-soft/70 select-none">?</span>
              <p className="eyebrow text-rose-deep">Problem</p>
              <p className="relative mt-4 text-base leading-relaxed text-gray-700 md:text-lg">{project.problem}</p>
            </Reveal>
          )}
          {project.goal && (
            <Reveal delay={0.1} data-testid="project-goal" className="relative overflow-hidden rounded-3xl bg-ink p-8 text-white md:p-10">
              <div className="absolute -right-10 -top-16 h-48 w-48 rounded-full bg-blue-600/40 blur-[70px]" />
              <p className="eyebrow text-blue-300">Goal</p>
              <p className="relative mt-4 text-base leading-relaxed text-white/80 md:text-lg">{project.goal}</p>
            </Reveal>
          )}
        </div>
      )}
      {hasProcess && (
        <div className="mt-20" data-testid="project-process">
          <Reveal>
            <p className="eyebrow">Process</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Cara saya sampai ke solusi.</h2>
          </Reveal>
          <ol className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {project.process.map((s, i) => (
              <Reveal key={s.title + i} delay={i * 0.08} className="card-soft card-hover relative p-6">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-gradient-to-br from-brand-blue to-brand-purple text-sm font-black text-white">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-5 text-lg font-bold text-gray-900">{s.title}</h3>
                {s.description && <p className="mt-2 text-sm leading-relaxed text-gray-600">{s.description}</p>}
                {i < project.process.length - 1 && <span className="absolute -right-2 top-1/2 hidden h-px w-4 bg-gray-200 lg:block" />}
              </Reveal>
            ))}
          </ol>
        </div>
      )}
      {hasKpis && (
        <div className="mt-20" data-testid="project-kpis">
          <Reveal>
            <p className="eyebrow">Impact</p>
            <h2 className="mt-3 text-2xl font-bold tracking-tight text-gray-900">Angka yang berbicara.</h2>
          </Reveal>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            {project.kpis.map((k, i) => (
              <Reveal key={k.label + i} delay={i * 0.08} className="card-soft card-hover border-t-4 border-t-rose p-6">
                <p className="text-3xl font-black tracking-tight text-gray-900 sm:text-4xl">{k.value}</p>
                <p className="mt-2 text-xs font-bold uppercase tracking-[0.15em] text-gray-500">{k.label}</p>
              </Reveal>
            ))}
          </div>
        </div>
      )}
    </section>
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
