import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";

export const usePortfolio = () =>
  useQuery({ queryKey: ["portfolio"], queryFn: () => api.get("/public/portfolio").then((r) => r.data) });

export const useProject = (slug) =>
  useQuery({
    queryKey: ["project", slug],
    queryFn: () => api.get(`/public/projects/${slug}`).then((r) => r.data),
    enabled: Boolean(slug),
    retry: false,
  });

export const useAdminList = (name) =>
  useQuery({ queryKey: ["admin", name], queryFn: () => api.get(`/admin/${name}`).then((r) => r.data) });
