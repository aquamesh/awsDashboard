// amplify/backend.ts - This file defines the backend resources for the Amplify project.
import { defineBackend } from "@aws-amplify/backend";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnMap } from "aws-cdk-lib/aws-location";
// import { CfnTopicRule } from "aws-cdk-lib/aws-iot";
import { auth } from "./auth/resource.js";
import { data } from "./data/resource.js";

import { queryIotCoreDevices } from "./functions/query-iotcore-devices/resource.js";
import { getParameterValuesBySensor } from "./functions/get-parameter-values-by-sensor/resource.js";
import { getSpectrogramReadingsBySensor } from "./functions/get-spectrogram-readings-by-sensor/resource.js";

const backend = defineBackend({
  auth,
  data,

  queryIotCoreDevices,
  getParameterValuesBySensor,
  getSpectrogramReadingsBySensor,
});

// disable unauthenticated access
const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;

// Mapping Resources
const geoStack = backend.createStack("geo-stack");

// create a Map resource
const map = new CfnMap(geoStack, "Map", {
  mapName: "SensorMap",
  description: "Sensor Map",
  configuration: {
    style: "VectorHereExplore",
  },
  pricingPlan: "RequestBasedUsage",
  tags: [
    {
      key: "name",
      value: "SensorMap",
    },
  ],
});

// create an IAM policy to allow interacting with geo resource
const myGeoPolicy = new Policy(geoStack, "GeoPolicy", {
  policyName: "myGeoPolicy",
  statements: [
    new PolicyStatement({
      actions: [
        "geo:GetMapTile",
        "geo:GetMapSprites",
        "geo:GetMapGlyphs",
        "geo:GetMapStyleDescriptor",
      ],
      resources: [map.attrArn],
    }),
  ],
});

// apply the policy to the authenticated role
backend.auth.resources.authenticatedUserIamRole.attachInlinePolicy(myGeoPolicy);

// patch the map resource to the expected output configuration
backend.addOutput({
  geo: {
    aws_region: geoStack.region,
    maps: {
      items: {
        [map.mapName]: {
          style: "VectorHereExplore",
        },
      },
      default: map.mapName,
    },
  },
});

// IoT Resources:
// grant the list sensors function access to search all IoT devices
const listSensorsLambda = backend.queryIotCoreDevices.resources.lambda;

listSensorsLambda.addToRolePolicy(
  new PolicyStatement({
    actions: ["iot:SearchIndex"],
    resources: ["arn:aws:iot:*:*:*"],
  })
);

// const iotStack = backend.createStack("iot-stack");