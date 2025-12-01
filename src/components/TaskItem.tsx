import React, { useEffect, useRef } from 'react'
import { Animated, Alert, TouchableOpacity, Text, View, StyleSheet } from 'react-native'
import { TaskItemProps } from '../constants/types'
import { ANIMATION } from '../constants/animation'
import { COLORS } from '../constants/colors'
import { normalizeModerately } from '../constants/Scalling'

export const TaskItem: React.FC<TaskItemProps> = ({
  item,
  index,
  onToggle,
  onEdit,
  onDelete,
}) => {
  const scaleAnim = useRef(new Animated.Value(0)).current
  const opacityAnim = useRef(new Animated.Value(0)).current
  const slideOutAnim = useRef(new Animated.Value(0)).current

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        delay: index * ANIMATION.ITEM_DELAY,
        useNativeDriver: true,
        tension: ANIMATION.SPRING_TENSION,
        friction: ANIMATION.SPRING_FRICTION,
      }),
      Animated.timing(opacityAnim, {
        toValue: 1,
        delay: index * ANIMATION.ITEM_DELAY,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start()
  }, [scaleAnim, opacityAnim, index])

  const handleDelete = () => {
    Alert.alert(
      'Delete Task',
      'Are you sure you want to delete this task?',
      [
        { text: 'Cancel', onPress: () => {}, style: 'cancel' },
        {
          text: 'Delete',
          onPress: () => {
            Animated.timing(slideOutAnim, {
              toValue: 1,
              duration: 250,
              useNativeDriver: true,
            }).start(() => onDelete(item.id))
          },
          style: 'destructive',
        },
      ]
    )
  }

  const translateX = slideOutAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 400],
  })

  return (
    <Animated.View
      style={[
        styles.taskItemWrapper,
        {
          transform: [{ scale: scaleAnim }, { translateX }],
          opacity: opacityAnim,
        },
      ]}>
      <View style={styles.taskItemContainer}>
        <TouchableOpacity
          style={styles.taskItem}
          onPress={() => onToggle(item.id)}
          activeOpacity={0.6}
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.completed }}>
          <View
            style={[
              styles.checkbox,
              item.completed && styles.checkboxCompleted,
            ]}>
            {item.completed && <Text style={styles.checkmark}>✓</Text>}
          </View>

          <Text
            style={[
              styles.taskText,
              item.completed && styles.taskTextCompleted,
            ]}
            numberOfLines={1}>
            {item.title}
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.editButton}
          onPress={() => onEdit(item.id, item.title)}
          accessibilityRole="button"
          accessibilityLabel="Edit task">
          <Text style={styles.actionButtonText}>✎</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.deleteButton}
          onPress={handleDelete}
          accessibilityRole="button"
          accessibilityLabel="Delete task">
          <Text style={styles.deleteButtonText}>✕</Text>
        </TouchableOpacity>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  taskItemWrapper: {
    marginBottom: 8,
  },
  taskItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  taskItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: normalizeModerately(14),
    paddingHorizontal: normalizeModerately(14),
    borderRadius: 12,
    backgroundColor: COLORS.whiteColor,
  },
  checkbox: {
    width: normalizeModerately(24),
    height: normalizeModerately(24),
    borderRadius: 6,
    backgroundColor: COLORS.checkboxInactive,
    marginRight: normalizeModerately(12),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.border,
  },
  checkboxCompleted: {
    backgroundColor: COLORS.checkboxActive,
    borderColor: COLORS.checkboxActive,
  },
  checkmark: {
    color: COLORS.whiteColor,
    fontSize: normalizeModerately(14),
    fontWeight: '600',
  },
  taskText: {
    fontSize: normalizeModerately(15),
    color: COLORS.text,
    fontWeight: '500',
    flex: 1,
  },
  taskTextCompleted: {
    color: COLORS.textSecondary,
    textDecorationLine: 'line-through',
  },
  actionButtonText: {
    fontSize: normalizeModerately(16),
    color: COLORS.primary,
  },
  editButton: {
    width: normalizeModerately(40),
    height: normalizeModerately(40),
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightGray,
  },
  deleteButton: {
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.lightRed,
  },
  deleteButtonText: {
    fontSize: normalizeModerately(16),
    color: COLORS.danger,
    fontWeight: '600',
  },
})