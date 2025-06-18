#!/usr/bin/env node
require('dotenv').config();
const fs = require('fs/promises');
const path = require('path');
const { fetchAITools } = require('../dataLayer');

async function sync() {
  try {
    const tools = await fetchAITools();
    const filePath = path.join(__dirname, '..', 'public', 'aiTools.json');
    await fs.writeFile(filePath, JSON.stringify(tools, null, 2));
    console.log(`Synced ${tools.length} tools to aiTools.json`);
  } catch (err) {
    console.error('Failed to sync tools:', err);
    process.exit(1);
  }
}

sync();
