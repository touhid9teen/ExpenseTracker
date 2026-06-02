import { neon } from '@neondatabase/serverless';

export const runtime = 'edge';

export async function GET(request) {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const res = await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY,
        item VARCHAR(255),
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL
      );
    `;
    return new Response(JSON.stringify({ success: true, message: "Database table initialized" }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ success: false, error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
