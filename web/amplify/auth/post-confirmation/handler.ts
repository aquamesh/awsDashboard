import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource.js";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(
  env
);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const userAttrs = event.request.userAttributes;

  await client.models.User.create({
    id: userAttrs.sub,
    email: userAttrs.email,
    phoneNumber: userAttrs.phone_number,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  return event;
};
