- Determine the color based on the task's completion status
- create shared component for the card and use it in both links

# Activity Module – Code Review

### 1. Code Quality & Cleanup
- Duplicate functions (`formatTimeA` and `formatTimeB`) performing the same operation.
- Duplicate filtering logic in `applyFilterA` and `applyFilterB`.
- Unnecessary state variables (`shownActivity`, `forcedList`, and `tick`) that can be eliminated by deriving filtered results directly from the original data and search query.
- An unnecessary API request to `/api/reports` inside the Activity Module, as the response is not used by the UI.
- Unnecessary console logging instead of proper error handling.

### 2. Performance & State Management
- An unnecessary `setInterval` updating `tick` every 1.4 seconds, causing repeated re-renders without any meaningful UI benefit.
- Repeatedly creating new activity list arrays and objects without actual data changes.
- Redundant filtering operations on the same activity data.
- Unnecessary complexity in the statistics calculation due to its dependency on the artificial `tick` state.

### 3. API & Error Handling
- Missing `response.ok` validation before processing API responses.
- No loading state while fetching activity data.
- API failures are silently handled by setting activity lists to empty arrays, without informing the user.
- No retry mechanism when fetching activity data fails.
- No request cancellation when the component unmounts.

### 4. UI & User Experience
- The page layout is basic and needs improved visual hierarchy, spacing, and consistency.
- The activity timestamp is displayed twice with identical values.
- Missing dedicated empty states for when no activities exist or when no search results match.
- The search field could provide a better user experience with a clear-search action.
- Activity items lack sufficient visual distinction between the action title, description, and timestamp.

### 5. Suggested Improvements
- Remove redundant state variables, effects, and duplicate logic.
- Simplify filtering and derive visible activities from the original list and search query.
- Add appropriate loading, error, and empty states.
- Improve API response validation and error handling, including a retry option.
- Use `AbortController` to cancel pending requests when the component unmounts.
- Improve the Activity Feed layout, readability, and responsive design.

**Recommended priority:** Start by removing redundant logic and unnecessary state updates, then improve API handling and loading/error states, followed by UI enhancements.