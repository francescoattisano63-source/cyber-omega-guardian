import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface RiskAssessment {
  score: number;
  level: 'low' | 'moderate' | 'high';
  summary: string;
  explanation: string[];
  sources: string[];
  partial: boolean;
}

function calculateEmailRiskScore(breachCount: number, breaches: any[], reputation: any): RiskAssessment {
  let score = 0;
  const explanation: string[] = [];
  const sources: string[] = [];
  let partial = false;

  // Factor 1: Number of breaches (0-50 points)
  if (breachCount > 0) {
    // More breaches = higher risk
    const breachScore = Math.min(50, breachCount * 10);
    score += breachScore;
    
    if (breachCount === 1) {
      explanation.push(`Questa email è stata coinvolta in 1 data breach noto.`);
    } else {
      explanation.push(`Questa email è stata coinvolta in ${breachCount} data breach noti.`);
    }
    
    // Check severity of breaches
    const hasPasswordLeak = breaches.some(b => 
      b.DataClasses?.includes('Passwords') || 
      b.DataClasses?.includes('Password hints')
    );
    if (hasPasswordLeak) {
      score += 15;
      explanation.push(`Alcuni breach includono password esposte, aumentando il rischio.`);
    }
    
    sources.push('Have I Been Pwned');
  } else {
    explanation.push(`Non sono stati trovati data breach noti per questa email.`);
    sources.push('Have I Been Pwned');
  }

  // Factor 2: Email reputation (0-35 points)
  if (reputation) {
    sources.push('EmailRep.io');
    
    if (reputation.suspicious) {
      score += 25;
      explanation.push(`L'email risulta segnalata come sospetta da fonti di intelligence.`);
    }
    
    if (reputation.details?.blacklisted) {
      score += 15;
      explanation.push(`L'email è presente in blacklist conosciute.`);
    }
    
    if (reputation.details?.malicious_activity) {
      score += 20;
      explanation.push(`Sono state rilevate attività malevole associate a questa email.`);
    }
    
    if (reputation.reputation === 'low') {
      score += 15;
    } else if (reputation.reputation === 'medium') {
      score += 5;
    }
  } else {
    partial = true;
  }

  // Normalize score to 0-100
  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  let level: 'low' | 'moderate' | 'high';
  let summary: string;
  
  if (score <= 20) {
    level = 'low';
    summary = `L'analisi non ha rilevato segnalazioni critiche nelle fonti consultate. Tuttavia, l'assenza di segnalazioni non garantisce che non esistano rischi futuri.`;
  } else if (score <= 60) {
    level = 'moderate';
    summary = `Sono state rilevate alcune segnalazioni che richiedono attenzione. Si consiglia di valutare le informazioni e considerare misure preventive.`;
  } else {
    level = 'high';
    summary = `Questa email presenta segnalazioni significative. Si raccomanda di adottare misure di sicurezza e considerare il cambio delle credenziali associate.`;
  }

  if (partial) {
    explanation.push(`Nota: alcune fonti non erano disponibili, il risultato potrebbe essere parziale.`);
  }

  return { score, level, summary, explanation, sources, partial };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { email } = await req.json()
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: 'Input non valido: inserire un indirizzo email valido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const HIBP_API_KEY = Deno.env.get('HIBP_API_KEY')
    
    // Check email breaches via Have I Been Pwned
    let breaches: any[] = []
    let hibpError = false
    
    if (HIBP_API_KEY) {
      try {
        const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`
        const hibpRes = await fetch(hibpUrl, {
          method: 'GET',
          headers: {
            'hibp-api-key': HIBP_API_KEY,
            'User-Agent': 'CyberOmegaGuardian/1.0'
          }
        })
        
        if (hibpRes.status === 200) {
          breaches = await hibpRes.json()
        } else if (hibpRes.status === 404) {
          breaches = [] // No breaches found
        } else if (hibpRes.status === 429) {
          hibpError = true
        }
      } catch {
        console.error('HIBP API request failed')
        hibpError = true
      }
    } else {
      hibpError = true
    }

    // Check email reputation via emailrep.io (free tier, no API key needed)
    let reputation = null
    let repError = false
    
    try {
      const repUrl = `https://emailrep.io/${encodeURIComponent(email)}`
      const repRes = await fetch(repUrl, {
        headers: {
          'User-Agent': 'CyberOmegaGuardian/1.0'
        }
      })
      if (repRes.ok) {
        reputation = await repRes.json()
      } else if (repRes.status === 429) {
        repError = true
      }
    } catch {
      console.error('EmailRep API request failed')
      repError = true
    }

    // Calculate risk assessment
    const riskAssessment = calculateEmailRiskScore(breaches.length, breaches, reputation);

    // Add source availability info
    const sourceStatus = {
      hibp: hibpError ? 'unavailable' : 'ok',
      emailrep: repError ? 'unavailable' : 'ok'
    };

    return new Response(
      JSON.stringify({ 
        email,
        breaches,
        breachCount: breaches.length,
        reputation,
        riskAssessment,
        sourceStatus
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch {
    console.error('Request processing failed')
    return new Response(
      JSON.stringify({ error: 'Servizio temporaneamente non disponibile. Riprova tra qualche minuto.' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
