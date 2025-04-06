'use client';

import { useState } from 'react';
import AlertForm from './../components/AlertForm';

interface AlertData {
    disasterType: string;
    severity: string;
    location: string;
    message?: string;
}

interface AlertHistoryItem extends AlertData {
    timestamp: string;
    recipients: number;
}

export default function Alerts() {
    const [alertHistory, setAlertHistory] = useState<AlertHistoryItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSendAlert = async (alertData: AlertData): Promise<{ success: boolean; message: string }> => {
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('/api/alerts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(alertData),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const result = await response.json();

            const newAlert: AlertHistoryItem = {
                ...alertData,
                timestamp: new Date().toISOString(),
                recipients: result.notifications?.length || 0
            };

            setAlertHistory(prev => [newAlert, ...prev]);
            return {
                success: true,
                message: `Alerts sent to ${result.notifications?.length || 0} recipients`
            };
        } catch (error) {
            console.error('Failed to send alerts:', error);
            const errorMessage = error instanceof Error ? error.message : 'Failed to send alerts';
            setError(errorMessage);
            return {
                success: false,
                message: errorMessage
            };
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="row">
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header bg-info text-white">
                        <h4 className="mb-0">Send Emergency Alert</h4>
                    </div>
                    <div className="card-body">
                        <AlertForm onSendAlert={handleSendAlert} loading={loading} />
                        {error && (
                            <div className="alert alert-danger mt-3">
                                <i className="fas fa-exclamation-circle me-2"></i>
                                {error}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="col-md-6">
                <div className="card">
                    <div className="card-header bg-secondary text-white">
                        <h4 className="mb-0">Alert History</h4>
                    </div>
                    <div className="card-body p-0">
                        {alertHistory.length === 0 ? (
                            <div className="p-3 text-center text-muted">
                                <i className="fas fa-inbox fa-2x mb-2"></i>
                                <p>No alerts have been sent yet</p>
                            </div>
                        ) : (
                            <ul className="list-group list-group-flush">
                                {alertHistory.map((alert, index) => (
                                    <li key={index} className="list-group-item">
                                        <div className="d-flex justify-content-between align-items-start">
                                            <div>
                                                <span className={`badge ${alert.severity === 'critical' ? 'bg-danger' :
                                                        alert.severity === 'high' ? 'bg-warning' :
                                                            alert.severity === 'medium' ? 'bg-primary' : 'bg-success'
                                                    } me-2`}>
                                                    {alert.severity}
                                                </span>
                                                <strong>{alert.disasterType}</strong>
                                            </div>
                                            <small className="text-muted">
                                                {new Date(alert.timestamp).toLocaleTimeString()}
                                            </small>
                                        </div>
                                        <div className="mt-2">
                                            {alert.message && <p className="mb-1">{alert.message}</p>}
                                            <small className="text-muted">
                                                Location: {alert.location} | Sent to {alert.recipients} recipients
                                            </small>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}