import React, { useEffect, useRef } from 'react'
import { Animated, TouchableOpacity, Text, TextInput, StyleSheet } from 'react-native'
import { InputModalProps } from '../constants/types'
import { ANIMATION } from '../constants/animation'
import { COLORS } from '../constants/colors'
import { normalizeModerately } from '../constants/Scalling'

export const InputModal: React.FC<InputModalProps> = ({
  visible,
  title,
  placeholder,
  value,
  onChange,
  onSubmit,
  onClose,
  submitButtonText,
}) => {
  const slideAnim = useRef(new Animated.Value(300)).current
  const overlayOpacityAnim = useRef(new Animated.Value(0)).current
  const inputRef = useRef<TextInput>(null)

  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.spring(slideAnim, {
          toValue: 0,
          useNativeDriver: true,
          tension: ANIMATION.SPRING_TENSION,
          friction: ANIMATION.SPRING_FRICTION,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 1,
          duration: ANIMATION.INPUT_DURATION,
          useNativeDriver: true,
        }),
      ]).start(() => {
        // Focus input after modal animation completes
        inputRef.current?.focus()
      })
    } else {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 300,
          duration: ANIMATION.INPUT_DURATION,
          useNativeDriver: true,
        }),
        Animated.timing(overlayOpacityAnim, {
          toValue: 0,
          duration: ANIMATION.INPUT_DURATION,
          useNativeDriver: true,
        }),
      ]).start()
    }
  }, [visible, slideAnim, overlayOpacityAnim])

  if (!visible) return null

  return (
    <Animated.View
      style={[
        styles.inputOverlay,
        { opacity: overlayOpacityAnim },
        { pointerEvents: visible ? 'auto' : 'none' },
      ]}>
      <TouchableOpacity
        style={styles.overlayBackground}
        onPress={onClose}
        activeOpacity={1}
      />

      <Animated.View
        style={[
          styles.inputContainer,
          { transform: [{ translateY: slideAnim }] },
        ]}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          accessibilityRole="button"
          accessibilityLabel="Close">
          <Text style={styles.closeButtonText}>✕</Text>
        </TouchableOpacity>

        <Text style={styles.inputLabel}>{title}</Text>

        <TextInput
          ref={inputRef}
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={COLORS.textSecondary}
          value={value}
          onChangeText={onChange}
          onSubmitEditing={onSubmit}
          returnKeyType="done"
          maxLength={100}
          editable={true}
        />

        <TouchableOpacity
          style={[
            styles.submitButton,
            value.trim().length === 0 && styles.submitButtonDisabled,
          ]}
          onPress={onSubmit}
          disabled={value.trim().length === 0}
          accessibilityRole="button"
          accessibilityLabel={submitButtonText}>
          <Text style={styles.submitButtonText}>{submitButtonText}</Text>
        </TouchableOpacity>
      </Animated.View>
    </Animated.View>
  )
}

export const styles = StyleSheet.create({
  inputOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBackground: {
    flex: 1,
    backgroundColor: COLORS.overlay,
  },
  inputContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: normalizeModerately(24),
    borderTopRightRadius: normalizeModerately(24),
    padding: normalizeModerately(24),
    paddingBottom: normalizeModerately(20),
    shadowColor: COLORS.shadow,
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 12,
  },
  inputLabel: {
    fontSize: normalizeModerately(20),
    fontWeight: '700',
    color: COLORS.text,
    marginBottom: normalizeModerately(12),
    marginTop: normalizeModerately(8),
  },
  input: {
    fontSize: normalizeModerately(16),
    color: COLORS.text,
    paddingVertical: normalizeModerately(12),
    paddingHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
    marginBottom: normalizeModerately(24),
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: normalizeModerately(34),
    height: normalizeModerately(34),
    borderRadius: 18,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  closeButtonText: {
    color: COLORS.background,
    fontSize: normalizeModerately(14),
    fontWeight: '600',
  },
  submitButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: normalizeModerately(14),
    borderRadius: 12,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: COLORS.background,
    fontSize: normalizeModerately(15),
    fontWeight: '600',
  },
})