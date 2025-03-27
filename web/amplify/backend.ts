// amplify/backend.ts - This file defines the backend resources for the Amplify project.
import { defineBackend } from "@aws-amplify/backend";
import { Policy, PolicyStatement } from "aws-cdk-lib/aws-iam";
import { CfnMap } from "aws-cdk-lib/aws-location";
import { auth } from "./auth/resource.js";
import { postConfirmation } from "./auth/post-confirmation/resource.js";
import { data } from "./data/resource.js";

// import { CfnTopicRule } from "aws-cdk-lib/aws-iot";
// import { queryIotCoreDevices } from "./functions/query-iotcore-devices/resource.js";
// import { getParameterValuesBySensor } from "./functions/get-parameter-values-by-sensor/resource.js";
// import { getSpectrogramReadingsBySensor } from "./functions/get-spectrogram-readings-by-sensor/resource.js";

const backend = defineBackend({
  auth, // This is the authentication resource for Cognito
  postConfirmation, // This is the post-confirmation trigger for Cognito
  data, // This is the data resource for Amplify DataStore

  // DEBUG: Remove this line to enable the iot backend
  // queryIotCoreDevices,
  // getParameterValuesBySensor,
  // getSpectrogramReadingsBySensor,
});


// Disable unauthenticated access to the identity pool
const { cfnIdentityPool } = backend.auth.resources.cfnResources;
cfnIdentityPool.allowUnauthenticatedIdentities = false;


//////////////////////////////////////////////////////////////////
// Mapping Resources
//////////////////////////////////////////////////////////////////
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


//////////////////////////////////////////////////////////////////
// IoT Resources
//////////////////////////////////////////////////////////////////
// DEBUG: Remove this to enable the backend
// const listSensorsLambda = backend.queryIotCoreDevices.resources.lambda; // grant the list sensors function access to search all IoT devices

// listSensorsLambda.addToRolePolicy(
//   new PolicyStatement({
//     actions: ["iot:SearchIndex"],
//     resources: ["arn:aws:iot:*:*:*"],
//   })
// );

// const iotStack = backend.createStack("iot-stack");