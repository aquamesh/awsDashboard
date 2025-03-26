// amplify/functions/utils/isUserInOrg.ts - Utility function to check if a user is in an organization
import { generateClient } from 'aws-amplify/data';
import type { Schema } from '../../data/resource.js';

const client = generateClient<Schema>();

export const isUserInOrg = async (userId: string, organizationId: string): Promise<boolean> => {
  const { data, errors } = await client.models.UserOrganization.list({
    filter: {
      userId: { eq: userId },
      organizationId: { eq: organizationId },
    },
  });

  if (errors) {
    console.error('Error checking user-org membership', errors);
    return false;
  }

  return data.length > 0;
};
