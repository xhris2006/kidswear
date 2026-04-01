import dotenv from "dotenv";

export function loadEnv() {
  dotenv.config({ path: ".env.local" });
  dotenv.config();
}

function safeUrl(url) {
  if (!url) return null;

  try {
    return new URL(url);
  } catch {
    return null;
  }
}

function isSupabaseHost(hostname) {
  return hostname.endsWith(".supabase.co") || hostname.endsWith(".pooler.supabase.com");
}

export function isPooledConnection(url) {
  return typeof url === "string" && (url.includes("pgbouncer=true") || url.includes(".pooler."));
}

export function normalizeSupabaseUrl(url) {
  const parsed = safeUrl(url);

  if (!parsed || !isSupabaseHost(parsed.hostname)) {
    return url;
  }

  if (!parsed.searchParams.has("sslmode")) {
    parsed.searchParams.set("sslmode", "require");
  }

  return parsed.toString();
}

export function deriveSupabaseSessionPoolerUrl(url) {
  const parsed = safeUrl(normalizeSupabaseUrl(url));

  if (!parsed || !parsed.hostname.includes(".pooler.supabase.com")) {
    return null;
  }

  parsed.port = "5432";
  parsed.searchParams.delete("pgbouncer");
  parsed.searchParams.delete("connection_limit");

  const search = parsed.searchParams.toString();
  parsed.search = search ? `?${search}` : "";

  return parsed.toString();
}

export function buildDbPushCandidates(env = process.env) {
  const databaseUrl = normalizeSupabaseUrl(env.DATABASE_URL);
  const directUrl = normalizeSupabaseUrl(env.DIRECT_URL);
  const sessionPoolerUrl = deriveSupabaseSessionPoolerUrl(databaseUrl);
  const candidates = [];
  const seen = new Set();

  const addCandidate = (label, url) => {
    if (!url || seen.has(url)) return;
    seen.add(url);
    candidates.push({ label, url });
  };

  addCandidate("DIRECT_URL", directUrl);
  addCandidate("Supabase session pooler fallback", sessionPoolerUrl);

  if (databaseUrl && !isPooledConnection(databaseUrl)) {
    addCandidate("DATABASE_URL", databaseUrl);
  }

  return {
    databaseUrl,
    directUrl,
    sessionPoolerUrl,
    candidates,
  };
}
