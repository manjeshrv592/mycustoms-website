import { type NextRequest, NextResponse } from "next/server";
import { translateText } from "@/lib/translate";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { text, sourceLanguage, targetLanguage } = body;

    if (!text || !sourceLanguage || !targetLanguage) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: text, sourceLanguage, targetLanguage",
        },
        { status: 400 }
      );
    }

    const translatedText = await translateText({
      text,
      sourceLanguage,
      targetLanguage,
    });

    return NextResponse.json({ translatedText });
  } catch (error) {
    console.error("Translation API error:", error);
    return NextResponse.json({ error: "Translation failed" }, { status: 500 });
  }
}
