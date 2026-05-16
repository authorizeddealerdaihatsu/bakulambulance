import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import type { Session } from "@supabase/supabase-js";
import { supabase, getSupabaseConfigError } from "@/integrations/supabase/client";
import { Toaster } from "@/components/ui/sonner";
import { toast } from "sonner";
import { Lock, LogOut, Pencil, Plus, Trash2 } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Admin Dashboard — bakulambulance.com" },
      { name: "robots", content: "noindex, nofollow" },
    ],
  }),
  component: AdminPage,
});

type TabKey = "specifications" | "galleries" | "articles";

const TABS: { key: TabKey; label: string }[] = [
  { key: "specifications", label: "Spesifikasi" },
  { key: "galleries", label: "Galeri" },
  { key: "articles", label: "Artikel" },
];

type FieldType = "text" | "textarea" | "image";
const FIELDS: Record<TabKey, { name: string; label: string; type: FieldType }[]> = {
  specifications: [
    { name: "title", label: "Judul", type: "text" },
    { name: "harga", label: "Harga (Contoh: 350000000)", type: "text" },
    { name: "description", label: "Deskripsi Singkat", type: "textarea" },
    { name: "features", label: "Daftar Fitur / Item (Satu per baris)", type: "textarea" },
    { name: "image_url", label: "Gambar", type: "image" },
  ],
  galleries: [
    { name: "title", label: "Judul", type: "text" },
    { name: "image_url", label: "Gambar", type: "image" },
  ],
  articles: [
    { name: "title", label: "Judul", type: "text" },
    { name: "excerpt", label: "Ringkasan", type: "textarea" },
    { name: "content", label: "Konten", type: "textarea" },
    { name: "thumbnail_url", label: "Thumbnail", type: "image" },
  ],
};

function ImageUploadField({
  name,
  defaultValue,
}: {
  name: string;
  defaultValue?: string;
}) {
  const [url, setUrl] = useState<string>(defaultValue || "");
  const [uploading, setUploading] = useState(false);

  const onFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
      const { error } = await supabase.storage
        .from("cms-images")
        .upload(path, file, { cacheControl: "3600", upsert: false });
      if (error) throw error;
      const { data } = supabase.storage.from("cms-images").getPublicUrl(path);
      setUrl(data.publicUrl);
      toast.success("Gambar berhasil diunggah");
    } catch (err: any) {
      toast.error(err.message || "Gagal mengunggah gambar");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="mt-1.5 space-y-2">
      <input type="hidden" name={name} value={url} />
      {url && (
        <img
          src={url}
          alt=""
          className="h-32 w-full max-w-xs rounded-md border border-border object-cover"
        />
      )}
      <div className="flex items-center gap-2">
        <input
          type="file"
          accept="image/*"
          onChange={onFile}
          disabled={uploading}
          className="block w-full text-sm file:mr-3 file:rounded-md file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-semibold file:text-primary-foreground hover:file:bg-primary/90 disabled:opacity-60"
        />
        {url && (
          <button
            type="button"
            onClick={() => setUrl("")}
            className="rounded-md border border-border px-3 py-2 text-xs font-semibold hover:bg-muted"
          >
            Hapus
          </button>
        )}
      </div>
      {uploading && (
        <div className="text-xs text-muted-foreground">Mengunggah...</div>
      )}
    </div>
  );
}

