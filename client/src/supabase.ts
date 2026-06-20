import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://ojnpfdubvjaokyfidqpt.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbnBmZHVidmphb2t5ZmlkcXB0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODE5NDY1NTQsImV4cCI6MjA5NzUyMjU1NH0.g4NaG21EZrPLxNtwOhNm5i5aoNdNPVF0LK1bxKcyX1o"
);
