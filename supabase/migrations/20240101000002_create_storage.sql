-- Create storage bucket for PDF uploads
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'pdf-uploads',
  'pdf-uploads',
  false,
  52428800, -- 50MB in bytes
  ARRAY['application/pdf']::text[]
)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- RLS Policy: Users can upload PDFs to their own folder
CREATE POLICY "Users can upload own PDFs"
  ON storage.objects
  FOR INSERT
  WITH CHECK (
    bucket_id = 'pdf-uploads' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- RLS Policy: Users can view their own PDFs
CREATE POLICY "Users can view own PDFs"
  ON storage.objects
  FOR SELECT
  USING (
    bucket_id = 'pdf-uploads' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- RLS Policy: Users can update their own PDFs
CREATE POLICY "Users can update own PDFs"
  ON storage.objects
  FOR UPDATE
  USING (
    bucket_id = 'pdf-uploads' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  )
  WITH CHECK (
    bucket_id = 'pdf-uploads' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- RLS Policy: Users can delete their own PDFs
CREATE POLICY "Users can delete own PDFs"
  ON storage.objects
  FOR DELETE
  USING (
    bucket_id = 'pdf-uploads' AND
    (auth.uid())::text = (storage.foldername(name))[1]
  );

-- RLS Policy: Service role can access all PDFs
CREATE POLICY "Service role can access all PDFs"
  ON storage.objects
  FOR ALL
  USING (
    bucket_id = 'pdf-uploads' AND
    auth.role() = 'service_role'
  );

-- Create function to clean up old PDFs (30-day TTL)
CREATE OR REPLACE FUNCTION public.cleanup_old_pdfs()
RETURNS void AS $$
DECLARE
  expired_object RECORD;
BEGIN
  FOR expired_object IN
    SELECT *
    FROM storage.objects
    WHERE bucket_id = 'pdf-uploads'
    AND created_at < NOW() - INTERVAL '30 days'
  LOOP
    DELETE FROM storage.objects
    WHERE id = expired_object.id;
  END LOOP;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a scheduled cleanup job comment (actual cron job needs to be set up in Supabase dashboard)
COMMENT ON FUNCTION public.cleanup_old_pdfs() IS 'Deletes PDF files older than 30 days from storage. Schedule this to run daily via pg_cron or Supabase Edge Functions.';
