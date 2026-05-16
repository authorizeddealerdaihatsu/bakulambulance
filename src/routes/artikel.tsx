import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { SectionHeader } from "@/components/SectionHeader";
export const Route = createFileRoute("/artikel")({
  head: () => ({
    meta: [
      { title: "Artikel & Berita — bakulambulance.com" },
      {
        name: "description",
        content:
          "Wawasan industri karoseri ambulance: regulasi SNI, teknologi, dan best practices untuk pengadaan kendaraan medis.",
      },
      { property: "og:title", content: "Artikel & Berita — bakulambulance.com" },
      {
        property: "og:description",
        content:
          "Baca artikel terbaru seputar regulasi, teknologi, dan praktik terbaik industri karoseri ambulance.",
      },
    ],
  }),
  component: ArtikelPage,
});

type Article = {
  id: string;
  title: string;
  excerpt: string;
  thumbnail_url: string;
  created_at: string;
};

function ArtikelPage() {
  const [items, setItems] = useState<Article[]>([]);

  useEffect(() => {
    supabase
      .from("articles")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as Article[]);
      });
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="container-prose">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Beranda
          </Link>

          <div className="mt-8">
            <SectionHeader
              eyebrow="Artikel & Berita"
              title="Semua wawasan industri kami"
              description="Kumpulan artikel seputar regulasi, teknologi, dan praktik terbaik industri karoseri ambulance."
            />
          </div>

          <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {items.map((a) => (
              <Link
                key={a.id}
                to="/artikel/$id"
                params={{ id: a.id }}
                className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:shadow-elegant"
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
                  <div className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                    Baca selengkapnya
                    <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
