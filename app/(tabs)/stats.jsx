import { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useThemeColor } from '@/hooks/use-theme-color';
import { initDatabase, getTasks } from '@/utils/database.js';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function StatsScreen() {
  const [tasks, setTasks] = useState([]);

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

  const tintColor = useThemeColor({}, 'tint');
  const textSecondary = useThemeColor({}, 'textSecondary');
  const cardBg = useThemeColor({}, 'card');

  const totalTasks = tasks.length;
  const completedTasks = tasks.filter(t => t.completed).length;
  const activeTasks = tasks.filter(t => !t.completed).length;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const highPriorityTasks = tasks.filter(t => t.priority === 'high' && !t.completed).length;
  const mediumPriorityTasks = tasks.filter(t => t.priority === 'medium' && !t.completed).length;
  const lowPriorityTasks = tasks.filter(t => t.priority === 'low' && !t.completed).length;

  const todayTasks = tasks.filter(t => t.category === 'Today').length;
  const tomorrowTasks = tasks.filter(t => t.category === 'Tomorrow').length;
  const workTasks = tasks.filter(t => t.category === 'Work').length;
  const personalTasks = tasks.filter(t => t.category === 'Personal').length;

  const stats = [
    { 
      icon: 'checkmark-circle', 
      label: 'Completion Rate', 
      value: `${completionRate}%`, 
      color: '#10B981',
      bgColor: '#D1FAE5'
    },
    { 
      icon: 'list', 
      label: 'Total Tasks', 
      value: totalTasks, 
      color: '#3B82F6',
      bgColor: '#DBEAFE'
    },
    { 
      icon: 'time', 
      label: 'Active Tasks', 
      value: activeTasks, 
      color: '#F59E0B',
      bgColor: '#FEF3C7'
    },
    { 
      icon: 'checkmark-done', 
      label: 'Completed', 
      value: completedTasks, 
      color: '#8B5CF6',
      bgColor: '#EDE9FE'
    },
  ];

  const priorityStats = [
    { label: 'High Priority', value: highPriorityTasks, color: '#EF4444', icon: 'alert-circle' },
    { label: 'Medium Priority', value: mediumPriorityTasks, color: '#F59E0B', icon: 'warning' },
    { label: 'Low Priority', value: lowPriorityTasks, color: '#10B981', icon: 'information-circle' },
  ];

  const categoryStats = [
    { label: 'Today', value: todayTasks, color: '#00D084', icon: 'today' },
    { label: 'Tomorrow', value: tomorrowTasks, color: '#F59E0B', icon: 'calendar' },
    { label: 'Work', value: workTasks, color: '#EF4444', icon: 'briefcase' },
    { label: 'Personal', value: personalTasks, color: '#3B82F6', icon: 'person' },
  ];

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title" style={styles.headerTitle}>Statistics</ThemedText>
        <ThemedText style={[styles.subtitle, { color: textSecondary }]}>
          Track your productivity
        </ThemedText>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          {stats.map((stat, index) => (
            <View key={index} style={[styles.statCard, { backgroundColor: cardBg }]}>
              <View style={[styles.statIcon, { backgroundColor: stat.bgColor }]}>
                <Ionicons name={stat.icon} size={28} color={stat.color} />
              </View>
              <ThemedText style={styles.statValue}>{stat.value}</ThemedText>
              <ThemedText style={[styles.statLabel, { color: textSecondary }]}>
                {stat.label}
              </ThemedText>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Priority Breakdown</ThemedText>
          <View style={[styles.listCard, { backgroundColor: cardBg }]}>
            {priorityStats.map((stat, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                  <ThemedText style={styles.listItemLabel}>{stat.label}</ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: stat.color + '20' }]}>
                  <ThemedText style={[styles.badgeText, { color: stat.color }]}>
                    {stat.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <ThemedText style={styles.sectionTitle}>Category Breakdown</ThemedText>
          <View style={[styles.listCard, { backgroundColor: cardBg }]}>
            {categoryStats.map((stat, index) => (
              <View key={index} style={styles.listItem}>
                <View style={styles.listItemLeft}>
                  <Ionicons name={stat.icon} size={24} color={stat.color} />
                  <ThemedText style={styles.listItemLabel}>{stat.label}</ThemedText>
                </View>
                <View style={[styles.badge, { backgroundColor: stat.color + '20' }]}>
                  <ThemedText style={[styles.badgeText, { color: stat.color }]}>
                    {stat.value}
                  </ThemedText>
                </View>
              </View>
            ))}
          </View>
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
    gap: 4,
  },
  headerTitle: {
    fontSize: 32,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  subtitle: {
    fontSize: 15,
    marginTop: 4,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  statCard: {
    width: '47%',
    padding: 20,
    borderRadius: 16,
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  statIcon: {
    width: 56,
    height: 56,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statValue: {
    fontSize: 28,
    fontWeight: '700',
  },
  statLabel: {
    fontSize: 13,
    textAlign: 'center',
  },
  section: {
    padding: 20,
    paddingTop: 8,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 12,
  },
  listCard: {
    borderRadius: 16,
    padding: 16,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  listItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  listItemLabel: {
    fontSize: 15,
    fontWeight: '500',
  },
  badge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  badgeText: {
    fontSize: 14,
    fontWeight: '700',
  },
});
