import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    // 1. Create extension
    try { await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`; } catch (e) { console.log('1', e) }

    // 2. Create users table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
          username VARCHAR(255) UNIQUE NOT NULL,
          password_hash VARCHAR(255) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) { console.log('2', e) }

    // 3. Create users index
    try { await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`; } catch (e) { console.log('3', e) }

    // 4. Create expenses table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS expenses (
          id VARCHAR(255) PRIMARY KEY,
          item VARCHAR(255),
          description TEXT,
          amount NUMERIC,
          date DATE,
          category VARCHAR(255),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) { console.log('4', e) }

    // 4.b Add user_id column to expenses if it doesn't exist
    try {
      await sql`ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE`;
    } catch (e) { 
      // This will fail if the column already exists, which is fine
      console.log('4b', e.message);
    }

    // 5. Create expenses index
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC)`;
    } catch (e) {
      console.log('5', e.message);
    }

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
