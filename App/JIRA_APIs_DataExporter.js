//-------------------------------------------------------------------------------
// Name:        JIRA_APIs_DataExporter
// Purpose:     JIRA APIs Data Source Exporter Utility
//
// Author:      91973

// Created:     22-03-2025
// Copyright:   (c) 91973 2025
// Licence:     <your licence>
//-------------------------------------------------------------------------------

const fs = require("fs");
const path = require("path");
const axios = require("axios");
const ini = require("ini");

// Determine Base Directory
function getBasePath() {
    return process.pkg ? path.dirname(process.execPath) : __dirname;
}

const BASE_DIR = path.dirname(getBasePath());

// Paths to Config and Runtime Directory
const CONFIG_PATH = path.join(BASE_DIR, "Config", "configFile.ini");
const RUNTIME_SCREEN_DIR = path.join(BASE_DIR, "RunTime");

// Ensure Runtime Directory Exists
if (!fs.existsSync(RUNTIME_SCREEN_DIR)) {
    fs.mkdirSync(RUNTIME_SCREEN_DIR, { recursive: true });
}

// Load Config File
if (!fs.existsSync(CONFIG_PATH)) {
    throw new Error(`❌ Config file missing: ${CONFIG_PATH}`);
}

const config = ini.parse(fs.readFileSync(CONFIG_PATH, "utf-8"));

function getConfigValue(section, key, defaultValue = null) {
    if (config[section] && config[section][key]) {
        console.log(`🔹 Loaded [${section}] -> ${key}: ${config[section][key]}`);
        return config[section][key];
    }
    console.warn(`⚠️ Warning: Missing key [${section}] -> ${key}. Using default: ${defaultValue}`);
    return defaultValue;
}

// Read values from config.ini
const JIRA_BASE_URL = getConfigValue("DEFAULT", "url");
const API_TOKEN = getConfigValue("DEFAULT", "token", "default_token");
const USER_EMAIL = getConfigValue("DEFAULT", "email", "default@example.com");

// API Endpoint to list all projects
const url = `${JIRA_BASE_URL}/rest/api/3/project`;
console.log(`📡 Fetching project list from: ${url}`);

// Basic Auth Header
const auth = Buffer.from(`${USER_EMAIL}:${API_TOKEN}`).toString("base64");

const headers = {
    Accept: "application/json",
    Authorization: `Basic ${auth}`,
};

// Make the request
axios
    .get(url, { headers })
    .then((response) => {
        console.log("✅ Available Projects:");
        response.data.forEach((proj) => {
            console.log(`🔹 ${proj.key} - ${proj.name}`);
        });
    })
    .catch((error) => {
        if (error.response) {
            console.error(`❌ Failed to fetch project list: ${error.response.status}`);
            console.error("Details:", JSON.stringify(error.response.data, null, 2));
        } else if (error.request) {
            console.error("❌ No response received from Jira. Please check your network or Jira URL.");
        } else {
            console.error("❌ Error:", error.message);
        }
    });
