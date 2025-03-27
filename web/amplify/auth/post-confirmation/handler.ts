import type { PostConfirmationTriggerHandler } from "aws-lambda";
import { type Schema } from "../../data/resource.js";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from "@aws-amplify/backend/function/runtime";
import { env } from "$amplify/env/post-confirmation";

const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);

Amplify.configure(resourceConfig, libraryOptions);

const client = generateClient<Schema>();

export const handler: PostConfirmationTriggerHandler = async (event) => {
  const userAttrs = event.request.userAttributes;
  const now = new Date().toISOString();
  const cognitoSub = userAttrs.sub;
  const cognitoUsername = userAttrs["cognito:username"];

  // Step 1: Create User
  await client.models.User.create({
    id: cognitoSub,
    owner: cognitoUsername,
    email: userAttrs.email,
    ...(userAttrs.phone_number && { phoneNumber: userAttrs.phone_number }),
    createdAt: now,
    updatedAt: now,
  });

  // Step 2: Create related UserSettings, linking back via userId
  await client.models.UserSettings.create({
    userId: cognitoSub, // this links it to the User
    owner: cognitoUsername,
    theme: "light",
    uiLayout: {},
  });

  return event;
};
