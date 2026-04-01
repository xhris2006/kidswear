#!/usr/bin/env node
import { execSync } from "node:child_process";
import dotenv from "dotenv";
import { readFileSync } from "node:fs";

// Load environment variables from .env.local
dotenv.config({ path: ".env.local" });
dotenv.config();

console.log(`DATABASE_URL: ${process.env.DATABASE_URL ? "✓ loaded" : "✗ missing"}`);
console.log(`DIRECT_URL: ${process.env.DIRECT_URL ? "✓ loaded" : "✗ missing"}`);

// Execute prisma db push with loaded environment
try {
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: process.env,
  });
} catch (error) {
  process.exit(1);
}
