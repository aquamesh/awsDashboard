// src/api/client.ts - This file generates the clients for the Amplify project.
import { generateClient } from 'aws-amplify/data';
import { IoT } from '@aws-sdk/client-iot';
// import { fetchAuthSession } from 'aws-amplify/auth';
import type { Schema } from '../../amplify/data/resource';

// Import the config directly from amplify_outputs.json
import awsExports from '../../amplify_outputs.json';

// Get the region from the auth config section
const region = awsExports.auth?.aws_region || 
               awsExports.geo?.aws_region || 
               'us-east-1'; // Fallback to us-east-1

// Create the Amplify Data client instance
export const client = generateClient<Schema>();

// Create and export the IoT client
export const iotClient = new IoT({ region });