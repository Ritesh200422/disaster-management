import { NextResponse } from 'next/server';
import { getChatbotResponse } from '@/lib/gemini';

// Define types for the request and response
interface ChatbotRequest {
    query: string;
    disasterType: string;
}

interface ChatbotSuccessResponse {
    response: string;
    success: true;
}

interface ChatbotErrorResponse {
    response: string;
    success: false;
}

export async function POST(request: Request) {
    try {
        const body: ChatbotRequest = await request.json();
        const { query, disasterType } = body;

        // Validate required fields
        if (!query || !disasterType) {
            return NextResponse.json<ChatbotErrorResponse>(
                {
                    response: "Both query and disasterType are required",
                    success: false
                },
                { status: 400 }
            );
        }

        const response = await getChatbotResponse(query, disasterType);

        return NextResponse.json<ChatbotSuccessResponse>({
            response,
            success: true
        });
    } catch (error) {
        console.error('Chatbot error:', error);
        return NextResponse.json<ChatbotErrorResponse>(
            {
                response: "I'm sorry, I'm having trouble connecting to the emergency guidance system.",
                success: false
            },
            { status: 500 }
        );
    }
}