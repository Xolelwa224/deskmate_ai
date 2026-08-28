import { useState } from 'react';
import {
  HardHat, ClipboardCheck, FileText, Wallet, CheckSquare, BarChart3,
  Users, AlertTriangle, TrendingUp, Clock, Plus, ArrowRight, Sparkles,
} from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { DonutChart, BarChart, GroupedBarChart } from '../components/ui/Charts';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrency, formatCurrencyFull, formatDate, daysFromNow, isOverdue } from '../utils/format';
import { costCategories } from '../data/seed';
import type { ProjectType, Task } from '../types';

interface DashboardProps {
  onNavigate: (id: string) => void;
  onOpenProject: (id: string) => void;
}

export function Dashboard({ onNavigate, onOpenProject }: DashboardProps) {
  const { projects, tasks, quotations, inspections, expenses, notifications, addProject, addClient, addExpense, addTask } = useStore();
  const [modal, setModal] = useState<string | null>(null);

  const activeProjects = projects.filter((p) => p.status !== 'Completed');
  const onTrack = projects.filter((p) => p.status === 'On Track').length;
  const atRisk = projects.filter((p) => p.status === 'At Risk').length;
  const completed = projects.filter((p) => p.status === 'Completed').length;
  const totalValue = projects.reduce((sum, p) => sum + p.budget, 0);

  const upcomingInspections = inspections.filter((i) => daysFromNow(i.date) >= 0).length;
  const pendingQuotes = quotations.filter((q) => q.status === 'Draft' || q.status === 'Sent').length;
  const budgetAlerts = projects.filter((p) => p.health.budget === 'Over Budget').length;
  const tasksDueToday = tasks.filter((t) => t.status !== 'Completed' && daysFromNow(t.dueDate) <= 0).length;

  const projectsByCategory = [
    { label: 'Residential', value: projects.filter((p) => p.type === 'Residential' || p.type === 'New Construction').length, color: '#d96e36' },
    { label: 'Commercial', value: projects.filter((p) => p.type === 'Commercial').length, color: '#808f54' },
    { label: 'Renovation', value: projects.filter((p) => p.type === 'Renovation').length, color: '#c5a978' },
    { label: 'Infrastructure', value: projects.filter((p) => p.type === 'Infrastructure').length, color: '#e28a55' },
    { label: 'Interior', value: projects.filter((p) => p.type === 'Interior').length, color: '#9eac6f' },
  ];

  const budgetVsActual = activeProjects.slice(0, 5).map((p) => ({
    label: p.name.split(' ').slice(0, 2).join(' '),
    budget: p.budget / 1000000,
    actual: p.actualCost / 1000000,
  }));

  const upcomingTasks = tasks
    .filter((t) => t.status !== 'Completed')
    .sort((a, b) => daysFromNow(a.dueDate) - daysFromNow(b.dueDate))
    .slice(0, 5);

  const recentNotifications = notifications.slice(0, 4);

  const quickActions = [
    { label: 'New Project', icon: HardHat, modal: 'project', color: 'text-terracotta-400' },
    { label: 'New Client', icon: Users, modal: 'client', color: 'text-sand-400' },
    { label: 'New Quotation', icon: FileText, action: () => onNavigate('quotations'), color: 'text-olive-400' },
    { label: 'Site Inspection', icon: ClipboardCheck, action: () => onNavigate('inspections'), color: 'text-terracotta-400' },
    { label: 'Add Expense', icon: Wallet, modal: 'expense', color: 'text-sand-400' },
    { label: 'Add Task', icon: CheckSquare, modal: 'task', color: 'text-olive-400' },
    { label: 'Generate Report', icon: BarChart3, action: () => onNavigate('reports'), color: 'text-terracotta-400' },
  ];

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="p-4 sm:p-6 space-y-6 animate-fade-in pb-20 lg:pb-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-display font-bold text-cream-100">
            {greeting}, Xolelwa <span className="inline-block animate-wave">👋</span>
          </h2>
          <p className="text-sm text-charcoal-400 mt-1">Here's what's happening across your projects today.</p>
        </div>
        <Button onClick={() => onNavigate('ai-assistant')} variant="outline" size="md">
          <Sparkles size={16} /> Ask BuildAssist
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        <StatCard label="Active Projects" value={activeProjects.length} icon={<HardHat size={20} />} accent="terracotta" />
        <StatCard label="Upcoming Inspections" value={upcomingInspections} icon={<ClipboardCheck size={20} />} accent="sand" />
        <StatCard label="Pending Quotations" value={pendingQuotes} icon={<FileText size={20} />} accent="olive" />
        <StatCard label="Budget Alerts" value={budgetAlerts} icon={<AlertTriangle size={20} />} accent="red" />
        <StatCard label="Tasks Due Today" value={tasksDueToday} icon={<CheckSquare size={20} />} accent="terracotta" />
      </div>

      {/* Quick actions */}
      <Card className="p-4">
        <h3 className="text-sm font-display font-semibold text-cream-100 mb-3">Quick Actions</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-2.5">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                onClick={() => action.modal ? setModal(action.modal) : action.action?.()}
                className="flex flex-col items-center gap-2 p-3 rounded-lg bg-charcoal-900/50 border border-charcoal-700/40 hover:border-terracotta-600/40 hover:bg-charcoal-700/30 transition-all duration-200 active:scale-95"
              >
                <Icon size={22} className={action.color} />
                <span className="text-xs font-medium text-charcoal-300 text-center leading-tight">{action.label}</span>
              </button>
            );
          })}
        </div>
      </Card>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="p-5">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Projects by Category</h3>
          <DonutChart
            data={projectsByCategory}
            centerValue={String(projects.length)}
            centerLabel="Total"
          />
        </Card>

        <Card className="p-5 lg:col-span-2">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Budget vs Actual (R Millions)</h3>
          <GroupedBarChart
            labels={budgetVsActual.map((d) => d.label)}
            series={[
              { name: 'Budget', values: budgetVsActual.map((d) => d.budget), color: '#57534e' },
              { name: 'Actual', values: budgetVsActual.map((d) => d.actual), color: '#d96e36' },
            ]}
            formatValue={(v) => `R${v.toFixed(1)}M`}
          />
        </Card>
      </div>

      {/* Project overview */}
      <Card className="p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-display font-semibold text-cream-100">Project Overview</h3>
          <Button variant="ghost" size="sm" onClick={() => onNavigate('projects')}>
            View All <ArrowRight size={14} />
          </Button>
        </div>
        <div className="space-y-3">
          {projects.slice(0, 4).map((project) => (
            <button
              key={project.id}
              onClick={() => onOpenProject(project.id)}
              className="w-full flex items-center gap-4 p-3 rounded-lg hover:bg-charcoal-700/30 transition-colors text-left"
            >
              <img src={project.image} alt="" className="w-14 h-14 rounded-lg object-cover shrink-0" />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-cream-100 truncate">{project.name}</span>
                  <Badge variant={statusToVariant(project.status)} size="sm">{project.status}</Badge>
                </div>
                <div className="flex items-center gap-3 mt-1.5">
                  <ProgressBar value={project.progress} size="sm" showLabel />
                  <span className="text-xs text-charcoal-500 hidden sm:inline">{formatCurrency(project.budget)}</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </Card>

      {/* Bottom row: tasks + notifications */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-cream-100">Upcoming Tasks</h3>
            <Button variant="ghost" size="sm" onClick={() => onNavigate('tasks')}>
              View All <ArrowRight size={14} />
            </Button>
          </div>
          <div className="space-y-2">
            {upcomingTasks.map((task) => {
              const days = daysFromNow(task.dueDate);
              const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
              return (
                <div key={task.id} className="flex items-center gap-3 p-2.5 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30">
                  <div className={`w-2 h-2 rounded-full shrink-0 ${overdue ? 'bg-red-500' : days <= 1 ? 'bg-terracotta-500' : 'bg-olive-500'}`} />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-cream-100 truncate">{task.name}</p>
                    <p className="text-xs text-charcoal-500 truncate">{task.project}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className={`text-xs font-medium ${overdue ? 'text-red-400' : 'text-charcoal-400'}`}>{formatDate(task.dueDate)}</p>
                    <Badge variant={statusToVariant(task.status)} size="sm">{task.status}</Badge>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="p-5">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-display font-semibold text-cream-100">Recent Notifications</h3>
          </div>
          <div className="space-y-2">
            {recentNotifications.map((notif) => (
              <div key={notif.id} className="flex items-start gap-3 p-2.5 rounded-lg hover:bg-charcoal-700/20 transition-colors">
                <div className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${notif.read ? 'bg-charcoal-600' : 'bg-terracotta-500'}`} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-cream-100 leading-snug">{notif.message}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{formatDate(notif.date)}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <StatCard label="Projects On Track" value={onTrack} icon={<TrendingUp size={20} />} accent="olive" />
        <StatCard label="Projects At Risk" value={atRisk} icon={<AlertTriangle size={20} />} accent="red" />
        <StatCard label="Completed Projects" value={completed} icon={<CheckSquare size={20} />} accent="olive" />
        <StatCard label="Total Project Value" value={formatCurrency(totalValue)} icon={<Wallet size={20} />} accent="terracotta" />
      </div>

      {/* Modals */}
      {modal === 'project' && <NewProjectModal onClose={() => setModal(null)} onCreate={addProject} />}
      {modal === 'client' && <NewClientModal onClose={() => setModal(null)} onCreate={addClient} />}
      {modal === 'expense' && <NewExpenseModal onClose={() => setModal(null)} onCreate={addExpense} projects={projects.map((p) => p.name)} />}
      {modal === 'task' && <NewTaskModal onClose={() => setModal(null)} onCreate={addTask} projects={projects.map((p) => p.name)} />}
    </div>
  );
}

function NewProjectModal({ onClose, onCreate }: { onClose: () => void; onCreate: (p: any) => void }) {
  const [form, setForm] = useState({
    name: '', type: 'Residential' as ProjectType, location: '', description: '',
    client: '', manager: 'Xolelwa Lubisi', startDate: '', expectedCompletion: '',
    budget: '', actualCost: '0', progress: '0', status: 'Planning' as const, image: '',
  });

  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.location.trim()) return;
    onCreate({
      ...form,
      budget: Number(form.budget) || 0,
      actualCost: Number(form.actualCost) || 0,
      progress: Number(form.progress) || 0,
      image: form.image || 'https://images.pexels.com/photos/69483/pexels-photo-69483.jpeg?auto=compress&cs=tinysrgb&h=650&w=940',
    });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="New Project" size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Create Project</Button></>}
    >
      <div className="space-y-4">
        <Input label="Project Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="e.g. Riverside Family Residence" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Project Type" value={form.type} onChange={(v) => set('type', v)} options={[
            { value: 'Residential', label: 'Residential' }, { value: 'Commercial', label: 'Commercial' },
            { value: 'Renovation', label: 'Renovation' }, { value: 'Infrastructure', label: 'Infrastructure' },
            { value: 'Interior', label: 'Interior' }, { value: 'New Construction', label: 'New Construction' },
          ]} />
          <Input label="Location" value={form.location} onChange={(v) => set('location', v)} required placeholder="e.g. Mbombela" />
        </div>
        <Input label="Client Name" value={form.client} onChange={(v) => set('client', v)} placeholder="Client or company name" />
        <Textarea label="Description" value={form.description} onChange={(v) => set('description', v)} rows={3} placeholder="Project description..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Start Date" type="date" value={form.startDate} onChange={(v) => set('startDate', v)} />
          <Input label="Expected Completion" type="date" value={form.expectedCompletion} onChange={(v) => set('expectedCompletion', v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <Input label="Budget (R)" type="number" value={form.budget} onChange={(v) => set('budget', v)} placeholder="0" />
          <Input label="Actual Cost (R)" type="number" value={form.actualCost} onChange={(v) => set('actualCost', v)} placeholder="0" />
          <Input label="Progress (%)" type="number" value={form.progress} onChange={(v) => set('progress', v)} placeholder="0" />
        </div>
      </div>
    </Modal>
  );
}

function NewClientModal({ onClose, onCreate }: { onClose: () => void; onCreate: (c: any) => void }) {
  const [form, setForm] = useState({
    name: '', company: '', email: '', phone: '', project: '', projectValue: '', status: 'Prospect' as const,
    lastCommunication: new Date().toISOString().split('T')[0],
  });
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onCreate({ ...form, projectValue: Number(form.projectValue) || 0 });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="New Client" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Client</Button></>}
    >
      <div className="space-y-4">
        <Input label="Client Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="Full name" />
        <Input label="Company" value={form.company} onChange={(v) => set('company', v)} placeholder="Company name" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Email" type="email" value={form.email} onChange={(v) => set('email', v)} required placeholder="email@example.com" />
          <Input label="Phone" value={form.phone} onChange={(v) => set('phone', v)} placeholder="082 123 4567" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Project" value={form.project} onChange={(v) => set('project', v)} placeholder="Associated project" />
          <Input label="Project Value (R)" type="number" value={form.projectValue} onChange={(v) => set('projectValue', v)} placeholder="0" />
        </div>
        <Select label="Status" value={form.status} onChange={(v) => set('status', v)} options={[
          { value: 'Active', label: 'Active' }, { value: 'Prospect', label: 'Prospect' }, { value: 'Inactive', label: 'Inactive' },
        ]} />
      </div>
    </Modal>
  );
}

function NewExpenseModal({ onClose, onCreate, projects }: { onClose: () => void; onCreate: (e: any) => void; projects: string[] }) {
  const [form, setForm] = useState({
    project: '', category: 'Labour', description: '', amount: '', date: new Date().toISOString().split('T')[0],
  });
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.description.trim() || !form.amount) return;
    onCreate({ ...form, amount: Number(form.amount) || 0 });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Add Expense" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Expense</Button></>}
    >
      <div className="space-y-4">
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project"
          options={projects.map((p) => ({ value: p, label: p }))} />
        <Select label="Category" value={form.category} onChange={(v) => set('category', v)}
          options={costCategories.map((c) => ({ value: c, label: c }))} />
        <Input label="Description" value={form.description} onChange={(v) => set('description', v)} required placeholder="e.g. Ready-mix concrete delivery" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Amount (R)" type="number" value={form.amount} onChange={(v) => set('amount', v)} required placeholder="0" />
          <Input label="Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
        </div>
      </div>
    </Modal>
  );
}

function NewTaskModal({ onClose, onCreate, projects }: { onClose: () => void; onCreate: (t: Omit<Task, 'id'>) => void; projects: string[] }) {
  const [form, setForm] = useState({
    name: '', project: '', assignedTo: 'Xolelwa Lubisi', priority: 'Medium' as const,
    dueDate: '', status: 'To Do' as const,
  });
  const set = (key: string, value: string) => setForm((prev) => ({ ...prev, [key]: value }));

  const submit = () => {
    if (!form.name.trim() || !form.project) return;
    onCreate(form);
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Add Task" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Task</Button></>}
    >
      <div className="space-y-4">
        <Input label="Task Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="e.g. Foundation inspection" />
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project"
          options={projects.map((p) => ({ value: p, label: p }))} />
        <Input label="Assigned To" value={form.assignedTo} onChange={(v) => set('assignedTo', v)} placeholder="Person name" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Priority" value={form.priority} onChange={(v) => set('priority', v)} options={[
            { value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' },
            { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' },
          ]} />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={(v) => set('dueDate', v)} />
        </div>
      </div>
    </Modal>
  );
}
