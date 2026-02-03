import { MapPin, Clock, Calendar, Navigation } from 'lucide-react';
import type { Appointment, Technician } from '../types';

interface TechnicianCardProps {
  technician: Technician;
  appointments: Appointment[];
}

export default function TechnicianCard({ technician, appointments }: TechnicianCardProps) {
  const todayAppointments = appointments.filter(apt => {
    const aptDate = new Date(apt.date);
    const today = new Date();
    return (
      aptDate.getDate() === today.getDate() &&
      aptDate.getMonth() === today.getMonth() &&
      aptDate.getFullYear() === today.getFullYear() &&
      apt.status !== 'abgesagt'
    );
  });

  const nextAppointment = appointments
    .filter(apt => new Date(apt.date) > new Date() && apt.status !== 'abgesagt')
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())[0];

  const totalTravelTime = todayAppointments.reduce((sum, apt) => sum + (apt.travelTime || 0), 0);
  const confirmedCount = appointments.filter(a => a.status === 'bestätigt').length;
  const pendingCount = appointments.filter(a => a.status === 'blocker' || a.status === 'offen').length;

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div 
        className="p-4 text-white"
        style={{ backgroundColor: technician.color }}
      >
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center text-xl font-bold">
            {technician.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="font-semibold text-lg">{technician.name}</h3>
            <p className="text-white/80 text-sm">{technician.email}</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="p-4 grid grid-cols-3 gap-4 border-b">
        <div className="text-center">
          <p className="text-2xl font-bold text-gray-900">{todayAppointments.length}</p>
          <p className="text-xs text-gray-500">Heute</p>
        </div>
        <div className="text-center border-x">
          <p className="text-2xl font-bold text-green-600">{confirmedCount}</p>
          <p className="text-xs text-gray-500">Bestätigt</p>
        </div>
        <div className="text-center">
          <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
          <p className="text-xs text-gray-500">Ausstehend</p>
        </div>
      </div>

      {/* Today's Route */}
      <div className="p-4 border-b">
        <div className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-3">
          <Navigation className="h-4 w-4" />
          Heutige Tour
        </div>
        {todayAppointments.length > 0 ? (
          <div className="space-y-2">
            {todayAppointments.map((apt, idx) => (
              <div key={apt.id} className="flex items-start gap-2">
                <div className="flex flex-col items-center">
                  <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium ${
                    apt.status === 'bestätigt' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                  }`}>
                    {idx + 1}
                  </div>
                  {idx < todayAppointments.length - 1 && (
                    <div className="w-0.5 h-8 bg-gray-200 my-1" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">{apt.customerName}</p>
                  <p className="text-xs text-gray-500 truncate">{apt.customerAddress}</p>
                  <p className="text-xs text-gray-400">
                    {new Date(apt.date).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr
                    {apt.travelTime && ` • ${apt.travelTime} min Fahrt`}
                  </p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 text-center py-4">Keine Termine heute</p>
        )}
      </div>

      {/* Footer Stats */}
      <div className="p-4 bg-gray-50 flex items-center justify-between text-sm">
        <div className="flex items-center gap-2 text-gray-600">
          <Clock className="h-4 w-4" />
          <span>{totalTravelTime} min Fahrzeit</span>
        </div>
        {nextAppointment && (
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="h-4 w-4" />
            <span>
              Nächster: {new Date(nextAppointment.date).toLocaleDateString('de-DE', { 
                day: '2-digit', 
                month: '2-digit' 
              })}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
