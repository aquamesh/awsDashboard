import { useEffect, useRef } from "react";
import { createMap } from "maplibre-gl-js-amplify";
import { Marker } from "maplibre-gl";
import { generateClient } from "aws-amplify/api";
import { listSensors } from "../../graphql/queries";
import { onCreateSensorValue } from "../../graphql/subscriptions";

import "maplibre-gl/dist/maplibre-gl.css";
import "./Map.css";

const Map = () => {
  const mapContainer = useRef(null);
  const mapInstance = useRef(null);

  // Initialize map and fetch sensors
  useEffect(() => {
    // Only initialize the map once
    if (mapInstance.current) return;

    const CreateSensorMarker = (sensor) => {
      var marker = document.createElement("div");
      marker.id = "sensor-image-" + sensor.sensorId;
      marker.className = "sensor";

      let sensorColor = "white";
      marker.style.backgroundColor = sensorColor;
      marker.style.border = "border: 0.1em solid " + sensorColor + ";";

      return marker;
    };

    // call api to get list of sensors and display them as markers on the map
    async function DisplaySensors(map) {
      const client = generateClient();
      try {
        const response = await client.graphql({ query: listSensors });
        console.log("API Response:", response);

        if (response && response.data) {
          console.log("sensors retrieved");

          response.data.listSensors.forEach((sensor) => {
            var marker = CreateSensorMarker(sensor);
            console.log(sensor);
            new Marker({ element: marker })
              .setLngLat([sensor.geo.longitude, sensor.geo.latitude])
              .addTo(map);
          });
        }
      } catch (error) {
        console.log("error fetching sensors", error);
      }
    }

    // configure and display the map
    async function initializeMap() {
      // Check if container is available and has dimensions
      if (!mapContainer.current) {
        console.error("Map container reference not available");
        return;
      }

      try {
        console.log("Initializing map...");
        
        // Small delay to ensure container is fully rendered
        setTimeout(async () => {
          try {
            // Get container dimensions before initializing
            const containerStyles = window.getComputedStyle(mapContainer.current);
            const width = parseInt(containerStyles.width);
            const height = parseInt(containerStyles.height);
            
            console.log("Map container dimensions:", width, "x", height);
            
            if (width === 0 || height === 0) {
              console.error("Map container has zero dimensions. Width:", width, "Height:", height);
              return;
            }
            
            mapInstance.current = await createMap({
              container: mapContainer.current,
              center: [-122.2, 37.705],
              zoom: 9,
              maxZoom: 10,
              minZoom: 2,
              attributionControl: false,
              // style: 'StandardLight'  // Using the light theme style
            });

            mapInstance.current.repaint = true;
            console.log("Map Rendered");

            // After map is initialized, display sensors
            await DisplaySensors(mapInstance.current);
          } catch (error) {
            console.error("Error initializing map:", error);
          }
        }, 100);
      } catch (error) {
        console.error("Error in map initialization:", error);
      }
    }

    initializeMap();

    // Cleanup function
    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, []);

  // Subscription for sensor status changes
  useEffect(() => {
    const UpdateSensorMarker = (sensorId, status) => {
      var marker = document.getElementById("sensor-image-" + sensorId);

      if (marker) {
        let sensorColor = "";

        if (status === 1) {
          sensorColor = "green";
        } else if (status === 2) {
          sensorColor = "yellow";
        } else if (status === 3) {
          sensorColor = "red";
        } else {
          sensorColor = "white";
        }

        marker.style.backgroundColor = sensorColor;
        marker.style.border = `border: 0.1em solid ${sensorColor};`;

        console.log(sensorId + " updated");
      }
    };

    const client = generateClient();
    const createSub = client.graphql({ query: onCreateSensorValue }).subscribe({
      next: ({ data }) => {
        UpdateSensorMarker(
          data.onCreateSensorValue.sensorId,
          data.onCreateSensorValue.status
        );
      },
      error: (error) => console.warn(error),
    });

    // Cleanup subscription
    return () => {
      if (createSub) {
        createSub.unsubscribe();
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer}
      id="map" 
      className="card-map" 
      style={{ 
        width: '100%', 
        height: '100%',
        minHeight: '300px'
      }}
    />
  );
};

export default Map;