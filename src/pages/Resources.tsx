import { useState } from 'react';
import { Download, Eye, Upload, Search as SearchIcon, FileText, File, Image as ImageIcon } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';

const typeIcons: Record<string, typeof FileText> = {
  'Project Plan': FileText,
  'Quotation': FileText,
  'Contract': FileText,
  'Inspection Report': FileText,
  'Safety Document': FileText,
  'Invoice': FileText,
  'Project Photo': ImageIcon,
};

export function Resources() {
  const { documents, projects } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');

  const types = ['all', ...Array.from(new Set(documents.map((d) => d.type)))];
  const filters = types.map((t) => ({
    value: t,
    label: t === 'all' ? 'All' : t,
    count: t === 'all' ? documents.length : documents.filter((d) => d.type === t).length,
  }));

  const filtered = documents.filter((d) => {
    const ms = !search || d.name.toLowerCase().includes(search.toLowerCase()) || d.project.toLowerCase().includes(search.toLowerCase());
    const mf = filter === 'all' ? true : d.type === filter;
    return ms && mf;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Resources" description={`${documents.length} documents`} actions={<Button size="sm"><Upload size={16} /> Upload</Button>} />

      <div className="relative mb-4">
        <SearchIcon size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-charcoal-500" />
        <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search documents..."
          className="w-full sm:w-64 bg-charcoal-900/60 border border-charcoal-600/60 rounded-lg text-sm text-cream-100 placeholder-charcoal-500 pl-9 pr-3.5 py-2 focus:outline-none focus:border-terracotta-500/60 focus:ring-1 focus:ring-terracotta-500/30 transition-colors" />
      </div>

      <div className="mb-5"><FilterTabs tabs={filters} active={filter} onChange={setFilter} /></div>

      {filtered.length === 0 ? (
        <EmptyState icon={<File size={48} />} title="No documents found" description="Upload documents to share with your team." />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc) => {
            const Icon = typeIcons[doc.type] || File;
            return (
              <Card key={doc.id} className="p-4 hover:border-charcoal-600 transition-colors group">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-terracotta-600/10 text-terracotta-400 shrink-0"><Icon size={20} /></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-cream-100 truncate">{doc.name}</p>
                    <p className="text-xs text-charcoal-500 mt-0.5">{doc.project}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant="info" size="sm">{doc.type}</Badge>
                      <span className="text-xs text-charcoal-500">{doc.size}</span>
                    </div>
                    <p className="text-xs text-charcoal-600 mt-1.5">{formatDate(doc.date)}</p>
                  </div>
                </div>
                <div className="flex gap-2 mt-3 pt-3 border-t border-charcoal-700/40">
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs text-charcoal-400 hover:text-cream-100 py-1.5 rounded transition-colors"><Eye size={14} /> View</button>
                  <button className="flex-1 flex items-center justify-center gap-1.5 text-xs text-charcoal-400 hover:text-terracotta-400 py-1.5 rounded transition-colors"><Download size={14} /> Download</button>
                </div>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
