// MODULE 3: model layer for the customer-facing site.
// Every page reads its content from a JSON file in /data.
// A later module swaps these reads for Mongoose models and the RESTful API.
const fs = require('fs').promises;
const path = require('path');

const dataDir = path.join(__dirname, '..', '..', 'data');

// Reads fresh on each call so edits to a JSON file show up without a restart.
const read = async (name) => {
  const raw = await fs.readFile(path.join(dataDir, `${name}.json`), 'utf8');
  return JSON.parse(raw);
};

module.exports = { read };
