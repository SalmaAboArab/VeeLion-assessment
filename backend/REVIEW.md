# Code Review — VeeLion Backend Assessment

## Performance

- **Synchronous file I/O in Activity Log:** `readFileSync`/`writeFileSync` blocked the event loop during requests. Replaced with the shared asynchronous JSON store.
- **Repeated JSON file access patterns:** centralized JSON reads/writes in `src/utils/jsonStore.js` to avoid duplicate implementations.
- **Unnecessary debug output:** removed request-summary `console.log` statements from the Reports controller/service.

## Maintainability

- **Duplicate task validation:** the task validator existed but was not used by the controller. Create and update controllers now use `validateCreateTask` and `validateUpdateTask`.
- **Inconsistent naming:** Activity controller functions now use descriptive camelCase names.
- **Repeated data paths / dependence on process.cwd():** moved data file paths into `src/utils/dataPaths.js`, resolved relative to the project files.
- **Incomplete endpoint documentation:** README now documents routes and representative payloads.

## UX / API behavior

- **Unclear validation errors:** invalid request bodies now return consistent 400 responses, including unsupported fields.
- **Missing resource handling:** unknown task IDs return 404 through the shared error handler.
- **Reports endpoint naming:** retained `GET /reports` for compatibility and added `GET /reports/tasks-summary` as an explicit summary endpoint.
- **Activity visibility:** task creation, updates, and deletion now add activity log entries. Activity results are returned newest first.

## Code quality

- **Task update accepted arbitrary properties:** updates are restricted to `title` and `completed`; callers cannot overwrite `id`, `createdAt`, or other server-managed fields.
- **Service mutated incoming payload:** task creation now uses a normalized object instead of mutating the request payload.
- **Invalid JSON store shape was silently accepted:** the JSON store now reports a malformed store shape rather than silently returning an empty array.
- **Unsafe/non-atomic file writes:** JSON writes now use a temporary file followed by rename, and create parent directories when necessary.
- **Port fallback expression was unreachable:** changed `process.env.PORT || 4000 || 3000` to `Number(process.env.PORT) || 4000`.
- **Malformed JSON requests:** the shared error handler responds with HTTP 400 rather than treating invalid JSON as an internal server error.

## React best practices

This repository is the Express backend; React components are not present here, so React-specific best practices cannot be assessed from this folder. The frontend should consume the documented response shapes and handle loading, empty, and error states.

## Known limitation / follow-up

The task model currently contains a boolean `completed` field, not a three-state status. Therefore `todo` and `done` can be calculated accurately, but `in-progress` remains `0` until the data model and API contract explicitly support that state. `recentActivityCount` is defined as activity created in the last seven days.

## Suggested manual verification

1. `GET /tasks` — returns `{ "data": [...] }`.
2. `POST /tasks` with `{ "title": "Review API" }` — returns 201 and creates an activity entry.
3. `PATCH /tasks/:id` with `{ "completed": true }` — returns the updated task and creates an activity entry.
4. `PATCH /tasks/:id` with `{ "id": "changed" }` — returns 400.
5. `DELETE /tasks/:id` — returns 204 and creates an activity entry.
6. `GET /activity` — returns activity entries newest first.
7. `GET /reports/tasks-summary` — returns task counts and activity count for the last seven days.
