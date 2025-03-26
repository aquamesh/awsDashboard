// amplify/functions/get-spectrogram-readings-by-sensor/resource.ts - This file defines the Lambda function that retrieves spectrogram readings for a specific sensor.

import { defineFunction } from "@aws-amplify/backend";

export const getSpectrogramReadingsBySensor = defineFunction({
  entry: "./handler.ts",
  name: "getSpectrogramReadingsBySensor",
  resourceGroupName: "data",
});