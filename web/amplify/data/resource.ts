// amplify/data/resource.ts - This file defines the data schema and authorization for the Amplify backend.
import { type ClientSchema, a, defineData } from "@aws-amplify/backend";
import { queryIotCoreDevices } from "../functions/query-iotcore-devices/resource.js";
import { getParameterValuesBySensor } from "../functions/get-parameter-values-by-sensor/resource.js";
import { getSpectrogramReadingsBySensor } from "../functions/get-spectrogram-readings-by-sensor/resource.js";
import { postConfirmation } from "../auth/post-confirmation/resource.js"; // Post-confirmation trigger for Cognito

// Org-aware functions
import { isUserInOrg } from "../functions/utils/isUserInOrg.js"; // Utility function to check if a user is in an organization
// import { getUserAccessibleOrgs } from '../functions/get-user-accessible-orgs/resource';
// import { listOrgSensors } from '../functions/list-org-sensors/resource';

const schema = a
  .schema({
    // User model - connected to Cognito
    User: a.model({
      // Cognito user ID - fixed reference
      id: a.id().required(),
      owner: a.string().required(), // Cognito user ID
      email: a.string().required(), // Cognito email
      phoneNumber: a.string(), // Cognito phone number

      // User attributes
      firstName: a.string(),
      lastName: a.string(),
      profilePicture: a.string(),
      lastLogin: a.datetime(),
      preferences: a.json(),

      // Relationships - fixed reference field name
      organizations: a.hasMany('UserOrganization', 'userId'),

      // User Settings (one-to-one relationship)
      settings: a.hasOne('UserSettings', 'userId'),

      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

    }).authorization((allow) => [
      allow.owner(), // User can access their own data
      allow.group("GlobalAdmin") // Global admins can manage all users
    ]),

    // Organization model
    Organization: a.model({
      id: a.id().required(),
      name: a.string().required(),
      description: a.string(),
      logo: a.string(),
      address: a.string(),
      city: a.string(),
      state: a.string(),
      zipCode: a.string(),
      country: a.string(),
      website: a.string(),
      industry: a.string(),
      size: a.integer(), // Number of employees/size category

      // Relationships - fixed reference field names
      members: a.hasMany('UserOrganization', 'organizationId'), // Many-to-many relationship with User
      sensors: a.hasMany('SensorOrganization', 'organizationId'), // Many-to-many relationship with Sensor

      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    }).authorization((allow) => [
      // Global admins can access all orgs
      allow.group("GlobalAdmin"),
    ]),

    // Join table for User-Organization many-to-many relationship with role information
    UserOrganization: a.model({
      // References to both models - fixed relationships
      userId: a.id().required(),
      organizationId: a.id().required(),

      // Permission level stored as a string (Owner, Admin, User)
      role: a.string(),

      // References to both models - fixed relationships
      user: a.belongsTo('User', 'userId'),
      organization: a.belongsTo('Organization', 'organizationId'),

      // Additional metadata
      joinedAt: a.datetime(),
      invitedBy: a.string(), // User ID who invited this user

      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .secondaryIndexes((index) => [
      index("userId"), // Index for userId
      index("organizationId"), // Index for organizationId
      // TODO: Index for both userId and organizationId
    ])
    .authorization((allow) => [
      // Global admins can manage all memberships
      allow.group("GlobalAdmin"),
    ]),


    // SensorOrganization model - many to many relationship between Sensor and Organization
    SensorOrganization: a.model({
      // References to both models - fixed relationships
      sensorId: a.string().required(),
      organizationId: a.string().required(),

      // Relationship back to sensor and organization
      sensor: a.belongsTo('Sensor', 'sensorId'),
      organization: a.belongsTo('Organization', 'organizationId'),

      // Timestamps
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

    })
    .secondaryIndexes((index) => [
      index("sensorId"), // Index for sensorId
      index("organizationId"), // Index for organizationId
    ])
    .authorization((allow) => [
      // Global admins can access all sensor organizations
      allow.group("GlobalAdmin"),
    ]),

    // Modified Sensor model (now owned by an Organization)
    Sensor: a.model({
      id: a.id().required(),
      serialNumber: a.string().required(),
      name: a.string().required(),
      latitude: a.float().required(),
      longitude: a.float().required(),
      locationName: a.string(),
      status: a.integer().required(),
      enabled: a.boolean().required().default(false),
      firmwareVersion: a.string(),
      hardwareVersion: a.string(),
      batteryLevel: a.float(),

      // Organization relationship - many-to-many
      organizations: a.hasMany('SensorOrganization', 'sensorId'), // Many-to-many relationship with Organization

      // Timestamps
      createdAt: a.datetime(),
      lastUpdated: a.datetime(),
      lastServiceDate: a.datetime(),
      nextScheduledService: a.datetime(),

      // LED Configuration
      ledConfiguration: a.json(), // Stores which LEDs are installed
      calibrationData: a.json(), // Calibration parameters for each LED

      // Parameters this sensor can measure (based on LEDs)
      measurableParameters: a.string().array(),

      // Define relationships directly in the model - fixed references
      parameterValues: a.hasMany('ParameterValue', 'sensorId'),
      spectrogramReadings: a.hasMany('SpectrogramReading', 'sensorId'),
      alerts: a.hasMany('SensorAlert', 'sensorId'),

    }).authorization((allow) => [
      // Global admins can access all sensors
      allow.group('GlobalAdmin'),
    ]),

    // Parameter values (kept from original)
    ParameterValue: a.model({
      id: a.id(),
      sensorId: a.string().required(),
      timestamp: a.datetime().required(),

      // Dynamic parameter data (flexible based on sensor's LED configuration)
      parameterName: a.string().required(), // e.g., "pH", "temperature", "salinity", "disolvedO2"
      value: a.float().required(),
      unit: a.string().required(), // e.g., "mg/L", "°C"
      confidence: a.float(), // Confidence level (0-1)

      // Status and metadata
      status: a.integer().required(), // 0=invalid, 1=valid, 2=warning, etc.
      calibrationId: a.string(), // Reference to calibration used
      metadata: a.json(), // Any additional metadata

      // Add organizationId for access control
      organizationId: a.string().required(),

      // Relationship back to sensor - fixed reference
      sensor: a.belongsTo('Sensor', 'sensorId'),
    }).authorization((allow) => [
      // Global admins can access all parameter values
      allow.group('GlobalAdmin'),
    ]),

    // Spectrogram readings (kept from original)
    SpectrogramReading: a.model({
      id: a.id(),
      sensorId: a.string().required(),
      timestamp: a.datetime().required(),

      // LED information
      ledWavelength: a.float().required(), // nanometers
      ledIntensity: a.float().required(),

      // Spectrogram data
      wavelengths: a.float().array().required(), // Array of ~288 wavelength values in nm
      intensities: a.float().array().required(), // Corresponding intensity values

      // Calibration and quality
      calibrationId: a.string(),
      signalToNoiseRatio: a.float(),

      // Optional metadata
      temperature: a.float(), // Temperature during reading
      status: a.integer().required(), // Reading status
      metadata: a.json(), // Any additional metadata

      // Add organizationId for access control
      organizationId: a.string().required(),

      // Relationship back to sensor - fixed reference
      sensor: a.belongsTo('Sensor', 'sensorId'),
    }).authorization((allow) => [
      // Global admins can access all spectrogram readings
      allow.group('GlobalAdmin'),
    ]),

    // Other existing models (kept from original)
    ParameterConfig: a.model({
      id: a.id(),
      parameterName: a.string().required(), // e.g., "pH", "salinity"
      displayName: a.string().required(), // Human readable name
      unit: a.string().required(),
      description: a.string(),

      // The algorithm/formula used to calculate this parameter
      calculationMethod: a.string().required(), // e.g., "peak-intensity", "area-under-curve"
      calculationParameters: a.json().required(), // Wavelength ranges, coefficients, etc.

      // Which LED wavelengths are required for this parameter
      requiredLEDs: a.float().array(),

      // Validation ranges
      minValidValue: a.float(),
      maxValidValue: a.float(),

      // Add field for organization specific or global (null) parameter config
      organizationId: a.string(),

    }).authorization((allow) => [
      // Global admins can manage all parameter configs
      allow.group('GlobalAdmin'),
    ]),

    // Sensor alert model (kept from original)
    SensorAlert: a.model({
      id: a.id(),
      sensorId: a.string().required(),
      type: a.string().required(), // e.g., "battery-low", "reading-out-of-range"
      severity: a.integer().required(), // 1=info, 2=warning, 3=critical
      message: a.string().required(),
      timestamp: a.datetime().required(),
      acknowledged: a.boolean().required().default(false),
      acknowledgedBy: a.string(),
      acknowledgedAt: a.datetime(),

      // Add organizationId for access control
      organizationId: a.string().required(),

      // Relationship back to sensor - fixed reference
      sensor: a.belongsTo('Sensor', 'sensorId'),
    }).authorization((allow) => [
      // Global admins can access all alerts
      allow.group('GlobalAdmin'),
    ]),

    // Keep the existing custom types
    Geo: a.customType({
      latitude: a.float(),
      longitude: a.float(),
    }),

    // UserSettings model one to one with User
    UserSettings: a.model({
      // User Settings here
      theme: a.string(),
      uiLayout: a.json(),

      // Reference back to user - fixed reference
      userId: a.id().required(),
      user: a.belongsTo('User', 'userId'),

      owner: a.string().required(), // Cognito user ID
    })
    .secondaryIndexes((index) => [
      index("userId"), // Index for userId
    ])
    .authorization((allow) => [
      allow.owner(),
    ]),

    // Queries and mutations
    listIotCoreDevices: a
      .query()
      .returns(a.ref("Sensor").array())
      .handler(a.handler.function(queryIotCoreDevices)),

    getParameterValuesBySensor: a
      .query()
      .arguments({
        sensorId: a.string().required(),
        startTime: a.string().required(),
        endTime: a.string().required(),
        parameterNames: a.string().array() // Optional filter
      })
      .returns(a.ref('ParameterValue').array())
      .handler(a.handler.function(getParameterValuesBySensor)),

    getSpectrogramReadingsBySensor: a
      .query()
      .arguments({
        sensorId: a.string().required(),
        startTime: a.string().required(),
        endTime: a.string().required(),
        ledWavelength: a.float() // Optional filter
      })
      .returns(a.ref('SpectrogramReading').array())
      .handler(a.handler.function(getSpectrogramReadingsBySensor)),

    // getUserAccessibleOrgs: a
    //   .query()
    //   .returns(a.ref('Organization').array())
    //   .handler(a.handler.function(getUserAccessibleOrgs)),

    // listOrgSensors: a
    //   .query()
    //   .returns(a.ref('Sensor').array())
    //   .handler(a.handler.function(listOrgSensors)),
  })
  .authorization((allow) => [
    allow.authenticated(),
    // allow.resource(getUserAccessibleOrgs),
    // allow.resource(listOrgSensors),
    allow.resource(postConfirmation),
    allow.resource(getParameterValuesBySensor).to(['query']),
    allow.resource(getSpectrogramReadingsBySensor),
  ]);

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "userPool",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});
