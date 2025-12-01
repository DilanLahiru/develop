import { useCallback, useState } from 'react'
import { Task } from '../constants/types'
import { storageService } from '../service/storageService'

export const useTaskManager = () => {
  const [tasks, setTasks] = useState<Task[]>([])

  const saveTasks = useCallback(async (tasksToSave: Task[]) => {
    try {
      await storageService.saveTasks(tasksToSave)
      setTasks(tasksToSave)
    } catch (error) {
      console.error('Failed to save tasks:', error)
      throw error
    }
  }, [])

  const loadTasks = useCallback(async () => {
    try {
      const loadedTasks = await storageService.loadTasks()
      setTasks(loadedTasks)
      return loadedTasks
    } catch (error) {
      console.error('Failed to load tasks:', error)
      throw error
    }
  }, [])

  const toggleTask = useCallback(
    (id: string) => {
      const updated = tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
      saveTasks(updated)
    },
    [tasks, saveTasks]
  )

  const addTask = useCallback(
    (title: string) => {
      if (title.trim().length === 0) return

      const newTask: Task = {
        id: Date.now().toString(),
        title: title.trim(),
        completed: false,
      }

      const updated = [newTask, ...tasks]
      saveTasks(updated)
    },
    [tasks, saveTasks]
  )

  const editTask = useCallback(
    (id: string, newTitle: string) => {
      if (newTitle.trim().length === 0) return

      const updated = tasks.map((task) =>
        task.id === id ? { ...task, title: newTitle.trim() } : task
      )
      saveTasks(updated)
    },
    [tasks, saveTasks]
  )

  const deleteTask = useCallback(
    (id: string) => {
      const updated = tasks.filter((task) => task.id !== id)
      saveTasks(updated)
    },
    [tasks, saveTasks]
  )

  return {
    tasks,
    loadTasks,
    toggleTask,
    addTask,
    editTask,
    deleteTask,
  }
}