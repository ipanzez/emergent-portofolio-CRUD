import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { usePortfolio, useProject } from "@/hooks/usePortfolio";
import { assetUrl } from "@/lib/api";
import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/public/Navbar";
import { PageTransition, Reveal } from "@/components/public/Motion";
import { ProjectCard } from "@/components/public/Projects";
import { PublicLoader } from "@/components/public/PublicLoader";
import { ColorPalette, TypographyShowcase } from "@/components/public/ProjectSpecs";

const Meta = ({ label, children, testId }) => (
  <div data-testid={testId}>
    <p className="eyebrow">{label}</p>
    <div className="mt-2 text-base text-gray-800">{children}</div>
  </div>
);

export default function ProjectDetail() {
  const { slug } = useParams();
  const { data: project, isLoading, isError } = useProject(slug);
  const { data: portfolio } = usePortfolio();

  useEffect(() => { window.scrollTo({ top: 0 }); }, [slug]);

  if (isLoading) return <PublicLoader />;
  if (isError || !project) {
    return (
      <div className="grid min-h-screen place-items-center px-6 text-center" data-testid="project-not-found">
        <div>
          <p className="eyebrow">404</p>
          <h1 className="mt-3 text-3xl font-bold text-gray-900">Project tidak ditemukan.</h1>
          <Link to="/" className="mt-6 inline-flex items-center gap-2 text-brand-blue hover:underline"><ArrowLeft size={16} /> Kembali ke beranda</Link>
        </div>
      </div>
    );
  }

  const profile = portfolio?.profile;
  const related = (portfolio?.projects || []).filter((p) => p.slug !== project.slug).slice(0, 3);

  return (
    <PageTransition>
      <Seo title={`${project.title} — ${profile?.name || "Portfolio"}`} description={project.overview} image={project.cover_url} />
      <Navbar name={profile?.name || "Portfolio"} />
      <article data-testid="project-detail" className="mx-auto max-w-7xl px-6 pb-28 pt-28 lg:px-10">
        <Reveal>
          <Link to="/#projects" data-testid="project-back-link" className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition-colors hover:text-gray-900">
            <ArrowLeft size={16} /> All projects
          </Link>
          <div className="mt-8 flex flex-wrap items-end justify-between gap-6">
            <div className="max-w-3xl">
              <span className="rounded-full bg-rose-soft px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-deep">{project.category}</span>
              <h1 data-testid="project-title" className="mt-5 text-4xl font-black tracking-tighter text-gray-900 sm:text-5xl lg:text-6xl">{project.title}</h1>
            </div>
            {project.link && (
              <a data-testid="project-external-link" href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-full bg-rose px-6 py-3 text-sm font-bold text-white transition-[transform,background-color] duration-300 hover:-translate-y-0.5 hover:bg-rose-deep">
                View Live <ArrowUpRight size={16} />
              </a>
            )}
          </div>
        </Reveal>

        <Reveal delay={0.1} className="card-soft mt-12 overflow-hidden">
          <img data-testid="project-cover" src={assetUrl(project.cover_url)} alt={project.title} className="aspect-[16/8] w-full object-cover" />
        </Reveal>

        <div className="mt-16 grid gap-12 lg:grid-cols-12">
          <Reveal className="lg:col-span-7">
            <p className="eyebrow">Overview</p>
            <p data-testid="project-overview" className="mt-4 text-lg leading-relaxed text-gray-700">{project.overview}</p>
            {project.outcome && (
              <div data-testid="project-outcome" className="mt-10 rounded-3xl border-l-4 border-rose bg-rose-soft/40 p-6">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-rose-deep">Outcome</p>
                <p className="mt-2 text-base leading-relaxed text-gray-800">{project.outcome}</p>
              </div>
            )}
          </Reveal>
          <Reveal delay={0.1} className="card-soft h-fit space-y-8 p-8 lg:col-span-5">
            {project.role && <Meta label="Role" testId="project-role">{project.role}</Meta>}
            {project.year && <Meta label="Year">{project.year}</Meta>}
            {project.tools?.length > 0 && (
              <Meta label="Tools" testId="project-tools">
                <div className="flex flex-wrap gap-2">
                  {project.tools.map((t) => <span key={t} className="rounded-full bg-gray-50 px-3 py-1 text-sm font-medium text-gray-700">{t}</span>)}
                </div>
              </Meta>
            )}
          </Reveal>
        </div>

        {project.color_palette?.length > 0 && <ColorPalette colors={project.color_palette} />}
        {project.typography?.length > 0 && <TypographyShowcase items={project.typography} />}

        {project.gallery?.length > 0 && (
          <section className="mt-24" data-testid="project-gallery">
            <Reveal><p className="eyebrow">Gallery</p></Reveal>
            <div className="mt-6 grid gap-6 md:grid-cols-2">
              {project.gallery.map((g, i) => (
                <Reveal key={g + i} delay={(i % 2) * 0.1} className={`card-soft overflow-hidden ${i % 3 === 0 ? "md:col-span-2" : ""}`}>
                  <img src={assetUrl(g)} alt={`${project.title} screenshot ${i + 1}`} loading="lazy" className="w-full object-cover transition-transform duration-700 hover:scale-[1.02]" />
                </Reveal>
              ))}
            </div>
          </section>
        )}

        {related.length > 0 && (
          <section className="mt-28" data-testid="related-projects">
            <Reveal className="flex items-end justify-between">
              <div>
                <p className="eyebrow">More Work</p>
                <h2 className="mt-3 text-3xl font-bold tracking-tight text-gray-900">Proyek lainnya</h2>
              </div>
            </Reveal>
            <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p, i) => <ProjectCard key={p.id} project={p} compact index={i} />)}
            </div>
          </section>
        )}
      </article>
    </PageTransition>
  );
}
