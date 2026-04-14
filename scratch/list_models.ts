import * as dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

async function listModels() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    console.error('No API key found!')
    return
  }

  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`)
  const data = await res.json()
  
  if (data.models) {
    console.log('Available Models:')
    data.models.forEach((m: any) => {
      if (m.supportedGenerationMethods.includes('generateContent')) {
        console.log(`- ${m.name}`)
      }
    })
  } else {
    console.error('Error fetching models:', data)
  }
}

listModels()
