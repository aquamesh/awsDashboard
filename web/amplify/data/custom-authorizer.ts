// amplify/data/custom-authorizer.ts
// https://docs.amplify.aws/react/build-a-backend/data/customize-authz/custom-data-access-patterns/

import type { AppSyncAuthorizerHandler } from 'aws-lambda'; // types imported from @types/aws-lambda
import { Amplify } from 'aws-amplify';
import { type Schema } from './resource';
import { generateClient } from 'aws-amplify/data';
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';

// const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
// Amplify.configure(resourceConfig, libraryOptions);

// const client = generateClient<Schema>();

type ResolverContext = {
    userId: string;
    username: string;
    organizationId: string;
    role: string;
};

// export const handler: AppSyncAuthorizerHandler<ResolverContext> = async (event) => {
//     console.log(`EVENT: ${JSON.stringify(event)}`);
//     const {
//         authorizationToken,
//         requestContext: { apiId, accountId }
//     } = event;

//     const sub = event.identity?.sub; // Updated to use event.identity
//     const username = event.identity?.claims?.['cognito:username']; // Updated to use event.identity
//     const orgId = event.headers['x-org-id']; // Updated to use event.headers

//     if (!sub || !username || !orgId) {
//         return deny('Missing identity or org context');
//     }

//     // 🔍 Check for matching UserOrganization
//     const result = await client.models.UserOrganization.list({
//         filter: {
//             userId: { eq: sub },
//             organizationId: { eq: orgId },
//         },
//     });

//     const membership = result.data?.[0];

//     if (!membership) {
//         // ❌ User is not a member of the organization, so denyField should be the orgId
//         return deny("User is not a member of the organization");
//     }

//     // ✅ Authorized — inject org + role into context
//     return {
//         isAuthorized: true,
//         // JSON object visible as $ctx.identity.resolverContext in VTL resolver templates
//         resolverContext: { 
//             userId: sub,
//             username,
//             organizationId: orgId,
//             role: membership.role,
//         },
//         ttlOverride: 300, // cache for 5 minutes
//     };
// };

// const deny = (reason: string, deniedFields?: string[]) => {
//     console.log('Access Denied:', reason);
//     const response: {
//         isAuthorized: false;
//         resolverContext: {};
//         ttlOverride: number;
//         deniedFields?: string[];
//     } = {
//         isAuthorized: false, // if "false" then an UnauthorizedException is raised, access is denied
//         resolverContext: {}, // JSON object visible as $ctx.identity.resolverContext in VTL resolver templates
//         ttlOverride: 0, // no cache
//     };
    
//     // Only add deniedFields if they're provided
//     if (deniedFields && deniedFields.length > 0) {
//         response.deniedFields = deniedFields;
//     }
    
//     return response;
// };
