import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../app/store';
import { setActiveProject, fetchProjects, fetchProjectById } from '../features/projects/projectSlice';
import { logoutUser } from '../features/auth/authSlice';
import { resetProjects } from '../features/projects/projectSlice';
import api from '../services/api';

const Sidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const { user } = useSelector((s: RootState) => s.auth);
  const { projects, activeProject } = useSelector((s: RootState) => s.projects);
  const [showAddMember, setShowAddMember] = useState(false);
  const [memberEmail, setMemberEmail] = useState('');
  const [memberRole, setMemberRole] = useState('Member');
  const [addMsg, setAddMsg] = useState('');
  const [adding, setAdding] = useState(false);

  const canManageMembers = user?.role === 'Admin' || user?.role === 'Manager';

  const handleAddMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeProject) return;
    setAdding(true);
    setAddMsg('');
    try {
      await api.post(`/projects/${activeProject._id}/members`, {
        email: memberEmail,
        role: memberRole
      });

      // Fetch the full populated project to get real member names instantly
      await dispatch(fetchProjectById(activeProject._id));

      setAddMsg(`✓ ${memberEmail} added successfully!`);
      setMemberEmail('');
      setTimeout(() => { setAddMsg(''); setShowAddMember(false); }, 2000);
    } catch (err: any) {
      setAddMsg(`✗ ${err.response?.data?.message || 'Failed to add member'}`);
    } finally {
      setAdding(false);
    }
  };

  const handleLogout = () => {
    dispatch(resetProjects()); // clear project state immediately
    dispatch(logoutUser());
  };

  const navItems = [
    {
      path: '/dashboard', label: 'Board', icon: (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 16 16">
          <rect x="1" y="1" width="6" height="6" rx="1"/>
          <rect x="9" y="1" width="6" height="6" rx="1"/>
          <rect x="1" y="9" width="6" height="6" rx="1"/>
          <rect x="9" y="9" width="6" height="6" rx="1"/>
        </svg>
      )
    },
    {
      path: '/analytics', label: 'Analytics', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      )
    },
    {
      path: '/settings', label: 'Settings', icon: (
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )
    }
  ];

  return (
    <>
      <aside className="w-52 bg-gray-50 border-r border-gray-200 flex flex-col h-screen flex-shrink-0">
        <div className="px-4 py-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center text-white text-xs font-bold">T</div>
            <span className="text-sm font-semibold text-gray-800">TaskFlow</span>
          </div>
        </div>

        <div className="p-2 flex-1 overflow-y-auto">
          <p className="text-xs text-gray-400 px-2 py-2 uppercase tracking-wider font-medium">Navigation</p>
          {navItems.map(item => (
            <Link key={item.path} to={item.path}
              className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm mb-0.5 transition-colors ${
                location.pathname === item.path
                  ? 'bg-white text-gray-900 font-medium shadow-sm border border-gray-200'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}>
              {item.icon}
              {item.label}
            </Link>
          ))}

          <p className="text-xs text-gray-400 px-2 py-2 mt-3 uppercase tracking-wider font-medium">Projects</p>
          {projects.length === 0 ? (
            <p className="text-xs text-gray-400 px-3 py-2">No projects yet</p>
          ) : (
            projects.map(p => (
              <button key={p._id} onClick={() => dispatch(setActiveProject(p))}
                className={`w-full text-left flex items-center gap-2 px-3 py-2 rounded-lg text-xs mb-0.5 transition-colors ${
                  activeProject?._id === p._id
                    ? 'bg-blue-50 text-blue-700 font-medium'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}>
                <div className={`w-2 h-2 rounded-full flex-shrink-0 ${activeProject?._id === p._id ? 'bg-blue-500' : 'bg-gray-300'}`} />
                <span className="truncate">{p.name}</span>
              </button>
            ))
          )}

          {/* Add Member — only Admin/Manager of the active project */}
          {activeProject && canManageMembers && (
            <button onClick={() => setShowAddMember(true)}
              className="w-full mt-3 flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-indigo-600 hover:bg-indigo-50 transition-colors border border-dashed border-indigo-200">
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
              Add member
            </button>
          )}

          {/* Team list — shows real names immediately after add */}
          {activeProject?.members && activeProject.members.length > 0 && (
            <div className="mt-3 px-2">
              <p className="text-xs text-gray-400 uppercase tracking-wider font-medium mb-2">
                Team ({activeProject.members.length})
              </p>
              {activeProject.members.map((m: any, idx: number) => {
                const name = m.user?.name || m.user?.email || 'Loading...';
                const initial = name.charAt(0).toUpperCase();
                const isOnline = m.user?.isOnline || false;
                return (
                  <div key={m.user?._id || idx} className="flex items-center gap-2 py-1.5">
                    <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 flex-shrink-0">
                      {initial}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs text-gray-700 truncate font-medium">{name}</p>
                      <p className="text-xs text-gray-400">{m.role}</p>
                    </div>
                    <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${isOnline ? 'bg-green-400' : 'bg-gray-300'}`} />
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="p-3 border-t border-gray-200">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-semibold text-blue-700 flex-shrink-0">
              {user?.name?.charAt(0)?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-medium text-gray-800 truncate">{user?.name}</p>
              <p className="text-xs text-gray-400">{user?.role}</p>
            </div>
          </div>
          <button onClick={handleLogout}
            className="w-full text-xs text-red-500 hover:text-red-700 text-left px-2 py-1.5 rounded-lg hover:bg-red-50 transition-colors">
            Sign out
          </button>
        </div>
      </aside>

      {/* Add Member Modal */}
      {showAddMember && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl border border-gray-200 p-6 w-full max-w-sm shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold text-gray-900">Add team member</h2>
              <button onClick={() => { setShowAddMember(false); setAddMsg(''); setMemberEmail(''); }}
                className="text-gray-400 hover:text-gray-600">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4">
              <p className="text-xs text-blue-700 font-medium">
                Adding to: {activeProject?.name}
              </p>
              <p className="text-xs text-blue-500 mt-1">
                The user must already have a TaskFlow account with this email.
              </p>
            </div>

            <form onSubmit={handleAddMember} className="space-y-3">
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Email address</label>
                <input type="email" value={memberEmail}
                  onChange={e => setMemberEmail(e.target.value)}
                  placeholder="member@example.com" required
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="text-xs font-medium text-gray-700 mb-1 block">Role</label>
                <select value={memberRole} onChange={e => setMemberRole(e.target.value)}
                  className="w-full px-3 py-2.5 text-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                  <option value="Member">Member — can create and move tasks</option>
                  <option value="Manager">Manager — can delete tasks and add members</option>
                  <option value="Admin">Admin — full control</option>
                </select>
              </div>

              {addMsg && (
                <div className={`text-xs p-3 rounded-xl font-medium ${
                  addMsg.startsWith('✓')
                    ? 'bg-green-50 text-green-700 border border-green-200'
                    : 'bg-red-50 text-red-700 border border-red-200'
                }`}>{addMsg}</div>
              )}

              <div className="flex gap-2 pt-1">
                <button type="submit" disabled={adding}
                  className="flex-1 bg-blue-600 text-white py-2.5 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors disabled:opacity-60">
                  {adding ? 'Adding...' : 'Add member'}
                </button>
                <button type="button"
                  onClick={() => { setShowAddMember(false); setAddMsg(''); setMemberEmail(''); }}
                  className="flex-1 border border-gray-200 text-gray-600 py-2.5 rounded-xl text-sm hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;