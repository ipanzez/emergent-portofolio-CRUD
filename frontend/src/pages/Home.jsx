import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { usePortfolio } from "@/hooks/usePortfolio";
import { Seo } from "@/components/Seo";
import { Navbar } from "@/components/public/Navbar";
import { Hero } from "@/components/public/Hero";
import { About } from "@/components/public/About";
import { Experience } from "@/components/public/Experience";
import { Projects } from "@/components/public/Projects";
import { GetInTouch } from "@/components/public/GetInTouch";
import { PageTransition } from "@/components/public/Motion";
import { PublicLoader } from "@/components/public/PublicLoader";

export default function Home() {
  const { data, isLoading, isError } = usePortfolio();
  const { hash } = useLocation();

  useEffect(() => {
    if (!data || !hash) return;
    const t = setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: "smooth" }), 150);
    return () => clearTimeout(t);
  }, [data, hash]);

  if (isLoading) return <PublicLoader />;
  if (isError || !data) return <PublicLoader error />;

  const { profile, skills, tools, experiences, projects } = data;
  return (
    <PageTransition>
      <Seo title={profile.seo?.title || `${profile.name} — ${profile.role}`} description={profile.seo?.description} image={profile.seo?.og_image} />
      <Navbar name={profile.name} />
      <Hero profile={profile} />
      <About profile={profile} skills={skills} tools={tools} />
      <Experience experiences={experiences} />
      <Projects projects={projects} />
      <GetInTouch profile={profile} />
    </PageTransition>
  );
}
