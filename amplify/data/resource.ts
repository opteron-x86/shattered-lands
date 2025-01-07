// amplify/data/resource.ts
import { type ClientSchema, a, defineData } from '@aws-amplify/backend';

const schema = a.schema({
  // 1) "User" model
  User: a
    .model({
      username: a.string().required(),
      // This user can have many Kingdom records.
      // (1) modelName = "Kingdom"
      // (2) references = the remote model's field referencing THIS model.
      //    We'll call it "user", see below in Kingdom.
      kingdoms: a.hasMany('Kingdom', 'user'),
    })
    .authorization((rules) => [rules.owner()]),

  // 2) "Kingdom" model
  Kingdom: a
    .model({
      name: a.string().required(),
      resources: a.json(),
      buildings: a.json(),
      troops: a.json(),

      // This kingdom "belongsTo" a User.
      // (1) modelName = "User"
      // (2) references = the remote model's primary key,
      //    typically "id" if you're referencing User.id.
      user: a.belongsTo('User', 'id'),
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
