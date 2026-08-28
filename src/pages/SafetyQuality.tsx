import { useState } from 'react';
import { Plus, ShieldCheck, AlertTriangle, CheckCircle2, HardHat } from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';

export function SafetyQuality() {
  const { safetyItems, projects, addSafetyItem, updateSafetyItem } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const safetyCount = safetyItems.filter((s) => s.type === 'Safety Observation' && s.status === 'Open').length;
  const qualityCount = safetyItems.filter((s) => s.type === 'Quality Check' && s.status === 'Open').length;
  const resolvedCount = safetyItems.filter((s) => s.status === 'Resolved').length;

  const filters = [
    { value: 'all', label: 'All', count: safetyItems.length },
    { value: 'Safety Observation', label: 'Safety', count: safetyItems.filter((s) => s.type === 'Safety Observation').length },
    { value: 'Incident Report', label: 'Incidents', count: safetyItems.filter((s) => s.type === 'Incident Report').length },
    { value: 'Quality Check', label: 'Quality', count: safetyItems.filter((s) => s.type === 'Quality Check').length },
    { value: 'Outstanding Defect', label: 'Defects', count: safetyItems.filter((s) => s.type === 'Outstanding Defect').length },
  ];

  const filtered = safetyItems.filter((s) => {
    const ms = !search || s.title.toLowerCase().includes(search.toLowerCase()) || s.project.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : s.type === filter;
    return ms && mf;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Safety & Quality" description="Safety observations, incidents, quality checks and defects" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> New Observation</Button>} />

      <div className="grid grid-cols-3 gap-3 sm:gap-4 mb-5">
        <StatCard label="Safety Issues" value={safetyCount} icon={<ShieldCheck size={20} />} accent="red" />
        <StatCard label="Quality Issues" value={qualityCount} icon={<AlertTriangle size={20} />} accent="terracotta" />
        <StatCard label="Resolved" value={resolvedCount} icon={<CheckCircle2 size={20} />} accent="olive" />
      </div>

      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ShieldCheck size={48} />} title="No items found" description="Create a new observation to get started." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> New Observation</Button>} />
      ) : (
        <div className="space-y-2.5">
          {filtered.map((item) => (
            <Card key={item.id} className="p-4 hover:border-charcoal-600 transition-colors">
              <div className="flex items-start gap-3">
                <div className={`p-2 rounded-lg shrink-0 ${item.status === 'Open' ? 'bg-terracotta-600/10 text-terracotta-400' : 'bg-olive-600/10 text-olive-400'}`}>
                  {item.type === 'Safety Observation' ? <ShieldCheck size={18} /> : item.type === 'Incident Report' ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <Badge variant={statusToVariant(item.type)} size="sm">{item.type}</Badge>
                    <Badge variant={statusToVariant(item.severity)} size="sm">{item.severity}</Badge>
                    <Badge variant={statusToVariant(item.status)} size="sm">{item.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-cream-100">{item.title}</p>
                  <p className="text-xs text-charcoal-500 mt-0.5">{item.project} • {formatDate(item.date)}</p>
                  <p className="text-sm text-charcoal-300 mt-1.5">{item.description}</p>
                </div>
                {item.status === 'Open' && (
                  <button onClick={() => updateSafetyItem(item.id, { status: 'Resolved' })}
                    className="text-xs text-olive-400 hover:text-olive-300 shrink-0 px-2 py-1 rounded border border-olive-600/30 hover:bg-olive-600/10 transition-colors">
                    Resolve
                  </button>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <SafetyFormModal onClose={() => setShowForm(false)} onSave={(data) => { addSafetyItem(data); setShowForm(false); }} projects={projects.map((p) => p.name)} />}
    </div>
  );
}

function SafetyFormModal({ onClose, onSave, projects }: { onClose: () => void; onSave: (data: any) => void; projects: string[] }) {
  const [form, setForm] = useState({
    type: 'Safety Observation', title: '', project: '', description: '',
    severity: 'Medium', status: 'Open', date: new Date().toISOString().split('T')[0],
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title.trim() || !form.project) return;
    onSave(form);
  };

  return (
    <Modal open onClose={onClose} title="New Observation" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Create</Button></>}>
      <div className="space-y-4">
        <Select label="Type" value={form.type} onChange={(v) => set('type', v)} options={[
          { value: 'Safety Observation', label: 'Safety Observation' }, { value: 'Incident Report', label: 'Incident Report' },
          { value: 'Quality Check', label: 'Quality Check' }, { value: 'Outstanding Defect', label: 'Outstanding Defect' },
        ]} />
        <Input label="Title" value={form.title} onChange={(v) => set('title', v)} required placeholder="Brief title" />
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
        <Textarea label="Description" value={form.description} onChange={(v) => set('description', v)} rows={3} placeholder="Detailed description..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Severity" value={form.severity} onChange={(v) => set('severity', v)} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }]} />
          <Input label="Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
        </div>
      </div>
    </Modal>
  );
}
