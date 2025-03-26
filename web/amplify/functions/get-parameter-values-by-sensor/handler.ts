// amplify/functions/get-parameter-values-by-sensor/handler.ts - This file defines the Lambda function that retrieves parameter values for a specific sensor.
import type { Handler } from "aws-lambda";
import crypto from "@aws-crypto/sha256-js";
import { defaultProvider } from "@aws-sdk/credential-provider-node";
import { SignatureV4 } from "@aws-sdk/signature-v4";
import { HttpRequest } from "@aws-sdk/protocol-http";
import { default as fetch, Request } from "node-fetch";
import { isUserInOrg } from '../utils/isUserInOrg.js';


const GRAPHQL_ENDPOINT = process.env.AMPLIFY_DATA_GRAPHQL_ENDPOINT || "";
const AWS_REGION = process.env.AWS_REGION || "";
const { Sha256 } = crypto;

type GraphQLResponse = {
  data?: {
    parameterValuesBySensor?: {
      items: any[];
    };
  };
  errors?: Array<{ message: string }>;
};

export const handler: Handler = async (event) => {
  console.log("event", event);

  const query = /* GraphQL */ `
    query GetParameterValuesBySensor(
      $sensorId: String!
      $startTime: AWSDateTime!
      $endTime: AWSDateTime!
      $parameterNames: [String]
    ) {
      parameterValuesBySensor(
        sensorId: $sensorId
        timestamp: { between: [$startTime, $endTime] }
        filter: { parameterName: { in: $parameterNames } }
      ) {
        items {
          id
          sensorId
          timestamp
          parameterName
          value
          unit
          confidence
          status
          calibrationId
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
    parameterNames: event.parameterNames || null,
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
    if (body.data && body.data.parameterValuesBySensor) {
      return body.data.parameterValuesBySensor.items;
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