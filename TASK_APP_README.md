# Task Management App

A clean and simple task management app built with React Native and Expo.

## Features

✅ **Add Tasks** - Create tasks with title and optional description
✅ **Complete Tasks** - Mark tasks as complete/incomplete with a tap
✅ **Delete Tasks** - Remove tasks you no longer need
✅ **Filter Tasks** - View all, active, or completed tasks
✅ **Task Stats** - See your active and completed task counts
✅ **Dark Mode** - Automatic theme support

## How to Use

1. **Start the app:**
   ```bash
   npm start
   ```

2. **Add a task:**
   - Tap the floating "+" button at the bottom right
   - Enter a task title (required)
   - Optionally add a description
   - Tap "Add Task"

3. **Complete a task:**
   - Tap the circle icon next to any task to mark it complete
   - Tap again to mark it incomplete

4. **Delete a task:**
   - Tap the trash icon on the right side of any task

5. **Filter tasks:**
   - Use the filter buttons at the top to view:
     - All tasks
     - Active tasks only
     - Completed tasks only

## Project Structure

```
taskon/
├── app/(tabs)/
│   └── index.tsx          # Main task list screen
├── components/
│   ├── task-item.tsx      # Individual task component
│   └── add-task-modal.tsx # Modal for adding new tasks
└── types/
    └── task.ts            # Task type definition
```

## Next Steps

Consider adding:
- Persistent storage with AsyncStorage
- Task categories or tags
- Due dates and reminders
- Task priority levels
- Search functionality
- Task editing
