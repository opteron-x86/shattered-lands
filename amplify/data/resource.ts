// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      /**
       * The user "hasMany" kingdoms.
       * 1) First argument: the remote model's name ("Kingdom")
       * 2) Second argument: the remote model’s field name that references THIS model, 
       *    which we’ll set to "userID" in the Kingdom model.
       */
      kingdoms: a.hasMany('Kingdom', 'userID'),
    })
    .authorization((rules) => [rules.owner()]),

  Kingdom: a
    .model({
      name: a.string().required(),

      // Example JSON fields
      resources: a.json(),
      buildings: a.json(),
      troops: a.json(),

      createdAt: a.datetime(),
      updatedAt: a.datetime(),

      /**
       * The Kingdom "belongsTo" a User
       * 1) "User" is the remote model name
       * 2) "id" is the field in User we reference (the primary key)
       * 3) config object => { targetName: 'userID' } 
       *    means we'll store 'userID' in the Kingdom table as a foreign key referencing User.id
       */
      user: a.belongsTo('User', 'id', { targetName: 'userID' }),
    })
    .authorization((rules) => [rules.owner()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: 'userPool',
  },
});
