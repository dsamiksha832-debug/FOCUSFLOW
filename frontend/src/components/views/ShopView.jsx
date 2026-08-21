import React from 'react';
import { ShoppingBag, Sparkles, Check, Lock, Award, Shield } from 'lucide-react';
import { useApp, THEME_LIST } from '../../context/AppContext';

const AVATAR_STAGES = [
  { minLevel: 1, title: 'Seedling', emoji: '🌱', desc: 'Sowing the seeds of focus' },
  { minLevel: 3, title: 'Sprout', emoji: '🌿', desc: 'Growing daily discipline' },
  { minLevel: 5, title: 'Mighty Oak', emoji: '🌳', desc: 'Deep rooted concentration' },
  { minLevel: 8, title: 'Summit Mountain', emoji: '⛰️', desc: 'Unshakable mental strength' },
  { minLevel: 12, title: 'Rising Phoenix', emoji: '🦅', desc: 'Master of deep focus' },
  { minLevel: 20, title: 'Cosmic Dragon', emoji: '🐉', desc: 'Legendary productivity god' }
];

export default function ShopView() {
  const { userState, switchTheme, getAvatar, triggerSound } = useApp();
  const currentAvatar = getAvatar();

  return (
    <div className="max-w-6xl mx-auto px-4 lg:px-8 space-y-8 pb-12">
      {/* Header Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-white/10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-gradient-to-r from-purple-900/40 via-indigo-900/30 to-slate-900/50">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase tracking-wider mb-2">
            <ShoppingBag size={14} /> REWARD SHOP & EVOLUTION
          </div>
          <h2 className="text-2xl font-extrabold text-white">Spend XP & Unlock Themes</h2>
          <p className="text-xs text-gray-300 mt-1 max-w-xl">
            Turn your study focus hours into real rewards. Unlock high-contrast custom theme skins and evolve your avatar stage!
          </p>
        </div>

        <div className="glass-panel p-4 rounded-xl text-center min-w-[160px] border border-amber-500/30 bg-amber-950/20">
          <span className="text-xs text-amber-300 font-medium uppercase tracking-wider block">Available Balance</span>
          <span className="text-2xl font-bold text-amber-400 font-mono">{userState.xp} XP</span>
        </div>
      </div>

      {/* Avatar Evolution Timeline Section */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-white flex items-center gap-2">
              <Award size={20} className="text-indigo-400" /> Avatar Evolution Stages
            </h3>
            <p className="text-xs text-gray-400">Your avatar transforms as you level up</p>
          </div>
          <span className="text-xs font-bold text-indigo-300 bg-indigo-500/20 px-3 py-1 rounded-full border border-indigo-500/30 font-mono">
            Current: Level {userState.level} ({currentAvatar.title})
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          {AVATAR_STAGES.map(stage => {
            const isUnlocked = userState.level >= stage.minLevel;
            return (
              <div
                key={stage.minLevel}
                className={`p-4 rounded-xl border text-center space-y-2 transition-all ${
                  isUnlocked
                    ? 'bg-indigo-950/20 border-indigo-500/40 shadow-lg shadow-indigo-500/10'
                    : 'bg-white/5 border-white/10 opacity-50'
                }`}
              >
                <div className="text-3xl">{stage.emoji}</div>
                <div>
                  <h4 className="text-xs font-bold text-white">{stage.title}</h4>
                  <span className="text-[10px] text-gray-400 font-mono">Lvl {stage.minLevel}+</span>
                </div>
                {isUnlocked ? (
                  <span className="text-[10px] text-emerald-400 font-semibold block">Unlocked</span>
                ) : (
                  <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                    <Lock size={10} /> Locked
                  </span>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Theme Skins Shop Grid */}
      <div className="glass-panel p-6 rounded-2xl border border-white/10 space-y-4">
        <div>
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles size={20} className="text-purple-400" /> Unlockable Theme Skins
          </h3>
          <p className="text-xs text-gray-400">Customize the vibe of your workspace</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
          {THEME_LIST.map(theme => {
            const isUnlocked = userState.unlockedThemes.includes(theme.id);
            const isActive = userState.activeTheme === theme.id;
            const canAfford = userState.xp >= theme.price;

            return (
              <div
                key={theme.id}
                className={`p-4 rounded-xl border space-y-3 transition-all ${
                  isActive
                    ? 'bg-indigo-500/20 border-indigo-400 ring-2 ring-indigo-500/30'
                    : 'bg-white/5 border-white/10 hover:border-white/20'
                }`}
              >
                <div className="h-16 rounded-lg overflow-hidden border border-white/10" style={{ background: theme.preview }} />

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-sm font-bold text-white">{theme.name}</h4>
                    <span className="text-xs text-amber-400 font-mono font-semibold">
                      {theme.price === 0 ? 'Free Default' : `${theme.price} XP`}
                    </span>
                  </div>

                  {isActive ? (
                    <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30 flex items-center gap-1">
                      <Check size={12} /> Active
                    </span>
                  ) : isUnlocked ? (
                    <button
                      onClick={() => switchTheme(theme.id)}
                      className="btn btn-secondary text-xs py-1 px-3"
                    >
                      Use Theme
                    </button>
                  ) : (
                    <button
                      onClick={() => switchTheme(theme.id)}
                      disabled={!canAfford}
                      className={`btn text-xs py-1 px-3 ${
                        canAfford ? 'btn-primary' : 'bg-gray-700 text-gray-400 cursor-not-allowed'
                      }`}
                    >
                      {canAfford ? 'Unlock' : `Need ${theme.price - userState.xp} XP`}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
