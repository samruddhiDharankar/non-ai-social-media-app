import logger from "../logger";

export const analyzeTextContent = async (text: string) => {
  try {
    const response = await fetch(process.env.HUGGING_FACE_API_URL as string, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.HUGGING_FACE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ inputs: text }),
    });

    if (!response.ok) {
      logger.error("Failed to fetch AI detection results");
      return 0;
    }

    const result = await response.json();

    const prediction = result[0];
    const real = prediction.find((p: any) => p.label === "Real");
    const fake = prediction.find((p: any) => p.label === "Fake");

    const score = Math.round((real?.score ?? 0) * 100);

    // dummy model
    const aiResult = {
      score: score, // 0-100, higher = more human
      modelUsed: "roberta-base-openai-detector",
      isAIContentLikely: (fake?.score ?? 0) > 0.7,
      confidenceScore: +(fake?.score ?? 0).toFixed(2),
      explanation:
        score > 80
          ? "This content appears to be human-written."
          : score > 50
          ? "Parts of this may resemble AI-generated content."
          : "This content strongly resembles AI-generated content.",
    };
    return aiResult;
  } catch (error) {
    const err = error instanceof Error ? error : new Error("Unknown error");
    logger.error(`Logout error, Error: ${err.message}`);
  }
};
