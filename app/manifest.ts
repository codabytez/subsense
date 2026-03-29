import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "Subsense",
    short_name: "Subsense",
    description: "Subscription management, simplified.",
    start_url: "/dashboard",
    display: "standalone",
    background_color: "#0e0e13",
    theme_color: "#7c5cfc",
    orientation: "portrait-primary",
    categories: ["productivity", "finance"],
    lang: "en",
    dir: "ltr",
    icons: [
      {
        src: "/favicon/favicon-96x96.png",
        sizes: "96x96",
        type: "image/png",
      },
      {
        src: "/favicon/icon-192.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "/favicon/icon-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