function AdminPage() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  const [configError, setConfigError] = useState<string | null>(null);

  useEffect(() => {
    // Cek konfigurasi Supabase terlebih dahulu
    const cfgErr = getSupabaseConfigError();
    if (cfgErr) {
      setConfigError(cfgErr);
      setReady(true);
      return;
    }

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });

    // Timeout 5 detik sebagai fallback agar tidak pernah stuck
    const timeout = setTimeout(() => {
      setReady(true);
    }, 5000);

    supabase.auth.getSession().then(({ data }) => {
      clearTimeout(timeout);
      setSession(data.session);
      setReady(true);
    }).catch((err) => {
      clearTimeout(timeout);
      console.error("Gagal memuat sesi:", err);
      setConfigError(err.message || "Gagal menghubungi Supabase");
      setReady(true);
    });

    return () => {
      clearTimeout(timeout);
      subscription.unsubscribe();
    };
  }, []);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-sm text-muted-foreground">Memuat...</div>
      </div>
    );
  }

  if (configError) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="max-w-md rounded-2xl border border-destructive/30 bg-destructive/5 p-8 text-center">
          <div className="mb-2 text-lg font-bold text-destructive">Konfigurasi Supabase Tidak Lengkap</div>
          <div className="text-sm text-muted-foreground">{configError}</div>
          <div className="mt-4 rounded-md bg-muted p-3 text-left text-xs font-mono text-muted-foreground">
            VITE_SUPABASE_URL=https://xxx.supabase.co<br />
            VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_...
          </div>
        </div>
        <Toaster richColors position="top-center" />
      </div>
    );
  }

  if (!session) return <AuthScreen />;

  return (
    <Dashboard
      onLogout={async () => {
        await supabase.auth.signOut();
        toast.success("Berhasil keluar");
      }}
      email={session.user.email || ""}
    />
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"login" | "signup">("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === "login") {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        toast.success("Berhasil masuk");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: `${window.location.origin}/admin` },
        });
        if (error) throw error;
        toast.success("Akun dibuat. Silakan periksa email untuk verifikasi.");
      }
    } catch (err: any) {
      toast.error(err.message || "Terjadi kesalahan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-hero p-6">
      <form onSubmit={onSubmit} className="w-full max-w-md rounded-2xl bg-card p-8 shadow-elegant">
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Lock className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold">Admin Dashboard</div>
            <div className="text-xs text-muted-foreground">
              {mode === "login" ? "Masuk untuk mengelola konten" : "Buat akun admin baru"}
            </div>
          </div>
        </div>
        <div className="space-y-3">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            className="w-full rounded-md border border-input bg-background px-4 py-3 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          type="submit"
          disabled={loading}
          className="mt-4 w-full rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
        >
          {loading ? "Memproses..." : mode === "login" ? "Masuk" : "Daftar"}
        </button>
        <button
          type="button"
          onClick={() => setMode(mode === "login" ? "signup" : "login")}
          className="mt-4 w-full text-center text-xs text-muted-foreground hover:text-foreground"
        >
          {mode === "login" ? "Belum punya akun? Daftar" : "Sudah punya akun? Masuk"}
        </button>
      </form>
      <Toaster richColors position="top-center" />
    </div>
  );
}

