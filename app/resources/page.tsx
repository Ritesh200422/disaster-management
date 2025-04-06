'use client';

import { useState, useEffect } from 'react';
import ResourceList from './../components/ResourceList';

export default function Resources() {
    const [resources, setResources] = useState< | null>(null);
    const [loading, setLoading] = useState(true);
    const [disasterType, setDisasterType] = useState('flood');
    const [location, setLocation] = useState('Kerala');

    useEffect(() => {
        async function fetchResources() {
            setLoading(true);
            try {
                const response = await fetch(`/api/resources?disasterType=${disasterType}&location=${location}`);
                const data = await response.json();
                setResources(data);
            } catch (error) {
                console.error('Failed to fetch resources:', error);
                setResources(null);
            } finally {
                setLoading(false);
            }
        }

        fetchResources();
    }, [disasterType, location]);

    return (
        <div className="card">
            <div className="card-header bg-success">
                <h4>Resource Allocation</h4>
            </div>
            <div className="card-body">
                <div className="mb-3 row">
                    <div className="col-md-6">
                        <label htmlFor="disaster-type" className="form-label">Disaster Type</label>
                        <select
                            id="disaster-type"
                            className="form-select"
                            value={disasterType}
                            onChange={(e) => setDisasterType(e.target.value)}
                        >
                            <option value="flood">Flood</option>
                            <option value="fire">Fire</option>
                            <option value="earthquake">Earthquake</option>
                        </select>
                    </div>
                    <div className="col-md-6">
                        <label htmlFor="location" className="form-label">Location</label>
                        <input
                            type="text"
                            id="location"
                            className="form-control"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                        />
                    </div>
                </div>

                {loading ? (
                    <p>Loading resources...</p>
                ) : resources ? (
                    <ResourceList resources={resources} />
                ) : (
                    <p>Failed to load resources or no resources available.</p>
                )}
            </div>
        </div>
    );
}