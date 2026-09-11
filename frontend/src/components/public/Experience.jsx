import { Reveal, SectionHeading } from "./Motion";

export const Experience = ({ experiences }) => (
  <section id="experience" data-testid="experience-section" className="bg-white py-20 lg:py-36">
    <div className="mx-auto max-w-7xl px-6 lg:px-10">
      <div className="grid gap-12 lg:grid-cols-12">
        <div className="lg:col-span-4">
          <SectionHeading eyebrow="Experience" title="Perjalanan & kontribusi." description="Setiap peran mengajarkan cara baru mendengar pengguna." />
        </div>
        <ol className="relative lg:col-span-8">
          <span className="absolute left-[7px] top-2 h-[calc(100%-1rem)] w-px bg-gradient-to-b from-brand-blue via-gray-200 to-transparent" />
          {experiences.map((e, i) => (
            <Reveal key={e.id} delay={i * 0.08} data-testid={`experience-item-${i}`} className="relative pb-12 pl-10 last:pb-0">
              <span className="absolute left-0 top-2 h-[15px] w-[15px] rounded-full border-[3px] border-white bg-brand-blue shadow-[0_0_0_3px_#DBEAFE]" />
              <div className="card-soft card-hover p-6 md:p-8">
                <div className="flex flex-wrap items-baseline justify-between gap-2">
                  <h3 className="text-xl font-bold text-gray-900">{e.position}</h3>
                  <span className="rounded-full bg-gray-50 px-3 py-1 text-xs font-bold uppercase tracking-wider text-gray-500">
                    {e.start} — {e.end}
                  </span>
                </div>
                <p className="mt-1 text-sm font-medium text-brand-blue">{e.company}</p>
                {e.description && <p className="mt-4 text-base leading-relaxed text-gray-600">{e.description}</p>}
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </div>
  </section>
);
