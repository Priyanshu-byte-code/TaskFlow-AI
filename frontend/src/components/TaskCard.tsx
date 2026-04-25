import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useAuth } from '../hooks/useAuth';
import { Task } from '../types';

const priorityColors: Record<string, string> = {
  high:   'bg-red-100 text-red-800',
  medium: 'bg-amber-100 text-amber-800',
  low:    'bg-green-100 text-green-800'
};

const tagColors: Record<string, string> = {
  Feature: 'bg-blue-100 text-blue-800',
  Bug:     'bg-amber-100 text-amber-800',
  Design:  'bg-green-100 text-green-800',
  Backend: 'bg-indigo-100 text-indigo-800',
  AI:      'bg-purple-100 text-purple-800',
  DevOps:  'bg-gray-100 text-gray-700'
};

interface Props {
  task: Task;
  index: number;
  onDeleteTask: (task: Task) => void;
}

const TaskCard = ({ task, onDeleteTask }: Props) => {
  const { user } = useAuth();
  const canDelete = user?.role === 'Admin' || user?.role === 'Manager';

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: task._id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`bg-white border rounded-xl p-3 mb-2 select-none transition-all group ${
        isDragging
          ? 'border-blue-300 shadow-md'
          : 'border-gray-200 hover:border-gray-300 hover:shadow-sm'
      }`}
    >
      <div className="flex items-start justify-between mb-2">
        {/* Drag handle area */}
        <div {...attributes} {...listeners} className="flex-1 cursor-grab active:cursor-grabbing">
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${tagColors[task.tag] || 'bg-gray-100 text-gray-700'}`}>
            {task.tag}
          </span>
        </div>

        {/* Delete button — only Admin/Manager, shows on hover */}
        {canDelete && (
          <button
            onClick={(e) => { e.stopPropagation(); onDeleteTask(task); }}
            className="opacity-0 group-hover:opacity-100 transition-opacity w-6 h-6 flex items-center justify-center rounded-lg hover:bg-red-50 text-gray-400 hover:text-red-500 flex-shrink-0"
            title="Delete task"
          >
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>

      <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing">
        <p className="text-sm font-medium text-gray-800 mb-2 leading-snug">{task.title}</p>

        {task.progress > 0 && (
          <div className="w-full bg-gray-100 rounded-full h-1 mb-2">
            <div
              className={`h-1 rounded-full ${task.progress === 100 ? 'bg-green-500' : 'bg-blue-500'}`}
              style={{ width: `${task.progress}%` }}
            />
          </div>
        )}

        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1.5">
            {task.assignee ? (
              <>
                <div className="w-5 h-5 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700">
                  {task.assignee.name.charAt(0).toUpperCase()}
                </div>
                <span className="text-xs text-gray-600 font-medium">{task.assignee.name.split(' ')[0]}</span>
              </>
            ) : (
              <span className="text-xs text-gray-400 italic">Unassigned</span>
            )}
          </div>
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${priorityColors[task.priority]}`}>
            {task.priority}
          </span>
        </div>

        {task.dueDate && (
          <p className="text-xs text-gray-400 mt-1.5">
            Due: {new Date(task.dueDate).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
          </p>
        )}

        {task.comments?.length > 0 && (
          <div className="mt-2 pt-2 border-t border-gray-100 flex items-center gap-1">
            <svg className="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
            </svg>
            <span className="text-xs text-gray-400">{task.comments.length}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskCard;