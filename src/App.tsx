import { useState, useEffect } from 'react';
import { Calendar, Users, Mail, Play, Pause, RefreshCw, MapPin, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';
import type { Appointment, Technician, EmailQueueItem, WorkflowStatus } from './types';
import WeekView from './components/WeekView';
import StatusOverview from './components/StatusOverview';
import TechnicianCard from './components/TechnicianCard';
import EmailQueue from './components/EmailQueue';

// Demo-Daten
const demoTechnicians: Technician[] = [
  { id: '1', name: 'Max Müller', email: 'max@almas.de', calendarId: 'cal1', color: '#3B82F6' },
  { id: '2', name: 'Anna Schmidt', email: 'anna@almas.de', calendarId: 'cal2', color: '#10B981' },
  { id: '3', name: 'Peter Weber', email: 'peter@almas.de', calendarId: 'cal3', color: '#F59E0B' },
];

const demoAppointments: Appointment[] = [
  {
    id: '1',
    customerId: 'c1',
    customerName: 'Firma ABC GmbH',
    customerEmail: 'info@abc-gmbh.de',
    customerAddress: 'Hauptstraße 1, 60311 Frankfurt',
    technicianId: '1',
    technicianName: 'Max Müller',
    date: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    status: 'bestätigt',
    travelTime: 25,
  },
  {
    id: '2',
    customerId: 'c2',
    customerName: 'XYZ Industries',
    customerEmail: 'kontakt@xyz.de',
    customerAddress: 'Industriepark 5, 65929 Frankfurt',
    technicianId: '1',
    technicianName: 'Max Müller',
    date: new Date(Date.now() + 86400000 + 7200000).toISOString(),
    endDate: new Date(Date.now() + 86400000 + 10800000).toISOString(),
    status: 'blocker',
    travelTime: 35,
  },
  {
    id: '3',
    customerId: 'c3',
    customerName: 'Tech Solutions AG',
    customerEmail: 'office@techsol.de',
    customerAddress: 'Techpark 10, 64283 Darmstadt',
    technicianId: '2',
    technicianName: 'Anna Schmidt',
    date: new Date(Date.now() + 172800000).toISOString(),
    endDate: new Date(Date.now() + 172800000 + 3600000).toISOString(),
    status: 'offen',
    travelTime: 45,
  },
  {
    id: '4',
    customerId: 'c4',
    customerName: 'Global Services',
    customerEmail: 'service@global.de',
    customerAddress: 'Messeturm 1, 60308 Frankfurt',
    technicianId: '3',
    technicianName: 'Peter Weber',
    date: new Date(Date.now() + 86400000).toISOString(),
    endDate: new Date(Date.now() + 86400000 + 3600000).toISOString(),
    status: 'abgesagt',
    travelTime: 15,
  },
];

const demoEmailQueue: EmailQueueItem[] = [
  { id: 'e1', to: 'info@abc-gmbh.de', subject: 'Terminvorschlag für Service', status: 'sent', sentAt: new Date(Date.now() - 3600000).toISOString() },
  { id: 'e2', to: 'kontakt@xyz.de', subject: 'Terminvorschlag für Service', status: 'sent', sentAt: new Date(Date.now() - 1800000).toISOString() },
  { id: 'e3', to: 'office@techsol.de', subject: 'Terminvorschlag für Service', status: 'pending' },
];

function App() {
  const [appointments, setAppointments] = useState<Appointment[]>(demoAppointments);
  const [technicians] = useState<Technician[]>(demoTechnicians);
  const [emailQueue] = useState<EmailQueueItem[]>(demoEmailQueue);
  const [workflowStatus, setWorkflowStatus] = useState<WorkflowStatus>({
    running: false,
    lastRun: new Date(Date.now() - 3600000).toISOString(),
    nextRun: new Date(Date.now() + 3600000).toISOString(),
    appointmentsPlanned: 4,
    appointmentsConfirmed: 1,
    appointmentsCancelled: 1,
  });
  const [activeTab, setActiveTab] = useState<'overview' | 'week' | 'technicians' | 'emails'>('overview');
  const [loading, setLoading] = useState(false);

  const toggleWorkflow = async () => {
    setLoading(true);
    // API call würde hier hin
    await new Promise(resolve => setTimeout(resolve, 500));
    setWorkflowStatus(prev => ({ ...prev, running: !prev.running }));
    setLoading(false);
  };

  const refreshData = async () => {
    setLoading(true);
    // API call würde hier hin
    await new Promise(resolve => setTimeout(resolve, 1000));
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Techniker-Planung</h1>
                <p className="text-sm text-gray-500">ALMAS Industries</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Workflow Status */}
              <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium ${
                workflowStatus.running ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
              }`}>
                <div className={`w-2 h-2 rounded-full ${workflowStatus.running ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
                {workflowStatus.running ? 'Aktiv' : 'Gestoppt'}
              </div>
              
              {/* Controls */}
              <button
                onClick={toggleWorkflow}
                disabled={loading}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  workflowStatus.running
                    ? 'bg-red-100 text-red-700 hover:bg-red-200'
                    : 'bg-green-100 text-green-700 hover:bg-green-200'
                }`}
              >
                {workflowStatus.running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                {workflowStatus.running ? 'Stoppen' : 'Starten'}
              </button>
              
              <button
                onClick={refreshData}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Aktualisieren
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex gap-8">
            {[
              { id: 'overview', label: 'Übersicht', icon: AlertCircle },
              { id: 'week', label: 'Wochenansicht', icon: Calendar },
              { id: 'technicians', label: 'Techniker', icon: Users },
              { id: 'emails', label: 'E-Mail Queue', icon: Mail },
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`flex items-center gap-2 px-1 py-4 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        {activeTab === 'overview' && (
          <StatusOverview 
            appointments={appointments} 
            workflowStatus={workflowStatus} 
          />
        )}
        
        {activeTab === 'week' && (
          <WeekView 
            appointments={appointments} 
            technicians={technicians} 
          />
        )}
        
        {activeTab === 'technicians' && (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {technicians.map(tech => (
              <TechnicianCard
                key={tech.id}
                technician={tech}
                appointments={appointments.filter(a => a.technicianId === tech.id)}
              />
            ))}
          </div>
        )}
        
        {activeTab === 'emails' && (
          <EmailQueue items={emailQueue} />
        )}
      </main>
    </div>
  );
}

export default App;
