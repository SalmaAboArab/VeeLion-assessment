const path = require('node:path');

// Resolve data files relative to the project, not the shell's current directory.
const DATA_DIR = path.resolve(__dirname, '../../data');

module.exports = {
  DATA_DIR,
  TASKS_FILE_PATH: path.join(DATA_DIR, 'tasks.json'),
  ACTIVITY_FILE_PATH: path.join(DATA_DIR, 'activity.json'),
};
