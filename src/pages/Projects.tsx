import { useState } from 'react';
import { Plus, MapPin, ArrowLeft, Calendar, User, Wallet, TrendingUp, CheckCircle2, HardHat } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { SearchBar, FilterTabs, EmptyState } from '../components/ui/SearchBar';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Textarea, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrency, formatCurrencyFull, formatDate } from '../utils/format';
import { projectPhases } from '../data/seed';
import type { ProjectType, Project } from '../types';

interface ProjectsProps {
  onOpenProject: (id: string) => void;
}

export function Projects({ onOpenProject }: ProjectsProps) {
  const { projects, addProject } = useStore();
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('all');
  const [showNew, setShowNew] = useState(false);

  const filters = [
    { value: 'all', label: 'All', count: projects.length },
    { value: 'active', label: 'Active', count: projects.filter((p) => p.status !== 'Completed').length },
    { value: 'Residential', label: 'Residential', count: projects.filter((p) => p.type === 'Residential' || p.type === 'New Construction').length },
    { value: 'Commercial', label: 'Commercial', count: projects.filter((p) => p.type === 'Commercial').length },
    { value: 'Renovation', label: 'Renovation', count: projects.filter((p) => p.type === 'Renovation').length },
    { value: 'Infrastructure', label: 'Infrastructure', count: projects.filter((p) => p.type === 'Infrastructure').length },
    { value: 'Interior', label: 'Interior', count: projects.filter((p) => p.type === 'Interior').length },
    { value: 'completed', label: 'Completed', count: projects.filter((p) => p.status === 'Completed').length },
  ];

  const filtered = projects.filter((p) => {
    const matchesSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || p.location.toLowerCase().includes(search.toLowerCase()) || p.client.toLowerCase().includes(search.toLowerCase());
    const matchesFilter =
      filter === 'all' ? true :
      filter === 'active' ? p.status !== 'Completed' :
      filter === 'completed' ? p.status === 'Completed' :
      filter === 'Residential' ? p.type === 'Residential' || p.type === 'New Construction' :
      p.type === filter;
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader
        title="Projects"
        description={`${projects.length} projects • Sample portfolio data`}
        actions={<Button size="sm" onClick={() => setShowNew(true)}><Plus size={16} /> New Project</Button>}
      />

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <SearchBar value={search} onChange={setSearch} placeholder="Search projects..." />
      </div>

      <div className="mb-5">
        <FilterTabs tabs={filters} active={filter} onChange={setFilter} />
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={<HardHat size={48} />} title="No projects found" description="Try adjusting your search or filters." action={<Button onClick={() => setShowNew(true)}><Plus size={16} /> New Project</Button>} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((project) => (
            <Card key={project.id} hover onClick={() => onOpenProject(project.id)} className="overflow-hidden group">
              <div className="relative h-48 overflow-hidden">
                <img src={project.image} alt={project.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal-900 via-charcoal-900/20 to-transparent" />
                <div className="absolute top-3 left-3 flex gap-2">
                  <Badge variant="terracotta" size="sm">{project.type}</Badge>
                </div>
                <div className="absolute bottom-3 left-3 right-3">
                  <h3 className="font-display font-bold text-cream-50 text-base leading-tight">{project.name}</h3>
                  <p className="text-xs text-cream-200/70 flex items-center gap-1 mt-1"><MapPin size={11} /> {project.location}</p>
                </div>
              </div>
              <div className="p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-charcoal-400">Budget</span>
                  <span className="text-sm font-medium text-cream-100">{formatCurrency(project.budget)}</span>
                </div>
                <div>
                  <div className="flex items-center justify-between text-xs mb-1.5">
                    <span className="text-charcoal-400">Progress</span>
                    <span className="text-cream-100 font-medium">{project.progress}%</span>
                  </div>
                  <ProgressBar value={project.progress} size="sm" />
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-charcoal-700/40">
                  <Badge variant={statusToVariant(project.status)} size="sm">{project.status}</Badge>
                  <span className="text-xs text-charcoal-500">{formatDate(project.expectedCompletion)}</span>
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}

      {showNew && <NewProjectModal onClose={() => setShowNew(false)} onCreate={addProject} />}
    </div>
  );
}

interface ProjectDetailProps {
  project: Project;
  onBack: () => void;
  onNavigate: (id: string) => void;
}

export function ProjectDetail({ project, onBack }: ProjectDetailProps) {
  const { inspections, tasks, expenses, risks } = useStore();

  const projectInspections = inspections.filter((i) => i.project === project.name);
  const projectTasks = tasks.filter((t) => t.project === project.name);
  const projectExpenses = expenses.filter((e) => e.project === project.name);
  const projectRisks = risks.filter((r) => r.project === project.name);
  const totalExpenses = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budgetUsed = project.budget > 0 ? (project.actualCost / project.budget) * 100 : 0;

  const healthItems = [
    { label: 'Budget', value: project.health.budget, icon: Wallet },
    { label: 'Schedule', value: project.health.schedule, icon: Calendar },
    { label: 'Quality', value: project.health.quality, icon: CheckCircle2 },
    { label: 'Overall', value: project.health.overall, icon: TrendingUp },
  ];

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <button onClick={onBack} className="flex items-center gap-2 text-sm text-charcoal-400 hover:text-cream-100 transition-colors mb-4">
        <ArrowLeft size={16} /> Back to Projects
      </button>

      {/* Hero image */}
      <div className="relative h-48 sm:h-64 rounded-xl overflow-hidden mb-6">
        <img src={project.image} alt={project.name} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal-950 via-charcoal-950/40 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="terracotta" size="md">{project.type}</Badge>
            <Badge variant={statusToVariant(project.status)} size="md">{project.status}</Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-cream-50">{project.name}</h1>
          <p className="text-sm text-cream-200/80 flex items-center gap-1 mt-1"><MapPin size={13} /> {project.location}</p>
        </div>
      </div>

      {/* Key info */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        <Card className="p-4"><p className="text-xs text-charcoal-400 uppercase tracking-wider">Client</p><p className="text-sm font-medium text-cream-100 mt-1">{project.client}</p></Card>
        <Card className="p-4"><p className="text-xs text-charcoal-400 uppercase tracking-wider">Project Manager</p><p className="text-sm font-medium text-cream-100 mt-1">{project.manager}</p></Card>
        <Card className="p-4"><p className="text-xs text-charcoal-400 uppercase tracking-wider">Start Date</p><p className="text-sm font-medium text-cream-100 mt-1">{formatDate(project.startDate)}</p></Card>
        <Card className="p-4"><p className="text-xs text-charcoal-400 uppercase tracking-wider">Expected Completion</p><p className="text-sm font-medium text-cream-100 mt-1">{formatDate(project.expectedCompletion)}</p></Card>
      </div>

      {/* Budget + Progress */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        <Card className="p-5">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Budget Summary</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Estimated Budget</span><span className="text-sm font-medium text-cream-100">{formatCurrencyFull(project.budget)}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Actual Cost</span><span className="text-sm font-medium text-cream-100">{formatCurrencyFull(project.actualCost)}</span></div>
            <div className="flex items-center justify-between"><span className="text-sm text-charcoal-400">Remaining</span><span className="text-sm font-medium text-cream-100">{formatCurrencyFull(project.budget - project.actualCost)}</span></div>
            <div className="pt-2">
              <div className="flex items-center justify-between text-xs mb-1.5"><span className="text-charcoal-400">Budget Used</span><span className="text-cream-100 font-medium">{Math.round(budgetUsed)}%</span></div>
              <ProgressBar value={budgetUsed} color={budgetUsed > 90 ? 'red' : 'terracotta'} size="sm" />
            </div>
          </div>
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Progress</h3>
          <div className="flex items-center gap-4">
            <div className="relative w-24 h-24 shrink-0">
              <svg className="w-24 h-24 -rotate-90">
                <circle cx="48" cy="48" r="40" fill="none" stroke="currentColor" className="text-charcoal-700" strokeWidth="8" />
                <circle cx="48" cy="48" r="40" fill="none" stroke="#d96e36" strokeWidth="8" strokeLinecap="round" strokeDasharray={`${(project.progress / 100) * 251.3} 251.3`} className="transition-all duration-1000" />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center"><span className="text-xl font-display font-bold text-cream-100">{project.progress}%</span></div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-charcoal-400">Overall Completion</p>
              <p className="text-xs text-charcoal-500 mt-1">Recorded expenses: {formatCurrency(totalExpenses)}</p>
              <p className="text-xs text-charcoal-500 mt-0.5">{projectTasks.length} tasks • {projectInspections.length} inspections</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Description */}
      <Card className="p-5 mb-6">
        <h3 className="text-sm font-display font-semibold text-cream-100 mb-3">Project Description</h3>
        <p className="text-sm text-charcoal-300 leading-relaxed">{project.description}</p>
      </Card>

      {/* Project Health */}
      <Card className="p-5 mb-6">
        <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Project Health</h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {healthItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="bg-charcoal-900/40 rounded-lg p-3 border border-charcoal-700/30">
                <Icon size={18} className="text-charcoal-400 mb-2" />
                <p className="text-xs text-charcoal-400">{item.label}</p>
                <Badge variant={statusToVariant(item.value)} size="sm">{item.value}</Badge>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Timeline */}
      <Card className="p-5 mb-6">
        <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Project Timeline</h3>
        <div className="flex items-start gap-0 overflow-x-auto scrollbar-hide pb-2">
          {project.phases.map((phase, idx) => (
            <div key={phase.name} className="flex items-start shrink-0">
              <div className="flex flex-col items-center w-20 sm:w-24">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${phase.complete ? 'bg-olive-600 text-cream-50' : 'bg-charcoal-700 text-charcoal-400 border border-charcoal-600'}`}>
                  {phase.complete ? <CheckCircle2 size={16} /> : idx + 1}
                </div>
                <span className={`text-[10px] mt-2 text-center ${phase.complete ? 'text-cream-100 font-medium' : 'text-charcoal-500'}`}>{phase.name}</span>
                {phase.date && <span className="text-[9px] text-charcoal-600 mt-0.5 text-center">{formatDate(phase.date)}</span>}
              </div>
              {idx < project.phases.length - 1 && (
                <div className={`h-0.5 w-8 sm:w-12 mt-4 ${phase.complete ? 'bg-olive-600' : 'bg-charcoal-700'}`} />
              )}
            </div>
          ))}
        </div>
      </Card>

      {/* Risks */}
      {projectRisks.length > 0 && (
        <Card className="p-5 mb-6">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Risks ({projectRisks.length})</h3>
          <div className="space-y-2">
            {projectRisks.map((risk) => (
              <div key={risk.id} className="flex items-center gap-3 p-3 rounded-lg bg-charcoal-900/40 border border-charcoal-700/30">
                <Badge variant={statusToVariant(risk.level)} size="sm">{risk.level}</Badge>
                <p className="text-sm text-cream-100 flex-1 min-w-0 truncate">{risk.risk}</p>
                <Badge variant={statusToVariant(risk.status)} size="sm">{risk.status}</Badge>
              </div>
            ))}
          </div>
        </Card>
      )}
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
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Create Project</Button></>}>
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
