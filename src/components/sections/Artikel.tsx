import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";
type Article = {
  id: string;
  title: string;
  excerpt: string;
  thumbnail_url: string;
  created_at: string;
};

export function Artikel() {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(6)
      .then(({ data }) => {
        if (data) setItems(data as Article[]);
      });
  }, []);

  return (
    <section id="artikel" className="relative bg-muted/40 py-24 md:py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Artikel & Berita"
          title="Wawasan industri karoseri ambulance"
          description="Artikel terbaru seputar regulasi, teknologi, dan best practices industri kendaraan medis."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.slice(0, 3).map((a) => (
            <Link
              key={a.id}
              to="/artikel/$id"
              params={{ id: a.id }}
              className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-red-accent hover:shadow-elegant"
            >
              <div className="aspect-[16/10] overflow-hidden bg-muted">
                {a.thumbnail_url && (
                  <img
                    src={a.thumbnail_url}
                    alt={a.title}
                    loading="lazy"
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="flex flex-1 flex-col p-6">
                <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {new Date(a.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    timeZone: "UTC",
                  })}
                </div>
                <h3 className="mt-2 text-lg font-bold leading-snug text-foreground">
                  {a.title}
                </h3>
                <p className="mt-3 line-clamp-3 text-sm text-muted-foreground">
                  {a.excerpt}
                </p>
                <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-red-accent">
                  Baca selengkapnya
                  <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/artikel"
            className="pill-btn pill-btn-outline"
          >
            Lihat Semua Artikel
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
