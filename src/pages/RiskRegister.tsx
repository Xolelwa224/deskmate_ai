import { useState } from 'react';
import { Plus, ShieldAlert, FolderOpen } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';

export function RiskRegister() {
  const { risks, projects, addRisk, updateRisk } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);

  const filters = [
    { value: 'all', label: 'All', count: risks.length },
    { value: 'Open', label: 'Open', count: risks.filter((r) => r.status === 'Open').length },
    { value: 'Mitigated', label: 'Mitigated', count: risks.filter((r) => r.status === 'Mitigated').length },
    { value: 'Closed', label: 'Closed', count: risks.filter((r) => r.status === 'Closed').length },
  ];

  const filtered = risks.filter((r) => {
    const ms = !search || r.risk.toLowerCase().includes(search.toLowerCase()) || r.project.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : r.status === filter;
    return ms && mf;
  });

  const calcLevel = (prob: string, impact: string): string => {
    if (prob === 'High' && impact === 'High') return 'High';
    if (prob === 'High' || impact === 'High') return 'High';
    if (prob === 'Medium' || impact === 'Medium') return 'Medium';
    return 'Low';
  };

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Risk Register" description={`${risks.length} risks tracked`} actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Add Risk</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search risks..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ShieldAlert size={48} />} title="No risks found" description="Add a risk to the register." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Add Risk</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <Card key={r.id} className="p-4 hover:border-charcoal-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-start gap-3">
                <div className="p-2.5 rounded-lg bg-charcoal-700/40 text-charcoal-400 shrink-0"><ShieldAlert size={20} /></div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <Badge variant={statusToVariant(r.level)} size="sm">Risk: {r.level}</Badge>
                    <Badge variant={statusToVariant(r.status)} size="sm">{r.status}</Badge>
                  </div>
                  <p className="text-sm font-medium text-cream-100">{r.risk}</p>
                  <p className="text-xs text-charcoal-500 mt-1">Project: {r.project}</p>
                  <p className="text-sm text-charcoal-300 mt-2"><span className="text-charcoal-500">Mitigation: </span>{r.mitigation}</p>
                  <div className="flex items-center gap-4 mt-2 text-xs text-charcoal-500">
                    <span>Probability: <span className="text-charcoal-300">{r.probability}</span></span>
                    <span>Impact: <span className="text-charcoal-300">{r.impact}</span></span>
                    <span>Owner: <span className="text-charcoal-300">{r.owner}</span></span>
                  </div>
                </div>
                <Select value={r.status} onChange={(v) => updateRisk(r.id, { status: v as any })}
                  options={[{ value: 'Open', label: 'Open' }, { value: 'Mitigated', label: 'Mitigated' }, { value: 'Closed', label: 'Closed' }]} />
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <RiskFormModal onClose={() => setShowForm(false)} onSave={(data) => { addRisk(data); setShowForm(false); }} projects={projects.map((p) => p.name)} calcLevel={calcLevel} />}
    </div>
  );
}

function RiskFormModal({ onClose, onSave, projects, calcLevel }: { onClose: () => void; onSave: (data: any) => void; projects: string[]; calcLevel: (p: string, i: string) => string }) {
  const [form, setForm] = useState({
    risk: '', project: '', probability: 'Medium', impact: 'Medium',
    mitigation: '', owner: 'Xolelwa Lubisi', status: 'Open',
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.risk.trim() || !form.project) return;
    onSave({ ...form, level: calcLevel(form.probability, form.impact) });
  };

  return (
    <Modal open onClose={onClose} title="Add Risk" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Risk</Button></>}>
      <div className="space-y-4">
        <Input label="Risk Description" value={form.risk} onChange={(v) => set('risk', v)} required placeholder="e.g. Material delivery Delay" />
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Probability" value={form.probability} onChange={(v) => set('probability', v)} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }]} />
          <Select label="Impact" value={form.impact} onChange={(v) => set('impact', v)} options={[{ value: 'Low', label: 'Low' }, { value: 'Medium', label: 'Medium' }, { value: 'High', label: 'High' }]} />
        </div>
        <Textarea label="Mitigation" value={form.mitigation} onChange={(v) => set('mitigation', v)} rows={3} placeholder="Mitigation strategy..." />
        <Input label="Owner" value={form.owner} onChange={(v) => set('owner', v)} placeholder="Risk owner" />
      </div>
    </Modal>
  );
}
