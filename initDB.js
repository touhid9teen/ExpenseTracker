import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    const res = await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY,
        description VARCHAR(255) NOT NULL,
        amount DECIMAL(10, 2) NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL
      );
    `;
    console.log("Database table 'expenses' initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDB();
