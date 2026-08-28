import { useState } from 'react';
import { RotateCcw, User, Bell, Database, Info } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { useStore } from '../store/StoreContext';

export function Settings() {
  const { resetData, projects, clients, tasks } = useStore();
  const [confirmReset, setConfirmReset] = useState(false);

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Settings" description="Manage your account and application data" />

      <div className="space-y-4 max-w-2xl">
        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-terracotta-600/10 text-terracotta-400"><User size={20} /></div>
            <h3 className="text-sm font-display font-semibold text-cream-100">Account</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Name</span><span className="text-sm text-cream-100">Xolelwa Lubisi</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Role</span><span className="text-sm text-cream-100">Founder & Construction Project Consultant</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Email</span><span className="text-sm text-cream-100">demo@xolelwabuildconsult.com</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Account Type</span><Badge variant="info" size="sm">Demo Account</Badge></div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-sand-600/10 text-sand-400"><Database size={20} /></div>
            <h3 className="text-sm font-display font-semibold text-cream-100">Data</h3>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Projects</span><span className="text-sm text-cream-100">{projects.length}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Clients</span><span className="text-sm text-cream-100">{clients.length}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Tasks</span><span className="text-sm text-cream-100">{tasks.length}</span></div>
            <div className="pt-3 border-t border-charcoal-700/40">
              {!confirmReset ? (
                <Button variant="danger" size="sm" onClick={() => setConfirmReset(true)}><RotateCcw size={14} /> Reset All Data</Button>
              ) : (
                <div className="flex items-center gap-3">
                  <span className="text-sm text-charcoal-300">Are you sure? This will restore all demo data.</span>
                  <Button variant="danger" size="sm" onClick={() => { resetData(); setConfirmReset(false); }}>Yes, Reset</Button>
                  <Button variant="ghost" size="sm" onClick={() => setConfirmReset(false)}>Cancel</Button>
                </div>
              )}
            </div>
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2.5 rounded-lg bg-olive-600/10 text-olive-400"><Info size={20} /></div>
            <h3 className="text-sm font-display font-semibold text-cream-100">About</h3>
          </div>
          <p className="text-sm text-charcoal-300 leading-relaxed">Xolelwa BuildConsult is a demonstration portfolio application showcasing construction consulting and project management capabilities. All project data is sample data for demonstration purposes.</p>
          <p className="text-xs text-charcoal-500 mt-3">© 2026 Xolelwa BuildConsult. Demo portfolio application.</p>
        </Card>
      </div>
    </div>
  );
}
