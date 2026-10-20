const { readJsonArray } = require('../../../utils/jsonStore');
const { TASKS_FILE_PATH, ACTIVITY_FILE_PATH } = require('../../../utils/dataPaths');

const RECENT_ACTIVITY_WINDOW_MS = 7 * 24 * 60 * 60 * 1000;

async function getTasksSummary() {
  const [tasks, activities] = await Promise.all([
    readJsonArray(TASKS_FILE_PATH),
    readJsonArray(ACTIVITY_FILE_PATH),
  ]);

  const now = Date.now();
  const recentActivityCount = activities.filter((activity) => {
    const timestamp = Date.parse(activity.when);
    return Number.isFinite(timestamp) && timestamp <= now && now - timestamp <= RECENT_ACTIVITY_WINDOW_MS;
  }).length;

  return {
    total: tasks.length,
    byStatus: {
      todo: tasks.filter((task) => task.completed === false).length,
      // The current task schema only supports completed/not completed.
      // Keep this field for existing dashboard compatibility until a status field is introduced.
      'in-progress': 0,
      done: tasks.filter((task) => task.completed === true).length,
    },
    recentActivityCount,
  };
}

module.exports = { getTasksSummary };
