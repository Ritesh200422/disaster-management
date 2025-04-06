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

interface ResourceListProps {
    resources: ResourceResponse;
}

export default function ResourceList({ resources }: ResourceListProps) {
    if (!resources?.allocatedResources || resources.allocatedResources.length === 0) {
        return (
            <div className="alert alert-info mt-3">
                <i className="fas fa-info-circle me-2"></i>
                No resources available for {resources?.disasterType || 'selected disaster'} in {resources?.location || 'this location'}
            </div>
        );
    }

    const getStatusBadge = (status?: string) => {
        switch (status) {
            case 'en-route':
                return <span className="badge bg-warning text-dark">En Route</span>;
            case 'deployed':
                return <span className="badge bg-danger">Deployed</span>;
            default:
                return <span className="badge bg-success">Available</span>;
        }
    };

    return (
        <div className="resource-list-container mt-4">
            <div className="d-flex justify-content-between align-items-center mb-3">
                <h5 className="mb-0">
                    <i className="fas fa-boxes me-2 text-primary"></i>
                    Available Resources for {resources.disasterType} in {resources.location}
                </h5>
                <span className="badge bg-primary">
                    {resources.allocatedResources.length} {resources.allocatedResources.length === 1 ? 'resource' : 'resources'}
                </span>
            </div>

            <div className="table-responsive">
                <table className="table table-hover table-striped align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Type</th>
                            <th className="text-center">Units</th>
                            <th>Location</th>
                            <th>ETA</th>
                            <th>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {resources.allocatedResources.map((resource, index) => (
                            <tr key={`${resource.type}-${index}`}>
                                <td>
                                    <strong>{resource.type}</strong>
                                </td>
                                <td className="text-center">
                                    <span className="fw-bold">{resource.count}</span>
                                </td>
                                <td>{resource.location}</td>
                                <td>{resource.estimatedArrivalTime}</td>
                                <td>{getStatusBadge(resource.status)}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <div className="mt-2 text-muted text-end small">
                <i className="fas fa-clock me-1"></i>
                Updated: {new Date(resources.timestamp).toLocaleString()}
            </div>
        </div>
    );
}