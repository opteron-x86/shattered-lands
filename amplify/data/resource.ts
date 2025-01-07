import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
      lastLoginIp: a.string(),         // e.g. "192.168.x.x"
      lastLoginUserAgent: a.string(),  // e.g. "Mozilla/5.0..."
      lastLoginAt: a.datetime(),
    })
    .authorization((rules) => [rules.owner()]),
    
  // 2) Kingdom model
  Kingdom: a
  .model({
    // The name of the kingdom
    name: a.string().required(),

    // The game mode for this kingdom: "standard," "tournament," "casual"
    // You could also do an enum if you want strict values
    gameMode: a.string().required(),

    // Timestamps
    createdAt: a.datetime(),
    updatedAt: a.datetime(),

  })
  .authorization((rules) => [
    rules.owner(), // Only the user who owns the kingdom can change it
  ]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
