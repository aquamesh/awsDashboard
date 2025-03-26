// amplify/functions/get-spectrogram-readings-by-sensor/handler.ts - This file defines the Lambda function that retrieves spectrogram readings for a specific sensor.
import type { Handler } from "aws-lambda";
import crypto from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { default as fetch, Request } from "node-fetch";

const GRAPHQL_ENDPOINT = process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT || "";
const AWS_REGION = process.env.AWS_REGION || "";
const { Sha256 } = crypto;

type GraphQLResponse = {
  data?: {
    spectrogramReadingsBySensor?: {
      items: any[];
    };
  };
  errors?: Array<{ message: string }>;
};

export const handler: Handler = async (event) => {
  console.log("event", event);

  const query = /* GraphQL */ `
    query GetSpectrogramReadingsBySensor(
      $sensorId: String!
      $startTime: AWSDateTime!
      $endTime: AWSDateTime!
      $ledWavelength: Float
    ) {
      spectrogramReadingsBySensor(
        sensorId: $sensorId
        timestamp: { between: [$startTime, $endTime] }
        filter: { ledWavelength: { eq: $ledWavelength } }
      ) {
        items {
          id
          sensorId
          timestamp
          ledWavelength
          ledIntensity
          wavelengths
          intensities
          calibrationId
          signalToNoiseRatio
          temperature
          status
          metadata
          createdAt
          updatedAt
        }
      }
    }
  `;

  const variables = {
    sensorId: event.sensorId,
    startTime: event.startTime,
    endTime: event.endTime,
    ledWavelength: event.ledWavelength || null,
  };

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: "appsync",
    sha256: Sha256,
  });

  const requestToBeSigned = new HttpRequest({
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      host: endpoint.host,
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables }),
    path: endpoint.pathname,
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body: GraphQLResponse;
  let response;

  try {
    response = await fetch(request);
    body = await response.json() as GraphQLResponse;
    console.log(body);
    
    // Check if the query was successful and return the items
    if (body.data && body.data.spectrogramReadingsBySensor) {
      return body.data.spectrogramReadingsBySensor.items;
    } else {
      return [];
    }
  } catch (error: any) {
    console.log(error);
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message,
        },
      ],
    };
    
    return {
      statusCode,
      body: JSON.stringify(body),
    };
  }
};