#-------------------------------------------------------------------------------
# Name:        module1
# Purpose:
#
# Author:      91973
#
# Created:     22-03-2025
# Copyright:   (c) 91973 2025
# Licence:     <your licence>
#-------------------------------------------------------------------------------

import requests
from requests.auth import HTTPBasicAuth
import configparser

# Determine Base Directory (Handles PyInstaller Paths)
def get_base_path():
    """Determine base directory whether running as script or .exe."""
    if getattr(sys, 'frozen', False):  # Running as .exe
        base_path = os.path.dirname(sys.executable)
    else:  # Running as script
        base_path = os.path.abspath(os.path.dirname(__file__))

    return os.path.dirname(base_path)

BASE_DIR = get_base_path()

# Paths to Config and JSON Files
CONFIG_PATH = os.path.join(BASE_DIR, "Config", "configFile.ini")
EXCEL_PATH = None  # To be set dynamically

RUNTIME_SCREEN_DIR = os.path.join(BASE_DIR, "RunTime")
os.makedirs(RUNTIME_SCREEN_DIR, exist_ok=True)

# Load Config File with Debugging
config = configparser.ConfigParser()
if not os.path.exists(CONFIG_PATH):
    raise FileNotFoundError(f"❌ Config file missing: {CONFIG_PATH}")

config.read(CONFIG_PATH, encoding="utf-8")

# Read values from config.ini
JIRA_BASE_URL = get_config_value("DEFAULT", "url")
USERNAME = get_config_value("DEFAULT", "username", "default_user")
API_TOKEN = get_config_value("DEFAULT", "password", "default_pass")
PROJECT_ID = get_config_value("DEFAULT", "test_records_to_create", "1")

# API Endpoint
url = f"{JIRA_BASE_URL}/rest/api/3/project/{PROJECT_ID}"

# Headers
headers = {
    "Accept": "application/json"
}

# Make the request
response = requests.get(url, headers=headers, auth=HTTPBasicAuth(USERNAME, API_TOKEN))

# Check response
if response.status_code == 200:
    project_data = response.json()
    print(project_data)
else:
    print(f"Failed to fetch project data: {response.status_code} - {response.text}")


