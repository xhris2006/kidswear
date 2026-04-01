import { execSync } from "node:child_process";

const databaseUrl = process.env.DATABASE_URL;
const directUrl = process.env.DIRECT_URL;
const looksLikePooledConnection =
  typeof databaseUrl === "string" &&
  (databaseUrl.includes("pgbouncer=true") || databaseUrl.includes(".pooler."));

if (directUrl) {
  console.log("[build] DIRECT_URL detected, running prisma db push with direct connection...");
  execSync("npx prisma db push", {
    stdio: "inherit",
    env: {
      ...process.env,
      DATABASE_URL: directUrl,
    },
  });
} else if (databaseUrl && !looksLikePooledConnection) {
  console.log("[build] Running prisma db push with DATABASE_URL...");
  execSync("npx prisma db push", { stdio: "inherit", env: process.env });
} else if (databaseUrl) {
  console.log(
    "[build] Skipping prisma db push because DATABASE_URL appears to be a pooled pgBouncer connection. Set DIRECT_URL on Vercel for schema updates during build."
  );
} else {
  console.log("[build] No database connection configured, skipping prisma db push.");
}
