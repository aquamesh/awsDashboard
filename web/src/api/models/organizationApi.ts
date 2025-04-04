// src/api/models/organizationApi.ts - This file contains the API functions for organization management.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';


// Define selection sets
// Basic set should be what we need to display the list of organizations and their basic details
export const organizationBasicSelectionSet = [
    'id',
    'name',
    'description',
    'logo',
    'industry',
    'size',
    'website',
    'createdAt',
    'updatedAt',
] as const;

// This set should include all the details we need to display a single organization and its members
export const organizationWithMembersSelectionSet = [
    'id',
    'name',
    'description',
    'logo',
    'industry',
    'size',
    'website',
    'address',
    'city',
    'state',
    'zipCode',
    'country',
    'createdAt',
    'updatedAt',
    'members.user.id',
    'members.user.email',
    'members.user.firstName',
    'members.user.lastName',
    'members.role'
] as const;

// This set should include all the details we need to display a single organization with its sensors
export const organizationWithSensorsSelectionSet = [
    'id',
    'name',
    'description',
    'logo',
    'industry',
    'size',
    'website',
    'createdAt',
    'updatedAt',
    'sensors.sensor.id',
    'sensors.sensor.name',
    'sensors.sensor.status',
    'sensors.sensor.enabled',
    'sensors.sensor.locationName'
] as const;

// Fetch all organizations we have permission to access
export async function getAllOrganizationsBasic(): Promise<
    SelectionSet<Schema['Organization']['type'], typeof organizationBasicSelectionSet>[] | null
> {
    try {
        const { data, errors } = await client.models.Organization.list({
            selectionSet: organizationBasicSelectionSet,
        });

        if (errors) {
            console.error('Error fetching organizations:', errors);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception when fetching organizations:', error);
        throw error;
    }
}




// Fetch organization by ID
export async function getOrganizationBasicById(
    organizationId: string,
): Promise<SelectionSet<Schema['Organization']['type'], typeof organizationBasicSelectionSet> | null> {
    try {
        const { data, errors } = await client.models.Organization.get(
            { id: organizationId },
            { selectionSet: organizationBasicSelectionSet }
        );

        if (errors) {
            console.error('Error fetching organization:', errors);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception when fetching organization info:', error);
        throw error;
    }
}

// Fetch organization by ID with members
export async function getOrganizationWithMembersById(
    organizationId: string,
): Promise<SelectionSet<Schema['Organization']['type'], typeof organizationWithMembersSelectionSet> | null> {
    try {
        const { data, errors } = await client.models.Organization.get(
            { id: organizationId },
            { selectionSet: organizationWithMembersSelectionSet }
        );

        if (errors) {
            console.error('Error fetching organization with members:', errors);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception when fetching organization with members:', error);
        throw error;
    }
}


// Create a new organization
export async function createOrganization(
    organization: Partial<Schema['Organization']['type']>,
    ownerUserId: string
): Promise<SelectionSet<Schema['Organization']['type'], typeof organizationBasicSelectionSet> | null> {
    try {
        if (!organization.name) {
            throw new Error('Organization name is required');
        }

        const { data, errors } = await client.models.Organization.create({
            name: organization.name,
            description: organization.description,
            logo: organization.logo,
            address: organization.address,
            city: organization.city,
            state: organization.state,
            zipCode: organization.zipCode,
            country: organization.country,
            website: organization.website,
            industry: organization.industry,
            size: organization.size,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        if (errors) {
            console.error('Error creating organization:', errors);
            return null;
        }

        return data;
    } catch (error) {
        console.error('Exception when creating organization:', error);
        throw error;
    }
}