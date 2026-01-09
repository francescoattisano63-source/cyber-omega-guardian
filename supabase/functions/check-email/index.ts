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
    const { email } = await req.json()
    
    if (!email) {
      return new Response(
        JSON.stringify({ error: 'Email is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      )
    }

    const HIBP_API_KEY = Deno.env.get('HIBP_API_KEY')
    
    // Check email breaches via Have I Been Pwned
    let breaches = []
    if (HIBP_API_KEY) {
      try {
        const hibpUrl = `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`
        const hibpRes = await fetch(hibpUrl, {
          method: 'GET',
          headers: {
            'hibp-api-key': HIBP_API_KEY,
            'User-Agent': 'CyberShield/1.0'
          }
        })
        
        if (hibpRes.status === 200) {
          breaches = await hibpRes.json()
        } else if (hibpRes.status === 404) {
          breaches = [] // No breaches found
        }
      } catch {
        // Log minimal info for debugging without exposing details
        console.error('HIBP API request failed')
      }
    }

    // Check email reputation via emailrep.io (free tier, no API key needed)
    let reputation = null
    try {
      const repUrl = `https://emailrep.io/${encodeURIComponent(email)}`
      const repRes = await fetch(repUrl, {
        headers: {
          'User-Agent': 'CyberShield/1.0'
        }
      })
      if (repRes.ok) {
        reputation = await repRes.json()
      }
    } catch {
      // Log minimal info for debugging without exposing details
      console.error('EmailRep API request failed')
    }

    return new Response(
      JSON.stringify({ 
        email,
        breaches,
        breachCount: breaches.length,
        reputation
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  } catch {
    // Log minimal info without exposing error details
    console.error('Request processing failed')
    return new Response(
      JSON.stringify({ error: 'Service temporarily unavailable' }),
      { status: 503, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    )
  }
})
