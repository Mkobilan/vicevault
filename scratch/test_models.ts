import * as dotenv from 'dotenv'
import { GoogleGenerativeAI } from '@google/generative-ai'

dotenv.config({ path: '.env.local' })

async function testModels() {
  const apiKey = process.env.GOOGLE_GEMINI_API_KEY
  if (!apiKey) {
    console.error('No API key found!')
    return
  }

  const genAI = new GoogleGenerativeAI(apiKey)
  const candidates = [
    'gemini-flash-lite-latest',
    'gemini-2.0-flash-lite-001',
    'gemini-2.0-flash-lite',
    'gemini-2.5-flash',
    'gemini-flash-latest',
    'gemini-3.1-flash-lite-preview',
    'gemini-1.5-flash-latest'
  ]

  for (const modelId of candidates) {
    console.log(`\nTesting ${modelId}...`)
    try {
      const model = genAI.getGenerativeModel({ model: modelId })
      const result = await model.generateContent("Say 'hello' in exactly one word.")
      const text = result.response.text()
      console.log(`✅ Success with ${modelId}: ${text.trim()}`)
      return // Stop on first success
    } catch (err: any) {
      console.log(`❌ Failed ${modelId}: ${err.message}`)
    }
  }
}

testModels()
