// lib/GeminiService.js
// High-level wrappers around GeminiClient for defining AI tasks and prompts

import geminiClient from "./GeminiClient";
/**
 * Available AI tasks and their prompt templates.
 * You can customize or extend these as needed.
 */
export const AI_TASKS = {
  expandKeywords: {
    description: "Generate long-tail, high-intent keywords",
    prompt: (seeds) =>
      `You are a Google Ads keyword research assistant. Given seed keywords: ${JSON.stringify(
        seeds
      )}, generate a JSON object with a "keywords" array of high-intent, long-tail phrases. Only output valid JSON.`,
  },
  classifyIntent: {
    description: "Classify keyword intent (buy/info/compare)",
    prompt: (keywords) =>
      `You are a search intent classifier. Given keywords: ${JSON.stringify(
        keywords
      )}, return a JSON object with an "intents" array, each item with {"keyword": string, "intent": "buy"|"info"|"compare"}. Only output valid JSON.`,
  },
  suggestNegatives: {
    description: "Suggest negative keywords to exclude irrelevant traffic",
    prompt: (keywords) =>
      `You are a negative keyword identifier. Given target keywords: ${JSON.stringify(
        keywords
      )}, return a JSON object with a "negatives" array of terms to exclude. Only output valid JSON.`,
  },
  generateAdCopy: {
    description: "Write ad headlines and descriptions for a theme",
    prompt: (theme) =>
      `You are a Google Ads copywriting assistant. For ad group theme: "${theme}", generate a JSON object with "headlines" (array up to 5) and "descriptions" (array up to 2). Only output valid JSON.`,
  },
  generateInterests: {
    description: "Generate Facebook interest targets based on campaign details",
    prompt: (data) => {
      const {
        productService,
        targetAge,
        targetGender,
        targetLocation,
        targetIncome,
        interests,
        brands,
        interestCount,
      } = data;
      return `You are a Facebook Ads targeting specialist. Given the following campaign details:\
- Product/Service: ${productService}\
- Age Range: ${targetAge}\
- Gender: ${targetGender}\
- Location: ${targetLocation}\
- Income Level: ${targetIncome}\
- Existing Interests: ${interests}\
- Known Brands: ${brands}\
Generate a JSON object with property "interests" containing an array of ${interestCount} relevant Facebook interest keywords to target. Only output valid JSON.`;
    },
  },
};

class GeminiService {
  /**
   * Generic runner for any AI_TASKS entry.
   * @param {keyof AI_TASKS} taskKey
   * @param {any} input - payload for the prompt function
   * @param {object} options - optional GeminiClient request parameters
   */
  async run(taskKey, input, options = {}) {
    const task = AI_TASKS[taskKey];
    if (!task) throw new Error(`Unknown AI task: ${taskKey}`);

    const prompt = task.prompt(input);
    const raw = await geminiClient.request(prompt, options);
    try {
      return JSON.parse(raw);
    } catch (err) {
      throw new Error(`${taskKey}: Failed to parse JSON: ${err.message}`);
    }
  }

  expandKeywords(seeds, options) {
    return this.run("expandKeywords", seeds, options).then(
      (json) => json.keywords
    );
  }

  classifyIntent(keywords, options) {
    return this.run("classifyIntent", keywords, options).then(
      (json) => json.intents
    );
  }

  suggestNegatives(keywords, options) {
    return this.run("suggestNegatives", keywords, options).then(
      (json) => json.negatives
    );
  }

  generateAdCopy(theme, options) {
    return this.run("generateAdCopy", theme, options).then((json) => ({
      headlines: json.headlines,
      descriptions: json.descriptions,
    }));
  }

  /**
   * Generate Facebook Ads interest targets based on detailed campaign data.
   * @param {object} data - form data containing productService, targetAge, targetGender, targetLocation,
   *                       targetIncome, interests, brands, interestCount
   * @param {object} [options] - optional GeminiClient request parameters
   * @returns {Promise<string[]>} - array of generated interests
   */
  generateInterests(data, options) {
    return this.run("generateInterests", data, options).then(
      (json) => json.interests
    );
  }
}

export default new GeminiService();
