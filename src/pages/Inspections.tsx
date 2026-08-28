import { useState } from 'react';
import { Plus, ClipboardCheck, Eye, Printer, HardHat } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';
import type { Inspection } from '../types';

export function SiteInspections() {
  const { inspections, projects, addInspection } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Inspection | null>(null);

  const filters = [
    { value: 'all', label: 'All', count: inspections.length },
    { value: 'Passed', label: 'Passed', count: inspections.filter((i) => i.status === 'Passed').length },
    { value: 'Attention Required', label: 'Attention', count: inspections.filter((i) => i.status === 'Attention Required').length },
    { value: 'Critical', label: 'Critical', count: inspections.filter((i) => i.status === 'Critical').length },
  ];

  const filtered = inspections.filter((i) => {
    const ms = !search || i.project.toLowerCase().includes(search.toLowerCase()) || i.inspector.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : i.status === filter;
    return ms && mf;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Site Inspections" description={`${inspections.length} inspections recorded`} actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Create Inspection</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search inspections..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<ClipboardCheck size={48} />} title="No inspections found" description="Create a new site inspection to get started." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Create Inspection</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((insp) => (
            <Card key={insp.id} className="p-4 hover:border-charcoal-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-start gap-3 flex-1 min-w-0">
                  <div className="p-2.5 rounded-lg bg-charcoal-700/40 text-charcoal-400 shrink-0"><ClipboardCheck size={20} /></div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant={statusToVariant(insp.status)} size="sm">{insp.status}</Badge>
                      <span className="text-xs text-charcoal-500">{formatDate(insp.date)}</span>
                    </div>
                    <p className="text-sm font-medium text-cream-100 truncate">{insp.project}</p>
                    <p className="text-xs text-charcoal-500 truncate">Inspector: {insp.inspector} • {insp.weather}</p>
                  </div>
                </div>
                <button onClick={() => setViewing(insp)} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors shrink-0"><Eye size={18} /></button>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <InspectionFormModal onClose={() => setShowForm(false)} onSave={(data) => { addInspection(data); setShowForm(false); }} projects={projects.map((p) => p.name)} />}
      {viewing && <InspectionReportModal inspection={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function InspectionFormModal({ onClose, onSave, projects }: { onClose: () => void; onSave: (data: any) => void; projects: string[] }) {
  const [form, setForm] = useState({
    project: '', inspector: 'Xolelwa Lubisi', date: new Date().toISOString().split('T')[0],
    weather: '', siteConditions: '', workCompleted: '', issuesIdentified: '',
    safetyObservations: '', materialsDelivered: '', recommendedActions: '', status: 'Passed',
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.project) return;
    onSave(form);
  };

  return (
    <Modal open onClose={onClose} title="Create Inspection" size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Create Inspection Report</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
          <Input label="Inspector" value={form.inspector} onChange={(v) => set('inspector', v)} />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
          <Input label="Weather" value={form.weather} onChange={(v) => set('weather', v)} placeholder="e.g. Sunny, 24°C" />
        </div>
        <Select label="Status" value={form.status} onChange={(v) => set('status', v)} options={[
          { value: 'Passed', label: 'Passed' }, { value: 'Attention Required', label: 'Attention Required' }, { value: 'Critical', label: 'Critical' },
        ]} />
        <Textarea label="Site Conditions" value={form.siteConditions} onChange={(v) => set('siteConditions', v)} rows={2} />
        <Textarea label="Work Completed" value={form.workCompleted} onChange={(v) => set('workCompleted', v)} rows={2} />
        <Textarea label="Issues Identified" value={form.issuesIdentified} onChange={(v) => set('issuesIdentified', v)} rows={2} />
        <Textarea label="Safety Observations" value={form.safetyObservations} onChange={(v) => set('safetyObservations', v)} rows={2} />
        <Textarea label="Materials Delivered" value={form.materialsDelivered} onChange={(v) => set('materialsDelivered', v)} rows={2} />
        <Textarea label="Recommended Actions" value={form.recommendedActions} onChange={(v) => set('recommendedActions', v)} rows={2} />
      </div>
    </Modal>
  );
}

function InspectionReportModal({ inspection, onClose }: { inspection: Inspection; onClose: () => void }) {
  const fields = [
    { label: 'Project', value: inspection.project },
    { label: 'Inspector', value: inspection.inspector },
    { label: 'Date', value: formatDate(inspection.date) },
    { label: 'Weather', value: inspection.weather },
    { label: 'Site Conditions', value: inspection.siteConditions },
    { label: 'Work Completed', value: inspection.workCompleted },
    { label: 'Issues Identified', value: inspection.issuesIdentified },
    { label: 'Safety Observations', value: inspection.safetyObservations },
    { label: 'Materials Delivered', value: inspection.materialsDelivered },
    { label: 'Recommended Actions', value: inspection.recommendedActions },
  ];

  return (
    <Modal open onClose={onClose} title="Inspection Report" size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Close</Button><Button onClick={() => window.print()}><Printer size={16} /> Print Report</Button></>}>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2"><HardHat size={20} className="text-terracotta-400" /><span className="font-display font-bold text-cream-100">Site Inspection Report</span></div>
          <Badge variant={statusToVariant(inspection.status)} size="md">{inspection.status}</Badge>
        </div>
        <div className="space-y-3">
          {fields.map((f) => (
            <div key={f.label} className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30">
              <p className="text-xs text-charcoal-500 uppercase tracking-wider mb-1">{f.label}</p>
              <p className="text-sm text-cream-100">{f.value || '—'}</p>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
}
