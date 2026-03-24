import * as SQLite from 'expo-sqlite';

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync('tasks.db');
    
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        completed INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        dueDate TEXT,
        priority TEXT DEFAULT 'medium',
        category TEXT,
        tags TEXT,
        alarmTime TEXT,
        notificationId TEXT
      );
    `);
    
    console.log('Database initialized successfully');
    return db;
  } catch (error) {
    console.error('Error initializing database:', error);
    throw error;
  }
};

export const getTasks = async () => {
  try {
    if (!db) await initDatabase();
    
    const result = await db.getAllAsync('SELECT * FROM tasks ORDER BY createdAt DESC');
    
    return result.map(task => ({
      ...task,
      completed: task.completed === 1,
      createdAt: new Date(task.createdAt),
      dueDate: task.dueDate ? new Date(task.dueDate) : undefined,
      alarmTime: task.alarmTime ? new Date(task.alarmTime) : undefined,
      tags: task.tags ? JSON.parse(task.tags) : undefined,
    }));
  } catch (error) {
    console.error('Error getting tasks:', error);
    return [];
  }
};

export const addTask = async (task) => {
  try {
    if (!db) await initDatabase();
    
    await db.runAsync(
      `INSERT INTO tasks (id, title, description, completed, createdAt, dueDate, priority, category, tags, alarmTime, notificationId)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        task.id,
        task.title,
        task.description || null,
        task.completed ? 1 : 0,
        task.createdAt.toISOString(),
        task.dueDate ? task.dueDate.toISOString() : null,
        task.priority || 'medium',
        task.category || null,
        task.tags ? JSON.stringify(task.tags) : null,
        task.alarmTime ? task.alarmTime.toISOString() : null,
        task.notificationId || null,
      ]
    );
    
    return task;
  } catch (error) {
    console.error('Error adding task:', error);
    throw error;
  }
};

export const updateTask = async (id, updates) => {
  try {
    if (!db) await initDatabase();
    
    const fields = [];
    const values = [];
    
    if (updates.title !== undefined) {
      fields.push('title = ?');
      values.push(updates.title);
    }
    if (updates.description !== undefined) {
      fields.push('description = ?');
      values.push(updates.description);
    }
    if (updates.completed !== undefined) {
      fields.push('completed = ?');
      values.push(updates.completed ? 1 : 0);
    }
    if (updates.priority !== undefined) {
      fields.push('priority = ?');
      values.push(updates.priority);
    }
    if (updates.category !== undefined) {
      fields.push('category = ?');
      values.push(updates.category);
    }
    if (updates.dueDate !== undefined) {
      fields.push('dueDate = ?');
      values.push(updates.dueDate ? updates.dueDate.toISOString() : null);
    }
    if (updates.tags !== undefined) {
      fields.push('tags = ?');
      values.push(updates.tags ? JSON.stringify(updates.tags) : null);
    }
    if (updates.alarmTime !== undefined) {
      fields.push('alarmTime = ?');
      values.push(updates.alarmTime ? updates.alarmTime.toISOString() : null);
    }
    if (updates.notificationId !== undefined) {
      fields.push('notificationId = ?');
      values.push(updates.notificationId);
    }
    
    if (fields.length === 0) return;
    
    values.push(id);
    
    await db.runAsync(
      `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
  } catch (error) {
    console.error('Error updating task:', error);
    throw error;
  }
};

export const deleteTask = async (id) => {
  try {
    if (!db) await initDatabase();
    
    await db.runAsync('DELETE FROM tasks WHERE id = ?', [id]);
  } catch (error) {
    console.error('Error deleting task:', error);
    throw error;
  }
};

export const clearAllTasks = async () => {
  try {
    if (!db) await initDatabase();
    
    await db.runAsync('DELETE FROM tasks');
  } catch (error) {
    console.error('Error clearing tasks:', error);
    throw error;
  }
};
