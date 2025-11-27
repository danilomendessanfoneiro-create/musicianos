
export enum LeadStatus {
  NEW = 'Contato',
  CONTACTED = '1º Contato',
  NEGOTIATING = 'Negociação/Retorno',
  BOOKED = 'Fechado',
  LOST = 'Perdido'
}

export interface Lead {
  id: string;
  name: string;
  venue: string;
  channel: string; // New field
  value: number;
  status: LeadStatus;
  lastContact: string;
}

export interface Gig {
  id: string;
  date: string;
  city: string;
  venue: string;
  eventType: string; // New field
  fee: number;
  cost: number; // Travel, gear, etc.
  notes: string;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
}

export interface Project {
  id: string;
  title: string;
  dueDate: string;
  cost: number; // New field
  status: 'planning' | 'in-progress' | 'completed';
  description: string;
}

export type ViewState = 'dashboard' | 'crm' | 'gigs' | 'finance' | 'projects';
