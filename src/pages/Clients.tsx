import { useState } from 'react';
import { Plus, Mail, Phone, Building2, Pencil, Eye, Users } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrency, formatDate } from '../utils/format';
import type { Client } from '../types';

export function Clients() {
  const { clients, addClient, updateClient } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Client | null>(null);
  const [viewing, setViewing] = useState<Client | null>(null);

  const filters = [
    { value: 'all', label: 'All', count: clients.length },
    { value: 'Active', label: 'Active', count: clients.filter((c) => c.status === 'Active').length },
    { value: 'Prospect', label: 'Prospects', count: clients.filter((c) => c.status === 'Prospect').length },
    { value: 'Inactive', label: 'Inactive', count: clients.filter((c) => c.status === 'Inactive').length },
  ];

  const filtered = clients.filter((c) => {
    const ms = !search || c.name.toLowerCase().includes(search.toLowerCase()) || c.company.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : c.status === filter;
    return ms && mf;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Clients" description={`${clients.length} clients`} actions={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> New Client</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search clients..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Users size={48} />} title="No clients found" description="Add a new client to get started." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> New Client</Button>} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((client) => (
            <Card key={client.id} className="p-5 hover:border-charcoal-600 transition-colors">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-full bg-terracotta-600/15 border border-terracotta-600/30 flex items-center justify-center text-terracotta-300 font-semibold text-sm shrink-0">
                    {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
                  </div>
                  <div className="min-w-0">
                    <h3 className="text-sm font-display font-semibold text-cream-100 truncate">{client.name}</h3>
                    <p className="text-xs text-charcoal-400 truncate">{client.company}</p>
                  </div>
                </div>
                <Badge variant={statusToVariant(client.status)} size="sm">{client.status}</Badge>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex items-center gap-2 text-charcoal-300"><Mail size={14} className="text-charcoal-500 shrink-0" /><span className="truncate">{client.email}</span></div>
                <div className="flex items-center gap-2 text-charcoal-300"><Phone size={14} className="text-charcoal-500 shrink-0" /><span>{client.phone}</span></div>
                <div className="flex items-center gap-2 text-charcoal-300"><Building2 size={14} className="text-charcoal-500 shrink-0" /><span className="truncate">{client.project}</span></div>
              </div>
              <div className="flex items-center justify-between pt-3 mt-3 border-t border-charcoal-700/40">
                <div>
                  <p className="text-xs text-charcoal-500">Project Value</p>
                  <p className="text-sm font-medium text-cream-100">{formatCurrency(client.projectValue)}</p>
                </div>
                <div className="flex gap-1.5">
                  <button onClick={() => setViewing(client)} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Eye size={16} /></button>
                  <button onClick={() => { setEditing(client); setShowForm(true); }} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Pencil size={16} /></button>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showForm && <ClientFormModal client={editing} onClose={() => setShowForm(false)} onSave={(data) => { if (editing) updateClient(editing.id, data); else addClient(data as any); setShowForm(false); }} />}
      {viewing && <ClientViewModal client={viewing} onClose={() => setViewing(null)} />}
    </div>
  );
}

function ClientFormModal({ client, onClose, onSave }: { client: Client | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: client?.name || '', company: client?.company || '', email: client?.email || '',
    phone: client?.phone || '', project: client?.project || '', projectValue: String(client?.projectValue || ''),
    status: client?.status || 'Prospect', lastCommunication: client?.lastCommunication || new Date().toISOString().split('T')[0],
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim() || !form.email.trim()) return;
    onSave({ ...form, projectValue: Number(form.projectValue) || 0 });
  };

  return (
    <Modal open onClose={onClose} title={client ? 'Edit Client' : 'New Client'} size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>{client ? 'Save Changes' : 'Add Client'}</Button></>}>
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

function ClientViewModal({ client, onClose }: { client: Client; onClose: () => void }) {
  return (
    <Modal open onClose={onClose} title="Client Details" size="md">
      <div className="space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 rounded-full bg-terracotta-600/15 border border-terracotta-600/30 flex items-center justify-center text-terracotta-300 font-semibold">
            {client.name.split(' ').map((n) => n[0]).slice(0, 2).join('')}
          </div>
          <div>
            <h3 className="font-display font-bold text-cream-100">{client.name}</h3>
            <p className="text-sm text-charcoal-400">{client.company}</p>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Email</p><p className="text-cream-100">{client.email}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Phone</p><p className="text-cream-100">{client.phone}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Project</p><p className="text-cream-100">{client.project}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Project Value</p><p className="text-cream-100">{formatCurrency(client.projectValue)}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Status</p><Badge variant={statusToVariant(client.status)} size="sm">{client.status}</Badge></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Last Communication</p><p className="text-cream-100">{formatDate(client.lastCommunication)}</p></div>
        </div>
      </div>
    </Modal>
  );
}
