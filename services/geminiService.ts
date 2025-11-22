
import { GoogleGenAI, Type } from '@google/genai';
import { AnalysisResult, ContentType } from '../types';

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to create simple score schema
const createScoreSchema = (detailsProps?: Record<string, any>): any => {
    const schema: any = {
        type: Type.OBJECT,
        properties: {
            score: { type: Type.INTEGER, description: "0-100" },
            summary: { type: Type.STRING },
            recommendations: { type: Type.ARRAY, items: { type: Type.STRING } },
        },
        required: ['score', 'summary', 'recommendations']
    };
    if (detailsProps) {
        schema.properties.details = {
            type: Type.OBJECT,
            properties: detailsProps,
            required: Object.keys(detailsProps),
            nullable: true
        };
    }
    return schema;
};

// --- Detailed Schemas ---

const seoDetails = {
    readabilityScore: { type: Type.INTEGER },
    readingGrade: { type: Type.STRING },
    keywordDensity: { type: Type.STRING },
};

const serpDetails = {
    rankingPotentialScore: { type: Type.INTEGER }, // 0-100
    estimatedPosition: { type: Type.STRING }, // e.g., "#4"
    rankingConfidence: { type: Type.STRING }, // "85%"
};

const differentiationMetricsSchema = {
    type: Type.OBJECT,
    properties: {
        uniquenessScore: { type: Type.INTEGER },
        uniqueValueProps: { type: Type.ARRAY, items: { type: Type.STRING } },
        semanticSimilarity: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    competitorName: { type: Type.STRING },
                    similarPercentage: { type: Type.INTEGER },
                    uniquePercentage: { type: Type.INTEGER },
                }
            }
        },
        contentOverlap: {
            type: Type.OBJECT,
            properties: {
                sharedTopics: { type: Type.INTEGER },
                uniqueTopics: { type: Type.INTEGER },
                totalTopics: { type: Type.INTEGER },
                overlapPercentage: { type: Type.INTEGER },
            }
        },
        angleRecommendations: {
            type: Type.ARRAY,
            items: {
                type: Type.OBJECT,
                properties: {
                    title: { type: Type.STRING },
                    potentialScore: { type: Type.INTEGER },
                    competitionLevel: { type: Type.STRING, enum: ['Low', 'Medium', 'High'] },
                    description: { type: Type.STRING }
                }
            }
        }
    }
};

const contentGapSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            topic: { type: Type.STRING },
            userCoverage: { type: Type.INTEGER }, // 0-100
            competitorCoverage: { type: Type.INTEGER } // 0-100
        }
    }
};

const keywordMetricsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            keyword: { type: Type.STRING },
            density: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Optimal', 'High', 'Low'] },
            count: { type: Type.INTEGER }
        }
    }
};

// New Schemas for requested details
const headingStructureSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            tag: { type: Type.STRING, enum: ['H1', 'H2', 'H3', 'H4'] },
            count: { type: Type.INTEGER },
            status: { type: Type.STRING, enum: ['Optimal', 'Good', 'Warning', 'Missing'] }
        }
    }
};

const metaDescriptionSchema = {
    type: Type.OBJECT,
    properties: {
        length: { type: Type.INTEGER },
        status: { type: Type.STRING, enum: ['Optimal', 'Too Short', 'Too Long', 'Missing'] },
        preview: { type: Type.STRING }
    }
};

const voiceSearchSchema = {
    type: Type.OBJECT,
    properties: {
        questionFormatScore: { type: Type.INTEGER },
        conversationalToneScore: { type: Type.INTEGER },
        snippetPotentialScore: { type: Type.INTEGER }
    }
};

// Humanization Sub-Schemas
const aiPatternsSchema = {
    type: Type.ARRAY,
    items: {
        type: Type.OBJECT,
        properties: {
            pattern: { type: Type.STRING },
            status: { type: Type.STRING, enum: ['Detected', 'Not Detected'] },
            confidence: { type: Type.INTEGER }
        }
    }
};

