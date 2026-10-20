const { createId } = require('../../../utils/id');
const { readJsonArray, writeJsonArray } = require('../../../utils/jsonStore');
const { TASKS_FILE_PATH } = require('../../../utils/dataPaths');
const HttpError = require('../../../utils/httpError');
const activityService = require('../../activity/services/activity.service');

function buildTaskRecord(payload) {
  const now = new Date().toISOString();
  return {
    id: createId(),
    title: payload.title,
    completed: payload.completed ?? false,
    createdAt: now,
    updatedAt: now,
  };
}

async function getAllTasks() {
  return readJsonArray(TASKS_FILE_PATH);
}

async function getTaskById(taskId) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const task = tasks.find((item) => item.id === taskId);
  if (!task) throw new HttpError(404, 'Task not found.');
  return task;
}

async function createTask(payload) {
  // Keep service-level checks in case this service is called outside the HTTP controller.
  if (!payload || typeof payload.title !== 'string' || !payload.title.trim()) {
    throw new HttpError(400, 'A non-empty title is required.');
  }
  if (payload.completed !== undefined && typeof payload.completed !== 'boolean') {
    throw new HttpError(400, '"completed" must be a boolean.');
  }

  const normalizedPayload = { title: payload.title.trim(), completed: payload.completed ?? false };
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const newTask = buildTaskRecord(normalizedPayload);
  tasks.push(newTask);
  await writeJsonArray(TASKS_FILE_PATH, tasks);
  await activityService.createNewActivity({ action: 'task_created', info: `Created task: ${newTask.title}` });
  return newTask;
}

async function updateTask(taskId, updates) {
  const allowedFields = ['title', 'completed'];
  const unknownFields = Object.keys(updates || {}).filter((key) => !allowedFields.includes(key));
  if (unknownFields.length) {
    throw new HttpError(400, 'Body contains unsupported fields.', { unsupportedFields: unknownFields });
  }
  if (!updates || Object.keys(updates).length === 0) {
    throw new HttpError(400, 'Provide at least one updatable field.');
  }
  if (updates.title !== undefined && (typeof updates.title !== 'string' || !updates.title.trim())) {
    throw new HttpError(400, '"title" must be a non-empty string.');
  }
  if (updates.completed !== undefined && typeof updates.completed !== 'boolean') {
    throw new HttpError(400, '"completed" must be a boolean.');
  }

  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);
  if (taskIndex === -1) throw new HttpError(404, 'Task not found.');

  const existingTask = tasks[taskIndex];
  const normalizedUpdates = {};
  if (updates.title !== undefined) normalizedUpdates.title = updates.title.trim();
  if (updates.completed !== undefined) normalizedUpdates.completed = updates.completed;

  const updatedTask = { ...existingTask, ...normalizedUpdates, updatedAt: new Date().toISOString() };
  tasks[taskIndex] = updatedTask;
  await writeJsonArray(TASKS_FILE_PATH, tasks);
  await activityService.createNewActivity({ action: 'task_updated', info: `Updated task: ${updatedTask.title}` });
  return updatedTask;
}

async function deleteTask(taskId) {
  const tasks = await readJsonArray(TASKS_FILE_PATH);
  const taskIndex = tasks.findIndex((item) => item.id === taskId);
  if (taskIndex === -1) throw new HttpError(404, 'Task not found.');

  const [removedTask] = tasks.splice(taskIndex, 1);
  await writeJsonArray(TASKS_FILE_PATH, tasks);
  await activityService.createNewActivity({ action: 'task_deleted', info: `Deleted task: ${removedTask.title}` });
  return removedTask;
}

module.exports = { getAllTasks, getTaskById, createTask, updateTask, deleteTask };
