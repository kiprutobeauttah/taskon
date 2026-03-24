import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function TaskItem({ task, onToggle, onDelete }) {
  const tintColor = useThemeColor({}, 'tint');
  const checkboxBorder = useThemeColor({}, 'checkboxBorder');
  const textSecondary = useThemeColor({}, 'textSecondary');

  const getPriorityColor = () => {
    const colors = {
      high: '#EF4444',
      medium: '#F59E0B',
      low: '#10B981',
    };
    return colors[task.priority] || colors.medium;
  };

  const getCategoryColor = () => {
    if (!task.category) return null;
    const categoryColors = {
      work: '#FFE5E5',
      personal: '#E5F5FF',
      today: '#D4F4E7',
      tomorrow: '#FFF5E5',
    };
    return categoryColors[task.category.toLowerCase()] || '#E5E7EB';
  };

  const getCategoryTextColor = () => {
    if (!task.category) return null;
    const categoryColors = {
      work: '#DC2626',
      personal: '#2563EB',
      today: '#059669',
      tomorrow: '#D97706',
    };
    return categoryColors[task.category.toLowerCase()] || '#6B7280';
  };

  return (
    <ThemedView style={styles.container}>
      <View style={[styles.priorityIndicator, { backgroundColor: getPriorityColor() }]} />
      
      <TouchableOpacity
        style={[
          styles.checkbox,
          { borderColor: task.completed ? tintColor : checkboxBorder },
          task.completed && { backgroundColor: tintColor }
        ]}
        onPress={() => onToggle(task.id)}
        accessibilityLabel={task.completed ? 'Mark as incomplete' : 'Mark as complete'}
      >
        {task.completed && (
          <Ionicons name="checkmark" size={16} color="#fff" />
        )}
      </TouchableOpacity>

      <View style={styles.content}>
        <ThemedText
          style={[styles.title, task.completed && styles.completedText]}
          numberOfLines={2}
        >
          {task.title}
        </ThemedText>
        {task.description && (
          <ThemedText
            style={[styles.description, task.completed && styles.completedText]}
            numberOfLines={1}
          >
            {task.description}
          </ThemedText>
        )}
        {task.priority && (
          <View style={styles.metaRow}>
            <View style={[styles.priorityBadge, { backgroundColor: getPriorityColor() + '20' }]}>
              <Ionicons name="flag" size={12} color={getPriorityColor()} />
              <ThemedText style={[styles.priorityLabel, { color: getPriorityColor() }]}>
                {task.priority}
              </ThemedText>
            </View>
            {task.alarmTime && (
              <View style={styles.alarmBadge}>
                <Ionicons name="alarm" size={12} color="#8B5CF6" />
                <ThemedText style={[styles.alarmLabel, { color: '#8B5CF6' }]}>
                  {new Date(task.alarmTime).toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </ThemedText>
              </View>
            )}
          </View>
        )}
      </View>

      {task.category && (
        <View style={[styles.categoryTag, { backgroundColor: getCategoryColor() }]}>
          <ThemedText style={[styles.categoryText, { color: getCategoryTextColor() }]}>
            {task.category}
          </ThemedText>
        </View>
      )}

      <TouchableOpacity
        style={styles.deleteButton}
        onPress={() => onDelete(task.id)}
        accessibilityLabel="Delete task"
      >
        <Ionicons name="close-circle-outline" size={20} color={textSecondary} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    paddingLeft: 12,
    borderRadius: 16,
    marginBottom: 12,
    gap: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  priorityIndicator: {
    width: 4,
    height: 40,
    borderRadius: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    gap: 4,
  },
  title: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 20,
  },
  description: {
    fontSize: 13,
    opacity: 0.6,
    lineHeight: 18,
  },
  completedText: {
    textDecorationLine: 'line-through',
    opacity: 0.4,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 4,
  },
  priorityBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityLabel: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'capitalize',
  },
  alarmBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    backgroundColor: '#F3E8FF',
  },
  alarmLabel: {
    fontSize: 11,
    fontWeight: '600',
  },
  categoryTag: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
  },
  deleteButton: {
    padding: 4,
  },
});
