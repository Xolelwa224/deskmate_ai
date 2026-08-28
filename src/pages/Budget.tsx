import { useState } from 'react';
import { Plus, Wallet, AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';
import { Card, StatCard } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge } from '../components/ui/Badge';
import { BarChart } from '../components/ui/Charts';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatCurrencyFull, formatCurrency, formatDate } from '../utils/format';
import { costCategories } from '../data/seed';

export function Budget() {
  const { projects, expenses, addExpense } = useStore();
  const [selectedProject, setSelectedProject] = useState(projects[0]?.name || '');
  const [showAdd, setShowAdd] = useState(false);

  const project = projects.find((p) => p.name === selectedProject);
  const projectExpenses = expenses.filter((e) => e.project === selectedProject);
  const totalSpend = projectExpenses.reduce((sum, e) => sum + e.amount, 0);
  const budget = project?.budget || 0;
  const remaining = budget - totalSpend;
  const usedPct = budget > 0 ? (totalSpend / budget) * 100 : 0;

  const allBudgets = projects.map((p) => p.budget).reduce((a, b) => a + b, 0);
  const allSpend = projects.map((p) => p.actualCost).reduce((a, b) => a + b, 0);

  const byCategory = costCategories.map((cat) => ({
    label: cat,
    value: projectExpenses.filter((e) => e.category === cat).reduce((sum, e) => sum + e.amount, 0),
  })).filter((d) => d.value > 0);

  const budgetAlerts = projects.filter((p) => p.health.budget === 'Over Budget' || (p.budget > 0 && (p.actualCost / p.budget) * 100 >= 80));

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Budget & Costs" description="Track project spending against budgets" actions={<Button size="sm" onClick={() => setShowAdd(true)}><Plus size={16} /> Add Expense</Button>} />

      <div className="mb-5">
        <Select label="Select Project" value={selectedProject} onChange={setSelectedProject} options={projects.map((p) => ({ value: p.name, label: p.name }))} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-5">
        <StatCard label="Estimated Budget" value={formatCurrency(budget)} icon={<Wallet size={20} />} accent="terracotta" />
        <StatCard label="Actual Spend" value={formatCurrency(totalSpend)} icon={<TrendingDown size={20} />} accent="red" />
        <StatCard label="Remaining" value={formatCurrency(Math.max(0, remaining))} icon={<TrendingUp size={20} />} accent="olive" />
        <StatCard label="Budget Used" value={`${Math.round(usedPct)}%`} icon={<AlertTriangle size={20} />} accent={usedPct > 90 ? 'red' : 'sand'} />
      </div>

      {/* Budget alert */}
      {budgetAlerts.length > 0 && (
        <Card className="p-4 mb-5 border-terracotta-600/30 bg-terracotta-600/5">
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-terracotta-400 shrink-0 mt-0.5" />
            <div>
              <h3 className="text-sm font-display font-semibold text-terracotta-300">Budget Alert</h3>
              {budgetAlerts.map((p) => {
                const pct = Math.round((p.actualCost / p.budget) * 100);
                return <p key={p.id} className="text-sm text-charcoal-300 mt-1">{formatCurrencyFull(p.actualCost)} of the {formatCurrencyFull(p.budget)} budget for {p.name} has been used ({pct}%).</p>;
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-5">
        <Card className="p-5">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Spending by Category</h3>
          {byCategory.length > 0 ? (
            <BarChart data={byCategory.map((d) => ({ ...d, color: '#d96e36' }))} formatValue={(v) => formatCurrency(v)} />
          ) : <p className="text-sm text-charcoal-500 py-8 text-center">No expenses recorded for this project yet.</p>}
        </Card>
        <Card className="p-5">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Budget vs Actual (All Projects)</h3>
          <BarChart
            data={projects.slice(0, 6).map((p) => ({ label: p.name.split(' ').slice(0, 2).join(' '), value: p.actualCost, color: '#d96e36' }))}
            formatValue={(v) => formatCurrency(v)}
          />
        </Card>
      </div>

      {/* Expenses table */}
      <Card className="p-5">
        <h3 className="text-sm font-display font-semibold text-cream-100 mb-4">Recent Expenses — {selectedProject}</h3>
        <div className="overflow-x-auto -mx-5 px-5">
          <table className="w-full text-sm min-w-[500px]">
            <thead>
              <tr className="text-left text-xs text-charcoal-500 uppercase tracking-wider border-b border-charcoal-700/40">
                <th className="pb-2 pr-4">Date</th>
                <th className="pb-2 pr-4">Category</th>
                <th className="pb-2 pr-4">Description</th>
                <th className="pb-2 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              {projectExpenses.length === 0 ? (
                <tr><td colSpan={4} className="py-6 text-center text-charcoal-500">No expenses recorded</td></tr>
              ) : projectExpenses.map((e) => (
                <tr key={e.id} className="border-b border-charcoal-700/20">
                  <td className="py-2.5 pr-4 text-charcoal-300 whitespace-nowrap">{formatDate(e.date)}</td>
                  <td className="py-2.5 pr-4"><Badge variant="info" size="sm">{e.category}</Badge></td>
                  <td className="py-2.5 pr-4 text-cream-100">{e.description}</td>
                  <td className="py-2.5 text-right text-cream-100 font-medium tabular-nums">{formatCurrencyFull(e.amount)}</td>
                </tr>
              ))}
            </tbody>
            {projectExpenses.length > 0 && (
              <tfoot>
                <tr className="border-t border-charcoal-700/40">
                  <td colSpan={3} className="pt-3 text-charcoal-400 font-medium">Total</td>
                  <td className="pt-3 text-right text-terracotta-400 font-display font-bold tabular-nums">{formatCurrencyFull(totalSpend)}</td>
                </tr>
              </tfoot>
            )}
          </table>
        </div>
      </Card>

      {showAdd && <AddExpenseModal onClose={() => setShowAdd(false)} onAdd={addExpense} projects={projects.map((p) => p.name)} defaultProject={selectedProject} />}
    </div>
  );
}

function AddExpenseModal({ onClose, onAdd, projects, defaultProject }: { onClose: () => void; onAdd: (e: any) => void; projects: string[]; defaultProject: string }) {
  const [form, setForm] = useState({
    project: defaultProject, category: 'Labour', description: '', amount: '', date: new Date().toISOString().split('T')[0],
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.description.trim() || !form.amount) return;
    onAdd({ ...form, amount: Number(form.amount) || 0 });
    onClose();
  };

  return (
    <Modal open onClose={onClose} title="Add Expense" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Expense</Button></>}>
      <div className="space-y-4">
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} options={projects.map((p) => ({ value: p, label: p }))} />
        <Select label="Category" value={form.category} onChange={(v) => set('category', v)} options={costCategories.map((c) => ({ value: c, label: c }))} />
        <Input label="Description" value={form.description} onChange={(v) => set('description', v)} required placeholder="e.g. Ready-mix concrete delivery" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Amount (R)" type="number" value={form.amount} onChange={(v) => set('amount', v)} required placeholder="0" />
          <Input label="Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
        </div>
      </div>
    </Modal>
  );
}
