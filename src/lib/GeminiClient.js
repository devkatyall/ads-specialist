// lib/GeminiClient.js
// Required environment variables:
//   GEMINI_MODEL_ID=gemini-2.0-flash      # ID of the Gemini model to use
//   GEMINI_API_KEY=your_api_key_here       # Your Google API key for Generative Language API
//   (Optional) GEMINI_API_URL=...          # Override default endpoint URL

// Thin HTTP client for calling the Gemini API via API key

class GeminiClient {
  /**
   * @param {object} config
   * @param {string} config.modelId - The Gemini model ID (e.g. 'gemini-2.0-flash')
   * @param {string} config.apiKey  - Your Google API key
   * @param {string} [config.apiUrl] - Optional override for the endpoint URL
   */
  constructor({ modelId, apiKey, apiUrl } = {}) {
    this.modelId = modelId || process.env.GEMINI_MODEL_ID;
    this.apiKey = apiKey || process.env.GEMINI_API_KEY;
    this.apiUrl =
      apiUrl ||
      `https://generativelanguage.googleapis.com/v1beta/models/${this.modelId}:generateContent`;

    if (!this.modelId || !this.apiKey) {
      throw new Error(
        "GeminiClient: Missing GEMINI_MODEL_ID or GEMINI_API_KEY env vars"
      );
    }
  }

  /**
   * Send a prompt to the Gemini API and return the generated text.
   * @param {string} prompt - The text you want the model to complete
   * @param {object} [options] - Generation parameters
   * @param {number} [options.temperature=0.7]
   * @param {number} [options.maxOutputTokens=256]
   * @param {number} [options.topP=0.8]
   * @returns {Promise<string>} - The generated content
   */
  async request(
    prompt,
    { temperature = 0.7, maxOutputTokens = 256, topP = 0.8 } = {}
  ) {
    const url = `${this.apiUrl}?key=${this.apiKey}`;
    const body = {
      contents: [{ parts: [{ text: prompt }] }],
      temperature,
      maxOutputTokens,
      topP,
    };

    const response = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Gemini API error ${response.status}: ${err}`);
    }

    const data = await response.json();
    // The API returns an array of candidates under 'candidates' or inside 'responses'
    const candidates = data.candidates || data.responses?.[0]?.candidates;
    if (!Array.isArray(candidates) || !candidates.length) {
      throw new Error("GeminiClient: No candidates returned");
    }

    const content = candidates[0].content || candidates[0].text;
    if (typeof content !== "string") {
      throw new Error("GeminiClient: Unexpected candidate format");
    }
    return content;
  }
}

// Export a singleton instance
const geminiClient = new GeminiClient();
export default geminiClient;
