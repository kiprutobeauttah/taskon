import AsyncStorage from '@react-native-async-storage/async-storage';
import { Task } from '@/types/task';

const TASKS_KEY = '@tasks';

export const storage = {
  async getTasks(): Promise<Task[]> {
    try {
      const tasksJson = await AsyncStorage.getItem(TASKS_KEY);
      if (tasksJson) {
        const tasks = JSON.parse(tasksJson);
        // Convert date strings back to Date objects
        return tasks.map((task: any) => ({
          ...task,
          createdAt: new Date(task.createdAt),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading tasks:', error);
      return [];
    }
  },

  async saveTasks(tasks: Task[]): Promise<void> {
    try {
      await AsyncStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  },

  async clearTasks(): Promise<void> {
    try {
      await AsyncStorage.removeItem(TASKS_KEY);
    } catch (error) {
      console.error('Error clearing tasks:', error);
    }
  },
};
