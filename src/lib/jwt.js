import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET;
if (!secretKey || secretKey.length < 16) {
  throw new Error('JWT_SECRET environment variable must be set to a strong secret (min 16 characters)');
}
const key = new TextEncoder().encode(secretKey);

export async function authenticateUser(request) {
  const token = request.cookies.get('auth_token')?.value;
  if (token) {
    const user = await decrypt(token);
    if (user) return user;
  }
  return null;
}

export async function authenticateAdmin(request) {
  const user = await authenticateUser(request);
  if (user && user.isAdmin === true) return user;
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
  } catch {
    return null;
  }
}
