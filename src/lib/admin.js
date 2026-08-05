// Single source of truth for the admin-role check, shared by client and server.
// Admin status is carried on the (HS256-signed) JWT as the `isAdmin` claim and
// mirrored onto the client `user` object returned by the auth endpoints.
export const isAdmin = (user) => !!user?.isAdmin;

export default isAdmin;
