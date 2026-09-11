import { useEffect, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { api, formatApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Field, PageHeader, Panel } from "@/components/admin/Shared";
import { ImageUpload } from "@/components/admin/ImageUpload";

export const useProfileForm = () => {
  const qc = useQueryClient();
  const { data } = useQuery({ queryKey: ["admin", "profile"], queryFn: () => api.get("/admin/profile").then((r) => r.data) });
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  useEffect(() => { if (data) setForm(data); }, [data]);

  const set = (key) => (e) => setForm((f) => ({ ...f, [key]: e?.target ? e.target.value : e }));
  const save = async (patch = {}) => {
    setSaving(true);
    try {
      const { data: saved } = await api.put("/admin/profile", { ...form, ...patch });
      setForm(saved);
      qc.invalidateQueries({ queryKey: ["portfolio"] });
      qc.invalidateQueries({ queryKey: ["admin"] });
      toast.success("Saved");
    } catch (err) {
      toast.error(formatApiError(err));
    } finally {
      setSaving(false);
    }
  };
  return { form, setForm, set, save, saving };
};

export default function ProfileEditor() {
  const { form, set, save, saving } = useProfileForm();
  if (!form) return null;

  return (
    <form data-testid="profile-editor" onSubmit={(e) => { e.preventDefault(); save(); }}>
      <PageHeader title="Hero & About" description="Teks utama, bio, foto, dan rentang pengalaman.">
        <Button data-testid="profile-save-btn" type="submit" disabled={saving} className="h-10 rounded-xl bg-ink px-6 text-white hover:bg-gray-800">{saving ? "Saving…" : "Save changes"}</Button>
      </PageHeader>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <Panel title="Hero">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="hero-greeting" label="Greeting" value={form.hero_greeting} onChange={set("hero_greeting")} />
              <Field id="hero-title" label="Highlight title" value={form.hero_title} onChange={set("hero_title")} />
              <Field id="hero-subtitle" label="Subtitle" textarea className="sm:col-span-2" value={form.hero_subtitle} onChange={set("hero_subtitle")} />
              <Field id="experience-start" label="Experience start (year)" type="number" value={form.experience_start} onChange={(e) => set("experience_start")(Number(e.target.value))} />
              <Field id="experience-end" label="Experience end" hint="Tahun atau 'Present'" value={form.experience_end} onChange={set("experience_end")} />
            </div>
          </Panel>
          <Panel title="About">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field id="profile-name" label="Name" value={form.name} onChange={set("name")} />
              <Field id="profile-role" label="Role" value={form.role} onChange={set("role")} />
              <Field id="profile-bio" label="Bio" textarea className="sm:col-span-2" value={form.bio} onChange={set("bio")} />
            </div>
          </Panel>
        </div>
        <Panel title="Profile photo">
          <ImageUpload value={form.photo_url} onChange={set("photo_url")} aspect="aspect-[4/5]" label="Upload photo" testId="photo-upload" />
        </Panel>
      </div>
    </form>
  );
}
