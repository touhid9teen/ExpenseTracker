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
          email VARCHAR(255) UNIQUE NOT NULL DEFAULT '',
          password_hash VARCHAR(255) NOT NULL,
          security_question VARCHAR(255) NOT NULL DEFAULT '',
          security_answer_hash VARCHAR(255) NOT NULL DEFAULT '',
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) { console.log('2', e) }

    // Add email column to existing users table if missing
    // Note: We add WITHOUT UNIQUE constraint first to avoid conflicts with existing rows.
    // Uniqueness is enforced via a partial unique index that ignores empty strings.
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS email VARCHAR(255) NOT NULL DEFAULT ''`;
    } catch (e) { console.log('2a', e.message) }

    // Create unique index on email (separate from column definition to avoid migration issues)
    try {
      await sql`CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email_unique ON users(email) WHERE email != ''`;
    } catch (e) { console.log('2a-unique', e.message) }

    // Add security columns to existing users table
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS security_question VARCHAR(255) NOT NULL DEFAULT ''`;
    } catch (e) { console.log('2b', e.message) }
    try {
      await sql`ALTER TABLE users ADD COLUMN IF NOT EXISTS security_answer_hash VARCHAR(255) NOT NULL DEFAULT ''`;
    } catch (e) { console.log('2c', e.message) }

    // 3. Create users indexes
    try { await sql`CREATE INDEX IF NOT EXISTS idx_users_username ON users(username)`; } catch (e) { console.log('3', e) }
    try { await sql`CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)`; } catch (e) { console.log('3b', e) }

    // 4. Create password_reset_tokens table
    try {
      await sql`
        CREATE TABLE IF NOT EXISTS password_reset_tokens (
          id SERIAL PRIMARY KEY,
          user_id UUID REFERENCES users(id) ON DELETE CASCADE NOT NULL,
          token VARCHAR(255) UNIQUE NOT NULL,
          expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
          used BOOLEAN DEFAULT FALSE,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `;
    } catch (e) { console.log('4', e) }

    // 5. Create expenses table
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
    } catch (e) { console.log('5', e) }

    // 5.b Add user_id column to expenses if it doesn't exist
    try {
      await sql`ALTER TABLE expenses ADD COLUMN user_id UUID REFERENCES users(id) ON DELETE CASCADE`;
    } catch (e) { 
      console.log('5b', e.message);
    }

    // 6. Create expenses index
    try {
      await sql`CREATE INDEX IF NOT EXISTS idx_expenses_user_id_date ON expenses(user_id, date DESC)`;
    } catch (e) {
      console.log('6', e.message);
    }

    // 7. Create password_reset_tokens indexes
    try { await sql`CREATE INDEX IF NOT EXISTS idx_reset_tokens_token ON password_reset_tokens(token)`; } catch (e) { console.log('7', e) }
    try { await sql`CREATE INDEX IF NOT EXISTS idx_reset_tokens_user_id ON password_reset_tokens(user_id)`; } catch (e) { console.log('7b', e) }

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
