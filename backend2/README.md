# VeeLion Assessment — Backend

Express.js APIs for tasks, activity logs, and task summary reports. Data is stored in local JSON files under `data/`.

## Installation and run

```bash
npm install
npm start
```

The server listens on `http://localhost:4000` by default. Override the port with the `PORT` environment variable.

## Endpoints

### Tasks — `/tasks`

| Method | Path | Description | Success response |
|---|---|---|---|
| GET | `/tasks` | List tasks | `200 { "data": [...] }` |
| GET | `/tasks/:id` | Get one task | `200 { "data": {...} }` |
| POST | `/tasks` | Create a task | `201 { "data": {...} }` |
| PATCH | `/tasks/:id` | Update `title` and/or `completed` | `200 { "data": {...} }` |
| DELETE | `/tasks/:id` | Delete a task | `204 No Content` |

Create task example:

```json
{ "title": "Review API", "completed": false }
```

Update example:

```json
{ "completed": true }
```

Only `title` and `completed` are accepted in task request bodies. `id`, `createdAt`, and `updatedAt` are managed by the server.

### Activity log — `/activity`

| Method | Path | Description | Success response |
|---|---|---|---|
| GET | `/activity` | List activities, newest first | `200 [...]` |
| POST | `/activity` | Add an activity | `201 {...}` |

Activity creation example:

```json
{ "action": "manual_update", "info": "Updated task title" }
```

Task creation, update, and deletion also generate activity entries automatically.

### Reports — `/reports`

- `GET /reports` — existing summary endpoint.
- `GET /reports/tasks-summary` — explicit task summary endpoint.

Example response:

```json
{
  "total": 3,
  "byStatus": {
    "todo": 2,
    "in-progress": 0,
    "done": 1
  },
  "recentActivityCount": 3
}
```

`recentActivityCount` counts activities from the last seven days. Since the current task model uses a boolean `completed` field, it cannot identify in-progress tasks; that count remains zero until the model is extended.

## Error responses

Errors use a consistent shape:

```json
{ "error": { "message": "Task not found." } }
```

Validation errors use HTTP 400, missing tasks/routes use HTTP 404, and unexpected server errors return HTTP 500.
