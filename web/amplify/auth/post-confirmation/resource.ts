import { defineFunction } from '@aws-amplify/backend';

export const postConfirmation = defineFunction({
  entry: "./handler.ts",
  name: 'post-confirmation',
});