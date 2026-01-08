import { supabase } from "@/integrations/supabase/client";

export async function checkEmailBreach(email: string) {
  const { data, error } = await supabase.functions.invoke('check-email', {
    body: { email }
  });
  
  if (error) throw error;
  return data?.breaches || [];
}

export async function checkEmailReputation(email: string) {
  const { data, error } = await supabase.functions.invoke('check-email', {
    body: { email }
  });
  
  if (error) throw error;
  return data?.reputation || null;
}
