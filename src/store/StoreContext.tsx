import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import type {
  Project, Client, Quotation, Expense, Material, Inspection, Task,
  CalendarEvent, Risk, SafetyItem, DocumentItem, Notification, Enquiry, ChatMessage,
} from '../types';
import {
  seedProjects, seedClients, seedQuotations, seedExpenses, seedMaterials,
  seedInspections, seedTasks, seedCalendarEvents, seedRisks, seedSafetyItems,
  seedDocuments, seedNotifications,
} from '../data/seed';

interface StoreData {
  projects: Project[];
  clients: Client[];
  quotations: Quotation[];
  expenses: Expense[];
  materials: Material[];
  inspections: Inspection[];
  tasks: Task[];
  events: CalendarEvent[];
  risks: Risk[];
  safetyItems: SafetyItem[];
  documents: DocumentItem[];
  notifications: Notification[];
  enquiries: Enquiry[];
  chatMessages: ChatMessage[];
}

const STORAGE_KEY = 'xolelwa-buildconsult-data';

function loadFromStorage(): StoreData {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch {
    /* ignore */
  }
  return {
    projects: seedProjects,
    clients: seedClients,
    quotations: seedQuotations,
    expenses: seedExpenses,
    materials: seedMaterials,
    inspections: seedInspections,
    tasks: seedTasks,
    events: seedCalendarEvents,
    risks: seedRisks,
    safetyItems: seedSafetyItems,
    documents: seedDocuments,
    notifications: seedNotifications,
    enquiries: [],
    chatMessages: [],
  };
}

interface StoreContextValue extends StoreData {
  addProject: (p: Omit<Project, 'id' | 'phases' | 'health'>) => void;
  updateProject: (id: string, updates: Partial<Project>) => void;
  addClient: (c: Omit<Client, 'id'>) => void;
  updateClient: (id: string, updates: Partial<Client>) => void;
  addQuotation: (q: Omit<Quotation, 'id' | 'number'>) => void;
  updateQuotation: (id: string, updates: Partial<Quotation>) => void;
  addExpense: (e: Omit<Expense, 'id'>) => void;
  addMaterial: (m: Omit<Material, 'id'>) => void;
  updateMaterial: (id: string, updates: Partial<Material>) => void;
  addInspection: (i: Omit<Inspection, 'id'>) => void;
  addTask: (t: Omit<Task, 'id'>) => void;
  updateTask: (id: string, updates: Partial<Task>) => void;
  addEvent: (e: Omit<CalendarEvent, 'id'>) => void;
  addRisk: (r: Omit<Risk, 'id'>) => void;
  updateRisk: (id: string, updates: Partial<Risk>) => void;
  addSafetyItem: (s: Omit<SafetyItem, 'id'>) => void;
  updateSafetyItem: (id: string, updates: Partial<SafetyItem>) => void;
  addEnquiry: (e: Omit<Enquiry, 'id'>) => void;
  updateEnquiry: (id: string, updates: Partial<Enquiry>) => void;
  markNotificationRead: (id: string) => void;
  markAllNotificationsRead: () => void;
  addChatMessage: (m: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  resetData: () => void;
}

const StoreContext = createContext<StoreContextValue | null>(null);

let idCounter = 1000;
function nextId(prefix: string): string {
  idCounter += 1;
  return `${prefix}${idCounter}`;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [data, setData] = useState<StoreData>(loadFromStorage);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch {
      /* ignore */
    }
  }, [data]);

  const update = (partial: Partial<StoreData>) => setData((prev) => ({ ...prev, ...partial }));

  const value: StoreContextValue = {
    ...data,

    addProject: (p) => update({
      projects: [...data.projects, {
        ...p, id: nextId('p'),
        phases: [
          { name: 'Planning', complete: true },
          { name: 'Design', complete: false },
          { name: 'Preparation', complete: false },
          { name: 'Foundation', complete: false },
          { name: 'Structure', complete: false },
          { name: 'Finishing', complete: false },
          { name: 'Inspection', complete: false },
          { name: 'Handover', complete: false },
        ],
        health: { budget: 'On Track', schedule: 'On Track', quality: 'Good', overall: 'On Track' },
      }],
    }),
    updateProject: (id, updates) => update({
      projects: data.projects.map((p) => p.id === id ? { ...p, ...updates } : p),
    }),

    addClient: (c) => update({ clients: [...data.clients, { ...c, id: nextId('c') }] }),
    updateClient: (id, updates) => update({
      clients: data.clients.map((c) => c.id === id ? { ...c, ...updates } : c),
    }),

    addQuotation: (q) => {
      const num = `QT-${108 + data.quotations.length}`;
      update({ quotations: [...data.quotations, { ...q, id: nextId('q'), number: num }] });
    },
    updateQuotation: (id, updates) => update({
      quotations: data.quotations.map((q) => q.id === id ? { ...q, ...updates } : q),
    }),

    addExpense: (e) => update({ expenses: [{ ...e, id: nextId('e') }, ...data.expenses] }),
    addMaterial: (m) => update({ materials: [...data.materials, { ...m, id: nextId('m') }] }),
    updateMaterial: (id, updates) => update({
      materials: data.materials.map((m) => m.id === id ? { ...m, ...updates } : m),
    }),

    addInspection: (i) => update({ inspections: [{ ...i, id: nextId('i') }, ...data.inspections] }),
    addTask: (t) => update({ tasks: [...data.tasks, { ...t, id: nextId('t') }] }),
    updateTask: (id, updates) => update({
      tasks: data.tasks.map((t) => t.id === id ? { ...t, ...updates } : t),
    }),

    addEvent: (e) => update({ events: [...data.events, { ...e, id: nextId('ev') }] }),
    addRisk: (r) => update({ risks: [...data.risks, { ...r, id: nextId('r') }] }),
    updateRisk: (id, updates) => update({
      risks: data.risks.map((r) => r.id === id ? { ...r, ...updates } : r),
    }),

    addSafetyItem: (s) => update({ safetyItems: [{ ...s, id: nextId('s') }, ...data.safetyItems] }),
    updateSafetyItem: (id, updates) => update({
      safetyItems: data.safetyItems.map((s) => s.id === id ? { ...s, ...updates } : s),
    }),

    addEnquiry: (e) => {
      const enquiry = { ...e, id: nextId('enq') };
      update({
        enquiries: [enquiry, ...data.enquiries],
        notifications: [
          { id: nextId('n'), message: `New client enquiry received from ${e.fullName}.`, type: 'client', read: false, date: new Date().toISOString().split('T')[0] },
          ...data.notifications,
        ],
      });
    },
    updateEnquiry: (id, updates) => update({
      enquiries: data.enquiries.map((e) => e.id === id ? { ...e, ...updates } : e),
    }),

    markNotificationRead: (id) => update({
      notifications: data.notifications.map((n) => n.id === id ? { ...n, read: true } : n),
    }),
    markAllNotificationsRead: () => update({
      notifications: data.notifications.map((n) => ({ ...n, read: true })),
    }),

    addChatMessage: (m) => update({
      chatMessages: [...data.chatMessages, { ...m, id: nextId('msg'), timestamp: new Date().toISOString() }],
    }),

    resetData: () => {
      localStorage.removeItem(STORAGE_KEY);
      setData(loadFromStorage());
    },
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error('useStore must be used within StoreProvider');
  return ctx;
}