const sentenceComplexitySchema = {
    type: Type.OBJECT,
    properties: {
        varietyScore: { type: Type.INTEGER },
        avgLength: { type: Type.INTEGER },
        simplePercent: { type: Type.INTEGER },
        compoundPercent: { type: Type.INTEGER },
        complexPercent: { type: Type.INTEGER },
        compoundComplexPercent: { type: Type.INTEGER }
    }
};

const toneVoiceSchema = {
    type: Type.OBJECT,
    properties: {
        primaryTone: { type: Type.STRING },
        secondaryTone: { type: Type.STRING },
        consistencyScore: { type: Type.INTEGER },
        appropriatenessScore: { type: Type.INTEGER },
        characteristics: { type: Type.ARRAY, items: { type: Type.STRING } }
    }
};

const conversationalSchema = {
    type: Type.OBJECT,
    properties: {
        score: { type: Type.INTEGER },
        activeVoicePercent: { type: Type.INTEGER },
        pronounsCount: { type: Type.STRING },
        contractionsCount: { type: Type.INTEGER }
    }
};

// Main Schema
const responseSchema: any = {
    type: Type.OBJECT,
    properties: {
        contentType: { type: Type.STRING, enum: ['article', 'video'] },
        topic: { type: Type.STRING },
        speechReview: { type: Type.STRING },

        seo: createScoreSchema(seoDetails),
        serp: createScoreSchema(serpDetails),
        aeo: createScoreSchema(),
        humanization: createScoreSchema({
            humanLikelihood: { type: Type.INTEGER },
            naturalFlow: { type: Type.INTEGER },
            smoothness: { type: Type.INTEGER },
            coherence: { type: Type.INTEGER },
            transitions: { type: Type.INTEGER },
            perplexity: { type: Type.STRING }
        }),
        differentiation: createScoreSchema(),

        // Detailed Visual Data
        differentiationMetrics: differentiationMetricsSchema,
        contentGaps: contentGapSchema,
        keywords: keywordMetricsSchema,

        // New Specific Data
        headingStructure: headingStructureSchema,
        metaDescription: metaDescriptionSchema,
        voiceSearch: voiceSearchSchema,

        // Extended Humanization Data
        aiPatterns: aiPatternsSchema,
        sentenceComplexity: sentenceComplexitySchema,
        toneVoice: toneVoiceSchema,
        conversational: conversationalSchema,

        // Base Stats
        wordCount: { type: Type.INTEGER },
        readingLevel: { type: Type.STRING },

        // Simplified Dimensions
        freshness: createScoreSchema(),
        engagement: createScoreSchema(),
        linking: createScoreSchema(),
        accessibility: createScoreSchema(),
        tone: createScoreSchema({ primaryTone: { type: Type.STRING }, consistencyScore: { type: Type.INTEGER } }),
        contentDepth: createScoreSchema(),
        sentiment: createScoreSchema(),

        // Video
        hook: createScoreSchema({ hookImpact: { type: Type.STRING }, retentionScore: { type: Type.INTEGER } }),
        caption: createScoreSchema(),
        hashtags: createScoreSchema(),
        visuals: createScoreSchema({ visualPacing: { type: Type.STRING } }),
        trend: createScoreSchema(),

        overall: {
            type: Type.OBJECT,
            properties: {
                score: { type: Type.INTEGER },
                summary: { type: Type.STRING }
            },
            required: ['score', 'summary']
        },
    },
    required: ['contentType', 'overall', 'seo']
};

