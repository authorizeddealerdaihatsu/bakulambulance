import { useState, useRef, useEffect } from "react";
import { MessageCircle, X } from "lucide-react";

const sales = [
  { name: "Aris", role: "Sales Manager", phone: "62812000000001" },
  { name: "Fathan", role: "Sales Executive", phone: "62812000000002" },
];

export function WhatsappFAB() {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-50 md:bottom-8 md:right-8" ref={menuRef}>
      {/* Popup Menu */}
      <div
        className={`absolute bottom-[calc(100%+1rem)] right-0 w-64 origin-bottom-right rounded-2xl border border-border bg-card p-4 shadow-elegant transition-all duration-300 ${
          open ? "scale-100 opacity-100" : "pointer-events-none scale-95 opacity-0"
        }`}
      >
        <div className="mb-3 text-sm font-bold text-foreground">Hubungi Sales Kami</div>
        <div className="space-y-2">
          {sales.map((s) => (
            <a
              key={s.name}
              href={`https://wa.me/${s.phone}?text=${encodeURIComponent(
                `Halo ${s.name}, saya tertarik dengan layanan karoseri ambulance.`
              )}`}
              target="_blank"
              rel="noreferrer"
              onClick={() => setOpen(false)}
              className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3 transition-all hover:border-[#25D366] hover:bg-[#25D366]/5"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#25D366]/10 text-[#25D366]">
                <span className="text-sm font-bold">{s.name.charAt(0)}</span>
              </div>
              <div>
                <div className="text-sm font-semibold text-foreground group-hover:text-[#25D366] transition-colors">
                  {s.name}
                </div>
                <div className="text-xs text-muted-foreground">{s.role}</div>
              </div>
            </a>
          ))}
        </div>
      </div>

      {/* Button */}
      <div className="group relative flex items-center justify-end">
        {!open && <div className="whatsapp-fab-ring absolute inset-0 rounded-full bg-[#25D366]"></div>}

        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Tutup Menu" : "WhatsApp Sales"}
          className="relative flex h-[52px] items-center justify-center gap-2.5 rounded-full bg-[#25D366] px-5 text-white shadow-[0_8px_20px_rgba(37,211,102,0.3)] transition-transform hover:-translate-y-1 hover:shadow-[0_12px_24px_rgba(37,211,102,0.45)] md:h-14 md:px-6"
        >
          {open ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
          <span className="font-semibold tracking-wide text-[14px] md:text-[15px]">
            {open ? "Tutup" : "Hubungi Sales"}
          </span>
        </button>
      </div>
    </div>
  );
}
