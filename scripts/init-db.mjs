import dns from 'node:dns';
// Force IPv4 DNS resolution — the Neon endpoint is unreachable over IPv6 from
// some networks, which manifests as intermittent "fetch failed" errors.
dns.setDefaultResultOrder('ipv4first');

import { neon } from '@neondatabase/serverless';
import fs from 'fs';
import path from 'path';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

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

    const schemaPath = path.join(process.cwd(), 'src', 'lib', 'schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // sql.unsafe() is not an execution method — it returns a token to embed in
    // a tagged template. So each statement must run on its own as
    // sql`${sql.unsafe(stmt)}`, and statements are idempotent
    // (CREATE ... IF NOT EXISTS / ALTER ... IF NOT EXISTS).
    const statements = schema
        .split(';')
        .map((s) => s.trim())
        .filter((s) => s.length > 0);

    console.log(`Executing ${statements.length} schema statements...`);

    let failures = 0;
    for (const stmt of statements) {
        let applied = false;
        for (let attempt = 1; attempt <= 5 && !applied; attempt += 1) {
            try {
                await sql`${sql.unsafe(stmt)}`;
                applied = true;
            } catch (err) {
                // Retry transient connection failures (e.g. Neon free-tier
                // compute cold starts).
                if (attempt < 5) {
                    await sleep(3000 * attempt);
                } else {
                    console.error(`Statement failed after ${attempt} attempts:`);
                    console.error(`  ${stmt.slice(0, 140)}...`);
                    console.error(`  ${err.message}`);
                    failures += 1;
                }
            }
        }
    }

    if (failures > 0) {
        console.error(`\nDatabase initialization finished with ${failures} failed statement(s).`);
        process.exit(1);
    }
    console.log("Database initialized successfully!");
};

main();
