import { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, View, ImageBackground } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { initDatabase, getTasks, updateTask, deleteTask as deleteTaskDB } from '@/utils/database.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';
import { useRouter } from 'expo-router';

export default function HomeScreen() {
  const [tasks, setTasks] = useState([]);
  const router = useRouter();

  useFocusEffect(
    useCallback(() => {
      loadTasks();
    }, [])
  );

  const loadTasks = async () => {
    try {
      await initDatabase();
      const loadedTasks = await getTasks();
      setTasks(loadedTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
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

  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardBg = useThemeColor({}, 'card');

  const workTasks = tasks.filter(t => t.category === 'Work');
  const personalTasks = tasks.filter(t => t.category === 'Personal');
  const todayTasks = tasks.filter(t => t.category === 'Today');
  const tomorrowTasks = tasks.filter(t => t.category === 'Tomorrow');
  
  const activeTasks = tasks.filter(t => !t.completed);
  const completedTasks = tasks.filter(t => t.completed);

  const categories = [
    { id: '1', name: 'My Lists', icon: 'list-outline', count: tasks.length, color: '#00D084', bgColor: '#D4F4E7' },
    { id: '2', name: 'Work', icon: 'briefcase-outline', count: workTasks.length, color: '#EF4444', bgColor: '#FEE2E2' },
    { id: '3', name: 'Personal', icon: 'person-outline', count: personalTasks.length, color: '#3B82F6', bgColor: '#DBEAFE' },
    { id: '4', name: 'Add List', icon: 'add', count: null, color: '#8B5CF6', bgColor: '#EDE9FE' },
  ];

  return (
    <ThemedView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <View>
            <ThemedText type="title" style={styles.headerTitle}>Beauttahs</ThemedText>
            <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
              {activeTasks.length} active · {completedTasks.length} completed
            </ThemedText>
          </View>
          <ThemedText style={[styles.date, { color: textSecondary }]}>
            {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
          </ThemedText>
        </View>

        <View style={styles.categoriesGrid}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[styles.categoryCard, { backgroundColor: cardBg }]}
              activeOpacity={0.7}
              onPress={() => {
                if (category.name !== 'Add List') {
                  router.push(`/category/${category.name}`);
                }
              }}
            >
              <View style={[styles.categoryIcon, { backgroundColor: category.bgColor }]}>
                <Ionicons name={category.icon} size={28} color={category.color} />
              </View>
              <ThemedText style={styles.categoryName}>{category.name}</ThemedText>
              {category.count !== null && (
                <ThemedText style={[styles.categoryCount, { color: category.color }]}>
                  {category.count} Tasks
                </ThemedText>
              )}
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Today</ThemedText>
            <ThemedText style={[styles.sectionCount, { color: tintColor }]}>
              {todayTasks.length} Tasks
            </ThemedText>
          </View>
          {todayTasks.length === 0 ? (
            <View style={styles.emptySection}>
              <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
                No tasks for today
              </ThemedText>
            </View>
          ) : (
            todayTasks.map((task) => (
              <View key={task.id} style={[styles.taskRow, { backgroundColor: cardBg }]}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={[
                    styles.checkboxCircle, 
                    { borderColor: task.completed ? tintColor : textSecondary },
                    task.completed && { backgroundColor: tintColor }
                  ]}>
                    {task.completed && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <ThemedText style={[
                    styles.taskTitle,
                    task.completed && styles.completedText
                  ]}>
                    {task.title}
                  </ThemedText>
                  {task.description && (
                    <ThemedText style={[
                      styles.taskSubtitle, 
                      { color: textSecondary },
                      task.completed && styles.completedText
                    ]}>
                      {task.description}
                    </ThemedText>
                  )}
                </View>
                <View style={[styles.categoryBadge, { 
                  backgroundColor: task.category === 'Today' ? '#D4F4E7' : '#FFF5E5' 
                }]}>
                  <ThemedText style={[styles.categoryBadgeText, {
                    color: task.category === 'Today' ? '#059669' : '#D97706'
                  }]}>
                    {task.category}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <ThemedText style={styles.sectionTitle}>Tomorrow</ThemedText>
            <ThemedText style={[styles.sectionCount, { color: tintColor }]}>
              {tomorrowTasks.length} Tasks
            </ThemedText>
          </View>
          {tomorrowTasks.length === 0 ? (
            <View style={styles.emptySection}>
              <ThemedText style={[styles.emptyText, { color: textSecondary }]}>
                No tasks for tomorrow
              </ThemedText>
            </View>
          ) : (
            tomorrowTasks.map((task) => (
              <View key={task.id} style={[styles.taskRow, { backgroundColor: cardBg }]}>
                <TouchableOpacity 
                  style={styles.checkbox}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={[
                    styles.checkboxCircle, 
                    { borderColor: task.completed ? tintColor : textSecondary },
                    task.completed && { backgroundColor: tintColor }
                  ]}>
                    {task.completed && (
                      <Ionicons name="checkmark" size={14} color="#fff" />
                    )}
                  </View>
                </TouchableOpacity>
                <View style={styles.taskContent}>
                  <ThemedText style={[
                    styles.taskTitle,
                    task.completed && styles.completedText
                  ]}>
                    {task.title}
                  </ThemedText>
                  {task.description && (
                    <ThemedText style={[
                      styles.taskSubtitle, 
                      { color: textSecondary },
                      task.completed && styles.completedText
                    ]}>
                      {task.description}
                    </ThemedText>
                  )}
                </View>
                <View style={[styles.categoryBadge, { 
                  backgroundColor: task.category === 'Today' ? '#D4F4E7' : '#FFF5E5' 
                }]}>
                  <ThemedText style={[styles.categoryBadgeText, {
                    color: task.category === 'Today' ? '#059669' : '#D97706'
                  }]}>
                    {task.category}
                  </ThemedText>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    marginTop: 4,
  },
  date: {
    fontSize: 15,
    marginTop: 4,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  categoryCard: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  categoryIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  categoryName: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 8,
  },
  categoryCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
  },
  sectionCount: {
    fontSize: 14,
    fontWeight: '500',
  },
  taskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  checkbox: {
    padding: 4,
  },
  checkboxCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  taskContent: {
    flex: 1,
    gap: 4,
  },
  taskTitle: {
    fontSize: 15,
    fontWeight: '500',
  },
  taskSubtitle: {
    fontSize: 13,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  emptySection: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
  },
  categoryBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryBadgeText: {
    fontSize: 12,
    fontWeight: '600',
  },
});
