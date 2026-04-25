import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import {
  BarChart, Bar, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import Sidebar from '../components/Sidebar';

const AnalyticsPage = () => {
  const { tasks } = useSelector((s: RootState) => s.tasks);
  const { activeProject } = useSelector((s: RootState) => s.projects);

  const statusData = [
    { name: 'To do',       count: tasks.filter(t => t.status === 'todo').length },
    { name: 'In progress', count: tasks.filter(t => t.status === 'inprogress').length },
    { name: 'In review',   count: tasks.filter(t => t.status === 'inreview').length },
    { name: 'Done',        count: tasks.filter(t => t.status === 'done').length }
  ];

  const priorityData = [
    { name: 'High',   count: tasks.filter(t => t.priority === 'high').length },
    { name: 'Medium', count: tasks.filter(t => t.priority === 'medium').length },
    { name: 'Low',    count: tasks.filter(t => t.priority === 'low').length }
  ];

  const totalPoints = tasks.reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const donePoints  = tasks.filter(t => t.status === 'done').reduce((acc, t) => acc + (t.storyPoints || 0), 0);
  const completionRate = totalPoints > 0 ? Math.round((donePoints / totalPoints) * 100) : 0;

  const velocityData = [
    { day: 'Day 1',  points: Math.round(donePoints * 0.1) },
    { day: 'Day 3',  points: Math.round(donePoints * 0.25) },
    { day: 'Day 5',  points: Math.round(donePoints * 0.4) },
    { day: 'Day 7',  points: Math.round(donePoints * 0.55) },
    { day: 'Day 9',  points: Math.round(donePoints * 0.7) },
    { day: 'Day 11', points: Math.round(donePoints * 0.88) },
    { day: 'Today',  points: donePoints }
  ];

  const statCards = [
    { label: 'Total tasks',       value: tasks.length },
    { label: 'Completed',         value: tasks.filter(t => t.status === 'done').length },
    { label: 'Story points done', value: `${donePoints}/${totalPoints}` },
    { label: 'Completion rate',   value: `${completionRate}%` }
  ];

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      <Sidebar />
      <div className="flex-1 overflow-y-auto p-6">
        <h1 className="text-lg font-semibold text-gray-900 mb-1">Analytics</h1>
        <p className="text-sm text-gray-500 mb-6">
          {activeProject ? `${activeProject.sprintName} — performance overview` : 'Select a project to view analytics'}
        </p>

        <div className="grid grid-cols-4 gap-4 mb-6">
          {statCards.map(card => (
            <div key={card.label} className="bg-white rounded-xl border border-gray-200 p-4">
              <p className="text-xs text-gray-500 mb-2">{card.label}</p>
              <p className="text-2xl font-semibold text-gray-900">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Task status breakdown</p>
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={statusData} barSize={32}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                  cursor={{ fill: '#f9fafb' }}
                />
                <Bar dataKey="count" fill="#3b82f6" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <p className="text-sm font-medium text-gray-700 mb-4">Sprint velocity (story points)</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={velocityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="day" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                />
                <Line
                  type="monotone"
                  dataKey="points"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ r: 4, fill: '#3b82f6', strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <p className="text-sm font-medium text-gray-700 mb-4">Priority distribution</p>
          <ResponsiveContainer width="100%" height={140}>
            <BarChart data={priorityData} layout="vertical" barSize={24}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" horizontal={false} />
              <XAxis type="number" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} allowDecimals={false} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} width={55} />
              <Tooltip
                contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                cursor={{ fill: '#f9fafb' }}
              />
              <Bar dataKey="count" fill="#8b5cf6" radius={[0, 6, 6, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsPage;
