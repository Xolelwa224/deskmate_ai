import { useState } from 'react';
import { Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Badge, statusToVariant } from '../components/ui/Badge';
import { PageHeader } from '../components/ui/PageHeader';
import { Modal } from '../components/ui/Modal';
import { Input, Select } from '../components/ui/Form';
import { useStore } from '../store/StoreContext';
import { formatDate } from '../utils/format';

const categoryColors: Record<string, string> = {
  'Site Inspection': 'bg-terracotta-500/20 text-terracotta-300 border-terracotta-500/30',
  'Client Meeting': 'bg-olive-500/20 text-olive-300 border-olive-500/30',
  'Contractor Meeting': 'bg-sand-500/20 text-sand-300 border-sand-500/30',
  'Material Delivery': 'bg-blue-500/20 text-blue-300 border-blue-500/30',
  'Project Deadline': 'bg-red-500/20 text-red-300 border-red-500/30',
  'Handover': 'bg-purple-500/20 text-purple-300 border-purple-500/30',
};

const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function Calendar() {
  const { events, projects, addEvent } = useStore();
  const [showForm, setShowForm] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date('2026-08-27'));

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const monthEvents = events.filter((e) => {
    const d = new Date(e.date);
    return d.getFullYear() === year && d.getMonth() === month;
  });

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

  const days: (number | null)[] = [];
  for (let i = 0; i < firstDay; i++) days.push(null);
  for (let d = 1; d <= daysInMonth; d++) days.push(d);

  const getEventsForDay = (day: number) => monthEvents.filter((e) => new Date(e.date).getDate() === day);

  return (
    <div className="p-4 sm:p-6 pb-20 lg:pb-6 animate-fade-in">
      <PageHeader title="Calendar" description="Project events and deadlines" actions={<Button size="sm" onClick={() => setShowForm(true)}><Plus size={16} /> Add Event</Button>} />

      <Card className="p-4 sm:p-5">
        <div className="flex items-center justify-between mb-4">
          <button onClick={prevMonth} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><ChevronLeft size={20} /></button>
          <h3 className="text-base font-display font-bold text-cream-100">{monthNames[month]} {year}</h3>
          <button onClick={nextMonth} className="p-2 rounded-lg text-charcoal-400 hover:text-cream-100 hover:bg-charcoal-700/50 transition-colors"><ChevronRight size={20} /></button>
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2 mb-2">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} className="text-center text-xs font-medium text-charcoal-500 py-1">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-1 sm:gap-2">
          {days.map((day, idx) => {
            if (day === null) return <div key={idx} />;
            const dayEvents = getEventsForDay(day);
            const isToday = day === 27 && month === 7 && year === 2026;
            return (
              <div key={idx} className={`min-h-[60px] sm:min-h-[80px] rounded-lg p-1.5 border ${isToday ? 'border-terracotta-500/50 bg-terracotta-500/5' : 'border-charcoal-700/40 bg-charcoal-900/30'}`}>
                <span className={`text-xs ${isToday ? 'text-terracotta-400 font-bold' : 'text-charcoal-400'}`}>{day}</span>
                <div className="space-y-0.5 mt-1">
                  {dayEvents.slice(0, 2).map((e) => (
                    <div key={e.id} className={`text-[9px] sm:text-[10px] px-1 py-0.5 rounded border truncate ${categoryColors[e.category] || 'bg-charcoal-700/40 text-charcoal-300'}`} title={e.title}>
                      {e.title}
                    </div>
                  ))}
                  {dayEvents.length > 2 && <div className="text-[9px] text-charcoal-500">+{dayEvents.length - 2} more</div>}
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Legend + Upcoming */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mt-4">
        <Card className="p-4">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-3">Event Categories</h3>
          <div className="flex flex-wrap gap-2">
            {Object.entries(categoryColors).map(([cat, color]) => (
              <span key={cat} className={`text-xs px-2 py-1 rounded border ${color}`}>{cat}</span>
            ))}
          </div>
        </Card>
        <Card className="p-4">
          <h3 className="text-sm font-display font-semibold text-cream-100 mb-3">Upcoming Events</h3>
          <div className="space-y-2">
            {events.slice(0, 5).map((e) => (
              <div key={e.id} className="flex items-center gap-3 text-sm">
                <div className={`w-2 h-2 rounded-full shrink-0 ${categoryColors[e.category]?.split(' ')[0] || 'bg-charcoal-600'}`} />
                <span className="text-cream-100 flex-1 min-w-0 truncate">{e.title}</span>
                <span className="text-xs text-charcoal-500 shrink-0">{formatDate(e.date)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {showForm && <EventFormModal onClose={() => setShowForm(false)} onSave={(data) => { addEvent(data); setShowForm(false); }} projects={projects.map((p) => p.name)} />}
    </div>
  );
}

function EventFormModal({ onClose, onSave, projects }: { onClose: () => void; onSave: (data: any) => void; projects: string[] }) {
  const [form, setForm] = useState({
    title: '', date: new Date().toISOString().split('T')[0], category: 'Site Inspection', project: '',
  });
  const set = (k: string, v: string) => setForm((p) => ({ ...p, [k]: v }));

  const submit = () => {
    if (!form.title.trim()) return;
    onSave(form);
  };

  return (
    <Modal open onClose={onClose} title="Add Event" size="md"
      footer={<><Button variant="ghost" onClick={onClose}>Cancel</Button><Button onClick={submit}>Add Event</Button></>}>
      <div className="space-y-4">
        <Input label="Event Title" value={form.title} onChange={(v) => set('title', v)} required placeholder="e.g. Site inspection" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input label="Date" type="date" value={form.date} onChange={(v) => set('date', v)} />
          <Select label="Category" value={form.category} onChange={(v) => set('category', v)} options={[
            { value: 'Site Inspection', label: 'Site Inspection' }, { value: 'Client Meeting', label: 'Client Meeting' },
            { value: 'Contractor Meeting', label: 'Contractor Meeting' }, { value: 'Material Delivery', label: 'Material Delivery' },
            { value: 'Project Deadline', label: 'Project Deadline' }, { value: 'Handover', label: 'Handover' },
          ]} />
        </div>
        <Select label="Project" value={form.project} onChange={(v) => set('project', v)} placeholder="Select project" options={projects.map((p) => ({ value: p, label: p }))} />
      </div>
    </Modal>
  );
}
