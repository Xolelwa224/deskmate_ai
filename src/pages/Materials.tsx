import { useState } from 'react';
import { Plus, Package, Search, ShoppingCart, Pencil } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import type { Material } from '../types';

export function Materials() {
  const { materials, addMaterial, updateMaterial } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Material | null>(null);

  const filters = [
    { value: 'all', label: 'All', count: materials.length },
    { value: 'Available', label: 'Available', count: materials.filter((m) => m.status === 'Available').length },
    { value: 'Low Stock', label: 'Low Stock', count: materials.filter((m) => m.status === 'Low Stock').length },
    { value: 'Ordered', label: 'Ordered', count: materials.filter((m) => m.status === 'Ordered').length },
    { value: 'Out of Stock', label: 'Out of Stock', count: materials.filter((m) => m.status === 'Out of Stock').length },
  ];

  const filtered = materials.filter((m) => {
    const ms = !search || m.name.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : m.status === filter;
    return ms && mf;
  });

  const markOrdered = (m: Material) => updateMaterial(m.id, { status: 'Ordered' });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Materials" description={`${materials.length} materials in inventory`} actions={<Button size="sm" onClick={() => { setEditing(null); setShowForm(true); }}><Plus size={16} /> Add Material</Button>} />
      <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search materials..." /></div>
      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<Package size={48} />} title="No materials found" description="Add materials to track inventory." action={<Button onClick={() => setShowForm(true)}><Plus size={16} /> Add Material</Button>} />
      ) : (
        <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="text-left text-xs text-charcoal-500 uppercase tracking-wider border-b border-charcoal-700/40">
                <th className="pb-2 pr-4">Material</th>
                <th className="pb-2 pr-4">Quantity</th>
                <th className="pb-2 pr-4">Reorder Level</th>
                <th className="pb-2 pr-4">Status</th>
                <th className="pb-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((m) => (
                <tr key={m.id} className="border-b border-charcoal-700/20 hover:bg-charcoal-800/40">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 rounded-lg bg-charcoal-700/40 text-charcoal-400"><Package size={16} /></div>
                      <span className="text-cream-100 font-medium">{m.name}</span>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-charcoal-300 tabular-nums">{m.quantity.toLocaleString()} {m.unit}</td>
                  <td className="py-3 pr-4 text-charcoal-400 tabular-nums">{m.reorderLevel.toLocaleString()} {m.unit}</td>
                  <td className="py-3 pr-4"><Badge variant={statusToVariant(m.status)} size="sm">{m.status}</Badge></td>
                  <td className="py-3 text-right">
                    <div className="flex gap-1.5 justify-end">
                      {m.status === 'Out of Stock' && <button onClick={() => markOrdered(m)} className="p-2 rounded-lg text-charcoal-400 hover:text-olive-300 hover:bg-charcoal-700/50 transition-colors" title="Mark as ordered"><ShoppingCart size={16} /></button>}
                      <button onClick={() => { setEditing(m); setShowForm(true); }} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Pencil size={16} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {showForm && <MaterialFormModal material={editing} onClose={() => setShowForm(false)} onSave={(data) => { if (editing) updateMaterial(editing.id, data); else addMaterial(data as any); setShowForm(false); }} />}
    </div>
  );
}

function MaterialFormModal({ material, onClose, onSave }: { material: Material | null; onClose: () => void; onSave: (data: any) => void }) {
  const [form, setForm] = useState({
    name: material?.name || '', quantity: String(material?.quantity || '0'), unit: material?.unit || 'Units',
    status: material?.status || 'Available', reorderLevel: String(material?.reorderLevel || '0'),
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.name.trim()) return;
    onSave({ ...form, quantity: Number(form.quantity) || 0, reorderLevel: Number(form.reorderLevel) || 0 });
  };

  return (
    <Modal open onClose={onClose} title={material ? 'Edit Material' : 'Add Material'} size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>{material ? 'Save' : 'Add Material'}</Button></>}>
      <div className="space-y-4">
        <Input label="Material Name" value={form.name} onChange={(v) => set('name', v)} required placeholder="e.g. Cement (42.5N)" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Quantity" type="number" value={form.quantity} onChange={(v) => set('quantity', v)} placeholder="0" />
          <Input label="Unit" value={form.unit} onChange={(v) => set('unit', v)} placeholder="e.g. Bags, m³, Tons" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Select label="Status" value={form.status} onChange={(v) => set('status', v)} options={[
            { value: 'Available', label: 'Available' }, { value: 'Low Stock', label: 'Low Stock' },
            { value: 'Ordered', label: 'Ordered' }, { value: 'Out of Stock', label: 'Out of Stock' },
          ]} />
          <Input label="Reorder Level" type="number" value={form.reorderLevel} onChange={(v) => set('reorderLevel', v)} placeholder="0" />
        </div>
      </div>
    </Modal>
  );
}