const createPrompt = (content: string, contentType: ContentType, keywords: string, activeDimensions: string[], platform: string = 'YouTube') => {
    const dimensionList = activeDimensions.length > 0 ? activeDimensions.join(', ') : 'all standard metrics';

    let platformInstructions = "";
    if (contentType === 'video') {
        platformInstructions = `
        **PLATFORM CONTEXT: ${platform}**
        - Analyze specifically for ${platform} algorithms and audience.
        - For Instagram/TikTok: Focus on visual hooks, trending audio potential, and fast pacing.
        - For YouTube: Focus on retention, storytelling, and thumbnail potential.
      `;
    }

    return `
    You are GritGrade V3.1. Analyze this ${contentType}.
    Target Keywords: "${keywords || 'Auto-detect'}".
    
    **PRIORITY INSTRUCTIONS:**
    Analyze and generate scores/recommendations specifically for these dimensions: ${dimensionList}.
    ENSURE YOU RETURN DATA FOR EVERY SINGLE REQUESTED DIMENSION. DO NOT OMIT ANY.
    
    ${platformInstructions}

    **IMPORTANT FOR URL ANALYSIS:**
    If the content provided is a URL (starts with http/https):
    1. Attempt to infer the content topic and quality from the URL structure and any metadata you can simulate accessing.
    2. IF you cannot access the actual video/page content, DO NOT HALLUCINATE specific details. Instead, provide a "General Audit" based on best practices for that URL type, but explicitly mention in the 'summary' that deep analysis requires the script/text.
    3. However, try to be as helpful as possible with the metadata you *can* see.

    **HUMANIZATION ANALYSIS DETAILS:**
    - Detect specific AI patterns: "Repetitive phrasing", "Unnatural transitions", "Robotic sentence structure", "Generic conclusions".
    - Calculate Sentence Complexity: % of simple, compound, complex sentences.
    - Analyze Tone: Define primary/secondary tone and consistency.
    - Check Conversational: Active voice usage %, contractions found.

    **DIFFERENTIATION ANALYSIS DETAILS:**
    - Compare semantic similarity with hypothetical top competitors (Competitor 1, 2, 3).
    - Suggest 3 specific "Content Angle Recommendations" that would rank better (e.g. "Technical SEO Deep Dive" vs "General Guide"). Give each a potential score and competition level.

    Crucial Requirements:
    1. **Visual Data**: Generate data for charts matching the "GritGrade" dashboard.
    2. **SEO Details**: Count H1, H2, H3 tags exactly. Estimate Meta Description length. 
    3. **AEO**: Evaluate Voice Search Potential (Question format, conversational tone).
    4. **Recommendations**: Provide 3-5 actionable recommendations for *each* requested dimension.
    5. **Differentiation**: Compare against hypothetical top competitors.

    Content:
    ${content.substring(0, 15000)}
  `;
};

import { fetchPageDetails } from './serpService';
import { TrafficMetrics, AdvancedSEOMetrics } from '../types';

// Generate AI-estimated analytics based on content quality
const generateEstimatedAnalytics = (analysisResult: AnalysisResult): {
    trafficMetrics: TrafficMetrics;
    advancedSEO: AdvancedSEOMetrics;
} => {
    // Base estimates on overall score and SEO score
    const overallScore = analysisResult.overall.score;
    const seoScore = analysisResult.seo?.score || 70;

    // Generate traffic metrics (higher scores = better traffic estimates)
    const baseVisits = Math.floor((overallScore / 100) * 5000000000); // Up to 5B
    const baseUniqueVisitors = Math.floor(baseVisits * 0.24); // ~24% conversion

    const trafficMetrics: TrafficMetrics = {
        visits: {
            value: formatLargeNumber(baseVisits),
            change: (Math.random() * 16) - 8, // -8% to +8%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        uniqueVisitors: {
            value: formatLargeNumber(baseUniqueVisitors),
            change: (Math.random() * 11) - 5.5, // -5.5% to +5.5%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        pagesPerVisit: {
            value: 2.5 + (seoScore / 100) * 1.5, // 2.5 to 4.0
            change: (Math.random() * 6) - 3, // -3% to +3%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        avgDuration: {
            value: formatDuration(300 + (overallScore / 100) * 600), // 5-15 minutes
            change: (Math.random() * 4) - 2, // -2% to +2%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        bounceRate: {
            value: 80 - (overallScore / 100) * 30, // 50-80%
            change: Math.random() * 0.05, // Small change
            trend: Math.random() > 0.5 ? 'down' : 'up' // Lower bounce rate is better
        }
    };

    // Generate advanced SEO metrics
    const authorityValue = Math.floor(40 + (seoScore / 100) * 60); // 40-100
    const organicTrafficBase = Math.floor((seoScore / 100) * 2000000000); // Up to 2B
    const organicKeywordsBase = Math.floor((seoScore / 100) * 200000000); // Up to 200M

    const advancedSEO: AdvancedSEOMetrics = {
        authorityScore: {
            value: authorityValue,
            rank: Math.floor(1000000 - (authorityValue / 100) * 990000) // Higher authority = lower rank number
        },
        organicTraffic: {
            value: formatLargeNumber(organicTrafficBase),
            change: (Math.random() * 2) - 1, // -1% to +1%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        organicKeywords: {
            value: formatLargeNumber(organicKeywordsBase),
            change: (Math.random() * 4) - 2, // -2% to +2%
            trend: Math.random() > 0.5 ? 'up' : 'down'
        },
        paidKeywords: {
            value: formatLargeNumber(Math.floor(organicKeywordsBase * 0.005)), // 0.5% of organic
            percentage: 0.1 + Math.random() * 0.4 // 0.1% to 0.5%
        },
        referringDomains: {
            value: formatLargeNumber(Math.floor((seoScore / 100) * 10000000)), // Up to 10M
            change: (Math.random() * 3) - 1.5, // -1.5% to +1.5%
            trend: Math.random() > 0.5 ? 'up' : 'down',
            backlinks: formatLargeNumber(Math.floor((seoScore / 100) * 7000000000)) // Up to 7B
        }
    };

    return { trafficMetrics, advancedSEO };
};

