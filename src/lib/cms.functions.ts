import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { supabaseAdmin } from "@/integrations/supabase/client.server";

const PASSCODE = "bakul2025"; // Static admin passcode (change in production)

const TABLES = ["specifications", "galleries", "articles"] as const;
type Table = (typeof TABLES)[number];

function assertPasscode(code: string) {
  if (code !== PASSCODE) {
    throw new Error("Passcode tidak valid");
  }
}

const upsertSchema = z.object({
  passcode: z.string().min(1),
  table: z.enum(TABLES),
  id: z.string().uuid().optional(),
  data: z.record(z.string(), z.any()),
});

export const upsertCmsRow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => upsertSchema.parse(input))
  .handler(async ({ data }) => {
    assertPasscode(data.passcode);
    const table: Table = data.table;
    const client = supabaseAdmin.from(table) as any;
    if (data.id) {
      const { error } = await client.update(data.data).eq("id", data.id);
      if (error) throw new Error(error.message);
    } else {
      const { error } = await client.insert(data.data);
      if (error) throw new Error(error.message);
    }
    return { ok: true };
  });

const deleteSchema = z.object({
  passcode: z.string().min(1),
  table: z.enum(TABLES),
  id: z.string().uuid(),
});

export const deleteCmsRow = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => deleteSchema.parse(input))
  .handler(async ({ data }) => {
    assertPasscode(data.passcode);
    const { error } = await supabaseAdmin
      .from(data.table)
      .delete()
      .eq("id", data.id);
    if (error) throw new Error(error.message);
    return { ok: true };
  });

export const verifyPasscode = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) =>
    z.object({ passcode: z.string() }).parse(input)
  )
  .handler(async ({ data }) => {
    return { ok: data.passcode === PASSCODE };
  });
