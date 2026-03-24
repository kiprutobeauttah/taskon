import { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, View } from 'react-native';
import { useLocalSearchParams, Stack } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { TaskItem } from '@/components/task-item';
import { AddTaskModal } from '@/components/add-task-modal';
import { useThemeColor } from '@/hooks/use-theme-color';
import { initDatabase, getTasks, addTask as addTaskDB, updateTask, deleteTask as deleteTaskDB } from '@/utils/database.js';

export default function CategoryScreen() {
  const { name } = useLocalSearchParams();
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    loadTasks();
  }, []);

  const loadTasks = async () => {
    try {
      await initDatabase();
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const addTask = async (title, description, category, priority) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        createdAt: new Date(),
        priority: priority || 'medium',
        category: category || name,
      };
      await addTaskDB(newTask);
      setTasks([newTask, ...tasks]);
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const toggleTask = async (id) => {
    try {
      const task = tasks.find(t => t.id === id);
      if (task) {
        await updateTask(id, { completed: !task.completed });
        setTasks(tasks.map(t =>
          t.id === id ? { ...t, completed: !t.completed } : t
        ));
      }
    } catch (error) {
      console.error('Error toggling task:', error);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteTaskDB(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const filteredTasks = name === 'My Lists' 
    ? tasks 
    : tasks.filter(t => t.category === name);

  const activeTasks = filteredTasks.filter(t => !t.completed);
  const completedTasks = filteredTasks.filter(t => t.completed);

  const getCategoryColor = () => {
    const colors = {
      'Work': '#EF4444',
      'Personal': '#3B82F6',
      'Today': '#00D084',
      'Tomorrow': '#F59E0B',
      'My Lists': '#00D084',
    };
    return colors[name] || '#00D084';
  };

  return (
    <ThemedView style={styles.container}>
      <Stack.Screen 
        options={{
          title: name,
          headerStyle: { backgroundColor: getCategoryColor() },
          headerTintColor: '#fff',
          headerTitleStyle: { fontWeight: 'bold' },
        }} 
      />

      <View style={[styles.header, { backgroundColor: getCategoryColor() }]}>
        <ThemedText style={styles.headerTitle}>{name}</ThemedText>
        <ThemedText style={styles.stats}>
          {activeTasks.length} active · {completedTasks.length} completed
        </ThemedText>
      </View>

      <FlatList
        data={filteredTasks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="folder-open-outline" size={64} color="#ccc" />
            <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
              No tasks in {name}
            </ThemedText>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: getCategoryColor() }]}
        onPress={() => setModalVisible(true)}
        accessibilityLabel="Add new task"
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      <AddTaskModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onAdd={addTask}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 24,
    paddingTop: 16,
    paddingBottom: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
  },
  stats: {
    fontSize: 14,
    color: '#fff',
    opacity: 0.9,
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingBottom: 100,
  },
  empty: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    gap: 16,
  },
  emptyText: {
    fontSize: 16,
    textAlign: 'center',
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
});
