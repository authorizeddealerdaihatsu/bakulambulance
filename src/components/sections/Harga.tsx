import { Check, Crown } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";

const tiers = [
  {
    name: "Tipe Standar",
    price: "Rp 145 Jt",
    description: "Karoseri ambulance transport sesuai standar SNI.",
    features: [
      "Stretcher heavy-duty",
      "Tabung oksigen portable",
      "Lampu rotator & sirine",
      "Interior fiberglass",
      "Garansi 1 tahun",
    ],
    highlighted: false,
  },
  {
    name: "Tipe Deluxe",
    price: "Rp 235 Jt",
    description: "Konfigurasi favorit rumah sakit & instansi.",
    features: [
      "Sistem oksigen terintegrasi",
      "AC double blower",
      "Lampu LED panel medis",
      "Suspensi diperkuat",
      "Lemari obat & alat",
      "Garansi 2 tahun",
    ],
    highlighted: true,
  },
  {
    name: "Tipe VIP",
    price: "Custom",
    description: "Modifikasi premium sesuai kebutuhan khusus.",
    features: [
      "Finishing kulit premium",
      "Peredam suara penuh",
      "Sistem komunikasi",
      "Konfigurasi bespoke",
      "Inspeksi berkala 3 tahun",
    ],
    highlighted: false,
  },
];

export function Harga() {
  return (
    <section id="harga" className="relative bg-background py-24 md:py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Harga"
          title="Investasi yang transparan, kualitas tanpa kompromi"
          description="Harga di bawah belum termasuk unit kendaraan dasar. Kami siap membantu pengadaan unit chassis sesuai kebutuhan."
        />

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition-all ${
                t.highlighted
                  ? "border-transparent bg-red-accent text-red-foreground shadow-red"
                  : "border-border bg-card text-foreground shadow-card hover:-translate-y-1 hover:border-red-accent hover:shadow-elegant"
              }`}
            >
              {t.highlighted && (
                <div className="absolute -top-3 left-1/2 inline-flex -translate-x-1/2 items-center gap-1.5 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-primary-foreground">
                  <Crown className="h-3 w-3" />
                  Paling Diminati
                </div>
              )}

              <div className={`text-xs uppercase tracking-[0.2em] ${t.highlighted ? "text-red-foreground/90" : "text-red-accent"}`}>
                {t.name}
              </div>
              <div className="mt-3 flex items-baseline gap-1">
                <span className="text-4xl font-bold tracking-tight md:text-5xl">
                  {t.price}
                </span>
              </div>
              <p
                className={`mt-3 text-sm ${
                  t.highlighted
                    ? "text-red-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {t.description}
              </p>

              <ul className="mt-6 space-y-3 text-sm">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check
                      className={`mt-0.5 h-4 w-4 flex-shrink-0 ${
                        t.highlighted ? "text-white" : "text-red-accent"
                      }`}
                    />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>

              <a
                href="#kontak"
                className={`mt-8 w-full justify-center ${
                  t.highlighted
                    ? "pill-btn bg-white text-red-accent hover:scale-[1.02] shadow-sm"
                    : "pill-btn pill-btn-outline"
                }`}
              >
                Minta Penawaran
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