function Dashboard({ onLogout, email }: { onLogout: () => void; email: string }) {
  const [tab, setTab] = useState<TabKey>("specifications");
  const [rows, setRows] = useState<any[]>([]);
  const [editing, setEditing] = useState<any | null>(null);
  const [showForm, setShowForm] = useState(false);

  const load = async () => {
    const { data } = await supabase.from(tab).select("*").order("created_at", { ascending: false });
    setRows(data || []);
  };

  useEffect(() => {
    load();
    setShowForm(false);
    setEditing(null);
  }, [tab]);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data: Record<string, any> = {};
    if (tab === "specifications") {
      data.title = String(fd.get("title") || "");
      data.image_url = String(fd.get("image_url") || "");
      const harga = String(fd.get("harga") || "");
      const desc = String(fd.get("description") || "");
      const featuresStr = String(fd.get("features") || "");
      const features = featuresStr.split("\n").map(s => s.trim()).filter(s => s);
      data.description = JSON.stringify({ harga, description: desc, features });
    } else {
      FIELDS[tab].forEach((f) => {
        data[f.name] = String(fd.get(f.name) || "");
      });
    }
    try {
      const client = supabase.from(tab) as any;
      const { error } = editing
        ? await client.update(data).eq("id", editing.id)
        : await client.insert(data);
      if (error) throw error;
      toast.success(editing ? "Berhasil diperbarui" : "Berhasil ditambahkan");
      setShowForm(false);
      setEditing(null);
      load();
    } catch (err: any) {
      toast.error(err.message || "Gagal menyimpan");
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Hapus item ini?")) return;
    try {
      const { error } = await supabase.from(tab).delete().eq("id", id);
      if (error) throw error;
      toast.success("Berhasil dihapus");
      load();
    } catch (err: any) {
      toast.error(err.message || "Gagal menghapus");
    }
  };

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="border-b border-border bg-card">
        <div className="container-prose flex h-16 items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <span className="text-sm font-bold">B</span>
            </div>
            <div>
              <div className="text-sm font-bold">Admin Dashboard</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
                {email}
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <a href="/" className="text-sm font-medium text-muted-foreground hover:text-foreground">
              Lihat Situs
            </a>
            <button
              onClick={onLogout}
              className="inline-flex items-center gap-1.5 rounded-md border border-border px-3 py-2 text-sm font-medium hover:bg-muted"
            >
              <LogOut className="h-4 w-4" />
              Keluar
            </button>
          </div>
        </div>
      </header>

      <div className="container-prose py-10">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex gap-1 rounded-lg border border-border bg-card p-1 shadow-card">
            {TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-md px-4 py-2 text-sm font-semibold transition-colors ${
                  tab === t.key
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <button
            onClick={() => { setEditing(null); setShowForm(true); }}
            className="inline-flex items-center gap-1.5 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
          >
            <Plus className="h-4 w-4" />
            Tambah
          </button>
        </div>

        {showForm && (
          <form
            onSubmit={onSubmit}
            className="mb-8 rounded-2xl border border-border bg-card p-6 shadow-card"
          >
            <div className="mb-4 text-base font-bold">
              {editing ? "Edit" : "Tambah"} {TABS.find((t) => t.key === tab)?.label}
            </div>
            <div className="space-y-4">
              {FIELDS[tab].map((f) => (
                <div key={f.name}>
                  <label className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
                    {f.label}
                  </label>
                  {f.type === "image" ? (
                    <ImageUploadField
                      name={f.name}
                      defaultValue={editing?.[f.name] || ""}
                    />
                  ) : f.type === "textarea" ? (
                    <textarea
                      name={f.name}
                      defaultValue={editing?.[f.name] || ""}
                      rows={4}
                      className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  ) : (
                    <input
                      name={f.name}
                      defaultValue={editing?.[f.name] || ""}
                      className="mt-1.5 w-full rounded-md border border-input bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
                    />
                  )}
                </div>
              ))}
            </div>
            <div className="mt-6 flex gap-2">
              <button
                type="submit"
                className="rounded-md bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary/90"
              >
                Simpan
              </button>
              <button
                type="button"
                onClick={() => { setShowForm(false); setEditing(null); }}
                className="rounded-md border border-border px-5 py-2.5 text-sm font-semibold hover:bg-muted"
              >
                Batal
              </button>
            </div>
          </form>
        )}

        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-card">
          {rows.length === 0 ? (
            <div className="p-12 text-center text-sm text-muted-foreground">
              Belum ada data. Klik "Tambah" untuk memulai.
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {rows.map((r) => (
                <li key={r.id} className="flex items-center gap-4 p-4">
                  {(r.image_url || r.thumbnail_url) && (
                    <img
                      src={r.image_url || r.thumbnail_url}
                      alt=""
                      loading="lazy"
                      className="h-14 w-14 flex-shrink-0 rounded-md object-cover"
                    />
                  )}
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-semibold text-foreground">
                      {r.title}
                    </div>
                    <div className="truncate text-xs text-muted-foreground">
                      {tab === "specifications" && r.description 
                        ? (r.description.includes('"harga"') ? "Data fitur JSON" : r.description)
                        : (r.description || r.excerpt || r.image_url)}
                    </div>
                  </div>
                  <div className="flex gap-1.5">
                    <button
                      onClick={() => { 
                        const editData = { ...r };
                        if (tab === "specifications" && editData.description) {
                          try {
                            const parsed = JSON.parse(editData.description);
                            editData.harga = parsed.harga || "";
                            editData.description = parsed.description || "";
                            editData.features = parsed.features ? parsed.features.join("\n") : "";
                          } catch {
                            // legacy support
                            editData.features = editData.description;
                            editData.harga = "";
                            editData.description = "";
                          }
                        }
                        setEditing(editData); 
                        setShowForm(true); 
                      }}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border hover:bg-muted"
                      aria-label="Edit"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDelete(r.id)}
                      className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border text-destructive hover:bg-destructive hover:text-destructive-foreground"
                      aria-label="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <Toaster richColors position="top-center" />
    </div>
  );
}
