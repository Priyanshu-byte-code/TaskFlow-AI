export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Manager' | 'Member';
  avatar: string;
  isOnline: boolean;
}

export interface Comment {
  _id: string;
  author: User;
  text: string;
  createdAt: string;
}

export interface Task {
  _id: string;
  title: string;
  description: string;
  project: string;
  assignee: User | null;
  createdBy: User;
  status: 'todo' | 'inprogress' | 'inreview' | 'done';
  priority: 'low' | 'medium' | 'high';
  tag: string;
  storyPoints: number;
  dueDate: string | null;
  progress: number;
  comments: Comment[];
  aiPrioritized: boolean;
  createdAt: string;
}

export interface Project {
  _id: string;
  name: string;
  description: string;
  owner: User;
  members: { user: User; role: string }[];
  sprintName: string;
  sprintStart: string;
  sprintEnd: string;
  status: string;
}

export interface Notification {
  _id: string;
  type: string;
  message: string;
  isRead: boolean;
  sender: User;
  createdAt: string;
}

export interface AISuggestion {
  priorityAlert: string;
  sprintRisk: string;
  suggestedTask: string;
  atRiskTasks: string[];
  recommendation: string;
}
