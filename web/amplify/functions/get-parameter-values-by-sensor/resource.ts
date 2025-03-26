// amplify/functions/get-parameter-values-by-sensor/resource.ts - This file defines the Lambda function that retrieves parameter values for a specific sensor. 

import { defineFunction } from "@aws-amplify/backend";

export const getParameterValuesBySensor = defineFunction({
  entry: "./handler.ts",
  name: "getParameterValuesBySensor",
  resourceGroupName: "data",
});