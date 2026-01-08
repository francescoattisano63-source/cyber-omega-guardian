import { supabase } from "@/integrations/supabase/client";

export async function domainReport(domain: string) {
  const { data, error } = await supabase.functions.invoke('check-domain', {
    body: { domain }
  });
  
  if (error) throw error;
  return data;
}
