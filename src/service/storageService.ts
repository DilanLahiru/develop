import AsyncStorage from '@react-native-async-storage/async-storage'
import { Task } from '../constants/types'
import { STORAGE_KEY, DEFAULT_TASKS } from '../constants/storage'

export const storageService = {
  /**
   * Save tasks to device storage
   */
  saveTasks: async (tasks: Task[]): Promise<void> => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(tasks))
    } catch (error) {
      console.error('Failed to save tasks:', error)
      throw new Error('Failed to save tasks')
    }
  },

  /**
   * Load tasks from device storage
   */
  loadTasks: async (): Promise<Task[]> => {
    try {
      const savedTasks = await AsyncStorage.getItem(STORAGE_KEY)
      return savedTasks ? JSON.parse(savedTasks) : DEFAULT_TASKS
    } catch (error) {
      console.error('Failed to load tasks:', error)
      throw new Error('Failed to load tasks')
    }
  },

  /**
   * Clear all tasks from storage
   */
  clearTasks: async (): Promise<void> => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY)
    } catch (error) {
      console.error('Failed to clear tasks:', error)
      throw new Error('Failed to clear tasks')
    }
  },
}