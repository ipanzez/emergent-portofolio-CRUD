import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl, formatApiError } from "@/lib/api";
import { useAdminList } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/Shared";

export default function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data: items = [] } = useAdminList("projects");
  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };

  const toggleFeatured = async (p) => {
    try { await api.put(`/admin/projects/${p.id}`, { ...p, featured: !p.featured }); refresh(); } catch (err) { toast.error(formatApiError(err)); }
  };
  const remove = async (p) => {
    if (!window.confirm(`Hapus project "${p.title}"?`)) return;
    try { await api.delete(`/admin/projects/${p.id}`); toast.success("Deleted"); refresh(); } catch (err) { toast.error(formatApiError(err)); }
  };

  return (
    <div data-testid="projects-admin-page">
      <PageHeader title="Projects" description="Featured project tampil di Selected Projects, sisanya di Other Projects.">
        <Button asChild className="h-10 rounded-xl bg-ink px-5 text-white hover:bg-gray-800">
          <Link to="/admin/projects/new" data-testid="project-add-btn"><Plus size={16} className="mr-1" /> New project</Link>
        </Button>
      </PageHeader>
      <div className="card-soft overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-left text-xs uppercase tracking-wider text-gray-500">
            <tr>
              <th className="px-5 py-3">Project</th>
              <th className="hidden px-5 py-3 md:table-cell">Category</th>
              <th className="px-5 py-3">Featured</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((p, i) => (
              <tr key={p.id} data-testid={`project-row-${i}`} className="hover:bg-gray-50/60">
                <td className="px-5 py-3">
                  <div className="flex items-center gap-3">
                    <img src={assetUrl(p.cover_url)} alt="" className="h-12 w-16 rounded-lg bg-gray-100 object-cover" />
                    <div>
                      <p className="font-bold text-gray-900">{p.title}</p>
                      <p className="text-xs text-gray-400">/{p.slug}</p>
                    </div>
                  </div>
                </td>
                <td className="hidden px-5 py-3 md:table-cell"><span className="rounded-full bg-rose-soft px-2.5 py-1 text-xs font-bold text-rose-deep">{p.category}</span></td>
                <td className="px-5 py-3">
                  <div className="flex items-center gap-2">
                    <Switch data-testid={`project-featured-toggle-${i}`} checked={p.featured} onCheckedChange={() => toggleFeatured(p)} />
                    {p.featured && <Star size={14} className="fill-amber-400 text-amber-400" />}
                  </div>
                </td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-2">
                    <Button asChild variant="outline" size="sm" className="rounded-lg"><Link to={`/admin/projects/${p.id}`} data-testid={`project-edit-${i}`}><Pencil size={14} /></Link></Button>
                    <Button variant="outline" size="sm" data-testid={`project-delete-${i}`} onClick={() => remove(p)} className="rounded-lg text-rose hover:bg-rose-soft"><Trash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={4} className="px-5 py-10 text-center text-gray-400">Belum ada project.</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  );
}
