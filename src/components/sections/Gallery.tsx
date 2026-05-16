import { useEffect, useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";
type Item = { id: string; title: string; image_url: string };

export function Gallery() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    supabase
      .from("galleries")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data }) => {
        if (data) setItems(data as Item[]);
      });
  }, []);

  return (
    <section id="gallery" className="relative bg-muted/40 py-24 md:py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Galeri Proyek"
          title="Karya kami berbicara dengan presisi"
          description="Beberapa proyek karoseri ambulance yang telah kami selesaikan untuk klien di berbagai kota di Indonesia."
        />

        <div className="mt-14 grid auto-rows-[200px] grid-cols-2 gap-4 md:auto-rows-[260px] md:grid-cols-4">
          {items.slice(0, 6).map((item, i) => (
            <figure
              key={item.id}
              className={`group relative overflow-hidden rounded-xl border border-border bg-card shadow-card ${
                i === 0 ? "md:col-span-2 md:row-span-2" : ""
              } ${i === 3 ? "md:col-span-2" : ""}`}
            >
              <img
                src={item.image_url}
                alt={item.title}
                loading="lazy"
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <figcaption className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-[oklch(0.10_0.03_260_/_0.85)] to-transparent p-4">
                <div className="text-sm font-semibold text-primary-foreground">
                  {item.title}
                </div>
              </figcaption>
            </figure>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            to="/galeri"
            className="pill-btn pill-btn-outline"
          >
            Lihat Semua Galeri
            <ArrowUpRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
