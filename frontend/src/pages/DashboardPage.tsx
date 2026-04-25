import { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, pointerWithin } from '@dnd-kit/core';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../app/store';
import { fetchTasks, updateTaskStatus, createTask, deleteTask } from '../features/tasks/taskSlice';
import { fetchProjects, createProject } from '../features/projects/projectSlice';
import { fetchNotifications } from '../features/notifications/notificationSlice';
import { useSocket } from '../hooks/useSocket';
import { useAuth } from '../hooks/useAuth';
import Sidebar from '../components/Sidebar';
import KanbanColumn from '../components/KanbanColumn';
import AIPanel from '../components/AIPanel';
import NotificationBell from '../components/NotificationBell';
import { Task } from '../types';

const COLUMNS = ['todo', 'inprogress', 'inreview', 'done'];

const DashboardPage = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuth();
  const { tasks, loading: tasksLoading } = useSelector((s: RootState) => s.tasks);
  const { activeProject, projects, loading: projectsLoading } = useSelector((s: RootState) => s.projects);
  const [showNewTask, setShowNewTask] = useState(false);
  const [showNewProject, setShowNewProject] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Task | null>(null);
  const [taskForm, setTaskForm] = useState({
    title: '',
    priority: 'medium',
    tag: 'Feature',
    storyPoints: 1,
    assignee: ''
  });
  const [projectForm, setProjectForm] = useState({ name: '', description: '', sprintName: 'Sprint 1' });

  useSocket(user?._id, activeProject?._id);

  useEffect(() => {
    dispatch(fetchProjects());
    dispatch(fetchNotifications());
  }, [dispatch]);

  useEffect(() => {
    if (activeProject?._id) dispatch(fetchTasks(activeProject._id));
  }, [activeProject?._id, dispatch]);

  const findColumn = (id: string): string | null => {
    if (COLUMNS.includes(id)) return id;
    const task = tasks.find(t => t._id === id);
    return task ? task.status : null;
  };

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over) return;
    const activeId = active.id as string;
    const overId = over.id as string;
    const targetColumn = COLUMNS.includes(overId) ? overId : findColumn(overId);
    if (!targetColumn) return;
    const sourceColumn = findColumn(activeId);
    if (!sourceColumn || sourceColumn === targetColumn) return;
    dispatch(updateTaskStatus({ id: activeId, status: targetColumn }));
  };

  const tasksByColumn = (col: string): Task[] => tasks.filter(t => t.status === col);

  const daysLeft = activeProject
    ? Math.max(0, Math.ceil((new Date(activeProject.sprintEnd).getTime() - Date.now()) / 86400000))
    : 0;

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    const payload: any = {
      title: taskForm.title,
      priority: taskForm.priority,
      tag: taskForm.tag,
      storyPoints: taskForm.storyPoints,
      project: activeProject._id,
      status: 'todo'
    };
    if (taskForm.assignee) payload.assignee = taskForm.assignee;
    await dispatch(createTask(payload));
    setShowNewTask(false);
    setTaskForm({ title: '', priority: 'medium', tag: 'Feature', storyPoints: 1, assignee: '' });
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();
    await dispatch(createProject(projectForm));
    setShowNewProject(false);
    setProjectForm({ name: '', description: '', sprintName: 'Sprint 1' });
  };

  const handleConfirmDelete = async () => {
    if (!showDeleteConfirm) return;
    await dispatch(deleteTask(showDeleteConfirm._id));
    setShowDeleteConfirm(null);
  };

  const teamMembers = activeProject?.members?.map((m: any) => m.user).filter(Boolean) || [];

  if (projectsLoading) {
    return (
      <div className="flex h-screen bg-gray-50 overflow-hidden">
        <Sidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />

      <div className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-gray-200 px-6 py-3 flex items-center justify-between flex-shrink-0">
          <div>
            <h1 className="text-base font-semibold text-gray-900">
              {activeProject?.sprintName || 'Dashboard'}
            </h1>
            <p className="text-xs text-gray-400">
              {activeProject
                ? `${activeProject.name} · ${daysLeft} days left`
                : projects.length === 0
                  ? 'Create a project or wait to be added to one'
                  : 'Select a project from the sidebar'
              }
            </p>
          </div>
          <div className="flex items-center gap-2">
            {activeProject && (
              <span className={`text-xs px-3 py-1 rounded-full font-medium ${
                daysLeft <= 2 ? 'bg-red-100 text-red-700' :
                daysLeft <= 5 ? 'bg-amber-100 text-amber-700' :
                'bg-green-100 text-green-700'
              }`}>{daysLeft}d left</span>
            )}
            <NotificationBell />
            {activeProject && (
              <button onClick={() => setShowNewTask(true)}
                className="text-sm bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-medium">
                + Add task
              </button>
            )}
          </div>
        </header>

        <div className="flex-1 overflow-x-auto p-5">
          {projects.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-2xl flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">No projects yet</h2>
              <p className="text-sm text-gray-500 mb-2 max-w-sm">
                Create your own project, or ask a project Admin/Manager to add you as a member.
              </p>
              <p className="text-xs text-gray-400 mb-5">Once added, the project will appear here automatically.</p>
              <button onClick={() => setShowNewProject(true)}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                Create new project
              </button>
            </div>
          ) : !activeProject ? (
            <div className="flex items-center justify-center h-full">
              <p className="text-sm text-gray-500">Select a project from the sidebar</p>
            </div>
          ) : tasksLoading ? (
            <div className="flex items-center justify-center h-full">
              <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full" />
            </div>
          ) : (
            <div className="flex gap-4 h-full">
              <DndContext collisionDetection={pointerWithin} onDragEnd={onDragEnd}>
                <div className="flex gap-4 flex-1">
                  {COLUMNS.map(col => (
                    <KanbanColumn
                      key={col}
                      columnId={col}
                      tasks={tasksByColumn(col)}
                      onDeleteTask={(task) => setShowDeleteConfirm(task)}
                    />
                  ))}
                </div>
              </DndContext>
              <AIPanel projectId={activeProject._id} sprintEnd={activeProject.sprintEnd} />
            </div>
          )}
        </div>
      </div>

      {showNewTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Add new task</h2>
              <button onClick={() => setShowNewTask(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateTask} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Task title</label>
                <input value={taskForm.title}
                  onChange={e => setTaskForm({ ...taskForm, title: e.target.value })}
                  placeholder="e.g. Set up JWT authentication" required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Assign to</label>
                <select value={taskForm.assignee}
                  onChange={e => setTaskForm({ ...taskForm, assignee: e.target.value })}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="">Unassigned</option>
                  {teamMembers.map((m: any) => (
                    <option key={m._id} value={m._id}>{m.name} ({m.role})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Priority</label>
                  <select value={taskForm.priority}
                    onChange={e => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium text-gray-700 mb-1 block">Tag</label>
                  <select value={taskForm.tag}
                    onChange={e => setTaskForm({ ...taskForm, tag: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    {['Feature', 'Bug', 'Design', 'Backend', 'AI', 'DevOps'].map(t => <option key={t}>{t}</option>)}
                  </select>
                </div>
              </div>
              <div className="flex gap-2 pt-1">
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  Create task
                </button>
                <button type="button" onClick={() => setShowNewTask(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showNewProject && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-md shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Create new project</h2>
              <button onClick={() => setShowNewProject(false)} className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={handleCreateProject} className="space-y-3">
              <input value={projectForm.name}
                onChange={e => setProjectForm({ ...projectForm, name: e.target.value })}
                placeholder="Project name" required
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={projectForm.description}
                onChange={e => setProjectForm({ ...projectForm, description: e.target.value })}
                placeholder="Description (optional)"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <input value={projectForm.sprintName}
                onChange={e => setProjectForm({ ...projectForm, sprintName: e.target.value })}
                placeholder="Sprint name e.g. Sprint 1"
                className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              <div className="flex gap-2 pt-1">
                <button type="submit"
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                  Create project
                </button>
                <button type="button" onClick={() => setShowNewProject(false)}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm shadow-xl">
            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-4 mx-auto">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 text-center mb-2">Delete task</h3>
            <p className="text-sm text-gray-500 text-center mb-1">Are you sure you want to delete</p>
            <p className="text-sm font-medium text-gray-800 text-center mb-2">"{showDeleteConfirm.title}"?</p>
            <p className="text-xs text-gray-400 text-center mb-5">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={handleConfirmDelete}
                className="flex-1 bg-red-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-red-700 transition-colors">
                Delete task
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;