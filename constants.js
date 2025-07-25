'use strict';

// Constants
const RELEASE_NAME = '1.0.0-RC1';
const RELEASE_DESCRIPTION = 'Exclusive access!';
const MAX_RESPONSE_TIME_MS = 600000;

// Fabric
const GENESIS_HASH = '';
const MAX_MEMORY_SIZE = 32 * 1024 * 1024; // 32 MB
const SNAPSHOT_INTERVAL = 1000 * 60 * 10; // 10 minutes
const {
  BITCOIN_NETWORK,
  BITCOIN_GENESIS_HASH,
  FIXTURE_SEED
} = require('@fabric/core/constants');

// Sensemaker
const AGENT_MAX_TOKENS = 8192 * 16; // 128k tokens
const AGENT_TEMPERATURE = 0;
const BRAND_NAME = 'Sensemaker';
const CORE_MODEL = 'llama3.2';
const EMBEDDING_MODEL = 'mxbai-embed-large';

// Authentication
const BCRYPT_PASSWORD_ROUNDS = 10;

// Features
const ALLOWED_UPLOAD_TYPES = [
  'image/png',
  'image/jpeg',
  'image/tiff',
  'image/bmp',
  'application/pdf',
  'video/mp4',
  'video/avi',
  'video/mov',
  'video/mkv',
  'video/webm',
  'video/wmv',
  'video/flv',
  'video/m4v',
  'video/3gp',
  'video/ogv',
  'audio/mp3',
  'audio/wav',
  'audio/ogg',
  'audio/m4a',
  'audio/flac',
  'audio/aac',
  'audio/wma',
  'audio/opus'
];

// Flags
const IS_CONFIGURED = false; // Set to true after initial admin setup

// Configuration settings that should be saved as GLOBAL (system-wide) settings
const GLOBAL_SETTINGS = [
  'NODE_NAME',
  'NODE_PERSONALITY',
  'AI_TEMPERATURE',
  'USER_GOALS',
  'IS_CONFIGURED'
];

const ENABLE_AGENTS = true;
const ENABLE_ALERTS = true;
const ENABLE_BILLING = true;
const ENABLE_BITCOIN = true;
const ENABLE_CHANGELOG = false; // TODO: enable changelog ("blog")
const ENABLE_CHAT = true;
const ENABLE_CONTENT_TOPBAR = true;
const ENABLE_CONTRACTS = true;
const ENABLE_CONVERSATION_SIDEBAR = false;
const ENABLE_DISCORD_LOGIN = false;
const ENABLE_DOCUMENT_SEARCH = true;
const ENABLE_DOCUMENTS = true;
const ENABLE_FABRIC = true;
const ENABLE_FEEDBACK_BUTTON = false;
const ENABLE_FILES = true;
const ENABLE_GROUPS = false;
const ENABLE_JOBS = false;
const ENABLE_LIBRARY = true;
const ENABLE_LOGIN = true;
const ENABLE_MARKETING = true;
const ENABLE_NETWORK = true;
const ENABLE_PERSON_SEARCH = false;
const ENABLE_REGISTRATION = false;
const ENABLE_SOURCES = false;
const ENABLE_TASKS = true;
const ENABLE_UPLOADS = true;
const ENABLE_WALLET = false;

// UI
const USER_QUERY_TIMEOUT_MS = 15000; // 15 seconds
const USER_MENU_HOVER_TIME_MS = 1000;
const USER_HINT_TIME_MS = 3000;
const SYNC_EMBEDDINGS_COUNT = 100;
const INTEGRITY_CHECK = false;

// Browser
const BROWSER_DATABASE_NAME = 'sensemaker';
const BROWSER_DATABASE_TOKEN_TABLE = 'tokens';

// Records
const PER_PAGE_LIMIT = 100;
const PER_PAGE_DEFAULT = 30;

// ChatGPT
const CHATGPT_MAX_TOKENS = AGENT_MAX_TOKENS;
const OPENAI_API_KEY = 'replace with a valid OpenAI key';

// Exports
module.exports = {
  GENESIS_HASH, // TODO: use a real genesis hash
  RELEASE_NAME, // TODO: use a real release name
  RELEASE_DESCRIPTION, // TODO: use a real release description
  SNAPSHOT_INTERVAL, // 10 minutes for snapshot interval
  MAX_RESPONSE_TIME_MS, // 60 seconds for maximum response time
  BITCOIN_NETWORK,
  BITCOIN_GENESIS_HASH,
  FIXTURE_SEED,
  AGENT_MAX_TOKENS,
  MAX_MEMORY_SIZE,
  INTEGRITY_CHECK,
  IS_CONFIGURED,
  ALLOWED_UPLOAD_TYPES,
  BCRYPT_PASSWORD_ROUNDS,
  CORE_MODEL,
  EMBEDDING_MODEL,
  ENABLE_AGENTS,
  ENABLE_ALERTS,
  ENABLE_BITCOIN,
  ENABLE_CONTENT_TOPBAR,
  ENABLE_CONTRACTS,
  ENABLE_CHANGELOG,
  ENABLE_CONVERSATION_SIDEBAR,
  ENABLE_DISCORD_LOGIN,
  ENABLE_DOCUMENTS,
  ENABLE_FABRIC,
  ENABLE_FEEDBACK_BUTTON,
  ENABLE_GROUPS,
  ENABLE_JOBS,
  ENABLE_BILLING,
  ENABLE_LOGIN,
  ENABLE_REGISTRATION,
  ENABLE_CHAT,
  ENABLE_FILES,
  ENABLE_DOCUMENT_SEARCH,
  ENABLE_PERSON_SEARCH,
  ENABLE_UPLOADS,
  ENABLE_LIBRARY,
  ENABLE_MARKETING,
  ENABLE_NETWORK,
  ENABLE_SOURCES,
  ENABLE_TASKS,
  ENABLE_WALLET,
  PER_PAGE_LIMIT,
  PER_PAGE_DEFAULT,
  BROWSER_DATABASE_NAME,
  BROWSER_DATABASE_TOKEN_TABLE,
  BRAND_NAME,
  CHATGPT_MAX_TOKENS,
  OPENAI_API_KEY,
  AGENT_TEMPERATURE,
  USER_QUERY_TIMEOUT_MS,
  USER_HINT_TIME_MS,
  USER_MENU_HOVER_TIME_MS,
  SYNC_EMBEDDINGS_COUNT,
  GLOBAL_SETTINGS
};
