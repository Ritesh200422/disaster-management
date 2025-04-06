import { NextResponse } from 'next/server';

interface AlertRequest {
    disasterType: string;
    severity: string;
    location: string;
    message?: string;
}

interface User {
    name: string;
    phone: string;
    email: string;
    location?: string;
}

interface NotificationResult {
    user: string;
    method: 'SMS' | 'Email' | 'Push';
    status: 'queued' | 'delivered' | 'failed';
    messageId: string;
    timestamp: string;
}

export async function POST(request: Request) {
    try {
        const body: AlertRequest = await request.json();
        const { disasterType, severity, location, message } = body;

        // Validate required fields
        if (!disasterType || !severity || !location) {
            return NextResponse.json(
                { error: 'Missing required fields (disasterType, severity, location)' },
                { status: 400 }
            );
        }
        

        // Simulated affected users
        const affectedUsers: User[] = [
            {
                name: 'John Doe',
                phone: '+1234567890',
                email: 'john@example.com',
                location: '123 Main St'
            },
            {
                name: 'Jane Smith',
                phone: '+0987654321',
                email: 'jane@example.com',
                location: '456 Oak Ave'
            }
        ];

        // Generate alert message
        // const alertMessage = message ||
        //     `EMERGENCY ALERT: ${severity.toUpperCase()} ${disasterType} warning for ${location}. ` +
        //     `Follow instructions from local authorities.`;
        console.log('Received message:', message);
        // Simulate sending notifications
        const notifications: NotificationResult[] = affectedUsers.map(user => {
            const method: 'SMS' | 'Email' | 'Push' = Math.random() > 0.5 ? 'SMS' : 'Email';
            const status: 'queued' | 'delivered' | 'failed' = Math.random() > 0.2 ? 'delivered' : 'failed';

            return {
                user: user.name,
                method,
                status,
                messageId: `msg_${Math.random().toString(36).substring(2, 15)}`,
                timestamp: new Date().toISOString()
            };
        });

        return NextResponse.json({
            success: true,
            message: `Alerts processed`,
            notifications,
            metadata: {
                disasterType,
                severity,
                location,
                sentAt: new Date().toISOString()
            }
        });

    } catch (error) {
        console.error('Alert processing error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}