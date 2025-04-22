import translate, { DeeplLanguages } from 'deepl'
export async function Translator(text: string, target: DeeplLanguages) {
  const auth_key = process.env.NEXT_PUBLIC_DEEPL_AUTH_KEY ?? "";
  const response = await fetch("https://api-free.deepl.com/v2/translate", {
    method: "POST",
    headers: {
      "Authorization": `DeepL-Auth-Key ${auth_key}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      text,
      target_lang: target,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`翻訳失敗: ${response.status} - ${errorText}`);
  }

  const data = await response.json();
  return data.translations[0]; // { text: "...", detected_source_language: "..." }
}
