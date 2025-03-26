// amplify/functions/list-sensors/resource.ts - This file defines the resource for the list-sensors function.
import { defineFunction } from "@aws-amplify/backend";

export const queryIotCoreDevices = defineFunction({
  entry: "./handler.ts",
  name: "queryIotCoreDevices",
});
