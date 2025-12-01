import React, { useEffect, useRef, useState } from 'react'
import {
  Animated,
  Easing,
  FlatList,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  Alert,
  StyleSheet,
} from 'react-native'
import { TaskItem } from '../components/TaskItem'
import { InputModal } from '../components/InputModal'
import { useTaskManager } from '../hooks/useTaskManager'
import { COLORS } from '../constants/colors'

const HomeScreen: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true)
  const [addModalVisible, setAddModalVisible] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(false)
  const [newTaskText, setNewTaskText] = useState('')
  const [editingTaskId, setEditingTaskId] = useState<string | null>(null)
  const [editingTaskText, setEditingTaskText] = useState('')

  const headerOpacityAnim = useRef(new Animated.Value(0)).current
  const { tasks, loadTasks, toggleTask, addTask, editTask, deleteTask } = useTaskManager()

  // Load tasks on mount
  useEffect(() => {
    const initializeTasks = async () => {
      try {
        await loadTasks()
      } catch (error) {
        Alert.alert('Error', 'Failed to load tasks')
      } finally {
        setIsLoading(false)
      }
    }
    initializeTasks()
  }, [loadTasks])

  // Header animation
  useEffect(() => {
    if (!isLoading) {
      Animated.timing(headerOpacityAnim, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start()
    }
  }, [isLoading, headerOpacityAnim])

  const completedCount = tasks.filter((t) => t.completed).length

  const renderTask = ({ item, index }: any) => (
    <TaskItem
      item={item}
      index={index}
      onToggle={toggleTask}
      onEdit={(id, title) => {
        setEditingTaskId(id)
        setEditingTaskText(title)
        setEditModalVisible(true)
      }}
      onDelete={deleteTask}
    />
  )

  const handleAddTask = () => {
    if (newTaskText.trim().length === 0) {
      Alert.alert('Empty Task', 'Please enter a task title')
      return
    }
    addTask(newTaskText)
    setNewTaskText('')
    setAddModalVisible(false)
  }

  const handleEditTask = () => {
    if (editingTaskText.trim().length === 0) {
      Alert.alert('Empty Task', 'Please enter a task title')
      return
    }
    if (editingTaskId) {
      editTask(editingTaskId, editingTaskText)
    }
    setEditingTaskId(null)
    setEditingTaskText('')
    setEditModalVisible(false)
  }

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text style={styles.loadingText}>Loading tasks...</Text>
      </View>
    )
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      <Animated.View style={[styles.header, { opacity: headerOpacityAnim }]}>
        <Text style={styles.title}>Tasks</Text>
        <Text style={styles.subtitle}>
          {completedCount} of {tasks.length} completed
        </Text>
      </Animated.View>

      {tasks.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={styles.emptyStateText}>No tasks yet</Text>
          <Text style={styles.emptyStateSubtext}>Tap + to create your first task</Text>
        </View>
      ) : (
        <FlatList
          data={tasks}
          renderItem={renderTask}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
      )}

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => setAddModalVisible(true)}
        activeOpacity={0.8}>
        <Text style={styles.addButtonText}>+</Text>
      </TouchableOpacity>

      <InputModal
        visible={addModalVisible}
        title="New Task"
        placeholder="What do you want to accomplish?"
        value={newTaskText}
        onChange={setNewTaskText}
        onSubmit={handleAddTask}
        onClose={() => {
          setAddModalVisible(false)
          setNewTaskText('')
        }}
        submitButtonText="Add Task"
      />

      <InputModal
        visible={editModalVisible}
        title="Edit Task"
        placeholder="Update your task"
        value={editingTaskText}
        onChange={setEditingTaskText}
        onSubmit={handleEditTask}
        onClose={() => {
          setEditModalVisible(false)
          setEditingTaskId(null)
          setEditingTaskText('')
        }}
        submitButtonText="Update Task"
      />
    </View>
  )
}

export default HomeScreen

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: COLORS.textSecondary,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  title: {
    fontSize: 36,
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: COLORS.textSecondary,
    fontWeight: '500',
  },
  listContent: {
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  addButton: {
    position: 'absolute',
    right: 24,
    bottom: 40,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  addButtonText: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '300',
  },
})