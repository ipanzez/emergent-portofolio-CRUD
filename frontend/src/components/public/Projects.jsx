import { Link } from "react-router-dom";
import { ArrowUpRight } from "lucide-react";
import { Reveal, SectionHeading } from "./Motion";
import { assetUrl } from "@/lib/api";

export const ProjectCard = ({ project, compact = false, index = 0 }) => (
  <Reveal delay={(index % 3) * 0.08}>
    <Link
      to={`/projects/${project.slug}`}
      data-testid={`project-card-${project.slug}`}
      className="card-soft card-hover group block overflow-hidden"
    >
      <div className={`relative overflow-hidden ${compact ? "aspect-[4/3]" : "aspect-[16/11]"}`}>
        <img
          src={assetUrl(project.cover_url)}
          alt={project.title}
          className="h-full w-full object-cover transition-[transform,filter] duration-700 ease-out group-hover:scale-[1.04] group-hover:saturate-[1.15]"
          loading="lazy"
        />
        <span className="absolute left-4 top-4 rounded-full bg-rose-soft/95 px-3 py-1 text-xs font-bold uppercase tracking-wider text-rose-deep backdrop-blur">
          {project.category}
        </span>
      </div>
      <div className={`flex items-start justify-between gap-4 ${compact ? "p-5" : "p-7"}`}>
        <div>
          <h3 className={`font-bold text-gray-900 ${compact ? "text-lg" : "text-xl md:text-2xl"}`}>{project.title}</h3>
          {!compact && project.tools?.length > 0 && (
            <p className="mt-2 text-sm text-gray-500">{project.tools.join(" · ")}{project.year ? ` · ${project.year}` : ""}</p>
          )}
        </div>
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full border border-gray-200 text-gray-600 transition-[background-color,color,transform] duration-300 group-hover:bg-rose group-hover:text-white group-hover:rotate-45 group-hover:border-rose">
          <ArrowUpRight size={18} />
        </span>
      </div>
    </Link>
  </Reveal>
);

export const Projects = ({ projects }) => {
  const featured = projects.filter((p) => p.featured);
  const others = projects.filter((p) => !p.featured);
  return (
    <>
      <section id="projects" data-testid="projects-section" className="mx-auto max-w-7xl px-6 py-20 lg:px-10 lg:py-36">
        <SectionHeading eyebrow="Selected Projects" title="Karya pilihan yang paling saya banggakan." description="Studi kasus ringkas: konteks, peran, palet warna, dan hasil." />
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
          {featured.map((p, i) => <ProjectCard key={p.id} project={p} index={i} />)}
        </div>
      </section>
      {others.length > 0 && (
        <section id="other-projects" data-testid="other-projects-section" className="bg-white py-20 lg:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-10">
            <SectionHeading eyebrow="Other Projects" title="Eksplorasi & proyek lainnya." />
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {others.map((p, i) => <ProjectCard key={p.id} project={p} compact index={i} />)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};
