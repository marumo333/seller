// app/api/translate/route.ts
import { NextRequest } from 'next/server'

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { text, target_lang } = body

  const authKey = process.env.DEEPL_AUTH_KEY

  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      Authorization: `DeepL-Auth-Key ${authKey}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      target_lang,
    }),
  })

  if (!response.ok) {
    const err = await response.text()
    return new Response(`翻訳失敗: ${response.status} - ${err}`, { status: 500 })
  }

  const data = await response.json()
  return Response.json(data.translations[0]) // { text: "...", detected_source_language: "..." }
}
