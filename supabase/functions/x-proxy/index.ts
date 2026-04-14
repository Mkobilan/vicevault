const X_BEARER_TOKEN = Deno.env.get("X_BEARER_TOKEN")

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const query = "GTA6 OR \"GTA VI\" OR Leonida OR ViceCity"
    const url = `https://api.twitter.com/2/tweets/search/recent?query=${encodeURIComponent(query)}&tweet.fields=created_at,author_id,public_metrics,entities&expansions=author_id,attachments.media_keys&user.fields=username,profile_image_url&media.fields=url,preview_image_url`

    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${X_BEARER_TOKEN}`,
      },
    })

    const data = await response.json()

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})
