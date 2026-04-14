"use strict";

async function readJsonBody(req) {
  if (req.body && typeof req.body === "object") {
    return req.body;
  }

  if (typeof req.body === "string" && req.body.length > 0) {
    return JSON.parse(req.body);
  }

  const chunks = [];
  for await (const chunk of req) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }

  if (chunks.length === 0) {
    return {};
  }

  return JSON.parse(Buffer.concat(chunks).toString("utf8"));
}

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.setHeader("Cache-Control", "no-store");
  res.end(JSON.stringify(payload));
}

function getAdminPassword(req) {
  return req.headers["x-admin-password"];
}

function ensureAdmin(req) {
  const configuredPassword = process.env.ADMIN_PASSWORD;

  if (!configuredPassword) {
    throw new Error("Missing required environment variable: ADMIN_PASSWORD");
  }

  if (getAdminPassword(req) !== configuredPassword) {
    const error = new Error("Unauthorized");
    error.statusCode = 401;
    throw error;
  }
}

module.exports = {
  ensureAdmin,
  readJsonBody,
  sendJson,
};
