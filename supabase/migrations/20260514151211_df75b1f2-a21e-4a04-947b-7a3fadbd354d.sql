
-- Allow authenticated users full write access to CMS tables
CREATE POLICY "Authenticated can insert specifications" ON public.specifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update specifications" ON public.specifications FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete specifications" ON public.specifications FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert galleries" ON public.galleries FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update galleries" ON public.galleries FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete galleries" ON public.galleries FOR DELETE TO authenticated USING (true);

CREATE POLICY "Authenticated can insert articles" ON public.articles FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated can update articles" ON public.articles FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Authenticated can delete articles" ON public.articles FOR DELETE TO authenticated USING (true);
