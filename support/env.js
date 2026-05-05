const path = require("path");
const dotenv = require("dotenv");

dotenv.config({ path: path.resolve(process.cwd(), ".env") });

const must = (k) => {
    const v = process.env[k];
    if (!v) throw new Error(`Missing env var: ${k}`);
    return v;
};

const toBool = (v, def = true) =>
    v === undefined || v === "" ? def : String(v).toLowerCase() === "true";

const toInt = (v, def) => {
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : def;
};

const config = {
    baseUrl: must("BASE_URL"),
    username: must("USERNAME"),
    password: must("PASSWORD"),
    headless: toBool(process.env.HEADLESS, true),
    browserName: process.env.BROWSER || "chromium",
    timeout: toInt(process.env.TIMEOUT, 30000),
};

module.exports = { config };
