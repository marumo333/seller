export type DeeplLanguages = 'EN-US' | 'JA' | 'DE' | 'FR' | 'ES' | 'IT' | 'PT' | 'RU' | 'ZH';

export async function Translator(text: string, targetLang: DeeplLanguages): Promise<{ text: string }> {
  const response = await fetch('/api/translate', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      text: text,
      target_lang: targetLang,
    }),
  });

  if (!response.ok) {
    throw new Error(`Translation failed: ${response.statusText}`);
  }

  const data = await response.json();
  return { text: data.text };
}