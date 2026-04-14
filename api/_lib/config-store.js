"use strict";

const CONFIG_ROW_ID = 1;
const DEFAULT_WIN_RATE = 0.4;

function getEnv(name) {
  const rawValue = process.env[name];
  const value = typeof rawValue === "string" ? rawValue.trim().replace(/^"(.*)"$/, "$1") : rawValue;

  if (!value) {
    throw new Error(`Missing required environment variable: ${name}`);
  }

  return value;
}

function getSupabaseConfig() {
  const url = getEnv("SUPABASE_URL").replace(/\/$/, "");
  const serviceRoleKey = getEnv("SUPABASE_SERVICE_ROLE_KEY");

  return { url, serviceRoleKey };
}

function normalizeWinRate(value) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    throw new Error("winRate must be a number between 0 and 1.");
  }

  if (numericValue < 0 || numericValue > 1) {
    throw new Error("winRate must be between 0 and 1.");
  }

  return Number(numericValue.toFixed(4));
}

async function supabaseRequest(path, options = {}) {
  const { url, serviceRoleKey } = getSupabaseConfig();
  const response = await fetch(`${url}/rest/v1${path}`, {
    method: options.method || "GET",
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    const details = data && typeof data === "object" ? data.message || data.error || text : text;
    throw new Error(`Supabase request failed: ${response.status} ${details}`);
  }

  return data;
}

function mapConfigRow(row) {
  if (!row) {
    return {
      id: CONFIG_ROW_ID,
      winRate: DEFAULT_WIN_RATE,
      updatedAt: null,
    };
  }

  return {
    id: row.id,
    winRate: normalizeWinRate(row.win_rate),
    updatedAt: row.updated_at || null,
  };
}

async function readConfig() {
  const rows = await supabaseRequest(`/app_config?id=eq.${CONFIG_ROW_ID}&select=id,win_rate,updated_at`);
  return mapConfigRow(Array.isArray(rows) ? rows[0] : null);
}

async function saveConfig(winRate) {
  const normalizedWinRate = normalizeWinRate(winRate);
  const now = new Date().toISOString();

  const rows = await supabaseRequest(`/app_config?on_conflict=id`, {
    method: "POST",
    headers: {
      Prefer: "resolution=merge-duplicates,return=representation",
    },
    body: [
      {
        id: CONFIG_ROW_ID,
        win_rate: normalizedWinRate,
        updated_at: now,
      },
    ],
  });

  return mapConfigRow(Array.isArray(rows) ? rows[0] : null);
}

module.exports = {
  DEFAULT_WIN_RATE,
  normalizeWinRate,
  readConfig,
  saveConfig,
};
