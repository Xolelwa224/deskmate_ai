import { useState } from 'react';
import { Plus, FileText, Download, Send, Eye, Save, Printer } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrencyFull, formatCurrency, formatDate } from '../utils/format';
import type { Quotation } from '../types';

export function Quotations() {
  const { quotations, clients, projects, addQuotation, updateQuotation } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [viewing, setViewing] = useState<Quotation | null>(null);

  const filters = [
    { value: 'all', label: 'All', count: quotations.length },
    { value: 'Draft', label: 'Draft', count: quotations.filter((q) => q.status === 'Draft').length },
    { value: 'Sent', label: 'Sent', count: quotations.filter((q) => q.status === 'Sent').length },
    { value: 'Under Review', label: 'Under Review', count: quotations.filter((q) => q.status === 'Under Review').length },
    { value: 'Accepted', label: 'Accepted', count: quotations.filter((q) => q.status === 'Accepted').length },
    { value: 'Declined', label: 'Declined', count: quotations.filter((q) => q.status === 'Declined').length },
  ];

  const filtered = quotations.filter((q) => {
    const ms = !search || q.number.toLowerCase().includes(search.toLowerCase()) || q.client.toLowerCase().includes(search.toLowerCase()) || q.project.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : q.status === filter;
    return ms && mf;
  });

  const calcTotal = (q: Quotation) => {
    const subtotal = q.labour + q.materials + q.equipment + q.professionalFees + q.otherCosts;
    return subtotal + q.vat;
  };

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Quotations" description={`${quotations.length} quotations`} actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> New Quotation</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search quotations..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<FileText size={48} />} title="No quotations found" description="Create a new quotation to get started." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> New Quotation</Button>} />
      ) : (
        <div className="space-y-3">
          {filtered.map((q) => (
            <Card key={q.id} className="p-4 hover:border-charcoal-600 transition-colors">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-sm font-display font-bold text-cream-100">{q.number}</span>
                    <Badge variant={statusToVariant(q.status)} size="sm">{q.status}</Badge>
                  </div>
                  <p className="text-sm text-charcoal-300 truncate">{q.client}</p>
                  <p className="text-xs text-charcoal-500 truncate">{q.project} • {formatDate(q.date)}</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-xs text-charcoal-500">Total</p>
                    <p className="text-lg font-display font-bold text-cream-100">{formatCurrency(calcTotal(q))}</p>
                  </div>
                  <div className="flex gap-1.5">
                    <button onClick={() => setViewing(q)} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Eye size={16} /></button>
                    {q.status === 'Draft' && <button onClick={() => updateQuotation(q.id, { status: 'Sent' })} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Send size={16} /></button>}
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <QuotationFormModal onClose={() => setShowForm(false)} onSave={(data) => { addQuotation(data); setShowForm(false); }} clients={clients.map((c) => c.name)} projects={projects.map((p) => p.name)} />}
      {viewing && <QuotationViewModal quotation={viewing} onClose={() => setViewing(null)} total={calcTotal(viewing)} />}
    </div>
  );
}

function QuotationFormModal({ onClose, onSave, clients, projects }: { onClose: () => void; onSave: (data: any) => void; clients: string[]; projects: string[] }) {
  const [form, setForm] = useState({
    client: '', project: '', description: '', labour: '0', materials: '0',
    equipment: '0', professionalFees: '0', otherCosts: '0', vat: '0',
    status: 'Draft', date: new Date().toISOString().split('T')[0],
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const subtotal = Number(form.labour) + Number(form.materials) + Number(form.equipment) + Number(form.professionalFees) + Number(form.otherCosts);
  const vatAmount = subtotal * 0.15;
  const total = subtotal + vatAmount;

  const submit = () => {
    if (!form.client || !form.project) return;
    onSave({
      ...form,
      labour: Number(form.labour) || 0, materials: Number(form.materials) || 0,
      equipment: Number(form.equipment) || 0, professionalFees: Number(form.professionalFees) || 0,
      otherCosts: Number(form.otherCosts) || 0, vat: vatAmount,
    });
  };

  return (
    <Modal open onClose={onClose} title="New Quotation" size="lg"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}><Save size={16} /> Save Quote</Button></>}>
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Client" value={form.client} onChange={(v) => set('client', v)} required placeholder="Select client" options={clients.map((c) => ({ value: c, label: c }))} />
          <Select label="Project" value={form.project} onChange={(v) => set('project', v)} required placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
        </div>
        <Textarea label="Description" value={form.description} onChange={(v) => set('description', v)} rows={2} placeholder="Quotation description..." />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Labour (R)" type="number" value={form.labour} onChange={(v) => set('labour', v)} />
          <Input label="Materials (R)" type="number" value={form.materials} onChange={(v) => set('materials', v)} />
          <Input label="Equipment (R)" type="number" value={form.equipment} onChange={(v) => set('equipment', v)} />
          <Input label="Professional Fees (R)" type="number" value={form.professionalFees} onChange={(v) => set('professionalFees', v)} />
          <Input label="Other Costs (R)" type="number" value={form.otherCosts} onChange={(v) => set('otherCosts', v)} />
        </div>
        <div className="bg-charcoal-900/60 rounded-lg p-4 border border-charcoal-700/40 space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Subtotal</span><span className="text-cream-100 font-medium">{formatCurrencyFull(subtotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">VAT (15%)</span><span className="text-cream-100 font-medium">{formatCurrencyFull(vatAmount)}</span></div>
          <div className="flex items-center justify-between text-base font-display font-bold pt-2 border-t border-charcoal-700/40"><span className="text-cream-100">Total</span><span className="text-terracotta-400">{formatCurrencyFull(total)}</span></div>
        </div>
      </div>
    </Modal>
  );
}

function QuotationViewModal({ quotation: q, onClose, total }: { quotation: Quotation; onClose: () => void; total: number }) {
  const subtotal = q.labour + q.materials + q.equipment + q.professionalFees + q.otherCosts;

  const handlePrint = () => window.print();

  return (
    <Modal open onClose={onClose} title={`Quotation ${q.number}`} size="lg"
      footer={<>
        <Button variant="ghost" onClick={onClose}>Close</Button>
        <Button variant="outline" onClick={handlePrint}><Printer size={16} /> Print</Button>
        <Button onClick={handlePrint}><Download size={16} /> Download PDF</Button>
      </>}>
      <div className="space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs text-charcoal-500">Quotation Number</p>
            <p className="text-lg font-display font-bold text-cream-100">{q.number}</p>
          </div>
          <Badge variant={statusToVariant(q.status)} size="md">{q.status}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Client</p><p className="text-cream-100">{q.client}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Project</p><p className="text-cream-100">{q.project}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30 sm:col-span-2"><p className="text-xs text-charcoal-500 mb-1">Description</p><p className="text-cream-100">{q.description}</p></div>
        </div>
        <div className="bg-charcoal-900/60 rounded-lg p-4 border border-charcoal-700/40 space-y-2">
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Labour</span><span className="text-cream-100">{formatCurrencyFull(q.labour)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Materials</span><span className="text-cream-100">{formatCurrencyFull(q.materials)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Equipment</span><span className="text-cream-100">{formatCurrencyFull(q.equipment)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Professional Fees</span><span className="text-cream-100">{formatCurrencyFull(q.professionalFees)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">Other Costs</span><span className="text-cream-100">{formatCurrencyFull(q.otherCosts)}</span></div>
          <div className="flex items-center justify-between text-sm pt-2 border-t border-charcoal-700/40"><span className="text-charcoal-300 font-medium">Subtotal</span><span className="text-cream-100 font-medium">{formatCurrencyFull(subtotal)}</span></div>
          <div className="flex items-center justify-between text-sm"><span className="text-charcoal-400">VAT (15%)</span><span className="text-cream-100">{formatCurrencyFull(q.vat)}</span></div>
          <div className="flex items-center justify-between text-lg font-display font-bold pt-2 border-t border-charcoal-700/40"><span className="text-cream-100">Total</span><span className="text-terracotta-400">{formatCurrencyFull(total)}</span></div>
        </div>
      </div>
    </Modal>
  );
}
