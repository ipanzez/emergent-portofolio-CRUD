import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { Reorder, useDragControls } from "framer-motion";
import { GripVertical, Pencil, Plus, Star, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { api, assetUrl, formatApiError } from "@/lib/api";
import { useAdminList } from "@/hooks/usePortfolio";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { PageHeader } from "@/components/admin/Shared";

const ProjectRow = ({ p, i, onToggle, onDelete, onDrop }) => {
  const controls = useDragControls();
  return (
    <Reorder.Item
      value={p}
      dragListener={false}
      dragControls={controls}
      onDragEnd={onDrop}
      data-testid={`project-row-${i}`}
      whileDrag={{ scale: 1.01, boxShadow: "0 24px 48px rgb(0 0 0 / 0.14)" }}
      className="card-soft flex select-none flex-wrap items-center gap-4 p-4"
    >
      <button type="button" aria-label="Drag to reorder" data-testid={`project-drag-${i}`} onPointerDown={(e) => controls.start(e)} className="cursor-grab touch-none rounded p-1 text-gray-400 hover:text-gray-700 active:cursor-grabbing">
        <GripVertical size={16} />
      </button>
      {p.cover_url ? (
        <img src={assetUrl(p.cover_url)} alt="" className="h-14 w-20 rounded-xl bg-gray-100 object-cover" />
      ) : (
        <div className="grid h-14 w-20 place-items-center rounded-xl bg-gray-100 text-[10px] font-bold uppercase text-gray-400">No cover</div>
      )}
      <div className="min-w-0 flex-1">
        <p className="truncate font-bold text-gray-900">{p.title}</p>
        <p className="truncate text-xs text-gray-400">/{p.slug}</p>
      </div>
      <span className="hidden rounded-full bg-rose-soft px-2.5 py-1 text-xs font-bold text-rose-deep md:inline">{p.category}</span>
      <div className="flex items-center gap-2">
        <Switch data-testid={`project-featured-toggle-${i}`} checked={p.featured} onCheckedChange={onToggle} />
        <Star size={14} className={p.featured ? "fill-amber-400 text-amber-400" : "text-gray-200"} />
      </div>
      <div className="flex gap-2">
        <Button asChild variant="outline" size="sm" className="rounded-lg"><Link to={`/admin/projects/${p.id}`} data-testid={`project-edit-${i}`}><Pencil size={14} /></Link></Button>
        <Button variant="outline" size="sm" data-testid={`project-delete-${i}`} onClick={onDelete} className="rounded-lg text-rose hover:bg-rose-soft"><Trash2 size={14} /></Button>
      </div>
    </Reorder.Item>
  );
};

export default function ProjectsAdmin() {
  const qc = useQueryClient();
  const { data } = useAdminList("projects");
  const [items, setItems] = useState([]);
  const latest = useRef([]);

  useEffect(() => { if (data) { setItems(data); latest.current = data; } }, [data]);

  const refresh = () => {
    qc.invalidateQueries({ queryKey: ["admin", "projects"] });
    qc.invalidateQueries({ queryKey: ["portfolio"] });
  };
  const run = async (fn, ok) => {
    try { await fn(); if (ok) toast.success(ok); refresh(); } catch (err) { toast.error(formatApiError(err)); }
  };
  const toggleFeatured = (p) => run(() => api.put(`/admin/projects/${p.id}`, { ...p, featured: !p.featured }));
  const remove = (p) => {
    if (!window.confirm(`Hapus project "${p.title}"?`)) return;
    run(() => api.delete(`/admin/projects/${p.id}`), "Deleted");
  };
  const onReorder = (next) => { setItems(next); latest.current = next; };
  const persist = () => run(() => api.put("/admin/projects/reorder", { ids: latest.current.map((p) => p.id) }));

  return (
    <div data-testid="projects-admin-page">
      <PageHeader title="Projects" description="Tarik ikon ⋮⋮ untuk mengurutkan. Featured tampil di Selected Projects, sisanya di Other Projects.">
        <Button asChild className="h-10 rounded-xl bg-ink px-5 text-white hover:bg-gray-800">
          <Link to="/admin/projects/new" data-testid="project-add-btn"><Plus size={16} className="mr-1" /> New project</Link>
        </Button>
      </PageHeader>
      <Reorder.Group axis="y" values={items} onReorder={onReorder} className="space-y-3" data-testid="projects-list">
        {items.map((p, i) => (
          <ProjectRow key={p.id} p={p} i={i} onToggle={() => toggleFeatured(p)} onDelete={() => remove(p)} onDrop={persist} />
        ))}
      </Reorder.Group>
      {items.length === 0 && <p className="py-10 text-center text-sm text-gray-400">Belum ada project.</p>}
    </div>
  );
}
