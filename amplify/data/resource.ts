// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

/**
 * 1) Define your schema using the `a.schema` builder.
 *    Here we have two models: `User` and `Fiefdom`.
 *
 *    - `User` has fields like `username` and `race`.
 *    - `Fiefdom` belongs to a `User` via a foreign key `userID`.
 *
 *    We also apply basic owner-based auth to each model:
 *    only the record owner can create/update/delete,
 *    but you can tweak as needed.
 */
const schema = a.schema({
  // Remove or rename your original 'Todo' model if you no longer need it.
  // e.g., 'Todo' -> 'User' or just remove it entirely.

  User: a
    .model({
      username: a.string({ isRequired: true }),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      // If you want a "hasMany" relationship from User -> Fiefdom
      // you can define it here; see below for Fiefdom's belongsTo
      // (We'll rely on the Fiefdom's foreign key to link back to User).
    })
    .authorization((rules) => [
      rules.owner(), // Only the owner can read/update/delete their own User record
    ]),

  Kingdom: a
    .model({
      name: a.string,

      // Resources, buildings, troops can be stored as JSON for now
      resources: a.json(), 
      buildings: a.json(),
      troops: a.json(),

      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      // Link back to the User
      // By default, Amplify will create a 'userID' field in DynamoDB
      // to track the relationship if we specify `belongsTo`.
      user: a.belongsTo({ targetName: 'userID' }),
    })
    .authorization((rules) => [
      rules.owner(), // Only the record owner can mutate their own Fiefdom data
    ]),
});

/**
 * 2) Export the schema type so Amplify can correctly infer the types of your data.
 */
export type Schema = ClientSchema<typeof schema>;

/**
 * 3) Define your data resource.
 *    - The `schema` is passed in so Amplify knows what models to provision.
 *    - Configure your default auth mode (e.g., userPool).
 */
export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
