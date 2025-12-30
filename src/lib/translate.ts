const LIBRETRANSLATE_URL =
  process.env.LIBRETRANSLATE_URL || "http://localhost:5000";

interface TranslateRequest {
  text: string;
  sourceLanguage: string;
  targetLanguage: string;
}

interface TranslateResponse {
  translatedText: string;
}

/**
 * Translate text using LibreTranslate API
 */
export async function translateText({
  text,
  sourceLanguage,
  targetLanguage,
}: TranslateRequest): Promise<string> {
  if (!text || text.trim() === "") {
    return "";
  }

  // Map our locale codes to LibreTranslate codes
  const languageMap: Record<string, string> = {
    en: "en",
    nl: "nl",
    de: "de",
    cn: "zh", // Chinese uses 'zh' in LibreTranslate
  };

  const source = languageMap[sourceLanguage] || sourceLanguage;
  const target = languageMap[targetLanguage] || targetLanguage;

  try {
    const response = await fetch(`${LIBRETRANSLATE_URL}/translate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        q: text,
        source,
        target,
      }),
    });

    if (!response.ok) {
      throw new Error(`Translation failed: ${response.statusText}`);
    }

    const data: TranslateResponse = await response.json();
    return data.translatedText;
  } catch (error) {
    console.error("Translation error:", error);
    throw error;
  }
}

/**
 * Translate multiple texts in batch
 */
export async function translateBatch(
  texts: string[],
  sourceLanguage: string,
  targetLanguage: string
): Promise<string[]> {
  const results = await Promise.all(
    texts.map((text) => translateText({ text, sourceLanguage, targetLanguage }))
  );
  return results;
}
