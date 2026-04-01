import { execSync } from "node:child_process";

if (process.env.DATABASE_URL) {
  console.log("[build] DATABASE_URL detected, running prisma db push...");
  execSync("npx prisma db push", { stdio: "inherit" });
} else {
  console.log("[build] DATABASE_URL not set, skipping prisma db push.");
}
