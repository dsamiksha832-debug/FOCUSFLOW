import React, { useState } from 'react';
import { X, UserCheck, LogIn, UserPlus, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { api } from '../../services/api';

export default function AuthModal({ isOpen, onClose }) {
  const { user, setUser, triggerSound, addToast } = useApp();
  const [isLoginView, setIsLoginView] = useState(true);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setLoading(true);

    try {
      if (isLoginView) {
        const res = await api.login({ email, password });
        api.setToken(res.user.token);
        setUser(res.user);
        localStorage.setItem('focusflow_user', JSON.stringify(res.user));
        triggerSound('fanfare');
        addToast(`Welcome back, ${res.user.name}!`, 'success');
      } else {
        const res = await api.signup({ name, email, password });
        api.setToken(res.user.token);
        setUser(res.user);
        localStorage.setItem('focusflow_user', JSON.stringify(res.user));
        triggerSound('fanfare');
        addToast(`Account created! Welcome, ${res.user.name}!`, 'success');
      }
      onClose();
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed');
      triggerSound('click');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    triggerSound('click');
    api.setToken('');
    setUser(null);
    localStorage.removeItem('focusflow_user');
    addToast('Logged out successfully');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in" onClick={onClose}>
      <div className="glass-panel w-full max-w-md p-6 sm:p-8 rounded-2xl border border-white/10 shadow-2xl relative" onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-white">
          <X size={20} />
        </button>

        {user ? (
          /* User Profile & Logout View */
          <div className="text-center space-y-4">
            <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-2xl font-bold text-white shadow-xl shadow-indigo-500/30">
              {user.name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">{user.name}</h3>
              <p className="text-xs text-gray-400 font-mono">{user.email}</p>
            </div>

            <div className="p-3 rounded-xl bg-white/5 border border-white/10 text-xs text-emerald-300 font-semibold flex items-center justify-center gap-2">
              <UserCheck size={16} /> Authenticated & Synced to Database
            </div>

            <button onClick={handleLogout} className="btn bg-red-500/20 text-red-300 hover:bg-red-500/30 w-full py-2.5 text-xs font-semibold">
              Log Out
            </button>
          </div>
        ) : (
          /* Login / Signup Form */
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="text-center space-y-1">
              <div className="w-12 h-12 mx-auto rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-2">
                <Shield size={24} />
              </div>
              <h3 className="text-xl font-bold text-white">
                {isLoginView ? 'Welcome Back to FocusFlow' : 'Create Student Account'}
              </h3>
              <p className="text-xs text-gray-400">
                {isLoginView ? 'Sign in to sync your focus sessions & XP' : 'Start your journey and save your focus streak'}
              </p>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-lg bg-red-500/20 border border-red-500/40 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle size={16} />
                <span>{errorMsg}</span>
              </div>
            )}

            {!isLoginView && (
              <div>
                <label className="text-xs font-semibold text-gray-300 block mb-1">Full Name</label>
                <input
                  type="text"
                  placeholder="e.g. Samiksha Deshmukh"
                  className="input-field text-sm"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  required
                />
              </div>
            )}

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
              <input
                type="email"
                placeholder="student@university.edu"
                className="input-field text-sm"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
              <input
                type="password"
                placeholder="••••••••"
                className="input-field text-sm"
                value={password}
                onChange={e => setPassword(e.target.value)}
                required
              />
            </div>

            <button type="submit" disabled={loading} className="btn btn-primary w-full py-3 text-sm">
              {loading ? 'Authenticating...' : isLoginView ? 'Sign In' : 'Create Account'}
            </button>

            <div className="text-center pt-2">
              <button
                type="button"
                onClick={() => {
                  triggerSound('click');
                  setIsLoginView(!isLoginView);
                  setErrorMsg('');
                }}
                className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold"
              >
                {isLoginView ? "Don't have an account? Sign up" : 'Already have an account? Sign in'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
