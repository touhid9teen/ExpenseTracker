import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    // 1. Create extension
    await sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

    // 2. Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        username VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      )
    `;

    // 3. Create users index
    await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`;

    // 4. Create expenses table
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

    // 4.b Add user_id column to expenses if it doesn't exist
    await sql`
      ALTER TABLE expenses 
      ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES users(id) ON DELETE CASCADE
    `;

    // 5. Create expenses index
    await sql`CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC)`;

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
