import { useEffect, useState } from "react";
import { Menu, X, Plus } from "lucide-react";

const links = [
  { href: "#home", label: "Beranda" },
  { href: "#spesifikasi", label: "Spesifikasi" },
  { href: "#gallery", label: "Galeri" },
  { href: "#artikel", label: "Artikel" },
  { href: "#kontak", label: "Kontak" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 10);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      data-scrolled={scrolled}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "navbar-glass" : ""}`}
    >
      <nav className="container-prose flex h-16 items-center justify-between md:h-20">
        <a href="#home" className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-red-accent text-red-foreground shadow-sm">
            <Plus className="h-5 w-5 stroke-[3]" />
          </div>
          <div className="leading-tight">
            <div className="text-sm font-bold tracking-tight text-foreground md:text-base">
              bakulambulance
            </div>
            <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Karoseri Premium
            </div>
          </div>
        </a>

        <ul className="hidden items-center gap-8 lg:flex">
          {links.map((l) => (
            <li key={l.href}>
              <a
                href={l.href}
                className="text-sm font-semibold text-foreground/70 transition-colors hover:text-red-accent"
              >
                {l.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#kontak"
          className="hidden pill-btn pill-btn-red lg:inline-flex"
        >
          Hubungi Kami
        </a>

        <button
          onClick={() => setOpen((o) => !o)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-md text-foreground lg:hidden"
          aria-label="Toggle menu"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      {open && (
        <div className="border-t border-border glass lg:hidden">
          <ul className="container-prose flex flex-col gap-1 py-4">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-md px-3 py-3 text-sm font-medium text-foreground/80 hover:bg-muted"
                >
                  {l.label}
                </a>
              </li>
            ))}
            <li>
              <a
                href="#kontak"
                onClick={() => setOpen(false)}
                className="mt-2 block w-full justify-center text-center pill-btn pill-btn-red"
              >
                Hubungi Kami
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
