import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';
import 'dotenv/config'; // if needed, but since it's Next.js maybe dotenv is better

const main = async () => {
    // Manually getting from .env.local if dotenv isn't there
    const envLocal = fs.readFileSync('.env.local', 'utf8');
    const dbUrlMatch = envLocal.match(/DATABASE_URL="([^"]+)"/);
    if (!dbUrlMatch) {
        console.error("Could not find DATABASE_URL in .env.local");
        process.exit(1);
    }
    
    const dbUrl = dbUrlMatch[1];
    console.log("Found database URL.");

    const sql = neon(dbUrl);
    
    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');
    
    // The neon serverless driver does not support multi-statement queries well if not formatted properly,
    // but we can try to split by semicolon and run sequentially.
    const statements = schema
        .split(';')
        .map(s => s.trim())
        .filter(s => s.length > 0);
        
    for (const stmt of statements) {
        console.log(`Executing: ${stmt.substring(0, 50)}...`);
        try {
            const result = await sql.query(stmt);
            console.log("Success.");
        } catch (err) {
            console.error("Error executing statement:", err.message);
        }
    }
    console.log("Database initialized.");
};

main();
