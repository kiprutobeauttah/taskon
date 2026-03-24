import { useThemeColor } from '@/hooks/use-theme-color';
import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Modal,
    Platform,
    StyleSheet,
    Switch,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';

export function AddTaskModal({ visible, onClose, onAdd }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [priority, setPriority] = useState('medium');
  const [dueDate, setDueDate] = useState('');
  const [alarmEnabled, setAlarmEnabled] = useState(false);
  const [alarmTime, setAlarmTime] = useState(new Date());
  const [showTimePicker, setShowTimePicker] = useState(false);
  
  const backgroundColor = useThemeColor({}, 'background');
  const textColor = useThemeColor({}, 'text');
  const tintColor = useThemeColor({}, 'tint');
  const borderColor = useThemeColor({ light: '#e0e0e0', dark: '#333' }, 'border');

  const categories = ['Today', 'Tomorrow', 'Work', 'Personal'];
  const priorities = [
    { value: 'low', label: 'Low', color: '#10B981' },
    { value: 'medium', label: 'Medium', color: '#F59E0B' },
    { value: 'high', label: 'High', color: '#EF4444' },
  ];

  const handleAdd = () => {
    if (title.trim()) {
      onAdd(
        title.trim(), 
        description.trim() || undefined, 
        category || undefined, 
        priority,
        alarmEnabled ? alarmTime : undefined
      );
      setTitle('');
      setDescription('');
      setCategory('');
      setPriority('medium');
      setDueDate('');
      setAlarmEnabled(false);
      setAlarmTime(new Date());
      onClose();
    }
  };

  const handleCancel = () => {
    setTitle('');
    setDescription('');
    setCategory('');
    setPriority('medium');
    setDueDate('');
    setAlarmEnabled(false);
    setAlarmTime(new Date());
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleCancel}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.overlay}
      >
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={handleCancel}
        />
        <ThemedView style={styles.container}>
          <ThemedText type="subtitle" style={styles.header}>
            New Task
          </ThemedText>

          <TextInput
            style={[styles.input, { backgroundColor, color: textColor, borderColor }]}
            placeholder="Task title"
            placeholderTextColor={textColor + '80'}
            value={title}
            onChangeText={setTitle}
            autoFocus
          />

          <TextInput
            style={[styles.input, styles.textArea, { backgroundColor, color: textColor, borderColor }]}
            placeholder="Description (optional)"
            placeholderTextColor={textColor + '80'}
            value={description}
            onChangeText={setDescription}
            multiline
            numberOfLines={3}
          />

          <View style={styles.categoryContainer}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[
                  styles.categoryChip,
                  category === cat && { backgroundColor: tintColor },
                  category !== cat && { backgroundColor: borderColor },
                ]}
                onPress={() => setCategory(category === cat ? '' : cat)}
              >
                <ThemedText
                  style={[
                    styles.categoryChipText,
                    category === cat && { color: '#fff' },
                  ]}
                >
                  {cat}
                </ThemedText>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.priorityContainer}>
            <ThemedText style={styles.label}>Priority</ThemedText>
            <View style={styles.priorityRow}>
              {priorities.map((p) => (
                <TouchableOpacity
                  key={p.value}
                  style={[
                    styles.priorityChip,
                    priority === p.value && { 
                      backgroundColor: p.color,
                      borderColor: p.color,
                    },
                    priority !== p.value && { 
                      borderColor: borderColor,
                      borderWidth: 1,
                    },
                  ]}
                  onPress={() => setPriority(p.value)}
                >
                  <ThemedText
                    style={[
                      styles.priorityText,
                      priority === p.value && { color: '#fff' },
                    ]}
                  >
                    {p.label}
                  </ThemedText>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View style={styles.alarmContainer}>
            <View style={styles.alarmHeader}>
              <View style={styles.alarmLabelRow}>
                <Ionicons name="alarm-outline" size={20} color={textColor} />
                <ThemedText style={styles.label}>Set Alarm</ThemedText>
              </View>
              <Switch
                value={alarmEnabled}
                onValueChange={setAlarmEnabled}
                trackColor={{ false: borderColor, true: tintColor + '80' }}
                thumbColor={alarmEnabled ? tintColor : '#f4f3f4'}
              />
            </View>
            
            {alarmEnabled && (
              <TouchableOpacity
                style={[styles.timeButton, { borderColor }]}
                onPress={() => setShowTimePicker(true)}
              >
                <Ionicons name="time-outline" size={20} color={tintColor} />
                <ThemedText style={styles.timeText}>
                  {alarmTime.toLocaleString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                    hour12: true,
                  })}
                </ThemedText>
              </TouchableOpacity>
            )}
          </View>

          {showTimePicker && (
            <DateTimePicker
              value={alarmTime}
              mode="datetime"
              display="default"
              onChange={(event, selectedDate) => {
                setShowTimePicker(Platform.OS === 'ios');
                if (selectedDate) {
                  setAlarmTime(selectedDate);
                }
              }}
              minimumDate={new Date()}
            />
          )}

          <View style={styles.buttons}>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleCancel}
            >
              <ThemedText style={styles.buttonText}>Cancel</ThemedText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.addButton, { backgroundColor: tintColor }]}
              onPress={handleAdd}
              disabled={!title.trim()}
            >
              <ThemedText style={[styles.buttonText, styles.addButtonText]}>
                Add Task
              </ThemedText>
            </TouchableOpacity>
          </View>
        </ThemedView>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  container: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 24,
    paddingBottom: 40,
  },
  header: {
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    marginBottom: 12,
  },
  textArea: {
    height: 80,
    textAlignVertical: 'top',
  },
  categoryContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 16,
  },
  categoryChipText: {
    fontSize: 14,
    fontWeight: '500',
  },
  priorityContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  priorityRow: {
    flexDirection: 'row',
    gap: 8,
  },
  priorityChip: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: 'center',
  },
  priorityText: {
    fontSize: 14,
    fontWeight: '600',
  },
  alarmContainer: {
    marginBottom: 16,
  },
  alarmHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  alarmLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  timeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  timeText: {
    fontSize: 15,
    fontWeight: '500',
  },
  buttons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#666',
  },
  addButton: {
    opacity: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  addButtonText: {
    color: '#fff',
  },
});