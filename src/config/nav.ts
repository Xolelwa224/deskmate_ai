import {
  LayoutDashboard, HardHat, Users, FileText, ClipboardCheck, Package,
  Wallet, CheckSquare, Calendar, BarChart3, FolderOpen, Sparkles, Settings,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  group: 'main' | 'management' | 'tools';
}

export const navItems: NavItem[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, group: 'main' },
  { id: 'projects', label: 'Projects', icon: HardHat, group: 'main' },
  { id: 'clients', label: 'Clients', icon: Users, group: 'main' },
  { id: 'quotations', label: 'Quotations', icon: FileText, group: 'management' },
  { id: 'inspections', label: 'Site Inspections', icon: ClipboardCheck, group: 'management' },
  { id: 'materials', label: 'Materials', icon: Package, group: 'management' },
  { id: 'budget', label: 'Budget & Costs', icon: Wallet, group: 'management' },
  { id: 'tasks', label: 'Tasks', icon: CheckSquare, group: 'management' },
  { id: 'calendar', label: 'Calendar', icon: Calendar, group: 'management' },
  { id: 'reports', label: 'Project Reports', icon: BarChart3, group: 'management' },
  { id: 'risk', label: 'Risk Register', icon: FolderOpen, group: 'management' },
  { id: 'safety', label: 'Safety & Quality', icon: ClipboardCheck, group: 'management' },
  { id: 'resources', label: 'Resources', icon: FolderOpen, group: 'tools' },
  { id: 'calculators', label: 'Calculators', icon: BarChart3, group: 'tools' },
  { id: 'enquiries', label: 'Client Enquiries', icon: Users, group: 'tools' },
  { id: 'ai-assistant', label: 'BuildAssist', icon: Sparkles, group: 'tools' },
  { id: 'settings', label: 'Settings', icon: Settings, group: 'tools' },
];

export const groupLabels: Record<string, string> = {
  main: 'Main',
  management: 'Project Management',
  tools: 'Tools & Support',
};
