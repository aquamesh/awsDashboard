// src/api/models/organizationApi.ts - This file contains the API functions for organization management.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';


// Define organization selection set
export const organizationSelectionSet = [
    'id',
    'name',
    'description',
    'logo',

    'address',
    'city',
    'state',
    'zipCode',
    'country',
    
    'website',
    'industry',
    'size',

    // Relationships
    'members.*', // This will fetch all fields of the members in the organization (UserOrganization is a join table that connects users to organizations)
    'sensors.*', // This will fetch all fields of the sensors associated with the organization (SensorOrganization is a join table that connects sensors to organizations)
    
    // Timestamps
    'createdAt',
    'updatedAt',
] as const;

export type Organization = SelectionSet<Schema['Organization']['type'], typeof organizationSelectionSet>;
