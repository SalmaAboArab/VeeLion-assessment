- Determine the color based on the task's completion status
- create shared component for the card and use it in both links

# Frontend Code Review

## 1. Activity Module

### Code Quality
- Duplicate time-formatting and filtering functions.
- Redundant state variables and unused API requests.
- Unnecessary console logging.

### Performance & State Management
- Unnecessary interval causing repeated re-renders.
- Redundant array creation and filtering operations.
- Statistics calculation unnecessarily depends on `tick` state.

### API & Error Handling
- Missing HTTP response validation.
- Missing loading and error states.
- No retry mechanism or request cancellation.

### UI & UX
- Basic layout with inconsistent visual hierarchy and spacing.
- Duplicate activity timestamps.
- Missing empty states for activity lists and search results.
- Limited visual distinction between activity titles, descriptions, and timestamps.

---

## 2. Task Module

### Code Quality & Maintainability
- Repeated inline styles across components.
- `TaskDashboard` handles multiple UI states directly.
- Outdated comments in `TaskItem`.
- `handleToggle` does not handle the returned result of `updateTaskStatus`.

### State Management & Performance
- Potential duplicated logic in `useTasks`.
- Task status and `updatedAt` synchronization needs verification.
- Potential loading-state conflicts during concurrent updates.
- List rendering performance under larger datasets needs verification.

### API & Error Handling
- API response validation and HTTP error handling need verification.
- Loading and error states during retries need verification.
- Failed status updates may leave the UI inconsistent.
- Repeated status updates may cause inconsistent task data.

### UI & UX
- Basic styling with inconsistent spacing and typography.
- Incorrect empty-state message when no tasks exist.
- Task status color consistency and readability issues.
- Missing clear feedback for successful or failed updates.
- Loading and disabled button states lack clear feedback.
- Timestamp formatting and invalid date handling need verification.

---

## 3. Home Page

### Code Quality & Maintainability
- Repeated inline styles and duplicated navigation card markup.
- Module titles, descriptions, and routes are hardcoded in JSX.

### UI & UX
- Basic layout with limited visual hierarchy.
- Insufficient descriptions for navigation cards.
- Inconsistent card spacing and interaction states.
- Missing visible keyboard-focus styles.
- Responsive behavior across desktop, tablet, and mobile needs improvement.
- Page description mentions two modules, while the page contains three navigation links.