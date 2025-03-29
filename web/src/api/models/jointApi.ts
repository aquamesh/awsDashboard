// src/api/models/jointApi.ts - This file contains the API functions for managing join table entities, such as sensorOrganizations and userOrganizations.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

// Define selection set for user organization join table
export const userOrganizationSelectionSet = [
    'userId', // ID of the user
    'organizationId', // ID of the organization
    'role', // Permission level (Owner, Admin, User)

    // Relationships
    // 'user.*', // Fetch all fields of the user associated with this join entry
    // 'organization.*', // Fetch all fields of the organization associated with this join entry

    // Metadata fields
    'joinedAt',
    'invitedBy',
    'createdAt',
    'updatedAt',
] as const;

export type UserOrganization = SelectionSet<Schema['UserOrganization']['type'], typeof userOrganizationSelectionSet>;


// Define selection set for sensor organization join table
export const sensorOrganizationSelectionSet = [
    'sensorId', // ID of the sensor
    'organizationId', // ID of the organization

    // Relationships
    // 'sensor.*', // Fetch all fields of the sensor associated with this join entry
    // 'organization.*', // Fetch all fields of the organization associated with this join entry

    // Metadata fields
    'createdAt', // Timestamp when the entry was created
    'updatedAt', // Timestamp when the entry was last updated
] as const;

export type SensorOrganization = SelectionSet<Schema['SensorOrganization']['type'], typeof sensorOrganizationSelectionSet>;