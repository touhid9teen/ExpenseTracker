import sql from '../../../lib/db';
import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  try {
    await sql`DELETE FROM expenses`;
    return NextResponse.json({ success: true, message: "All expenses have been deleted from the database." });
  } catch (error) {
    console.error('Error clearing database:', error);
    return NextResponse.json({ error: 'Failed to clear database' }, { status: 500 });
  }
}
