import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    const VT_API_KEY = Deno.env.get('VT_API_KEY')
    
    let report = null
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
        } else {
          const errorData = await vtRes.text()
          console.error('VirusTotal API error:', vtRes.status, errorData)
        }
      } catch (error) {
        console.error('VirusTotal API error:', error)
      }
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

    return new Response(
      JSON.stringify({ 
        domain,
        analysis,
        rawReport: report
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
