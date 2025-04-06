import { NextResponse } from 'next/server';

interface Resource {
    type: string;
    count: number;
    location: string;
    estimatedArrivalTime: string;
    status?: 'available' | 'en-route' | 'deployed';
}

interface ResourceResponse {
    disasterType: string;
    location: string;
    allocatedResources: Resource[];
    timestamp: string;
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const disasterType = searchParams.get('disasterType') || 'flood';
        const location = searchParams.get('location') || 'River Valley';

        // Validate disasterType
        const validDisasterTypes = ['flood', 'fire', 'earthquake', 'hurricane', 'tsunami'];
        if (!validDisasterTypes.includes(disasterType)) {
            return NextResponse.json(
                { error: 'Invalid disaster type' },
                { status: 400 }
            );
        }

        // Database simulation with typed resources
        const availableResources: Record<string, Resource[]> = {
            'flood': [
                {
                    type: 'Rescue Boat',
                    count: 5,
                    location: 'Fire Station 1',
                    estimatedArrivalTime: '15 minutes',
                    status: 'available'
                },
                {
                    type: 'Sand Bags',
                    count: 1000,
                    location: 'City Warehouse',
                    estimatedArrivalTime: '30 minutes',
                    status: 'available'
                },
                {
                    type: 'Water Pumps',
                    count: 10,
                    location: 'Public Works Dept',
                    estimatedArrivalTime: '20 minutes',
                    status: 'available'
                }
            ],
            'fire': [
                {
                    type: 'Fire Truck',
                    count: 3,
                    location: 'Fire Station 2',
                    estimatedArrivalTime: '10 minutes',
                    status: 'available'
                },
                {
                    type: 'Helicopter',
                    count: 1,
                    location: 'County Airport',
                    estimatedArrivalTime: '25 minutes',
                    status: 'en-route'
                }
            ],
            'earthquake': [
                {
                    type: 'Search & Rescue Team',
                    count: 2,
                    location: 'Police HQ',
                    estimatedArrivalTime: '15 minutes',
                    status: 'available'
                },
                {
                    type: 'Medical Supplies',
                    count: 50,
                    location: 'City Hospital',
                    estimatedArrivalTime: '20 minutes',
                    status: 'available'
                }
            ],
            'hurricane': [
                {
                    type: 'Emergency Shelter Kits',
                    count: 200,
                    location: 'Red Cross Facility',
                    estimatedArrivalTime: '45 minutes',
                    status: 'available'
                }
            ],
            'tsunami': [
                {
                    type: 'Life Vests',
                    count: 150,
                    location: 'Coast Guard Station',
                    estimatedArrivalTime: '30 minutes',
                    status: 'available'
                }
            ]
        };

        const allocatedResources = availableResources[disasterType] || [];

        const response: ResourceResponse = {
            disasterType,
            location,
            allocatedResources,
            timestamp: new Date().toISOString()
        };

        return NextResponse.json(response);

    } catch (error) {
        console.error('Resource allocation error:', error);
        return NextResponse.json(
            {
                error: 'Failed to allocate resources',
                details: error instanceof Error ? error.message : 'Unknown error'
            },
            { status: 500 }
        );
    }
}