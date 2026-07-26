/* global process */
import dns from 'node:dns';
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import 'dotenv/config';
import { config } from 'dotenv';
config({ path: '.env.local' });
import SCHEMA_SQL from './src/lib/schema.mjs';

const sql = neon(process.env.DATABASE_URL);

async function initDB() {
  try {
    const statements = SCHEMA_SQL
      .split(';')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);

    for (const stmt of statements) {
      await sql.unsafe(stmt + ';');
    }

    console.log('Database initialized successfully from canonical schema.');
  } catch (error) {
    console.error('Error initializing database:', error);
  }
}

initDB();
