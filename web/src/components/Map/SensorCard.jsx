import React from 'react';
import './SensorCard.css';

const SensorCard = ({ sensor, onClose }) => {
    // Helper function to convert status code to readable text
    const getStatusText = (status) => {
        switch (status) {
            case 1:
                return 'Normal';
            case 2:
                return 'Warning';
            case 3:
                return 'Critical';
            default:
                return 'Unknown';
        }
    };

    // Helper function to get status color
    const getStatusColor = (status) => {
        switch (status) {
            case 1:
                return 'green';
            case 2:
                return 'yellow';
            case 3:
                return 'red';
            default:
                return 'white';
        }
    };

    if (!sensor) return null;

    return (
        <div className="sensor-card">
            <div className="sensor-card-header">
                <h3>{sensor.name || `Sensor ${sensor.sensorId}`}</h3>
                <button className="close-button" onClick={onClose}>×</button>
            </div>

            <div className="sensor-card-content">
                <div className="sensor-info-item">
                    <span className="info-label">ID:</span>
                    <span className="info-value">{sensor.sensorId}</span>
                </div>

                <div className="sensor-info-item">
                    <span className="info-label">Status:</span>
                    <span
                        className="info-value status-text"
                        style={{ color: getStatusColor(sensor.status) }}
                    >
                        {getStatusText(sensor.status)}
                    </span>
                </div>

                {sensor.type && (
                    <div className="sensor-info-item">
                        <span className="info-label">Type:</span>
                        <span className="info-value">{sensor.type}</span>
                    </div>
                )}

                {sensor.model && (
                    <div className="sensor-info-item">
                        <span className="info-label">Model:</span>
                        <span className="info-value">{sensor.model}</span>
                    </div>
                )}

                {sensor.battery !== undefined && (
                    <div className="sensor-info-item">
                        <span className="info-label">Battery:</span>
                        <span className="info-value">{sensor.battery}%</span>
                    </div>
                )}

                {sensor.lastReading && (
                    <div className="sensor-info-item">
                        <span className="info-label">Last Reading:</span>
                        <span className="info-value">
                            {new Date(sensor.lastReading).toLocaleString()}
                        </span>
                    </div>
                )}

                {sensor.geo && (
                    <div className="sensor-info-item">
                        <span className="info-label">Location:</span>
                        <span className="info-value">
                            {sensor.geo.latitude.toFixed(6)}, {sensor.geo.longitude.toFixed(6)}
                        </span>
                    </div>
                )}
            </div>

            {sensor.deploymentId && (
                <div className="sensor-card-footer">
                    <span className="deployment-id">Deployment: {sensor.deploymentId}</span>
                </div>
            )}
        </div>
    );
};

export default SensorCard;