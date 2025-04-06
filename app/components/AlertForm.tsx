'use client';

import { FormEvent } from 'react';

interface AlertData {
    disasterType: string;
    severity: string;
    location: string;
    message?: string;
}

interface AlertFormProps {
    onSendAlert: (data: AlertData) => Promise<{ success: boolean; message: string }>;
    loading: boolean;
}

export default function AlertForm({ onSendAlert, loading }: AlertFormProps) {
    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const alertData: AlertData = {
            disasterType: formData.get('disasterType') as string,
            severity: formData.get('severity') as string,
            location: formData.get('location') as string,
            message: formData.get('message') as string || undefined,
        };

        const result = await onSendAlert(alertData);
        if (result.success) {
            alert(result.message);
            e.currentTarget.reset();
        } else {
            alert(result.message);
        }
    };

    return (
        <form onSubmit={handleSubmit}>
            <div className="mb-3">
                <label htmlFor="disasterType" className="form-label">
                    Disaster Type <span className="text-danger">*</span>
                </label>
                <select
                    name="disasterType"
                    id="disasterType"
                    className="form-select"
                    required
                    disabled={loading}
                >
                    <option value="">Select disaster type</option>
                    <option value="flood">Flood</option>
                    <option value="fire">Fire</option>
                    <option value="earthquake">Earthquake</option>
                    <option value="hurricane">Hurricane</option>
                    <option value="tsunami">Tsunami</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="severity" className="form-label">
                    Severity <span className="text-danger">*</span>
                </label>
                <select
                    name="severity"
                    id="severity"
                    className="form-select"
                    required
                    disabled={loading}
                >
                    <option value="">Select severity level</option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                </select>
            </div>

            <div className="mb-3">
                <label htmlFor="location" className="form-label">
                    Location <span className="text-danger">*</span>
                </label>
                <input
                    type="text"
                    name="location"
                    id="location"
                    className="form-control"
                    required
                    disabled={loading}
                    placeholder="Enter location coordinates or address"
                />
            </div>

            <div className="mb-3">
                <label htmlFor="message" className="form-label">
                    Custom Message
                </label>
                <textarea
                    name="message"
                    id="message"
                    className="form-control"
                    rows={3}
                    placeholder="Optional custom alert message"
                    disabled={loading}
                />
            </div>

            <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
            >
                {loading ? (
                    <>
                        <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                        Sending Alert...
                    </>
                ) : (
                    'Send Alert'
                )}
            </button>
        </form>
    );
}