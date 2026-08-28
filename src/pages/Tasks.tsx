import { useState } from 'react';
import { Plus, CheckSquare, Calendar, User, Flag } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatDate, daysFromNow, isOverdue } from '../utils/format';
import type { Task } from '../types';

export function Tasks() {
  const { tasks, projects, addTask, updateTask } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filters = [
    { value: 'all', label: 'All', count: tasks.length },
    { value: 'To Do', label: 'To Do', count: tasks.filter((t) => t.status === 'To Do').length },
    { value: 'In Progress', label: 'In Progress', count: tasks.filter((t) => t.status === 'In Progress').length },
    { value: 'Blocked', label: 'Blocked', count: tasks.filter((t) => t.status === 'Blocked').length },
    { value: 'Completed', label: 'Completed', count: tasks.filter((t) => t.status === 'Completed').length },
  ];

  const filtered = tasks.filter((t) => {
    const ms = !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.project.toLowerCase().includes(search.toLowerCase()) || t.assignedTo.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : t.status === filter;
    return ms && mf;
  }).sort((a, b) => {
    const order = { 'In Progress': 0, 'Blocked': 1, 'To Do': 2, 'Completed': 3 };
    return order[a.status] - order[b.status];
  });

  const statusOptions = ['To Do', 'In Progress', 'Blocked', 'Completed'];

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Tasks" description={`${tasks.length} tasks`} actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Add Task</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search tasks..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<CheckSquare size={48} />} title="No tasks found" description="Add a new task to get started." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Add Task</Button>} />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((task) => {
            const overdue = isOverdue(task.dueDate) && task.status !== 'Completed';
            const days = daysFromNow(task.dueDate);
            return (
              <Card key={task.id} className="p-4 hover:border-charcoal-600 transition-colors">
                <div className="flex items-start gap-3">
                  <button
                    onClick={() => updateTask(task.id, { status: task.status === 'Completed' ? 'To Do' : 'Completed' })}
                    className={`mt-0.5 w-5 h-5 rounded border-2 shrink-0 flex items-center justify-center transition-colors ${task.status === 'Completed' ? 'bg-olive-600 border-olive-600' : 'border-charcoal-600 hover:border-terracotta-500'}`}
                  >
                    {task.status === 'Completed' && <CheckSquare size={12} className="text-cream-50" />}
                  </button>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                      <p className={`text-sm font-medium ${task.status === 'Completed' ? 'line-through text-charcoal-500' : 'text-cream-100'}`}>{task.name}</p>
                      <Badge variant={statusToVariant(task.priority)} size="sm">{task.priority}</Badge>
                    </div>
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-charcoal-500">
                      <span className="flex items-center gap-1"><CheckSquare size={12} /> {task.project}</span>
                      <span className="flex items-center gap-1"><User size={12} /> {task.assignedTo}</span>
                      <span className={`flex items-center gap-1 ${overdue ? 'text-red-400' : ''}`}><Calendar size={12} /> {formatDate(task.dueDate)} {overdue ? '(overdue)' : days >= 0 && days <= 2 ? '(due soon)' : ''}</span>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <Select value={task.status} onChange={(v) => updateTask(task.id, { status: v as Task['status'] })}
                      options={statusOptions.map((s) => ({ value: s, label: s }))} />
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {showForm && <TaskFormModal onClose={() => setShowForm(false)} onSave={(data) => { addTask(data); setShowForm(false); }} projects={projects.map((p) => p.name)} />}
    </div>
  );
}

function TaskFormModal({ onClose, onSave, projects }: { onClose: () => void; onSave: (data: Omit<Task, 'id'>) => void; projects: string[] }) {
  const [form, setForm] = useState({
    name: '', project: '', assignedTo: 'Xolelwa Lubisi', priority: 'Medium' as const,
    dueDate: '', status: 'To Do' as const,
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.project) return;
    onSave(form);
  };

  return (
    <Modal open onClose={onClose} title="Add Task" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Task</Button></>}>
      <div className="space-y-4">
        <Input label="Task Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="e.g. Foundation inspection" />
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
        <Input label="Assigned To" value={form.assignedTo} onChange={(v) => set('assignedTo', v)} placeholder="Person name" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Priority" value={form.priority} onChange={(v) => set('priority', v)} options={[
            { value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }, { value: 'Critical', label: 'Critical' },
          ]} />
          <Input label="Due Date" type="date" value={form.dueDate} onChange={(v) => set('dueDate', v)} />
        </div>
      </div>
    </Modal>
  );
}
