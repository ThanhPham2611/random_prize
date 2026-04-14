"use strict";

const { readConfig } = require("./_lib/config-store");
const { sendJson } = require("./_lib/http");

module.exports = async function handler(req, res) {
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return sendJson(res, 405, { error: "Method not allowed" });
  }

  try {
    const config = await readConfig();
    return sendJson(res, 200, config);
  } catch (error) {
    return sendJson(res, 500, {
      error: "Unable to load config",
      details: error.message,
    });
  }
};