// Helper to format large numbers (e.g., 1200000 -> "1.2M")
const formatLargeNumber = (num: number): string => {
    if (num >= 1000000000) return `${(num / 1000000000).toFixed(1)}B`;
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
};

// Helper to format duration in seconds to HH:MM:SS
const formatDuration = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
};

export const analyzeContent = async (
    content: string,
    inputType: 'text' | 'url',
    contentType: ContentType,
    keywords: string = '',
    activeDimensions: string[] = [],
    platform: string = 'YouTube'
): Promise<AnalysisResult> => {
    try {
        let finalContent = content;
        let contextInfo = "";

        // If URL, try to fetch real metadata to avoid hallucinations
        if (inputType === 'url') {
            const details = await fetchPageDetails(content);
            if (details.title) {
                contextInfo = `
            **REAL CONTENT METADATA (Fetched from ${details.platform || 'URL'}):**
            Title: "${details.title}"
            Channel/Creator: "${details.channel || 'Unknown'}"
            Views: "${details.views || 'N/A'}"
            Likes: "${details.likes || 'N/A'}"
            Description/Snippet: "${details.description}"
            
            **CRITICAL INSTRUCTION:**
            You are auditing a video based on this metadata. You do NOT have the full transcript.
            1. Use the **Title** and **Description** to understand the core topic and promise.
            2. Use **Views** and **Likes** (if available) to infer engagement and viral potential.
            3. Do NOT hallucinate a script. Analyze the *concept*, *packaging* (title/hook), and *audience appeal*.
            4. If the description is short, infer the likely content based on the title and niche standards.
            `;
                // Append context to content string so prompt sees it
                finalContent = `URL: ${content}\n${contextInfo}`;
            }
        }

        const prompt = createPrompt(finalContent, contentType, keywords, activeDimensions, platform);

        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                responseMimeType: 'application/json',
                responseSchema: responseSchema,
            },
        });

        const text = response.text.trim();
        const cleanText = text.replace(/^```json\s*|```\s*$/g, '');
        const result = JSON.parse(cleanText) as AnalysisResult;

        result.contentType = contentType;
        // Default to 2000 if missing
        if (!result.recommendedWordCount) result.recommendedWordCount = 2000;

        // Generate analytics estimates for article content
        if (contentType === 'article') {
            const analytics = generateEstimatedAnalytics(result);
            result.trafficMetrics = analytics.trafficMetrics;
            result.advancedSEO = analytics.advancedSEO;
        }

        return result;

    } catch (error) {
        console.error("Error analyzing content:", error);
        throw new Error("Failed to analyze content.");
    }
};
