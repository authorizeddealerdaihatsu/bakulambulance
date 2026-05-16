import heroImage from "@/assets/hero-ambulance.png";
import { ArrowRight, ShieldCheck, Wrench, Award } from "lucide-react";

export function Hero() {
  return (
    <section id="home" className="relative isolate overflow-hidden bg-background pt-28 text-foreground md:pt-32">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "radial-gradient(800px 400px at 80% 0%, oklch(0.53 0.22 27 / 0.4), transparent 60%), radial-gradient(600px 400px at 0% 100%, oklch(0.20 0.05 260 / 0.2), transparent 60%)",
        }}
      />

      <div className="container-prose relative grid items-center gap-12 pb-20 md:grid-cols-2 md:pb-28">
        <div className="reveal">
          <div className="eyebrow-red">
            Karoseri Ambulance Premium
          </div>

          <h1 className="mt-6 text-4xl font-bold leading-[1.05] tracking-tight md:text-6xl lg:text-7xl">
            Membangun Ambulance.
            <br />
            <span className="text-red-accent">
              Menyelamatkan Hidup.
            </span>
          </h1>

          <p className="mt-6 max-w-xl text-base text-muted-foreground md:text-lg">
            Spesialis karoseri dan modifikasi ambulance kelas premium untuk
            rumah sakit, klinik, dan instansi di seluruh Indonesia. Dirancang
            sesuai standar medis, dirakit dengan presisi tinggi.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#kontak"
              className="pill-btn pill-btn-red group"
            >
              Hubungi Kami
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </a>
            <a
              href="#spesifikasi"
              className="pill-btn pill-btn-outline"
            >
              Lihat Spesifikasi
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 gap-4 border-t border-border pt-8">
            {[
              { icon: ShieldCheck, label: "Standar Medis", value: "SNI" },
              { icon: Wrench, label: "Pengalaman", value: "15+ Tahun" },
              { icon: Award, label: "Unit Selesai", value: "500+" },
            ].map((s) => (
              <div key={s.label} className="rounded-xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-1 hover:border-red-accent hover:shadow-card">
                <s.icon className="h-5 w-5 text-red-accent" />
                <div className="mt-3 text-lg font-bold tracking-tight text-foreground md:text-xl">
                  {s.value}
                </div>
                <div className="mt-1 text-[10px] uppercase tracking-wider text-muted-foreground md:text-xs">
                  {s.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="reveal reveal-delay-2 relative">
          {/* Geometris dekoratif */}
          <div className="absolute -right-12 -top-12 -z-10 h-64 w-64 rounded-full border-[16px] border-red-accent/10"></div>
          <div className="absolute -bottom-8 -left-8 -z-10 h-32 w-32 rounded-full border-[8px] border-primary/10"></div>
          
          <div className="relative overflow-hidden rounded-2xl border border-border bg-card shadow-card">
            <img
              src={heroImage}
              alt="Ambulance custom karoseri premium"
              width={1920}
              height={1280}
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[oklch(0.10_0.04_260)] to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
              <div>
                <div className="inline-flex rounded-full bg-red-accent px-2 py-0.5 text-[10px] font-bold uppercase tracking-widest text-red-foreground">
                  Featured Build
                </div>
                <div className="mt-2 text-base font-semibold text-primary-foreground">
                  Type PSC 119 — Toyota Hiace
                </div>
              </div>
              <div className="rounded-md bg-white px-3 py-1.5 text-xs font-semibold text-primary">
                2025
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
