const fs = require('node:fs/promises');
const path = require('node:path');

async function readJsonArray(filePath) {
  let raw;

  try {
    raw = await fs.readFile(filePath, 'utf8');
  } catch (error) {
    if (error.code !== 'ENOENT') throw error;

    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await writeJsonArray(filePath, []);
    return [];
  }

  // Treat an empty file as an empty store, but don't silently hide invalid JSON.
  if (!raw.trim()) return [];

  const parsed = JSON.parse(raw);
  if (!Array.isArray(parsed)) {
    throw new TypeError(`Expected a JSON array in ${path.basename(filePath)}.`);
  }

  return parsed;
}

async function writeJsonArray(filePath, data) {
  if (!Array.isArray(data)) {
    throw new TypeError('Data store value must be an array.');
  }

  await fs.mkdir(path.dirname(filePath), { recursive: true });
  const temporaryPath = `${filePath}.${process.pid}.${Date.now()}.tmp`;
  await fs.writeFile(temporaryPath, `${JSON.stringify(data, null, 2)}\n`, 'utf8');
  await fs.rename(temporaryPath, filePath);
}

module.exports = { readJsonArray, writeJsonArray };
