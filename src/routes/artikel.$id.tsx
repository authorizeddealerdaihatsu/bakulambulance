import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";

export const Route = createFileRoute("/artikel/$id")({
  head: () => ({
    meta: [
      { title: "Artikel — bakulambulance.com" },
      {
        name: "description",
        content:
          "Baca artikel lengkap seputar industri karoseri ambulance dari bakulambulance.com.",
      },
    ],
  }),
  component: ArticleDetailPage,
});

type Article = {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  thumbnail_url: string;
  created_at: string;
};

function ArticleDetailPage() {
  const { id } = Route.useParams();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    supabase
      .from("articles")
      .select("*")
      .eq("id", id)
      .maybeSingle()
      .then(({ data }) => {
        setArticle((data as Article) || null);
        setLoading(false);
      });
  }, [id]);

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="pt-28 pb-24 md:pt-36 md:pb-32">
        <div className="container-prose max-w-3xl">
          <Link
            to="/artikel"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="h-4 w-4" />
            Kembali ke Artikel
          </Link>

          {loading ? (
            <div className="mt-12 text-sm text-muted-foreground">Memuat artikel...</div>
          ) : !article ? (
            <div className="mt-12 rounded-2xl border border-border bg-card p-10 text-center">
              <h1 className="text-2xl font-bold text-foreground">Artikel tidak ditemukan</h1>
              <p className="mt-2 text-sm text-muted-foreground">
                Artikel yang Anda cari tidak tersedia atau telah dihapus.
              </p>
              <Link
                to="/artikel"
                className="mt-6 inline-flex rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Lihat Semua Artikel
              </Link>
            </div>
          ) : (
            <article className="mt-10">
              <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                {new Date(article.created_at).toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                  timeZone: "UTC",
                })}
              </div>
              <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-foreground md:text-4xl">
                {article.title}
              </h1>
              {article.excerpt && (
                <p className="mt-4 text-lg leading-relaxed text-muted-foreground">
                  {article.excerpt}
                </p>
              )}
              {article.thumbnail_url && (
                <div className="mt-8 aspect-[16/9] overflow-hidden rounded-2xl border border-border bg-muted">
                  <img
                    src={article.thumbnail_url}
                    alt={article.title}
                    className="h-full w-full object-cover"
                  />
                </div>
              )}
              {article.content && (
                <div className="prose prose-neutral mt-10 max-w-none whitespace-pre-wrap text-base leading-relaxed text-foreground">
                  {article.content}
                </div>
              )}
            </article>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
