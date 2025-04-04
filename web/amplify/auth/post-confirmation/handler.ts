// amplify/auth/post-confirmation/handler.ts - This file contains the AWS Lambda function that handles post-confirmation events for user sign-ups.
import type { PostConfirmationTriggerHandler } from "aws-lambda";
import {
  CognitoIdentityProviderClient,
  AdminAddUserToGroupCommand
} from '@aws-sdk/client-cognito-identity-provider';
import { type Schema } from "../../data/resource";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/data";
import { getAmplifyDataClientConfig } from '@aws-amplify/backend/function/runtime';
import { env } from "$amplify/env/post-confirmation";


// Set up the Amplify Data client
const { resourceConfig, libraryOptions } = await getAmplifyDataClientConfig(env);
Amplify.configure(resourceConfig, libraryOptions);
const client = generateClient<Schema>();

// Set up the Cognito Identity Provider client
const cognitoClient = new CognitoIdentityProviderClient();
const globalAdminEmails = ["npalmer5620@gmail.com"];

// Create the handler for the post-confirmation trigger
export const handler: PostConfirmationTriggerHandler = async (event) => {

  // Check if the email is in a list of emails to be a global admin
  const isGlobalAdmin = globalAdminEmails.includes(event.request.userAttributes.email);

  // Step 1: Create User Object
  const { data: user, errors: userErrors } = await client.models.User.create({
    // ID attributes
    id: event.request.userAttributes.sub, // global sub id
    owner: `${event.request.userAttributes.sub}::${event.userName}`, // this is the owner of the user

    // Info from Cognito
    email: event.request.userAttributes.email,
    // phoneNumber: event.request.userAttributes.phone_number,

    userSetupStage: "INITIAL", // Set the initial setup stage
    globalAdmin: isGlobalAdmin, // Set the global admin flag based on email
    
    // Timestamp attributes
    lastLogin: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  });

  // Check for errors in creating the user
  if (userErrors || !user) {
    console.error("Error creating user:", userErrors);
    return event;
  }

  console.log("Successfully created user:", user);

  // Step 2: Add the user to the global admin group if they are a global admin
  if (isGlobalAdmin) {
    const command = new AdminAddUserToGroupCommand({
      GroupName: "GLOBAL_ADMIN",
      Username: event.userName,
      UserPoolId: event.userPoolId
    });
    const response = await cognitoClient.send(command);
    console.log('Added to GlobalAdmin:', response.$metadata.requestId);
  }

  // Step 3: Create related UserSettings, linking back via userId
  const { data: userSettings, errors: userSettingsErrors } = await client.models.UserSettings.create({
    owner: `${event.request.userAttributes.sub}::${event.userName}`, // settings is now owned by the user
    userId: user?.id, // this links it to the User

    // Set default values for settings
    theme: "light",
    uiLayout: JSON.stringify({}),
  });

  // Check for errors in creating the user settings
  if (userSettingsErrors || !userSettings) {
    console.error("Error creating user settings:", userSettingsErrors);
    return event;
  }

  console.log("Successfully created userSettings:", userSettings);

  return event;
};
