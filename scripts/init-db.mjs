import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const main = async () => {
    // Manually getting from .env.local
    let envLocal = '';
    try {
        envLocal = fs.readFileSync('.env.local', 'utf8');
    } catch (e) {
        console.error("Could not find .env.local file.");
        process.exit(1);
    }
    
    const dbUrlMatch = envLocal.match(/DATABASE_URL="([^"]+)"/);
    if (!dbUrlMatch) {
        console.error("Could not find DATABASE_URL in .env.local");
        process.exit(1);
    }
    
    const dbUrl = dbUrlMatch[1];
    console.log("Found database URL. Connecting...");

    const sql = neon(dbUrl);
    
    try {
        const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
        const schema = fs.readFileSync(schemaPath, 'utf8');
        
        console.log("Executing schema.sql...");
        await sql.unsafe(schema);
        console.log("Database initialized successfully!");
    } catch (err) {
        console.error("Error executing schema:", err);
    }
};

main();
