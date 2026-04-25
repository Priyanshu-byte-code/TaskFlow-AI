import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { Task } from '../types';
import TaskCard from './TaskCard';

const columnConfig: Record<string, { label: string; color: string }> = {
  todo:       { label: 'To do',       color: 'bg-gray-400' },
  inprogress: { label: 'In progress', color: 'bg-blue-500' },
  inreview:   { label: 'In review',   color: 'bg-amber-500' },
  done:       { label: 'Done',        color: 'bg-green-500' }
};

interface Props {
  columnId: string;
  tasks: Task[];
  onDeleteTask: (task: Task) => void;
}

const KanbanColumn = ({ columnId, tasks, onDeleteTask }: Props) => {
  const config = columnConfig[columnId] || { label: columnId, color: 'bg-gray-400' };
  const { setNodeRef, isOver } = useDroppable({ id: columnId });

  return (
    <div className="flex flex-col min-w-[240px] max-w-[240px]">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${config.color}`} />
          <span className="text-sm font-medium text-gray-700">{config.label}</span>
        </div>
        <span className="text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium">
          {tasks.length}
        </span>
      </div>
      <div
        ref={setNodeRef}
        className={`flex-1 min-h-[300px] rounded-xl p-2 transition-colors duration-150 ${
          isOver
            ? 'bg-blue-50 border-2 border-dashed border-blue-300'
            : 'bg-gray-50 border border-gray-200'
        }`}
      >
        <SortableContext items={tasks.map(t => t._id)} strategy={verticalListSortingStrategy}>
          {tasks.map((task, idx) => (
            <TaskCard
              key={task._id}
              task={task}
              index={idx}
              onDeleteTask={onDeleteTask}
            />
          ))}
        </SortableContext>
        {tasks.length === 0 && !isOver && (
          <p className="text-xs text-gray-400 text-center mt-8 select-none">Drop tasks here</p>
        )}
      </div>
    </div>
  );
};

export default KanbanColumn;