'use client';

import { useEffect, useState } from 'react';
import PredictionMap from './components/PridictionMap';
import ChatbotInterface from './components/ChatbotInterface';

interface Prediction {
  type: string;
  location: string;
  riskLevel: number;
  time: string;
}

interface PredictionData {
  riskLevel?: number;
  location?: string;
  recentPredictions?: Prediction[];
}

export default function Home() {
  const [predictions, setPredictions] = useState<PredictionData>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchPredictions() {
      try {
        const response = await fetch('/api/predictions');
        const data: PredictionData = await response.json();
        setPredictions(data);
      } catch (error) {
        console.error('Failed to fetch predictions:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchPredictions();
  }, []);

  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header bg-warning">
            <h4>Disaster Prediction Dashboard</h4>
          </div>
          <div className="card-body">
            {predictions.riskLevel && predictions.riskLevel > 7 && (
              <div className="alert alert-danger">
                <strong>High Risk Alert:</strong> Potential disaster in {predictions.location}.
              </div>
            )}
            <PredictionMap />
            <div className="mt-3">
              <h5>Recent Predictions</h5>
              {loading ? (
                <p>Loading predictions...</p>
              ) : (
                <table className="table table-striped">
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Location</th>
                      <th>Risk Level</th>
                      <th>Time</th>
                    </tr>
                  </thead>
                  <tbody>
                    {predictions.recentPredictions ? (
                      predictions.recentPredictions.map((prediction, index) => (
                        <tr key={index}>
                          <td>{prediction.type}</td>
                          <td>{prediction.location}</td>
                          <td>{`${prediction.riskLevel}/10`}</td>
                          <td>{prediction.time}</td>
                        </tr>
                      ))
                    ) : (
                      // Fallback static data if API not implemented
                      <>
                        <tr>
                          <td>Flood</td>
                          <td>Kerala</td>
                          <td>High (8/10)</td>
                          <td>Today 14:30</td>
                        </tr>
                        <tr>
                          <td>Landslide</td>
                          <td>Chennai</td>
                          <td>Medium (5/10)</td>
                          <td>Today 15:45</td>
                        </tr>
                            <tr>
                              <td>Landslide</td>
                              <td>Hydrabad</td>
                              <td>Medium (2/10)</td>
                              <td>Today 11:50</td>
                            </tr>
                            <tr>
                              <td>Fire</td>
                              <td>Rajamahendraverma</td>
                              <td>Low (1/10)</td>
                              <td>Today 10:45</td>
                            </tr>
                      </>
                    )}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <ChatbotInterface />
      </div>
    </div>
  );
}