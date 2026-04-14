"use strict";

const { readConfig } = require("./_lib/config-store");
const { sendJson } = require("./_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const config = await readConfig();
    const isWin = Math.random() < config.winRate;

    return sendJson(res, 200, {
      isWin,
      winRate: config.winRate,
      updatedAt: config.updatedAt,
    });
  } catch (error) {
    return sendJson(res, 500, {
      error: "Unable to complete spin",
      details: error.message,
    });
  }
};
