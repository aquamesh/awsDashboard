// src/api/models/userApi.ts - This file contains the API functions for user profile management.
import { client } from '../client';
import type { SelectionSet } from 'aws-amplify/data';
import type { Schema } from '../../../amplify/data/resource';

// Define selection sets
export const userAccountSelectionSet = [
  'id',
  'owner',

  'email',
  'phoneNumber',
  'profilePicture',

  'firstName',
  'lastName',
  'industry',
  'jobTitle',
  'location',
  'bio',

  'organizations.*',

  'userSetupStage',
  'settings.*',

  // Metadata fields
  'lastLogin',
  'createdAt',
  'updatedAt',
] as const;

// Define selection set for user settings
export const userSettingsSelectionSet = [
  'id',
  'owner',

  'userId',
  'theme',
  'uiLayout'
] as const;

// Define types for type safety
export type UserAccount = SelectionSet<Schema['User']['type'], typeof userAccountSelectionSet>;
export type UserSettings = SelectionSet<Schema['UserSettings']['type'], typeof userSettingsSelectionSet>;

// Fetch user profile data
export async function getUserById(userId: string): Promise<UserAccount | null> {
  try {
    const { data, errors } = await client.models.User.get(
      { id: userId },
      { selectionSet: userAccountSelectionSet }
    );

    if (errors) {
      console.error('Error fetching user account:', errors);
      return null;
    }
    return data;
  } catch (error) {
    console.error('Exception when fetching user profile:', error);
    throw error;
  }
}

// Fetch all users
export async function getAllUsers(): Promise<UserAccount[] | null> {
  try {
    // Fetch all users we have permission to access using the User table and list operation
    const { data, errors } = await client.models.User.list({
      selectionSet: userAccountSelectionSet
    });

    if (errors) {
      console.error('Error fetching all users:', errors);
      return null;
    }

    return data;
  }
  catch (error) {
    console.error('Exception when fetching all users:', error);
    throw error;
  }
}

// Update user profile data
export async function updateUserProfile(
  userId: string,
  userData: Partial<Omit<Schema['User']['type'], 'id' | 'organizations' | 'settings'>>
) {
  try {
    const { data, errors } = await client.models.User.update({
      id: userId,
      ...userData
    });

    if (errors) {
      console.error('Error updating user profile:', errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception when updating user profile:', error);
    throw error;
  }
}

// Get user organizations (query the UserOrganization join table)
export async function getUserOrganizations(userId: string) {
  try {
    // Fetch user organizations using the UserOrganization join table and list operation
    const { data, errors } = await client.models.UserOrganization.list({
      filter: { userId: { eq: userId } },
      selectionSet: [
        'userId',
        'organizationId',
        'role',
        'joinedAt',
        'invitedBy',
        'organization.name',
        'organization.logo',
        'organization.description',
        'organization.industry'
      ]
    });

    if (errors) {
      console.error('Error fetching user organizations:', errors);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Exception when fetching user organizations:', error);
    throw error;
  }
}

// Update user settings
export async function updateUserSettings(
  userId: string,
  settings: Partial<Omit<Schema['UserSettings']['type'], 'userId'>>
) {
  try {
    // Query the UserSettings table to find the user's settings (use the secdondary index)
    const { data: existingSettings, errors } = await client.models.UserSettings.listUserSettingsByUserId({
      userId: userId,
    });

    if (errors) {
      console.error('Error fetching existing user settings:', errors);
      return null;
    }

    // Print how many settings were found
    console.log(`Found ${existingSettings?.length} user settings for userId ${userId}`);

    // If we found no settings, log an error and return null
    if (!existingSettings || existingSettings.length === 0) {
      console.warn('User has no settings');
      return null;
    }

    // Get the first settings object (there should only be one)
    const userSettings = existingSettings[0];
    console.log('User settings:', userSettings);

    // Update the settings with the new object
    const { data, errors: updateErrors } = await client.models.UserSettings.update({
      id: userSettings.id,
      ...settings
    });

    if (updateErrors) {
      console.error('Error updating user settings:', updateErrors);
      return null;
    }

    // Print the updated settings
    console.log('Updated user settings:', data);

    return data;
  } catch (error) {
    console.error('Exception when updating user settings:', error);
    throw error;
  }
}

// Get user settings given a settingsId (found in the User table)
export async function getUserSettings(userId: string) {

  // Query the User table to find the user's settings
  const { data, errors } = await client.models.User.get(
    { id: userId },
    { selectionSet: userAccountSelectionSet }
  );

  if (errors) {
    console.error('Error fetching user settings:', errors);
    return null;
  }

  // If the user has no settings, return null
  if (!data?.settings) {
    console.warn('User has no settings');
    return null;
  }

  // TODO: maybe return default settings if none exist
  // return {
  //   theme: 'light',
  //   uiLayout: {}
  // };

  return data.settings;
}

// Join an organization
export async function joinOrganization(userId: string, organizationId: string, role: string, invitedBy?: string) {
  try {
    // Do a naive check, check the UserOrganization join table by userId, and go through those records to find the organizationId that matches the provided organizationId
    const { data: existingMemberships, errors } = await client.models.UserOrganization.listUserOrganizationByUserId({
      userId: userId,
    });

    if (errors) {
      console.error('Error fetching existing memberships:', errors);
      return null;
    }

    // Check if the user is already a member of the organization
    const isAlreadyMember = existingMemberships.some((membership) => membership.organizationId === organizationId);
    if (isAlreadyMember) {
      console.warn('User is already a member of the organization');
      return null;
    }

    // Create a new membership in the UserOrganization join table
    const { data, errors: joinErrors } = await client.models.UserOrganization.create({
      userId,
      organizationId,
      role,
      invitedBy
    });
    
    if (joinErrors) {
      console.error('Error joining organization:', joinErrors);
      return null;
    }

    console.log(`User ${userId} successfully joined organization ${organizationId} with role ${role}.`);

    return data;
  } catch (error) {
    console.error('Exception when joining organization:', error);
    throw error;
  }
}

// Update organization membership
// export async function updateOrganizationRole(userId: string, organizationId: string, role: string) {
//   try {
//     // Query the UserOrganization join table to find the record
//     const { data: userOrg } = await client.models.UserOrganization.get({
//       userId,
//       organizationId
//     });



//   } catch (error) {
//     console.error('Exception when updating organization role:', error);
//     throw error;
//   }
// }

// // Leave an organization
// export async function leaveOrganization(userId: string, organizationId: string) {
//   try {
//     // According to the schema, userId and organizationId together form the composite primary key
//     const { errors } = await client.models.UserOrganization.delete({
//       userId,
//       organizationId
//     });

//     if (errors) {
//       console.error('Error leaving organization:', errors);
//       return false;
//     }

//     return true;
//   } catch (error) {
//     console.error('Exception when leaving organization:', error);
//     throw error;
//   }
// }