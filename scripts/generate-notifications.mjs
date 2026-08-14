import dns from 'node:dns';
// Force IPv4 DNS resolution — the Neon endpoint is unreachable over IPv6 from
// some networks, which manifests as intermittent "fetch failed" errors.
dns.setDefaultResultOrder('ipv4first');

import fs from 'fs';

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const main = async () => {
    // Prefer the DATABASE_URL env var; fall back to reading it from .env.local.
    let dbUrl = process.env.DATABASE_URL;
    if (!dbUrl) {
        let envLocal = '';
        try {
            envLocal = fs.readFileSync('.env.local', 'utf8');
        } catch (e) {
            console.error("Could not find .env.local file and DATABASE_URL is not set.");
            process.exit(1);
        }

        const dbUrlMatch = envLocal.match(/DATABASE_URL="([^"]+)"/);
        if (!dbUrlMatch) {
            console.error("Could not find DATABASE_URL in .env.local");
            process.exit(1);
        }

        dbUrl = dbUrlMatch[1];
    }

    process.env.DATABASE_URL = dbUrl;

    // Import after env is set so src/lib/db.js picks up the connection URL.
    const { generateNotifications } = await import('../src/lib/notifications/generate.js');

    console.log('Generating period-end notifications...');

    let result;
    for (let attempt = 1; attempt <= 5; attempt += 1) {
        try {
            result = await generateNotifications();
            break;
        } catch (err) {
            // Retry transient Neon connectivity failures (cold starts, IPv6).
            if (attempt < 5) {
                console.error(`Attempt ${attempt} failed (${err?.message}); retrying...`);
                await sleep(3000 * attempt);
            } else {
                console.error('Notification generation failed:', err?.message);
                process.exit(1);
            }
        }
    }

    console.log(`Done — created ${result.created} notification(s) across ${result.users} user(s).`);
};

main();
