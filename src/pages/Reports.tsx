import { useState } from 'react';
import { BarChart3, Download, Printer, FileText } from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { ProgressBar } from '../components/ui/ProgressBar';
import { BarChart, LineChart } from '../components/ui/Charts';
import { PageHeader } from '../components/ui/PageHeader';
import { Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrency, formatCurrencyFull, formatDate } from '../utils/format';

export function Reports() {
  const { projects, tasks, inspections, expenses, risks } = useStore();
  const [selectedProject, setSelectedProject] = useState('all');
  const [generated, setGenerated] = useState(false);

  const reportProjects = selectedProject === 'all' ? projects : projects.filter((p) => p.name === selectedProject);
  const reportTasks = selectedProject === 'all' ? tasks : tasks.filter((t) => t.project === selectedProject);
  const reportInspections = selectedProject === 'all' ? inspections : inspections.filter((i) => i.project === selectedProject);
  const reportExpenses = selectedProject === 'all' ? expenses : expenses.filter((e) => e.project === selectedProject);
  const reportRisks = selectedProject === 'all' ? risks : risks.filter((r) => r.project === selectedProject);

  const totalBudget = reportProjects.reduce((s, p) => s + p.budget, 0);
  const totalActual = reportProjects.reduce((s, p) => s + p.actualCost, 0);
  const avgProgress = reportProjects.length > 0 ? Math.round(reportProjects.reduce((s, p) => s + p.progress, 0) / reportProjects.length) : 0;
  const completedTasks = reportTasks.filter((t) => t.status === 'Completed').length;
  const openRisks = reportRisks.filter((r) => r.status === 'Open').length;

  const progressData = reportProjects.map((p) => ({ label: p.name.split(' ').slice(0, 2).join(' '), value: p.progress, color: '#d96e36' }));

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Project Reports" description="Generate weekly project reports" actions={
        <div className="flex items-center gap-2">
          <Select value={selectedProject} onChange={setSelectedProject} options={[{ value: 'all', label: 'All Projects' }, ...projects.map((p) => ({ value: p.name, label: p.name }))]} />
          <Button size="sm" onClick={() => setGenerated(true)}><FileText size={16} /> Generate Report</Button>
        </div>
      } />

      {!generated ? (
        <Card className="p-12 text-center">
          <BarChart3 size={48} className="text-charcoal-600 mx-auto mb-4" />
          <h3 className="text-lg font-display font-semibold text-cream-100">Weekly Project Report</h3>
          <p className="text-sm text-charcoal-400 mt-2 max-w-md mx-auto">Select a project (or all projects) and click Generate Report to see progress, budget status, issues, risks and upcoming activities.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {/* Summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <StatCard label="Overall Progress" value={`${avgProgress}%`} icon={<BarChart3 size={20} />} accent="terracotta" />
            <StatCard label="Total Budget" value={formatCurrency(totalBudget)} accent="sand" />
            <StatCard label="Actual Spend" value={formatCurrency(totalActual)} accent="red" />
            <StatCard label="Open Risks" value={openRisks} accent="terracotta" />
          </div>

          {/* Progress chart */}
          <Card className="p-5">
            <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Project Progress</h3>
            <BarChart data={progressData} formatValue={(v) => `${v}%`} />
          </Card>

          {/* Budget vs actual */}
          <Card className="p-5">
            <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Budget vs Actual Spending</h3>
            <LineChart
              labels={reportProjects.map((p) => p.name.split(' ').slice(0, 2).join(' '))}
              values={reportProjects.map((p) => p.actualCost / 1000000)}
              formatValue={(v) => `R${v.toFixed(1)}M`}
            />
          </Card>

          {/* Work completed / remaining */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Work Completed & Remaining</h3>
              <div className="space-y-3">
                {reportProjects.map((p) => (
                  <div key={p.id}>
                    <div className="flex items-center justify-between text-sm mb-1.5">
                      <span className="text-charcoal-300 truncate">{p.name}</span>
                      <span className="text-cream-100 font-medium shrink-0 ml-2">{p.progress}% / {100 - p.progress}%</span>
                    </div>
                    <ProgressBar value={p.progress} size="sm" />
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5">
              <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Budget Status</h3>
              <div className="space-y-2">
                {reportProjects.map((p) => (
                  <div key={p.id} className="flex items-center justify-between text-sm py-2 border-b border-charcoal-700/20 last:border-0">
                    <span className="text-charcoal-300 truncate">{p.name}</span>
                    <Badge variant={statusToVariant(p.health.budget)} size="sm">{p.health.budget}</Badge>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Issues & risks */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className="p-5">
              <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Issues ({reportInspections.filter((i) => i.status !== 'Passed').length})</h3>
              <div className="space-y-2">
                {reportInspections.filter((i) => i.status !== 'Passed').length === 0 ? (
                  <p className="text-sm text-charcoal-500">No open issues.</p>
                ) : reportInspections.filter((i) => i.status !== 'Passed').map((i) => (
                  <div key={i.id} className="flex items-center gap-2 text-sm">
                    <Badge variant={statusToVariant(i.status)} size="sm">{i.status}</Badge>
                    <span className="text-charcoal-300 truncate">{i.project}</span>
                  </div>
                ))}
              </div>
            </Card>
            <Card className="p-5">
              <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Risks ({reportRisks.length})</h3>
              <div className="space-y-2">
                {reportRisks.length === 0 ? <p className="text-sm text-charcoal-500">No risks recorded.</p> : reportRisks.map((r) => (
                  <div key={r.id} className="flex items-center gap-2 text-sm">
                    <Badge variant={statusToVariant(r.level)} size="sm">{r.level}</Badge>
                    <span className="text-charcoal-300 truncate flex-1">{r.risk}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Upcoming activities */}
          <Card className="p-5">
            <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Upcoming Activities</h3>
            <div className="space-y-2">
              {reportTasks.filter((t) => t.status !== 'Completed').slice(0, 6).map((t) => (
                <div key={t.id} className="flex items-center gap-3 text-sm py-2 border-b border-charcoal-700/20 last:border-0">
                  <span className="text-charcoal-300 flex-1 truncate">{t.name}</span>
                  <span className="text-charcoal-500 text-xs">{formatDate(t.dueDate)}</span>
                  <Badge variant={statusToVariant(t.status)} size="sm">{t.status}</Badge>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => window.print()}><Printer size={16} /> Print</Button>
            <Button onClick={() => window.print()}><Download size={16} /> Download PDF</Button>
          </div>
        </div>
      )}
    </div>
  );
}
