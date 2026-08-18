import { GoogleGenerativeAI } from "@google/generative-ai";
import { ENV } from "../lib/env.js";

export async function reviewCode(req, res) {
  try {
    const { code, language, problemTitle, problemDescription } = req.body;

    if (!code || !language) {
      return res.status(400).json({ message: "Code and language are required" });
    }

    if (!ENV.GEMINI_API_KEY || ENV.GEMINI_API_KEY === "your_gemini_api_key_here") {
      console.error("GEMINI_API_KEY is not set or is still the placeholder in .env file");
      return res.status(500).json({
        message: "Gemini API key is not configured. Please add a valid GEMINI_API_KEY in backend/.env",
      });
    }

    // Initialize client here so it always uses the current key
    const genAI = new GoogleGenerativeAI(ENV.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

    const prompt = `You are an expert code reviewer for a technical interview platform. Analyze the following ${language} solution and provide a structured review.

Problem: ${problemTitle || "Unknown"}
Description: ${problemDescription || "Not provided"}

Code:
\`\`\`${language}
${code}
\`\`\`

Provide your review in the following JSON format (respond ONLY with valid JSON, no markdown):
{
  "correctness": {
    "score": <1-10>,
    "summary": "<brief assessment of whether the solution is correct>"
  },
  "timeComplexity": {
    "notation": "<Big O notation, e.g. O(n)>",
    "explanation": "<brief explanation of why>"
  },
  "spaceComplexity": {
    "notation": "<Big O notation, e.g. O(1)>",
    "explanation": "<brief explanation of why>"
  },
  "codeQuality": {
    "score": <1-10>,
    "feedback": "<assessment of readability, naming, style, idiomatic usage>"
  },
  "edgeCases": [
    "<edge case the solution might miss or handles well>"
  ],
  "suggestions": [
    "<specific actionable improvement>"
  ],
  "overallFeedback": "<2-3 sentence summary of the review>"
}`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse the JSON from the AI response (strip markdown fences if present)
    let review;
    try {
      const cleaned = responseText.replace(/```json\n?/g, "").replace(/```\n?/g, "").trim();
      review = JSON.parse(cleaned);
    } catch (parseError) {
      console.log("Failed to parse Gemini response as JSON:", parseError.message);
      // If parsing fails, return the raw text as a fallback
      review = {
        correctness: { score: 0, summary: "Could not parse AI response" },
        timeComplexity: { notation: "N/A", explanation: "N/A" },
        spaceComplexity: { notation: "N/A", explanation: "N/A" },
        codeQuality: { score: 0, feedback: "N/A" },
        edgeCases: [],
        suggestions: [],
        overallFeedback: responseText,
      };
    }

    res.status(200).json({ review });
  } catch (error) {
    console.error("Error in reviewCode controller:", error.message);
    console.error("Full error:", error);
    res.status(500).json({ message: "Failed to generate AI review: " + error.message });
  }
}
