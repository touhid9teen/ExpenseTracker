import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET
const key = new TextEncoder().encode(secretKey);

export async function authenticateUser(request) {
  const token = request.cookies.get('auth_token')?.value;
  if (token) {
    const user = await decrypt(token);
    if (user) return user;
  }
  if (process.env.APP_ENV === 'development') {
    return { id: 'dev-user-id', username: 'dev-user' };
  }
  return null;
}

export async function encrypt(payload) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('30d') // 1 month
    .sign(key);
}

export async function decrypt(input) {
  try {
    const { payload } = await jwtVerify(input, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    return null;
  }
}
