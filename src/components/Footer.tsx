export function Footer() {
  return (
    <footer className="border-t-[6px] border-red-accent bg-hero text-primary-foreground">
      <div className="container-prose grid gap-10 py-16 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-md bg-red-accent text-red-foreground shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14"/><path d="M12 5v14"/></svg>
            </div>
            <div>
              <div className="text-base font-bold">bakulambulance.com</div>
              <div className="text-[10px] uppercase tracking-[0.2em] text-primary-foreground/60">
                Karoseri Ambulance
              </div>
            </div>
          </div>
          <p className="mt-5 max-w-md text-sm text-primary-foreground/70">
            Spesialis karoseri dan modifikasi ambulance untuk rumah sakit,
            klinik, dan instansi pemerintah di seluruh Indonesia. Dibangun
            dengan presisi, dirancang untuk menyelamatkan.
          </p>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-accent">
            Navigasi
          </div>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li><a href="#spesifikasi" className="hover:text-red-accent">Spesifikasi</a></li>
            <li><a href="#gallery" className="hover:text-red-accent">Galeri</a></li>
            <li><a href="#artikel" className="hover:text-red-accent">Artikel</a></li>
          </ul>
        </div>

        <div>
          <div className="text-xs font-semibold uppercase tracking-[0.2em] text-red-accent">
            Workshop
          </div>
          <ul className="mt-4 space-y-2 text-sm text-primary-foreground/80">
            <li className="leading-relaxed">Jalan Pramuka RT 03 RW 04 (Pagar Biru)</li>
            <li>Kel. Mangun Jaya, Kec. Tambun Selatan</li>
            <li>Bekasi 17510</li>
            <li className="pt-2">
              <a href="#kontak" className="hover:text-red-accent">Hubungi Sales</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container-prose flex flex-col items-center justify-between gap-3 py-6 text-xs text-primary-foreground/60 md:flex-row">
          <div>
            © {new Date().getFullYear() - 15} bakulambulance.com — All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <a href="/admin" className="hover:text-red-accent">Admin</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
