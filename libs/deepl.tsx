export async function Translator(text: string, target: string) {
const res = await fetch("/api/translate", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    text,
    target_lang: target,
  }),
});


  if (!res.ok) {
    const err = await res.text();
    throw new Error(`翻訳失敗: ${res.status} - ${err}`);
  }

  return await res.json(); // { text: "...", detected_source_language: "..." }
}
