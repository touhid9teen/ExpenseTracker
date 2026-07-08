import sql from '../../../../lib/db';
import { encrypt } from '../../../../lib/jwt';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export const runtime = 'edge';

export async function POST(request) {
  try {
    const { username, password, securityQuestion, securityAnswer } = await request.json();
    if (!username || !password) {
      return NextResponse.json({ error: 'Username and password are required' }, { status: 400 });
    }
    
    let user;
    let isNewUser = false;
    
    if (sql) {
      const users = await sql`SELECT * FROM users WHERE username = ${username}`;
      if (users.length === 0) {
        const hashedPassword = await bcrypt.hash(password, 10);
        const hashedAnswer = securityQuestion && securityAnswer
          ? await bcrypt.hash(securityAnswer.toLowerCase().trim(), 10)
          : '';
        const inserted = await sql`
          INSERT INTO users (username, password_hash, security_question, security_answer_hash)
          VALUES (${username}, ${hashedPassword}, ${securityQuestion || ''}, ${hashedAnswer})
          RETURNING *
        `;
        user = inserted[0];
        isNewUser = true;
      } else {
        user = users[0];
        const isDevelopment = process.env.APP_ENV === 'development';
        if (!isDevelopment) {
          const isPasswordValid = await bcrypt.compare(password, user.password_hash);
          if (!isPasswordValid) {
            return NextResponse.json({ error: 'A user is already using this username or you entered a wrong password' }, { status: 401 });
          }
        }
      }
    } else {
      // Mock user for development
      user = { id: 'mock-user-id', username };
      isNewUser = true;
    }
    
    // Create JWT
    const token = await encrypt({ id: user.id, username: user.username });
    
    // Set cookie
    const response = NextResponse.json({ success: true, user, isNewUser });
    response.cookies.set({
      name: 'auth_token',
      value: token,
      httpOnly: true,
      secure: process.env.APP_ENV === 'production',
      maxAge: 60 * 60 * 24 * 30, // 30 days
      path: '/',
    });
    
    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
