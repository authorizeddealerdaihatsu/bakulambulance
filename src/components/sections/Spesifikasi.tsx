import { useEffect, useState } from "react";
import { Check } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { SectionHeader } from "@/components/SectionHeader";
type Spec = {
  id: string;
  title: string;
  description: string;
  image_url: string;
};

export function Spesifikasi() {
  const [items, setItems] = useState<Spec[]>([]);

  useEffect(() => {
    supabase
      .from("specifications")
      .select("*")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (data) setItems(data as Spec[]);
      });
  }, []);

  return (
    <section id="spesifikasi" className="relative bg-background py-24 md:py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Spesifikasi Ambulance"
          title="Pilih konfigurasi yang sesuai kebutuhan operasional Anda"
          description="Setiap unit dirancang berdasarkan standar medis nasional dan dapat dikustomisasi sesuai permintaan rumah sakit atau instansi."
        />

        <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {items.map((s, i) => {
            let harga = "";
            let features: string[] = [];
            let legacyDescription = s.description;
            let parsedDescription = "";

            if (s.description && s.description.startsWith("{")) {
              try {
                const parsed = JSON.parse(s.description);
                harga = parsed.harga || "";
                features = parsed.features || [];
                parsedDescription = parsed.description || "";
                legacyDescription = "";
              } catch {
                // ignore error, legacy
              }
            }

            const formatRupiah = (value: string) => {
              if (!value) return "";
              const numbers = value.replace(/\D/g, "");
              if (!numbers) return value;
              const formatted = new Intl.NumberFormat("id-ID").format(Number(numbers));
              return `Rp. ${formatted},-`;
            };

            const formattedHarga = formatRupiah(harga) || harga;
            const finalDesc = parsedDescription || legacyDescription;

            return (
              <article
                key={s.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card transition-all hover:-translate-y-1 hover:border-red-accent hover:shadow-elegant"
              >
                <div className="aspect-[4/3] overflow-hidden bg-muted">
                  {s.image_url && (
                    <img
                      src={s.image_url}
                      alt={s.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  )}
                </div>
                <div className="flex flex-1 flex-col p-6 md:p-8">
                  <div className="mb-1">
                    <h4 className="font-bold text-2xl text-foreground mb-1.5 group-hover:text-red-accent transition-colors leading-tight">
                      {s.title}
                    </h4>
                    <p className="text-sm font-medium text-muted-foreground">
                      Ambulance Tipe {String(i + 1).padStart(2, "0")}
                    </p>
                  </div>

                  {formattedHarga && (
                    <div className="mt-3 mb-5">
                      <p className="font-bold text-[19px] text-red-accent">
                        Mulai dari {formattedHarga}
                      </p>
                    </div>
                  )}

                  <hr className="border-border mb-5" />

                  <div className="flex-1 flex flex-col">
                    {finalDesc && (
                      <p className="mb-5 text-sm leading-relaxed text-muted-foreground">
                        {finalDesc}
                      </p>
                    )}

                    {features.length > 0 && (
                      <ul className="space-y-3.5 mb-8 text-sm text-foreground">
                        {features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-3">
                            <div className="mt-0.5 flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-full bg-red-accent/10">
                              <Check className="h-3 w-3 text-red-accent" strokeWidth={3} />
                            </div>
                            <span className="leading-snug text-muted-foreground pt-[1px]">{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <div className="mt-auto pt-2">
                    <a
                      href="#kontak"
                      className="pill-btn w-full justify-center border-[1.5px] border-border bg-transparent text-foreground group-hover:bg-red-accent group-hover:text-white group-hover:border-red-accent hover:!opacity-90 transition-all duration-300"
                    >
                      Minta Penawaran
                    </a>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
