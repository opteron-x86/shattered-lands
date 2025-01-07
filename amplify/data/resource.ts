import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      // For simplicity: one required field
      username: a.string().required(),

      // The relationship: A user has many kingdoms.
      // 1) 'Kingdom' is the child model's name.
      // 2) 'userId' is the **exact** field name in the child model
      //    that references this user.
      kingdoms: a.hasMany('Kingdom', 'userId'),
    })
    .authorization((rules) => [rules.owner()]),

  Kingdom: a
    .model({
      name: a.string().required(),
      resources: a.json(),
      buildings: a.json(),
      troops: a.json(),

      // This is the "childField" from above, i.e. 'userId'.
      // We'll define it as "belongsTo('User','id')"
      // meaning it references the User model's 'id' field.
      userId: a.belongsTo('User', 'id'),
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
