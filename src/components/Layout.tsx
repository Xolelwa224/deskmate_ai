import { useState } from 'react';
import { Bell, Menu, X, Check, CheckCheck, LogOut } from 'lucide-react';
import { Logo } from './ui/Logo';
import { Badge } from './ui/Badge';
import { useStore } from '../store/StoreContext';
import { formatDateShort } from '../utils/format';
import { navItems, groupLabels } from '../config/nav';
import type { NavItem } from '../config/nav';

interface SidebarProps {
  active: string;
  onNavigate: (id: string) => void;
  onExit: () => void;
  onClose?: () => void;
  mobile?: boolean;
}

export function Sidebar({ active, onNavigate, onExit, onClose, mobile }: SidebarProps) {
  const groups: NavItem['group'][] = ['main', 'management', 'tools'];

  return (
    <div className="flex flex-col h-full bg-charcoal-900 border-r border-charcoal-700/50 w-64 shrink-0">
      <div className="flex items-center justify-between px-4 py-4 border-b border-charcoal-700/50">
        <Logo />
        {mobile && (
          <button onClick={onClose} className="p-1.5 rounded-lg text-charcoal-400 hover:bg-charcoal-800">
            <X size={20} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto py-3 px-2.5 space-y-5">
        {groups.map((group) => (
          <div key={group}>
            <p className="text-[10px] font-semibold text-charcoal-500 uppercase tracking-wider px-3 mb-1.5">{groupLabels[group]}</p>
            <div className="space-y-0.5">
              {navItems.filter((item) => item.group === group).map((item) => {
                const Icon = item.icon;
                const isActive = active === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => { onNavigate(item.id); onClose?.(); }}
                    className={`flex items-center gap-3 w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${isActive ? 'bg-terracotta-600/15 text-terracotta-300' : 'text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-800/60'}`}
                  >
                    <Icon size={18} className={isActive ? 'text-terracotta-400' : ''} />
                    <span className="flex-1 text-left">{item.label}</span>
                    {isActive && <span className="w-1.5 h-1.5 rounded-full bg-terracotta-400" />}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-charcoal-700/50 p-3">
        <div className="flex items-center gap-3 px-2 py-2 mb-2">
          <div className="w-9 h-9 rounded-full bg-terracotta-600/20 border border-terracotta-600/30 flex items-center justify-center text-terracotta-300 font-semibold text-sm">
            XL
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-cream-100 truncate">Xolelwa Lubisi</p>
            <p className="text-xs text-charcoal-500 truncate">Project Consultant</p>
          </div>
        </div>
        <button
          onClick={onExit}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm font-medium text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-800/60 transition-colors"
        >
          <LogOut size={16} />
          Back to Website
        </button>
      </div>
    </div>
  );
}

interface TopBarProps {
  title: string;
  onMenuClick: () => void;
  onNavigate: (id: string) => void;
}

export function TopBar({ title, onMenuClick, onNavigate }: TopBarProps) {
  const { notifications, markNotificationRead, markAllNotificationsRead } = useStore();
  const [notifOpen, setNotifOpen] = useState(false);
  const unread = notifications.filter((n) => !n.read);

  return (
    <header className="sticky top-0 z-30 bg-charcoal-800/95 backdrop-blur-sm border-b border-charcoal-700/50 px-4 sm:px-6 py-3 flex items-center gap-3">
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg text-charcoal-300 hover:bg-charcoal-700/60"
      >
        <Menu size={20} />
      </button>

      <h1 className="text-lg font-display font-bold text-cream-100 flex-1 truncate">{title}</h1>

      <div className="relative">
        <button
          onClick={() => setNotifOpen(!notifOpen)}
          className="relative p-2 rounded-lg text-charcoal-300 hover:bg-charcoal-700/60 transition-colors"
        >
          <Bell size={20} />
          {unread.length > 0 && (
            <span className="absolute top-1 right-1 w-4 h-4 bg-terracotta-500 text-cream-50 text-[10px] font-bold rounded-full flex items-center justify-center">
              {unread.length}
            </span>
          )}
        </button>

        {notifOpen && (
          <>
            <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
            <div className="absolute right-0 top-12 z-50 w-80 sm:w-96 bg-charcoal-800 border border-charcoal-700 rounded-xl shadow-elevated animate-slide-down overflow-hidden">
              <div className="flex items-center justify-between px-4 py-3 border-b border-charcoal-700/60">
                <span className="text-sm font-display font-bold text-cream-100">Notifications</span>
                {unread.length > 0 && (
                  <button
                    onClick={markAllNotificationsRead}
                    className="text-xs text-terracotta-400 hover:text-terracotta-300 flex items-center gap-1"
                  >
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="max-h-96 overflow-y-auto">
                {notifications.length === 0 ? (
                  <p className="text-sm text-charcoal-500 text-center py-8">No notifications</p>
                ) : (
                  notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => markNotificationRead(n.id)}
                      className={`w-full text-left px-4 py-3 border-b border-charcoal-700/40 hover:bg-charcoal-700/30 transition-colors ${!n.read ? 'bg-terracotta-600/5' : ''}`}
                    >
                      <div className="flex items-start gap-2.5">
                        <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${n.read ? 'bg-charcoal-600' : 'bg-terracotta-500'}`} />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-cream-100 leading-snug">{n.message}</p>
                          <p className="text-xs text-charcoal-500 mt-1">{formatDateShort(n.date)}</p>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
              <div className="px-4 py-2.5 border-t border-charcoal-700/60">
                <button
                  onClick={() => { setNotifOpen(false); onNavigate('enquiries'); }}
                  className="text-xs text-charcoal-400 hover:text-cream-100 flex items-center gap-1.5"
                >
                  <Check size={12} /> View all enquiries
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </header>
  );
}

interface MobileNavProps {
  active: string;
  onNavigate: (id: string) => void;
}

export function MobileNav({ active, onNavigate }: MobileNavProps) {
  const quickItems = navItems.filter((item) =>
    ['dashboard', 'projects', 'tasks', 'calendar', 'ai-assistant'].includes(item.id)
  );

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-charcoal-900/95 backdrop-blur-sm border-t border-charcoal-700/50 px-1.5 py-1.5 flex items-center justify-around">
      {quickItems.map((item) => {
        const Icon = item.icon;
        const isActive = active === item.id;
        return (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`flex flex-col items-center gap-0.5 px-2 py-1.5 rounded-lg transition-colors ${isActive ? 'text-terracotta-400' : 'text-charcoal-500'}`}
          >
            <Icon size={20} />
            <span className="text-[9px] font-medium">{item.label.split(' ')[0]}</span>
          </button>
        );
      })}
    </nav>
  );
}
