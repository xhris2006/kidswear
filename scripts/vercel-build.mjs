import { execSync } from "node:child_process";
import dotenv from "dotenv";

// Load environment variables from .env.local for local development
try {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
} catch (e) {
  // Silently fail if dotenv not available (will use system env vars)
}

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const isProduction = process.env.NODE_ENV === "production" || !process.env.LOCAL_ENV;
const looksLikePooledConnection =
  typeof databaseUrl === "string" &&
  (databaseUrl.includes("pgbouncer=true") || databaseUrl.includes(".pooler."));

console.log("[build] Environment:");
console.log(`  - NODE_ENV: ${process.env.NODE_ENV}`);
console.log(`  - DATABASE_URL: ${databaseUrl ? "✓ set" : "✗ not set"}`);
console.log(`  - DIRECT_URL: ${directUrl ? "✓ set" : "✗ not set"}`);

if (directUrl) {
  console.log("[build] DIRECT_URL detected, running prisma db push with direct connection...");
  try {
    execSync("npx prisma db push --skip-generate", {
      stdio: "inherit",
      env: {
        ...process.env,
        DATABASE_URL: directUrl,
      },
    });
  } catch (error) {
    console.warn("[build] Warning: prisma db push failed. Continuing build...");
  }
} else if (databaseUrl && !looksLikePooledConnection) {
  console.log("[build] Running prisma db push with DATABASE_URL...");
  try {
    execSync("npx prisma db push --skip-generate", { stdio: "inherit", env: process.env });
  } catch (error) {
    console.warn("[build] Warning: prisma db push failed. Continuing build...");
  }
} else if (databaseUrl) {
  console.log(
    "[build] ℹ pgBouncer pooled connection detected. Set DIRECT_URL on Vercel for schema updates during build."
  );
} else {
  console.log("[build] ℹ No database connection configured, skipping prisma db push");
}
