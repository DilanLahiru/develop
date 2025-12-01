import { TextStyle } from "react-native"

export interface Task {
  id: string
  title: string
  completed: boolean
}

export interface TaskItemProps {
  item: Task
  index: number
  onToggle: (id: string) => void
  onEdit: (id: string, newTitle: string) => void
  onDelete: (id: string) => void
}

export interface InputModalProps {
  visible: boolean
  title: string
  placeholder: string
  value: string
  onChange: (text: string) => void
  onSubmit: () => void
  onClose: () => void
  submitButtonText: string
}

export interface WaveTitleProps {
  title: string;
  rise?: number;
  duration?: number;
  stagger?: number;
  textStyle?: TextStyle;
  containerStyle?: any;
};