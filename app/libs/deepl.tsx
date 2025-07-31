export type DeeplLanguages = 'EN-US' | 'JA' | 'DE' | 'FR' | 'ES' | 'IT' | 'PT' | 'RU' | 'ZH';

export async function Translator(text: string, targetLang: DeeplLanguages): Promise<{ text: string }> {
  if (!process.env.DEEPL_AUTH_KEY) {
    throw new Error('DEEPL_AUTH_KEY is not set');
  }

  const response = await fetch('https://api-free.deepl.com/v2/translate', {
    method: 'POST',
    headers: {
      'Authorization': `DeepL-Auth-Key ${process.env.DEEPL_AUTH_KEY}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      text: text,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return { text: data.translations[0].text };
}