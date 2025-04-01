// amplify/auth/resource.ts - This file defines the authentication resources for the Amplify project.
import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource.js';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  groups: ["GLOBAL_ADMIN"],
  triggers: {
    postConfirmation,
  },
  access: (allow) => [
    allow.resource(postConfirmation).to(["addUserToGroup"]),
  ],
});
