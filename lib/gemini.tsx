// lib/gemini.ts
import { GoogleGenerativeAI, type GenerativeModel } from '@google/generative-ai';

// Type definitions
interface WeatherData {
    rainfall: number[];
    riverLevels: number[];
    temperature: number[];
}

// type ChatRole = 'system' | 'user';
type DisasterType = 'flood' | 'earthquake' | 'wildfire' | 'hurricane' | 'tornado' | string;

// interface ChatMessage {
//     role: ChatRole;
//     parts: { text: string }[];
// }

// interface GenerationConfig {
//     temperature?: number;
//     maxOutputTokens?: number;
// }

// interface GenerateContentRequest {
//     contents: ChatMessage[];
//     generationConfig?: GenerationConfig;
// }

// Module state
let genAI: GoogleGenerativeAI | null = null;
let model: GenerativeModel | null = null;

/**
 * Initialize the Gemini API client
 * @throws {Error} If API key is missing or initialization fails
 */
function initializeGemini(): void {
    const API_KEY = process.env.GEMINI_API_KEY;
    if (!API_KEY) {
        throw new Error('GEMINI_API_KEY environment variable is not set');
    }

    try {
        genAI = new GoogleGenerativeAI(API_KEY);
        model = genAI.getGenerativeModel({
            model: 'gemini-1.5-pro',
            generationConfig: {
                temperature: 0.2,
                maxOutputTokens: 500,
            }
        });
    } catch (error) {
        console.error('Gemini API initialization error:', error);
        throw new Error(`Failed to initialize Gemini API: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

// Initialize on module load
initializeGemini();

/**
 * Generates disaster prediction based on weather data
 * @param data Weather data to analyze
 * @returns Formatted prediction with risk assessment
 * @throws {Error} If API is not initialized or request fails
 */
export async function generatePrediction(data: WeatherData): Promise<string> {
    if (!model) throw new Error('Gemini API not initialized');

    const prompt = `
    Analyze this weather data and predict disaster risk:
    Rainfall (mm): ${data.rainfall.join(', ')}
    River levels (m): ${data.riverLevels.join(', ')}
    Temperature (°C): ${data.temperature.join(', ')}
    
    Provide:
    1. Risk assessment on a scale of 1-10
    2. Detailed recommendations
    3. Potential impact areas
    
    Format with clear section headings.
  `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        return result.response.text();
    } catch (error) {
        console.error('Prediction generation error:', error);
        throw new Error(`Prediction failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
}

/**
 * Gets emergency response guidance from chatbot
 * @param query User's question
 * @param disasterType Type of disaster
 * @returns Assistant's response
 * @throws {Error} If API is not initialized or request fails
 */
export async function getChatbotResponse(query: string, disasterType: DisasterType): Promise<string> {
    if (!model) throw new Error('Gemini API not initialized');

    // Combine system prompt + user query into one message
    const prompt = `
You are an emergency response assistant specialized in ${disasterType}.
Provide:
- Life-saving actions first
- Evacuation routes if applicable
- Emergency contact numbers
- Safety precautions

Keep response under 300 words.
Use simple language.
Format with bullet points.

User query: ${query}
    `;

    try {
        const result = await model.generateContent({
            contents: [{ role: 'user', parts: [{ text: prompt }] }]
        });
        const response = result.response.text();
        if (!response.trim()) throw new Error('Empty response from API');
        return response;
    } catch (error) {
        console.error('Chatbot response error:', error);
        throw new Error(`Emergency guidance unavailable: ${error instanceof Error ? error.message : 'Try again later'}`);
    }
}

/**
 * Checks if Gemini API is ready
 * @returns boolean indicating initialization status
 */
export function isGeminiInitialized(): boolean {
    return model !== null;
}