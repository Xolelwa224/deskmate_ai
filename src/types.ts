export type ProjectType =
  | 'Residential'
  | 'Commercial'
  | 'Renovation'
  | 'Infrastructure'
  | 'Interior'
  | 'New Construction';

export type ProjectStatus = 'On Track' | 'At Risk' | 'Delayed' | 'Completed' | 'Planning';

export type ProjectPhase =
  | 'Planning'
  | 'Design'
  | 'Preparation'
  | 'Foundation'
  | 'Structure'
  | 'Finishing'
  | 'Inspection'
  | 'Handover';

export interface ProjectPhaseInfo {
  name: ProjectPhase;
  complete: boolean;
  date?: string;
}

export interface Project {
  id: string;
  name: string;
  type: ProjectType;
  location: string;
  image: string;
  description: string;
  client: string;
  manager: string;
  startDate: string;
  expectedCompletion: string;
  budget: number;
  actualCost: number;
  progress: number;
  status: ProjectStatus;
  phases: ProjectPhaseInfo[];
  health: {
    budget: 'On Track' | 'Over Budget' | 'Under Budget';
    schedule: 'On Track' | 'Slight Delay' | 'Delayed';
    quality: 'Good' | 'Attention Required' | 'Poor';
    overall: 'On Track' | 'At Risk' | 'Off Track';
  };
}

export interface Client {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  project: string;
  projectValue: number;
  status: 'Active' | 'Prospect' | 'Inactive';
  lastCommunication: string;
}

export interface QuotationLine {
  description: string;
  amount: number;
}

export interface Quotation {
  id: string;
  number: string;
  client: string;
  project: string;
  description: string;
  labour: number;
  materials: number;
  equipment: number;
  professionalFees: number;
  otherCosts: number;
  vat: number;
  status: 'Draft' | 'Sent' | 'Under Review' | 'Accepted' | 'Declined';
  date: string;
}

export interface Expense {
  id: string;
  project: string;
  category: string;
  description: string;
  amount: number;
  date: string;
}

export interface Material {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  status: 'Available' | 'Low Stock' | 'Ordered' | 'Out of Stock';
  reorderLevel: number;
}

export interface Inspection {
  id: string;
  project: string;
  inspector: string;
  date: string;
  weather: string;
  siteConditions: string;
  workCompleted: string;
  issuesIdentified: string;
  safetyObservations: string;
  materialsDelivered: string;
  recommendedActions: string;
  status: 'Passed' | 'Attention Required' | 'Critical';
}

export interface Task {
  id: string;
  name: string;
  project: string;
  assignedTo: string;
  priority: 'Low' | 'Medium' | 'High' | 'Critical';
  dueDate: string;
  status: 'To Do' | 'In Progress' | 'Blocked' | 'Completed';
}

export interface CalendarEvent {
  id: string;
  title: string;
  date: string;
  category: 'Site Inspection' | 'Client Meeting' | 'Contractor Meeting' | 'Material Delivery' | 'Project Deadline' | 'Handover';
  project: string;
}

export interface Risk {
  id: string;
  risk: string;
  project: string;
  probability: 'Low' | 'Medium' | 'High';
  impact: 'Low' | 'Medium' | 'High';
  level: 'Low' | 'Medium' | 'High';
  mitigation: string;
  owner: string;
  status: 'Open' | 'Mitigated' | 'Closed';
}

export interface SafetyItem {
  id: string;
  type: 'Safety Observation' | 'Incident Report' | 'Quality Check' | 'Outstanding Defect';
  title: string;
  project: string;
  description: string;
  severity: 'Low' | 'Medium' | 'High';
  status: 'Open' | 'Resolved';
  date: string;
}

export interface DocumentItem {
  id: string;
  name: string;
  type: 'Project Plan' | 'Quotation' | 'Contract' | 'Inspection Report' | 'Safety Document' | 'Invoice' | 'Project Photo';
  project: string;
  size: string;
  date: string;
}

export interface Notification {
  id: string;
  message: string;
  type: 'inspection' | 'budget' | 'quotation' | 'task' | 'client' | 'general';
  read: boolean;
  date: string;
}

export interface Enquiry {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  projectType: ProjectType | 'Other';
  location: string;
  estimatedBudget: string;
  expectedStartDate: string;
  description: string;
  date: string;
  status: 'New' | 'Reviewed' | 'Contacted';
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}
