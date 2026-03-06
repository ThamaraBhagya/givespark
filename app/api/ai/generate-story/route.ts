// app/api/ai/generate-story/route.ts
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { title, category, description } = await req.json();

    if (!title || !description) {
      return NextResponse.json(
        { error: "Title and description are required" },
        { status: 400 }
      );
    }

    if (!process.env.OPENROUTER_API_KEY) {
      console.error("Missing OpenRouter API key");
      return NextResponse.json(
        { error: "AI service configuration error. Please contact support." },
        { status: 500 }
      );
    }

    // OpenRouter API endpoint
    const OPENROUTER_API_URL = "https://openrouter.ai/api/v1/chat/completions";
    
    
    const MODEL = "meta-llama/llama-3.2-3b-instruct:free"; // Free model
    

    
    const prompt = `You are an expert crowdfunding copywriter with 15 years of experience creating successful campaigns. Your specialty is crafting emotional, compelling stories that inspire people to take action and donate.

Write a complete crowdfunding story for a campaign with these details:

CAMPAIGN TITLE: "${title}"
CATEGORY: ${category}
PROJECT DESCRIPTION: ${description}

IMPORTANT INSTRUCTIONS:
1. Write in a professional yet emotional tone
2. Structure the story with clear sections
3. Include specific, believable details
4. Create a sense of urgency and hope
5. End with a powerful call to action
6. Write in PLAIN TEXT only.
7. DO NOT use Markdown (no #, no **, no ---, no >).
8. DO NOT use emojis.
9. Structure the story into 5-6 clear, spaced paragraphs.
10. Do not include section headers (like "The Hook" or "Our Solution"). Just tell the story naturally.
11. Start immediately with the narrative.

STORY STRUCTURE:
1. **The Hook** - Start with an emotional, attention-grabbing opening paragraph
2. **The Problem** - Describe the challenge or opportunity in detail
3. **Our Solution** - Explain how this project addresses the problem
4. **How Funds Will Be Used** - Provide a clear, transparent budget breakdown
5. **The Impact** - Describe the difference this will make
6. **Call to Action** - End with an inspiring appeal for support

Make the story approximately 500-700 words. Use clear, persuasive language that builds trust and motivates action. Avoid generic phrases and focus on creating a unique, compelling narrative based on the provided details.`;

    console.log("Calling OpenRouter API with model:", MODEL);

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 60000); // 60 second timeout

    try {
      const response = await fetch(OPENROUTER_API_URL, {
        headers: {
          "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
          "HTTP-Referer": "http://localhost:3000", // Required by OpenRouter
          "X-Title": "Crowdfunding Platform", 
        },
        method: "POST",
        body: JSON.stringify({
          model: MODEL,
          messages: [
            {
              role: "system",
              content: "You are a professional crowdfunding copywriter. You write compelling, emotional stories that inspire action and donations. Your writing is clear, persuasive, and trustworthy."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.8,
          max_tokens: 1500,
          top_p: 0.9,
          frequency_penalty: 0.1,
          presence_penalty: 0.1,
          stream: false
        }),
        signal: controller.signal
      });

      clearTimeout(timeout);

      if (!response.ok) {
        const errorText = await response.text();
        console.error("OpenRouter API Error:", response.status, errorText);
        
        try {
          const errorJson = JSON.parse(errorText);
          return NextResponse.json({
            error: errorJson.error?.message || `OpenRouter error: ${response.status}`,
            details: errorJson
          }, { status: response.status });
        } catch {
          return NextResponse.json({
            error: `OpenRouter API error (${response.status}): ${errorText}`
          }, { status: response.status });
        }
      }

      const result = await response.json();
      console.log("OpenRouter response received");

      // Extract the story from OpenRouter response
      const story = result.choices?.[0]?.message?.content;
      
      if (!story) {
        console.error("No story in response:", result);
        return NextResponse.json({
          error: "AI service returned empty response",
          fallback: createFallbackStory(title, category, description)
        }, { status: 200 });
      }

      // Clean up the story
      let finalStory = story.trim();
      
      // Remove any potential system prompts or artifacts
      finalStory = finalStory
        .replace(/^(As an AI assistant|As a crowdfunding expert)[^.]*\.\s*/i, '')
        .replace(/^(I'll create|I will write)[^.]*\.\s*/i, '')
        .trim();

      // Ensure the story is substantial
      if (finalStory.length < 200) {
        console.warn("Generated story too short, using enhanced fallback");
        finalStory = createEnhancedFallbackStory(title, category, description);
      }

      return NextResponse.json({
        story: finalStory,
        note: "AI-generated content. Please review, personalize, and add your own voice.",
        model: MODEL,
        tokens: result.usage?.total_tokens,
        success: true
      });

    } catch (fetchError: any) {
      clearTimeout(timeout);
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json({
          error: "AI request timed out. The service might be busy.",
          fallback: createFallbackStory(title, category, description)
        }, { status: 200 });
      }
      
      console.error("Fetch error:", fetchError);
      throw fetchError;
    }

  } catch (error: any) {
    console.error("Unexpected error in AI generation:", error);
    
    
    let title = "", category = "", description = "";
    try {
      const body = await req.json();
      title = body.title || "";
      category = body.category || "";
      description = body.description || "";
    } catch {}
    
    return NextResponse.json({
      story: createFallbackStory(title, category, description),
      note: "AI service temporarily unavailable. Here's a template to help you get started.",
      error: error.message,
      fallback: true
    }, { status: 200 });
  }
}

function createFallbackStory(title: string, category: string, description: string): string {
  return `# ${title || "Our Campaign"}

## About This Project

${description || "We're launching an initiative to create positive change in our community."}

**Category:** ${category || "Community Project"}

### The Challenge

Every day, we see opportunities for improvement and growth. This project addresses a critical need that has been overlooked for too long.

### Our Vision

Our solution is designed to be sustainable, impactful, and community-focused.

### How Your Support Helps

Your contribution will support:
- Initial implementation and setup
- Resources and materials
- Community engagement
- Long-term sustainability

### Join Us

Be part of something meaningful. Your support creates real impact.`;
}

function createEnhancedFallbackStory(title: string, category: string, description: string): string {
  return `# ${title || "Transforming Lives Through Innovation"}

## The Vision Behind Our Campaign

**${description || "We're on a mission to create lasting positive change through innovative solutions that address real community needs."}**

### **Category:** ${category || "Social Impact"}

---

### 🌟 Why This Matters

Imagine a world where ${description.split(' ').slice(0, 10).join(' ') || "positive change happens every day"}. That's the world we're working to create. Right now, we have an opportunity to make a significant difference, but we can't do it alone.

### 🔍 The Reality We Face

While many organizations talk about change, we're committed to creating tangible, measurable impact. The challenge is real, and the need is urgent. Every day that passes without action is a missed opportunity to improve lives.

### 💡 Our Innovative Approach

Our solution combines proven methods with innovative thinking. We've spent months researching, planning, and building partnerships to ensure our approach is both effective and sustainable. Here's what sets us apart:

1. **Community-Centered Design** - Solutions created with the community, not just for them
2. **Transparent Operations** - Every dollar accounted for, every result measured
3. **Scalable Model** - Designed to grow and adapt to increasing needs
4. **Long-Term Focus** - Building foundations for sustained impact

### 📊 How Your Contribution Creates Change

| Area of Impact | Percentage | What It Supports |
|----------------|------------|------------------|
| Direct Implementation | 45% | Materials, resources, and on-ground execution |
| Community Outreach | 25% | Engagement, education, and partnership building |
| Monitoring & Evaluation | 15% | Tracking impact and ensuring effectiveness |
| Operational Support | 10% | Administration, logistics, and coordination |
| Contingency Fund | 5% | Unforeseen challenges and opportunities |

### 🎯 Our Specific Goals

With your support, we will achieve:
- **Short-term (1-3 months):** Initial rollout and community engagement
- **Medium-term (3-6 months):** Full implementation and early impact assessment
- **Long-term (6-12 months):** Sustainable operations and expansion planning

### 🤝 Why Your Support Matters

You're not just donating to a campaign – you're investing in:
- **Real change** that you can see and measure
- **Community empowerment** that lasts beyond our involvement
- **Innovative solutions** that can be replicated elsewhere
- **Hope and opportunity** for those who need it most

### 💫 The Ripple Effect

Your contribution creates waves of positive change:
1. **Direct beneficiaries** receive immediate support
2. **Families and communities** experience improved conditions
3. **Local economies** benefit from increased stability
4. **Future generations** inherit a better foundation

### 📈 Our Commitment to You

We promise:
- **Monthly updates** on progress and challenges
- **Transparent financial reporting**
- **Direct stories** from those impacted
- **Responsive communication** to all our supporters

### 🚀 Join Our Movement Today

This is your moment to be part of something bigger than yourself. Whether you contribute $10 or $1,000, you're sending a powerful message: **you believe in change, you believe in hope, and you believe in action.**

### ✨ Special Recognition

All supporters will receive:
- Digital certificate of appreciation
- Regular impact reports
- Invitation to virtual update sessions
- Recognition on our website (unless anonymous)

---

## **Ready to Make a Difference?**

**Click support now** and join a community of change-makers who are turning vision into reality. Share this campaign with friends, family, and colleagues who care about making the world better.

**Together, we can create the change we wish to see.**

*"The best time to plant a tree was 20 years ago. The second best time is now."*`;
}