export interface Appointment {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  customerAddress: string;
  technicianId: string;
  technicianName: string;
  date: string;
  endDate: string;
  status: 'offen' | 'blocker' | 'bestätigt' | 'abgesagt';
  travelTime?: number;
}

export interface Technician {
  id: string;
  name: string;
  email: string;
  calendarId: string;
  color: string;
}

export interface EmailQueueItem {
  id: string;
  to: string;
  subject: string;
  status: 'pending' | 'sent' | 'failed';
  sentAt?: string;
  error?: string;
}

export interface WorkflowStatus {
  running: boolean;
  lastRun?: string;
  nextRun?: string;
  appointmentsPlanned: number;
  appointmentsConfirmed: number;
  appointmentsCancelled: number;
}
