import { type ClientSchema, a, } from '@aws-amplify/backend';

const schema = a.schema({
  User: a
    .model({
      username: a.string().required(),
      createdAt: a.datetime(),
      updatedAt: a.datetime(),
    })
    .authorization((rules) => [rules.owner()]),
});

export type Schema = ClientSchema<typeof schema>;


