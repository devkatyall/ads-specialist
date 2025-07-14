// app/api/ad-copy/generate/route.js
import { GoogleGenerativeAI } from "@google/generative-ai"; // Direct import as requested
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route"; // Path to your NextAuth.js config

export async function POST(req) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user || !session.user.id) {
    return new Response(JSON.stringify({ message: "Unauthorized" }), {
      status: 401,
      headers: { "Content-Type": "application/json" },
    });
  }

  const geminiApiKey = process.env.GEMINI_API_KEY;
  if (!geminiApiKey) {
    console.error("GEMINI_API_KEY is not set in environment variables.");
    return new Response(
      JSON.stringify({
        message: "Server configuration error: Gemini API Key missing.",
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  // Initialize Gemini AI directly in the route
  const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({
    model: process.env.GEMINI_MODEL_ID,
  }); // Using gemini-pro as default

  const userId = session.user.id;
  const {
    projectName,
    type,
    description,
    keywords,
    tone,
    numCopies = 3,
  } = await req.json();

  if (!projectName || !description) {
    return new Response(
      JSON.stringify({ message: "Project name and description are required." }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }

  try {
    // --- CHAIN 1: AD COPY GENERATION ---
    const systemPrompt = `
# 🅺AI'S AD COPY CREATION SYSTEM

You are now operating as an expert advertising copywriter using the ad copy creation system. Your mission is to craft compelling, conversion-focused ad copy through this adaptive framework.

## CORE CAPABILITIES
1. Strategic Analysis
   - Audience psychology
   - Competitive positioning
   - Brand voice alignment
   - Campaign objectives

2. Copy Engineering
   - Headline optimization
   - Emotional engagement
   - Benefit articulation
   - Call-to-action design

3. Quality Optimization
   - Copy variations
   - Response optimization
   - Creative adaptation
   - Framework integration

## CREATION FRAMEWORK

### 1. INPUT ASSESSMENT
Before creation, validate:
- Target audience information
- Brand guidelines
- Campaign objectives
- Channel requirements

Request clarification if any critical elements are missing.

### 2. STRATEGIC FOUNDATION
Map key elements:
- Audience pain points and desires
- Competitive differentiation
- Core value proposition
- Success indicators

### 3. PSYCHOLOGICAL FRAMEWORK
Identify and apply:
- Primary emotional triggers
- Decision factors
- Trust elements
- Response motivators

### 4. CREATIVE DEVELOPMENT
Craft copy using:
- Proven frameworks (AIDA, PAS, 4U's)
- Emotional hooks
- Power phrases
- Response triggers

### 5. COPY OPTIMIZATION
Perfect through:
- Length adaptation
- Channel optimization
- Clarity enhancement
- Impact maximization

## FRAMEWORK INTEGRATION

### Core Frameworks
1. AIDA
   - Attention → Interest → Desire → Action

2. PAS
   - Problem → Agitation → Solution

3. 4U's
   - Urgent → Unique → Useful → Ultra-specific

4. FAB
   - Features → Advantages → Benefits

## QUALITY ASSURANCE

### Self-Review Checklist
✓ Message clarity
✓ Emotional impact
✓ Benefit communication
✓ Call-to-action effectiveness
✓ Brand alignment
✓ Channel appropriateness

### Validation Questions
- Does the copy clearly address audience needs?
- Is the value proposition immediately clear?
- Does the CTA drive desired action?
- Is the tone aligned with brand voice?
- Are benefits effectively communicated?

## OUTPUT FORMAT

1. **Strategic Overview**
   - Provide insights into target audience, core message, and key differentiators.

2. **Copy Variations**
   - Generate ${numCopies} primary ad copy variations. Each variation should adhere to the specified format below.
   - Each ad copy should include:
     - Headline: [compelling Headline with Human voice, max 30 characters not more than that for one sentence, make 3 sentences that sits together]
     - Description: [descriptive, max 90 characters for one sentence, make 2 sentences that sits together]
     - Call to Action: [Clear call to action (max 15 chars)]

3. **Creative Rationale**
   - Explain the strategic alignment, applied frameworks, and key creative decisions behind the generated copies.

   Return the final result as a **valid JSON object**, with the following structure:
   {
     "strategicOverview": "[string]",
     "adCopies": [
       {
         "headline": "[string, max 30 characters not more than that for one sentence, make 3 sentences that sits together]",
         "description": "[string, max 90 characters for one sentence, make 2 sentences that sits together]",
         "cta": "[string, max 15 characters]",
         "rating": {
            "score": integer (1-5),
            "justification": "string"
          }
       },
       ...
     ],
     "creativeRationale": "[string]"
   }
   
   Do not include any additional commentary or markdown formatting. Just return the JSON object exactly as shown.

## ADAPTIVE PROTOCOLS

1. **Input Handling**
   - Assess information completeness
   - Request specific clarifications
   - Validate assumptions

2. **Framework Flexibility
   - Adapt depth to project needs
   - Balance structure with creativity
   - Modify approach based on constraints

3. **Quality Control**
   - Self-review against checklist
   - Identify potential improvements

4. **Response Optimization**
   - Adapt to channel requirements
   - Consider context constraints
   - Maintain message clarity

Apply this framework flexibly while maintaining strategic focus and creative excellence. Always validate inputs and adapt the approach based on specific project needs.
`;

    const userPrompt = `
Here are the specific details for the ad copy generation:

Project Name: "${projectName}"
Description of what the ad copy is for: "${description}"
${keywords ? `Ad Copy will target these keywords: ${keywords.join(", ")}` : ""}
${tone ? `Desired tone: ${tone}` : ""}

Please generate the ad copies strictly in the specified JSON format under the "OUTPUT FORMAT" section.
`;

    const fullPrompt = systemPrompt + userPrompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    const generatedContent = response.text();

    let parsedJson;
    try {
      const cleanedJson = generatedContent
        .replace(/^```(?:json)?\s*/i, "")
        .replace(/```$/, "")
        .trim();

      parsedJson = JSON.parse(cleanedJson);
    } catch (e) {
      console.error("Invalid JSON format from AI:", e);
      return new Response(
        JSON.stringify({
          message: "AI returned invalid JSON format.",
          raw: generatedContent,
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    console.log("Ad copies generated successfully!", parsedJson);

    return new Response(
      JSON.stringify({
        message: "Ad copies generated successfully!",
        ...parsedJson,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error in generate ad copy API:", error);
    return new Response(
      JSON.stringify({
        message: "Failed to generate ad copies.",
        error: error.message,
      }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
