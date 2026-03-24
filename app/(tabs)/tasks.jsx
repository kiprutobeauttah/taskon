import { AddTaskModal } from '@/components/add-task-modal';
import { TaskItem } from '@/components/task-item';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { addTask as addTaskDB, deleteTask as deleteTaskDB, getTasks, initDatabase, updateTask } from '@/utils/database.js';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { SectionList, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

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
    } finally {
      setLoading(false);
    }
  };

  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const addTask = async (title, description, category, priority, alarmTime) => {
    try {
      const newTask = {
        id: Date.now().toString(),
        title,
        description,
        completed: false,
        createdAt: new Date(),
        priority: priority || 'medium',
        category,
        alarmTime,
      };
      
      if (alarmTime) {
        const notificationId = await scheduleTaskNotification(newTask, alarmTime);
        newTask.notificationId = notificationId;
      }
      
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
      const task = tasks.find(t => t.id === id);
      if (task?.notificationId) {
        await cancelTaskNotification(task.notificationId);
      }
      await deleteTaskDB(id);
      setTasks(tasks.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const todayTasks = activeTasks.filter(t => t.category === 'Today');
  const tomorrowTasks = activeTasks.filter(t => t.category === 'Tomorrow');
  const otherTasks = activeTasks.filter(t => t.category !== 'Today' && t.category !== 'Tomorrow');

  const sections = [
    { title: 'Today', data: todayTasks },
    { title: 'Tomorrow', data: tomorrowTasks },
    ...(otherTasks.length > 0 ? [{ title: 'Other', data: otherTasks }] : []),
    ...(completedTasks.length > 0 ? [{ title: 'Completed', data: completedTasks }] : []),
  ].filter(section => section.data.length > 0);

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <View>
          <ThemedText type="title" style={styles.headerTitle}>All Tasks</ThemedText>
          <ThemedText style={[styles.stats, { color: textSecondary }]}>
            {activeTasks.length} active · {completedTasks.length} completed
          </ThemedText>
        </View>
      </View>

      <SectionList
        sections={sections}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TaskItem
            task={item}
            onToggle={toggleTask}
            onDelete={deleteTask}
          />
        )}
        renderSectionHeader={({ section: { title, data } }) => (
          <View style={[
            styles.sectionHeader,
            title === 'Completed' && styles.completedSectionHeader
          ]}>
            <View style={styles.sectionTitleRow}>
              <ThemedText style={styles.sectionTitle}>{title}</ThemedText>
              {title === 'Completed' && (
                <Ionicons name="checkmark-circle" size={20} color={tintColor} style={styles.completedIcon} />
              )}
            </View>
            <ThemedText style={[styles.sectionCount, { color: tintColor }]}>
              {data.length} {data.length === 1 ? 'Task' : 'Tasks'}
            </ThemedText>
          </View>
        )}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="checkmark-done-outline" size={64} color="#ccc" />
            <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
              No tasks yet. Tap + to add one!
            </ThemedText>
          </View>
        }
      />

      <TouchableOpacity
        style={[styles.fab, { backgroundColor: tintColor }]}
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
    paddingTop: 60,
    gap: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  stats: {
    fontSize: 15,
    marginTop: 4,
  },
  list: {
    padding: 20,
    paddingTop: 8,
    paddingBottom: 100,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingTop: 20,
  },
  completedSectionHeader: {
    paddingTop: 32,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    marginTop: 12,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  completedIcon: {
    marginLeft: 4,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
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
