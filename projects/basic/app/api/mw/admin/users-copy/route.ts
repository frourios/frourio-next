import { createRoute } from './frourio.server';

export const { GET } = createRoute({
  get: async ({ query }, context) => {
    console.log('GET Handler (/api/mw/admin/users): Received full context:', context);
    console.log('GET Handler (/api/mw/admin/users): Received query:', query);

    const users = ['user1', 'user2', 'admin1'];
    const filteredUsers = query?.role
      ? users.filter((u) => u.includes(query.role as string))
      : users;

    return { status: 200, body: { context, users: filteredUsers } };
  },
});
