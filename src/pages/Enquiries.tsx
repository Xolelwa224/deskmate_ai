import { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Eye } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';
import type { Enquiry } from '../types';

export function Enquiries() {
  const { enquiries, updateEnquiry } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [viewing, setViewing] = useState<Enquiry | null>(null);

  const filters = [
    { value: 'all', label: 'All', count: enquiries.length },
    { value: 'New', label: 'New', count: enquiries.filter((e) => e.status === 'New').length },
    { value: 'Contacted', label: 'Contacted', count: enquiries.filter((e) => e.status === 'Contacted').length },
    { value: 'Reviewed', label: 'Reviewed', count: enquiries.filter((e) => e.status === 'Reviewed').length },
  ];

  const filtered = enquiries.filter((e) => {
    const ms = !search || e.fullName.toLowerCase().includes(search.toLowerCase()) || e.email.toLowerCase().includes(search.toLowerCase()) || e.projectType.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : e.status === filter;
    return ms && mf;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Client Enquiries" description={`${enquiries.length} enquiries received`} />

      {enquiries.length === 0 && !search ? (
        <EmptyState icon={<Mail size={48} />} title="No enquiries yet" description="When visitors submit the 'Start a Project' form on your website, their enquiries will appear here." />
      ) : (
        <>
          <div className="mb-4"><SearchBar value={search} onChange={setSearch} placeholder="Search enquiries..." /></div>
          <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

          {filtered.length === 0 ? (
            <EmptyState icon={<Mail size={48} />} title="No enquiries found" description="Try adjusting your search." />
          ) : (
            <div className="space-y-3">
              {filtered.map((enq) => (
                <Card key={enq.id} className="p-4 hover:border-charcoal-600 transition-colors">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-cream-100">{enq.fullName}</span>
                        <Badge variant={statusToVariant(enq.status)} size="sm">{enq.status}</Badge>
                      </div>
                      <p className="text-xs text-charcoal-500">{enq.email} • {enq.projectType}</p>
                      <p className="text-xs text-charcoal-500 mt-0.5">{enq.location} • Budget: {enq.estimatedBudget || 'Not specified'} • {formatDate(enq.date)}</p>
                    </div>
                    <div className="flex gap-1.5 shrink-0">
                      <button onClick={() => setViewing(enq)} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><Eye size={16} /></button>
                      {enq.status === 'New' && <button onClick={() => updateEnquiry(enq.id, { status: 'Contacted' })} className="text-xs text-terracotta-400 hover:text-terracotta-300 px-2 py-1 rounded border border-terracotta-600/30 hover:bg-terracotta-600/10 transition-colors">Mark Contacted</button>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </>
      )}

      {viewing && <EnquiryViewModal enquiry={viewing} onClose={() => setViewing(null)} onUpdate={(status) => { updateEnquiry(viewing.id, { status }); setViewing(null); }} />}
    </div>
  );
}

function EnquiryViewModal({ enquiry, onClose, onUpdate }: { enquiry: Enquiry; onClose: () => void; onUpdate: (status: Enquiry['status']) => void }) {
  return (
    <Modal open onClose={onClose} title="Enquiry Details" size="md"
      footer={
        <>
          <Button variant="ghost" onClick={onClose}>Close</Button>
          {enquiry.status === 'New' && <Button onClick={() => onUpdate('Contacted')}>Mark as Contacted</Button>}
          {enquiry.status === 'Contacted' && <Button onClick={() => onUpdate('Reviewed')}>Mark as Reviewed</Button>}
        </>
      }>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-display font-bold text-cream-100 text-lg">{enquiry.fullName}</h3>
          <Badge variant={statusToVariant(enquiry.status)} size="md">{enquiry.status}</Badge>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Email</p><p className="text-cream-100 flex items-center gap-1.5"><Mail size={14} /> {enquiry.email}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Phone</p><p className="text-cream-100 flex items-center gap-1.5"><Phone size={14} /> {enquiry.phone}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Project Type</p><p className="text-cream-100">{enquiry.projectType}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Location</p><p className="text-cream-100 flex items-center gap-1.5"><MapPin size={14} /> {enquiry.location || 'Not specified'}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Estimated Budget</p><p className="text-cream-100">{enquiry.estimatedBudget || 'Not specified'}</p></div>
          <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30"><p className="text-xs text-charcoal-500 mb-1">Expected Start Date</p><p className="text-cream-100 flex items-center gap-1.5"><Calendar size={14} /> {enquiry.expectedStartDate || 'Not specified'}</p></div>
        </div>
        <div className="p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30">
          <p className="text-xs text-charcoal-500 mb-1">Project Description</p>
          <p className="text-sm text-cream-100">{enquiry.description}</p>
        </div>
        <p className="text-xs text-charcoal-500">Received: {formatDate(enquiry.date)}</p>
      </div>
    </Modal>
  );
}
