"use strict";

const { normalizeWinRate, readConfig, saveConfig } = require("../_lib/config-store");
const { ensureAdmin, readJsonBody, sendJson } = require("../_lib/http");

module.exports = async function handler(req, res) {
  try {
    ensureAdmin(req);

    if (req.method === "GET") {
      const config = await readConfig();
      return sendJson(res, 200, config);
    }

    if (req.method === "POST") {
      const body = await readJsonBody(req);
      const nextWinRate = normalizeWinRate(body.winRate);
      const config = await saveConfig(nextWinRate);

      return sendJson(res, 200, {
        message: "Win rate updated successfully",
        config,
      });
    }

    res.setHeader("Allow", "GET, POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    const statusCode = error.statusCode || 500;
    return sendJson(res, statusCode, {
      error: statusCode === 401 ? "Unauthorized" : "Unable to manage win rate",
      details: error.message,
    });
  }
};
