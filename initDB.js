/* global process */
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS expenses (
        id VARCHAR(255) PRIMARY KEY,
        item VARCHAR(255) NOT NULL,
        description VARCHAR(255) NOT NULL,
        amount DOUBLE PRECISION NOT NULL,
        date DATE NOT NULL,
        category VARCHAR(100) NOT NULL
      );
    `;

    await sql`
      ALTER TABLE expenses
      ALTER COLUMN amount TYPE DOUBLE PRECISION
      USING amount::double precision
    `;

    console.log("Database table 'expenses' initialized successfully");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

initDB();
