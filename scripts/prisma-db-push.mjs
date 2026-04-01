#!/usr/bin/env node
import { execSync } from "node:child_process";
import { buildDbPushCandidates, loadEnv } from "./prisma-db-utils.mjs";

loadEnv();

const { databaseUrl, directUrl, sessionPoolerUrl, candidates } = buildDbPushCandidates();

console.log(`DATABASE_URL: ${databaseUrl ? "loaded" : "missing"}`);
console.log(`DIRECT_URL: ${directUrl ? "loaded" : "missing"}`);
console.log(`SESSION_POOLER_FALLBACK: ${sessionPoolerUrl ? "derived" : "unavailable"}`);

if (candidates.length === 0) {
  console.error("No usable database connection string was found for prisma db push.");
  process.exit(1);
}

let lastError = null;

for (const candidate of candidates) {
  console.log(`Trying prisma db push with ${candidate.label}...`);

  try {
    execSync("npx prisma db push", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: candidate.url,
        DIRECT_URL: candidate.url,
      },
    });

    console.log(`prisma db push succeeded with ${candidate.label}.`);
    process.exit(0);
  } catch (error) {
    lastError = error;
    console.warn(`prisma db push failed with ${candidate.label}.`);
  }
}

console.error("All prisma db push connection attempts failed.");
process.exit(lastError?.status ?? 1);
