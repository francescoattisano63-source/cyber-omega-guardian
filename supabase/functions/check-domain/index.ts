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

function calculateDomainRiskScore(analysis: any): RiskAssessment {
  let score = 0;
  const explanation: string[] = [];
  const sources: string[] = ['VirusTotal'];
  let partial = false;

  if (!analysis) {
    return {
      score: 0,
      level: 'low',
      summary: 'Non è stato possibile analizzare questo dominio. I dati potrebbero non essere disponibili.',
      explanation: ['Nessun dato disponibile per questo dominio nelle fonti consultate.'],
      sources,
      partial: true
    };
  }

  const stats = analysis.stats || {};
  const totalScans = (stats.harmless || 0) + (stats.malicious || 0) + (stats.suspicious || 0) + (stats.undetected || 0);

  // Factor 1: Malicious detections (0-60 points)
  if (stats.malicious > 0) {
    const maliciousScore = Math.min(60, stats.malicious * 15);
    score += maliciousScore;
    
    if (stats.malicious === 1) {
      explanation.push(`1 motore antivirus ha segnalato questo dominio come malevolo.`);
    } else {
      explanation.push(`${stats.malicious} motori antivirus hanno segnalato questo dominio come malevolo.`);
    }
  }

  // Factor 2: Suspicious detections (0-30 points)
  if (stats.suspicious > 0) {
    const suspiciousScore = Math.min(30, stats.suspicious * 8);
    score += suspiciousScore;
    
    if (stats.suspicious === 1) {
      explanation.push(`1 motore ha classificato il dominio come sospetto.`);
    } else {
      explanation.push(`${stats.suspicious} motori hanno classificato il dominio come sospetto.`);
    }
  }

  // Factor 3: VirusTotal reputation (0-20 points, negative reputation increases risk)
  if (typeof analysis.reputation === 'number') {
    if (analysis.reputation < 0) {
      const repScore = Math.min(20, Math.abs(analysis.reputation) * 2);
      score += repScore;
      explanation.push(`Il dominio ha una reputazione negativa (${analysis.reputation}) nella community.`);
    } else if (analysis.reputation > 0) {
      // Positive reputation slightly reduces risk
      score = Math.max(0, score - 5);
    }
  }

  // Factor 4: Domain age (newer domains are slightly more risky)
  if (analysis.creationDate) {
    const ageMs = Date.now() - new Date(analysis.creationDate).getTime();
    const ageMonths = ageMs / (1000 * 60 * 60 * 24 * 30);
    
    if (ageMonths < 3) {
      score += 10;
      explanation.push(`Il dominio è stato creato di recente (meno di 3 mesi fa).`);
    } else if (ageMonths < 6) {
      score += 5;
    }
  }

  // If no issues found
  if (stats.malicious === 0 && stats.suspicious === 0) {
    if (stats.harmless > 0) {
      const harmlessPercent = Math.round((stats.harmless / totalScans) * 100);
      explanation.push(`${stats.harmless} motori (${harmlessPercent}%) lo classificano come sicuro.`);
    }
    if (totalScans === 0) {
      explanation.push(`Nessun dato di analisi disponibile per questo dominio.`);
      partial = true;
    }
  }

  // Normalize score to 0-100
  score = Math.min(100, Math.max(0, score));

  // Determine risk level
  let level: 'low' | 'moderate' | 'high';
  let summary: string;
  
  if (score <= 20) {
    level = 'low';
    summary = `L'analisi non ha rilevato segnalazioni significative per questo dominio. Le fonti consultate non indicano rischi evidenti, ma si consiglia sempre prudenza.`;
  } else if (score <= 60) {
    level = 'moderate';
    summary = `Sono state rilevate alcune segnalazioni per questo dominio. Si consiglia di procedere con cautela e verificare ulteriormente prima di interagire.`;
  } else {
    level = 'high';
    summary = `Questo dominio presenta segnalazioni critiche da più fonti. Si sconsiglia l'interazione e si raccomanda di evitare di condividere dati sensibili.`;
  }

  if (partial && explanation.length === 0) {
    explanation.push(`Alcune fonti non erano disponibili, il risultato potrebbe essere parziale.`);
  }

  return { score, level, summary, explanation, sources, partial };
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders })
  }

  try {
    const { domain } = await req.json()
    
    if (!domain) {
      return new Response(
        JSON.stringify({ error: 'Domain is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    // Basic domain validation
    const domainRegex = /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]?\.[a-zA-Z]{2,}$/;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!domainRegex.test(domain) && !ipRegex.test(domain)) {
      return new Response(
        JSON.stringify({ error: 'Input non valido: inserire un dominio o IP valido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const VT_API_KEY = Deno.env.get('VT_API_KEY')
    
    let report = null
    let vtError = false
    
    if (VT_API_KEY) {
      try {
        const vtUrl = `https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`
        const vtRes = await fetch(vtUrl, {
          headers: {
            'x-apikey': VT_API_KEY
          }
        })
        
        if (vtRes.ok) {
          report = await vtRes.json()
        } else if (vtRes.status === 429) {
          vtError = true
        } else {
          console.error('VirusTotal API request failed')
        }
      } catch {
        console.error('VirusTotal API request failed')
        vtError = true
      }
    } else {
      vtError = true
    }

    // Extract useful info from VirusTotal report
    let analysis = null
    if (report?.data?.attributes) {
      const attrs = report.data.attributes
      const stats = attrs.last_analysis_stats || {}
      
      analysis = {
        domain,
        reputation: attrs.reputation,
        categories: attrs.categories,
        lastAnalysisDate: attrs.last_analysis_date ? new Date(attrs.last_analysis_date * 1000).toISOString() : null,
        stats: {
          harmless: stats.harmless || 0,
          malicious: stats.malicious || 0,
          suspicious: stats.suspicious || 0,
          undetected: stats.undetected || 0,
          timeout: stats.timeout || 0
        },
        registrar: attrs.registrar,
        creationDate: attrs.creation_date ? new Date(attrs.creation_date * 1000).toISOString() : null,
        lastModificationDate: attrs.last_modification_date ? new Date(attrs.last_modification_date * 1000).toISOString() : null
      }
    }

    // Calculate risk assessment
    const riskAssessment = calculateDomainRiskScore(analysis);

    // Add source availability info
    const sourceStatus = {
      virustotal: vtError ? 'unavailable' : 'ok'
    };

    return new Response(
      JSON.stringify({ 
        domain,
        analysis,
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
