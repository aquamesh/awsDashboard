import { defineAuth } from '@aws-amplify/backend';
import { postConfirmation } from './post-confirmation/resource.js';

export const auth = defineAuth({
  loginWith: {
    email: true,
  },
  userAttributes: {
    email: { required: true },
    phoneNumber: { required: false },
  },
  triggers: {
    postConfirmation,
  },
});
