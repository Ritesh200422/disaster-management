import { generatePrediction } from '@/lib/gemini';

export async function GET() {
    try {
        // In a real app, this would come from sensors/weather APIs
        const historicalData = {
            rainfall: [150, 200, 250, 300, 320],
            riverLevels: [2.1, 2.3, 2.5, 2.7, 3.0],
            temperature: [25, 26, 27, 28, 29]
        };

        const analysisText = await generatePrediction(historicalData);

        // Extract risk level from analysis
        // In a real app, you'd parse this more robustly
        const riskLevel = analysisText.includes('high risk') ? 8 :
            analysisText.includes('moderate risk') ? 5 : 3;

        return Response.json({
            riskLevel,
            analysis: analysisText,
            location: 'Kerala',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Prediction error:', error);
        return Response.json({ error: 'Failed to generate prediction' }, { status: 500 });
    }
}