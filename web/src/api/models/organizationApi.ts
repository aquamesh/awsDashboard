// src/api/models/organizationApi.ts - This file contains the API functions for organization management.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';


// Define selection sets
export const organizationBasicSelectionSet = [
    'id',
    'name',
    'logo',
] as const;

export const organizationWithMembersSelectionSet = [
    'id',
    'name',
    'members.user.id',
    'members.user.email',
    'members.role'
] as const;

export const organizationWithSensorsSelectionSet = [
    'id',
    'name',
    'sensors.sensor.id',
    'sensors.sensor.name',
    'sensors.sensor.status'
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

