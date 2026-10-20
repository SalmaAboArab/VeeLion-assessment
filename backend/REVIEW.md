
# Code Review — VeeLion Backend Assessment

## 1. Performance

- **Synchronous file I/O in Activity Log:** Using `readFileSync` and `writeFileSync` blocks the event loop while processing requests.
- **Repeated JSON file access logic:** JSON reading and writing logic is duplicated across the codebase.
- **Unnecessary debug logging:** Reports controller and service contain console logs that clutter server output.

## 2. Maintainability

- **Unused task validator:** A task validation module exists but is not consistently used by the controllers.
- **Inconsistent naming:** Activity controller functions use inconsistent or unclear naming conventions.
- **Scattered data file paths:** Data paths rely on repeated definitions and `process.cwd()`, making file resolution dependent on the working directory.
- **Incomplete API documentation:** The README does not fully document the available endpoints and their expected request and response formats.

## 3. API Behavior and Error Handling

- **Inconsistent validation errors:** Invalid request bodies and unsupported fields are not handled consistently.
- **Missing resource handling:** Requests involving unknown task IDs need consistent `404 Not Found` responses.
- **Unclear reports endpoint naming:** The reports endpoint does not clearly communicate the type of report returned.
- **Incomplete activity logging:** Task creation, updates, and deletion are not consistently reflected in the activity log.
- **Activity ordering:** Activity entries need a consistent ordering, with the newest entries appearing first.
- **Malformed JSON handling:** Invalid JSON request bodies need to produce an appropriate `400 Bad Request` response instead of an internal server error.

## 4. Code Quality and Data Integrity

- **Unrestricted task updates:** The update logic accepts arbitrary properties, potentially allowing protected fields such as `id` and `createdAt` to be overwritten.
- **Mutation of incoming payloads:** Task creation modifies the incoming request object instead of creating a normalized task object.
- **Invalid JSON store shape:** The JSON storage utility may silently treat an unexpected data structure as an empty array, masking data integrity problems.
- **Unsafe file writes:** Writing directly to JSON files without an atomic replacement strategy risks leaving incomplete data if a write is interrupted.
- **Missing directory handling:** JSON storage operations may fail when the required parent directory does not exist.
- **Incorrect port fallback expression:** The expression `process.env.PORT || 4000 || 3000` never falls back to port `3000`.
- **Incomplete update validation:** Update requests need explicit validation of allowed fields and their expected types.

## 5. Reports and Data Model

- **Limited task status model:** The task model uses a boolean `completed` field and cannot distinguish between `todo`, `in-progress`, and `done`.
- **Inaccurate in-progress count:** The reports service cannot calculate the actual number of in-progress tasks without an explicit status field.
- **Unclear recent activity definition:** The criteria for counting recent activity need to be consistently defined.