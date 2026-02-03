import { CheckCircle, XCircle, Clock, Calendar, TrendingUp, AlertTriangle } from 'lucide-react';
import type { Appointment, WorkflowStatus } from '../types';

interface StatusOverviewProps {
  appointments: Appointment[];
  workflowStatus: WorkflowStatus;
}

export default function StatusOverview({ appointments, workflowStatus }: StatusOverviewProps) {
  const stats = {
    total: appointments.length,
    confirmed: appointments.filter(a => a.status === 'bestätigt').length,
    pending: appointments.filter(a => a.status === 'blocker' || a.status === 'offen').length,
    cancelled: appointments.filter(a => a.status === 'abgesagt').length,
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-4">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Gesamt geplant</p>
              <p className="text-3xl font-bold text-gray-900 mt-1">{stats.total}</p>
            </div>
            <div className="bg-blue-100 p-3 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Bestätigt</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{stats.confirmed}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ausstehend</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{stats.pending}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Abgesagt</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{stats.cancelled}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <XCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Workflow Info */}
      <div className="bg-white rounded-xl p-6 shadow-sm border">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Workflow Status</h2>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <Clock className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Letzter Lauf</p>
              <p className="font-medium">{formatDate(workflowStatus.lastRun)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <TrendingUp className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Nächster Lauf</p>
              <p className="font-medium">{formatDate(workflowStatus.nextRun)}</p>
            </div>
          </div>
          <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg">
            <AlertTriangle className="h-5 w-5 text-gray-400" />
            <div>
              <p className="text-sm text-gray-500">Status</p>
              <p className={`font-medium ${workflowStatus.running ? 'text-green-600' : 'text-gray-600'}`}>
                {workflowStatus.running ? 'Läuft' : 'Gestoppt'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Appointments */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Aktuelle Termine</h2>
        </div>
        <div className="divide-y">
          {appointments.slice(0, 5).map(apt => (
            <div key={apt.id} className="p-4 hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`w-3 h-3 rounded-full ${
                    apt.status === 'bestätigt' ? 'bg-green-500' :
                    apt.status === 'abgesagt' ? 'bg-red-500' :
                    apt.status === 'blocker' ? 'bg-blue-500' : 'bg-yellow-500'
                  }`} />
                  <div>
                    <p className="font-medium text-gray-900">{apt.customerName}</p>
                    <p className="text-sm text-gray-500">{apt.customerAddress}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {new Date(apt.date).toLocaleDateString('de-DE')}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(apt.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                  </p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  apt.status === 'bestätigt' ? 'bg-green-100 text-green-800' :
                  apt.status === 'abgesagt' ? 'bg-red-100 text-red-800' :
                  apt.status === 'blocker' ? 'bg-blue-100 text-blue-800' : 'bg-yellow-100 text-yellow-800'
                }`}>
                  {apt.status.charAt(0).toUpperCase() + apt.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
