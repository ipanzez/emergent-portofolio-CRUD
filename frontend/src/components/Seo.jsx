import { useEffect } from "react";
import { assetUrl } from "@/lib/api";

const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
};

export const Seo = ({ title, description, image }) => {
  useEffect(() => {
    if (title) document.title = title;
    setMeta("name", "description", description);
    setMeta("property", "og:title", title);
    setMeta("property", "og:description", description);
    setMeta("property", "og:image", assetUrl(image));
    setMeta("property", "og:type", "website");
    setMeta("name", "twitter:card", "summary_large_image");
  }, [title, description, image]);
  return null;
};
