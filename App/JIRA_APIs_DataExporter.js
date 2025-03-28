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
const PROJECT_ID = getConfigValue("DEFAULT", "ProjectID", "1");

// API Endpoint
const url = `${JIRA_BASE_URL}/rest/api/3/project/${PROJECT_ID}`;
console.log(url);

// Headers
const headers = {
    Accept: "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
};

// Make the request
axios
    .get(url, { headers })
    .then((response) => {
        console.log(response.data);
    })
    .catch((error) => {
        console.error(`Failed to fetch project data: ${error.response?.status} - ${error.response?.data}`);
    });
