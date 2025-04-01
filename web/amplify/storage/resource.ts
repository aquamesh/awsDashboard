import { defineStorage } from "@aws-amplify/backend";

export const storage = defineStorage({
  name: "amplify-gen2-files",

  // Profile picture storage
  access: (allow) => ({
    "images/*": [allow.authenticated.to(["read", "write", "delete"]),
    allow.guest.to(["read"])],
  }),
});