const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');
const { ACTIVITY_FILE_PATH } = require('../../../utils/dataPaths');
const HttpError = require('../../../utils/httpError');

async function getAllActivity() {
  const activities = await readJsonArray(ACTIVITY_FILE_PATH);
  return activities.sort((a, b) => new Date(b.when) - new Date(a.when));
}

async function createNewActivity(payload) {
  if (!payload || typeof payload !== 'object' || Array.isArray(payload)) {
    throw new HttpError(400, 'Body must be a JSON object.');
  }

  const action = typeof payload.action === 'string' ? payload.action.trim() : '';
  const info = typeof payload.info === 'string' ? payload.info.trim() : '';

  if (!action) throw new HttpError(400, '"action" is required and must be a non-empty string.');
  if (!info) throw new HttpError(400, '"info" is required and must be a non-empty string.');

  const activities = await readJsonArray(ACTIVITY_FILE_PATH);
  const activity = {
    id: createId(),
    action,
    info,
    when: new Date().toISOString(),
  };

  activities.push(activity);
  await writeJsonArray(ACTIVITY_FILE_PATH, activities);
  return activity;
}

module.exports = { getAllActivity, createNewActivity };
