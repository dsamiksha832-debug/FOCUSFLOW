import React, { useState } from 'react';
import { Plus, CheckCircle2, Trash2, Flame, Calendar, Sparkles, Filter, Tag } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function TasksHabitsView() {
  const { tasks, habits, addTask, toggleTask, deleteTask, toggleHabit, triggerSound } = useApp();

  const [activeTab, setActiveTab] = useState('all');
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Study');
  const [newPriority, setNewPriority] = useState('Medium');
  const [newDetail, setNewDetail] = useState('');

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), newCategory, newPriority, newDetail.trim());
    setNewTitle('');
    setNewDetail('');
  };

  const filteredTasks = tasks.filter(t => {
    if (activeTab === 'pending') return !t.completed;
    if (activeTab === 'completed') return t.completed;
    if (activeTab === 'priority') return t.priority === 'High';
    return true;
  });

  const todayStr = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8 pb-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Tasks & Habit Chains</h2>
          <p className="text-xs text-gray-400">Organize your daily studies and build consistent habits</p>
        </div>
      </div>

      {/* Grid: Create Task & Task List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Task List (2 cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
            {/* Filter Tabs */}
            <div className="flex items-center gap-2 border-b border-white/10 pb-3 overflow-x-auto">
              {[
                { id: 'all', label: `All (${tasks.length})` },
                { id: 'pending', label: `Pending (${tasks.filter(t => !t.completed).length})` },
                { id: 'completed', label: `Completed (${tasks.filter(t => t.completed).length})` },
                { id: 'priority', label: `High Priority (${tasks.filter(t => t.priority === 'High').length})` }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    triggerSound('click');
                    setActiveTab(tab.id);
                  }}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                    activeTab === tab.id
                      ? 'bg-indigo-500 text-white'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Tasks Items */}
            {filteredTasks.length === 0 ? (
              <div className="text-center py-10 text-gray-400 text-sm">
                No tasks found in this section.
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTasks.map(t => (
                  <div
                    key={t.id}
                    className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                      t.completed
                        ? 'bg-emerald-950/20 border-emerald-500/20 opacity-75'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div className="flex items-center gap-3.5">
                      <button
                        onClick={() => toggleTask(t.id)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-all ${
                          t.completed
                            ? 'bg-emerald-500 border-emerald-400 text-white'
                            : 'border-gray-400 hover:border-indigo-400 text-transparent'
                        }`}
                      >
                        ✓
                      </button>

                      <div>
                        <span className={`text-sm font-semibold block ${t.completed ? 'line-through text-gray-400' : 'text-white'}`}>
                          {t.title}
                        </span>
                        {t.detail && <p className="text-xs text-gray-400">{t.detail}</p>}
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300">
                            {t.category}
                          </span>
                          <span className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                            t.priority === 'High' ? 'bg-red-500/20 text-red-300' : 'bg-amber-500/20 text-amber-300'
                          }`}>
                            {t.priority}
                          </span>
                        </div>
                      </div>
                    </div>

                    <button
                      onClick={() => deleteTask(t.id)}
                      className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                      title="Delete task"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Add Task Form & Habit Tracker Column */}
        <div className="space-y-6">
          {/* Add Task Form */}
          <form onSubmit={handleCreateTask} className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Plus size={18} className="text-indigo-400" /> Add New Task
            </h3>

            <div>
              <input
                type="text"
                placeholder="Task title..."
                className="input-field text-sm"
                value={newTitle}
                onChange={e => setNewTitle(e.target.value)}
                required
              />
            </div>

            <div>
              <input
                type="text"
                placeholder="Optional details / notes..."
                className="input-field text-xs"
                value={newDetail}
                onChange={e => setNewDetail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <select
                value={newCategory}
                onChange={e => setNewCategory(e.target.value)}
                className="input-field text-xs bg-slate-900"
              >
                <option value="Study">Study</option>
                <option value="Project">Project</option>
                <option value="Exam">Exam</option>
                <option value="Personal">Personal</option>
              </select>

              <select
                value={newPriority}
                onChange={e => setNewPriority(e.target.value)}
                className="input-field text-xs bg-slate-900"
              >
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>

            <button type="submit" className="w-full btn btn-primary py-2.5 text-xs">
              + Save Task (+25 XP)
            </button>
          </form>

          {/* Habit Tracker Card */}
          <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold text-white flex items-center gap-2">
                <Flame size={18} className="text-amber-400" /> Habit Chains
              </h3>
              <span className="text-xs text-amber-400 font-mono">+15 XP Each</span>
            </div>

            <div className="space-y-2.5 pt-1">
              {habits.map(h => {
                const isChecked = h.history.includes(todayStr);
                return (
                  <div
                    key={h.id}
                    onClick={() => toggleHabit(h.id)}
                    className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                      isChecked
                        ? 'bg-amber-950/20 border-amber-500/30'
                        : 'bg-white/5 border-white/10 hover:bg-white/10'
                    }`}
                  >
                    <div>
                      <span className="text-xs font-semibold text-white block">{h.title}</span>
                      <span className="text-[10px] text-gray-400">{h.category}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-amber-400 flex items-center gap-1 font-mono">
                        <Flame size={12} className="fill-amber-400" /> {h.streak}d
                      </span>
                      <div className={`w-5 h-5 rounded-md border flex items-center justify-center ${
                        isChecked ? 'bg-amber-500 border-amber-400 text-white' : 'border-gray-500'
                      }`}>
                        {isChecked && '✓'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
