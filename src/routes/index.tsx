import { createFileRoute } from "@tanstack/react-router";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Spesifikasi } from "@/components/sections/Spesifikasi";
import { Gallery } from "@/components/sections/Gallery";
import { Artikel } from "@/components/sections/Artikel";
import { Kontak } from "@/components/sections/Kontak";
import { Toaster } from "@/components/ui/sonner";
import { WhatsappFAB } from "@/components/WhatsappFAB";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "bakulambulance.com — Karoseri Ambulance Premium Indonesia" },
      {
        name: "description",
        content:
          "Spesialis karoseri & modifikasi ambulance premium untuk rumah sakit dan instansi di Indonesia. Standar medis, presisi tinggi.",
      },
      { property: "og:title", content: "bakulambulance.com — Karoseri Ambulance Premium" },
      {
        property: "og:description",
        content:
          "Karoseri ambulance kelas premium dengan standar medis dan presisi tinggi.",
      },
    ],
  }),
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Spesifikasi />
        <Gallery />
        <Artikel />
        <Kontak />
      </main>
      <Footer />
      <WhatsappFAB />
      <Toaster richColors position="top-center" />
    </div>
  );
}
