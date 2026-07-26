import sql from '../../../lib/db';
import { NextResponse } from 'next/server';
import SCHEMA_SQL from '../../../lib/schema.mjs';

export const runtime = 'edge';
export const dynamic = 'force-dynamic';

export async function GET() {
  if (!sql) {
    return NextResponse.json({ error: 'Database is not configured' }, { status: 503 });
  }

  try {
    // Execute the canonical schema from src/lib/schema.mjs
    const statements = SCHEMA_SQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      try {
        await sql.unsafe(stmt + ';');
      } catch (e) {
        console.error('Migration statement failed (may be idempotent):', e?.message);
      }
    }

    return NextResponse.json({ success: true, message: 'Database initialized successfully!' });
  } catch (error) {
    console.error('Initialization error:', error);
    return NextResponse.json({ error: 'Failed to initialize database', details: error.message }, { status: 500 });
  }
}
