import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { ArrowUpRight, Briefcase, FileText, FolderKanban, Sparkles, Star } from "lucide-react";
import { api } from "@/lib/api";
import { PageHeader, Panel } from "@/components/admin/Shared";

const Stat = ({ icon: Icon, label, value, to, testId }) => (
  <Link to={to} data-testid={testId} className="card-soft card-hover flex items-center justify-between p-6">
    <div>
      <p className="eyebrow">{label}</p>
      <p className="mt-2 text-3xl font-black tracking-tight text-gray-900">{value}</p>
    </div>
    <span className="grid h-11 w-11 place-items-center rounded-2xl bg-blue-50 text-brand-blue"><Icon size={20} /></span>
  </Link>
);

export default function Dashboard() {
  const { data } = useQuery({ queryKey: ["admin", "dashboard"], queryFn: () => api.get("/admin/dashboard").then((r) => r.data) });
  const d = data || {};
  const todo = [
    !d.has_photo && { label: "Upload foto profil", to: "/admin/profile" },
    !d.has_cv && { label: "Upload CV (PDF)", to: "/admin/settings" },
    d.projects === 0 && { label: "Tambah project pertama", to: "/admin/projects/new" },
  ].filter(Boolean);

  return (
    <div data-testid="admin-dashboard">
      <PageHeader title={`Halo, ${d.profile_name || "Admin"}`} description="Ringkasan konten portfolio kamu." />
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <Stat icon={FolderKanban} label="Projects" value={d.projects ?? "—"} to="/admin/projects" testId="stat-projects" />
        <Stat icon={Star} label="Featured" value={d.featured ?? "—"} to="/admin/projects" testId="stat-featured" />
        <Stat icon={Briefcase} label="Experiences" value={d.experiences ?? "—"} to="/admin/experience" testId="stat-experiences" />
        <Stat icon={Sparkles} label="Skills" value={d.skills ?? "—"} to="/admin/skills" testId="stat-skills" />
        <Stat icon={Sparkles} label="Tools" value={d.tools ?? "—"} to="/admin/skills" testId="stat-tools" />
        <Stat icon={FileText} label="CV" value={d.has_cv ? "Ready" : "Missing"} to="/admin/settings" testId="stat-cv" />
      </div>
      {todo.length > 0 && (
        <Panel title="Yang perlu dilengkapi" className="mt-8">
          <ul className="space-y-2">
            {todo.map((t) => (
              <li key={t.label}>
                <Link to={t.to} className="flex items-center justify-between rounded-xl bg-gray-50 px-4 py-3 text-sm font-medium text-gray-800 hover:bg-gray-100">
                  {t.label} <ArrowUpRight size={16} />
                </Link>
              </li>
            ))}
          </ul>
        </Panel>
      )}
    </div>
  );
}
