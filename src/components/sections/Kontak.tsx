import { useState, type FormEvent } from "react";
import { MapPin, Phone, Mail, MessageCircle } from "lucide-react";
import { SectionHeader } from "@/components/SectionHeader";
import { toast } from "sonner";

const sales = [
  { name: "Aris", role: "Sales Manager", phone: "62812000000001" },
  { name: "Fathan", role: "Sales Executive", phone: "62812000000002" },
];

export function Kontak() {
  const [loading, setLoading] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      (e.target as HTMLFormElement).reset();
      toast.success("Pesan terkirim. Tim kami akan segera menghubungi Anda.");
    }, 700);
  };

  return (
    <section id="kontak" className="relative bg-background py-24 md:py-32">
      <div className="container-prose">
        <SectionHeader
          eyebrow="Kontak"
          title="Mari diskusikan proyek karoseri Anda"
          description="Tim sales kami siap membantu konsultasi spesifikasi, penawaran harga, dan jadwal kunjungan workshop."
        />

        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-red-accent/10 text-red-accent">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Workshop & Pabrik
                    </div>
                    <div className="mt-1 text-base font-semibold text-foreground">
                      Jalan Pramuka RT 03 RW 04 (Pagar Biru)
                    </div>
                    <div className="text-sm text-muted-foreground leading-relaxed">
                      Kel. Mangun Jaya, Kec. Tambun Selatan<br />
                      Bekasi 17510
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-2xl border border-border bg-card p-6 shadow-card">
                <div className="flex items-start gap-4">
                  <div className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-md bg-red-accent/10 text-red-accent">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      Email
                    </div>
                    <div className="mt-1 text-base font-semibold text-foreground">
                      sales@bakulambulance.com
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-border shadow-card h-[250px] relative">
                <iframe
                  title="Lokasi Workshop Bakul Ambulance"
                  src="https://www.google.com/maps?q=Jalan+Pramuka+RT+03+RW+04,+Mangun+Jaya,+Tambun+Selatan,+Bekasi,+17510&output=embed"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen={false}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="absolute inset-0"
                ></iframe>
              </div>

            </div>
          </div>

          <form
            onSubmit={onSubmit}
            className="rounded-2xl border border-border bg-card p-8 shadow-card lg:col-span-3"
          >
            <div className="grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Nama Lengkap
                </label>
                <input
                  required
                  name="name"
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Nama Anda"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Instansi
                </label>
                <input
                  name="company"
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="Nama rumah sakit / instansi"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Email
                </label>
                <input
                  required
                  type="email"
                  name="email"
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="email@instansi.com"
                />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                  Nomor Telepon
                </label>
                <input
                  required
                  name="phone"
                  className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                  placeholder="08xx-xxxx-xxxx"
                />
              </div>
            </div>

            <div className="mt-5">
              <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                Pesan
              </label>
              <textarea
                required
                name="message"
                rows={5}
                className="mt-2 w-full rounded-md border border-input bg-background px-4 py-3 text-sm text-foreground outline-none transition-colors focus:border-primary"
                placeholder="Ceritakan kebutuhan karoseri ambulance Anda..."
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="mt-6 pill-btn pill-btn-red w-full justify-center disabled:opacity-60 md:w-auto"
            >
              {loading ? "Mengirim..." : "Kirim Pesan"}
              <Phone className="h-4 w-4" />
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
