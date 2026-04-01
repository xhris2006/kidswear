import { execSync } from "node:child_process";
import { buildDbPushCandidates, loadEnv } from "./prisma-db-utils.mjs";

loadEnv();

const { databaseUrl, directUrl, sessionPoolerUrl, candidates } = buildDbPushCandidates();

console.log("[build] Environment:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV ?? "undefined"}`);
console.log(`  - DATABASE_URL: ${databaseUrl ? "set" : "not set"}`);
console.log(`  - DIRECT_URL: ${directUrl ? "set" : "not set"}`);
console.log(`  - SESSION_POOLER_FALLBACK: ${sessionPoolerUrl ? "available" : "unavailable"}`);

if (candidates.length > 0) {
  let pushed = false;

  for (const candidate of candidates) {
    console.log(`[build] Trying prisma db push with ${candidate.label}...`);

    try {
      execSync("npx prisma db push --skip-generate", {
        stdio: "inherit",
        env: {
          ...process.env,
          DATABASE_URL: candidate.url,
          DIRECT_URL: candidate.url,
        },
      });
      pushed = true;
      console.log(`[build] prisma db push succeeded with ${candidate.label}.`);
      break;
    } catch {
      console.warn(`[build] Warning: prisma db push failed with ${candidate.label}.`);
    }
  }

  if (!pushed) {
    console.warn("[build] Warning: all prisma db push attempts failed. Continuing build...");
  }
} else {
  console.log("[build] No database connection configured, skipping prisma db push.");
}
