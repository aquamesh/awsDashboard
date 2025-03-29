// src/api/client.ts - This file generates the client for the Amplify project.
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../amplify/data/resource';

// Create the client instance
export const client = generateClient<Schema>();
