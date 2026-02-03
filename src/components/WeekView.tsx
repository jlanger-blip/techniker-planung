import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { Appointment, Technician } from '../types';

interface WeekViewProps {
  appointments: Appointment[];
  technicians: Technician[];
}

export default function WeekView({ appointments, technicians }: WeekViewProps) {
  const today = new Date();
  
  // Generate week days (Mon-Fri)
  const weekDays = useMemo(() => {
    const days = [];
    const startOfWeek = new Date(today);
    const dayOfWeek = startOfWeek.getDay();
    const diff = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;
    startOfWeek.setDate(startOfWeek.getDate() + diff);
    
    for (let i = 0; i < 5; i++) {
      const day = new Date(startOfWeek);
      day.setDate(day.getDate() + i);
      days.push(day);
    }
    return days;
  }, []);

  const hours = Array.from({ length: 10 }, (_, i) => i + 8); // 08:00 - 17:00

  const getAppointmentForSlot = (techId: string, day: Date, hour: number) => {
    return appointments.find(apt => {
      const aptDate = new Date(apt.date);
      return (
        apt.technicianId === techId &&
        aptDate.getDate() === day.getDate() &&
        aptDate.getMonth() === day.getMonth() &&
        aptDate.getHours() === hour
      );
    });
  };

  const formatDay = (date: Date) => {
    return date.toLocaleDateString('de-DE', { weekday: 'short', day: '2-digit', month: '2-digit' });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b flex items-center justify-between">
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronLeft className="h-5 w-5 text-gray-600" />
        </button>
        <h2 className="text-lg font-semibold text-gray-900">
          KW {Math.ceil((today.getDate() - today.getDay() + 1) / 7)} - {today.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' })}
        </h2>
        <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <ChevronRight className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Grid */}
      <div className="overflow-x-auto">
        <div className="min-w-[900px]">
          {technicians.map(tech => (
            <div key={tech.id} className="border-b last:border-b-0">
              {/* Technician Header */}
              <div className="flex items-center gap-3 p-4 bg-gray-50 border-b">
                <div 
                  className="w-4 h-4 rounded-full" 
                  style={{ backgroundColor: tech.color }}
                />
                <span className="font-medium text-gray-900">{tech.name}</span>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-6 border-b">
                <div className="p-2 text-center text-sm font-medium text-gray-500 bg-gray-50">Zeit</div>
                {weekDays.map((day, idx) => (
                  <div 
                    key={idx} 
                    className={`p-2 text-center text-sm font-medium border-l ${
                      day.toDateString() === today.toDateString() 
                        ? 'bg-blue-50 text-blue-600' 
                        : 'bg-gray-50 text-gray-500'
                    }`}
                  >
                    {formatDay(day)}
                  </div>
                ))}
              </div>

              {/* Time Slots */}
              {hours.map(hour => (
                <div key={hour} className="grid grid-cols-6 border-b last:border-b-0">
                  <div className="p-2 text-center text-sm text-gray-500 bg-gray-50 border-r">
                    {hour.toString().padStart(2, '0')}:00
                  </div>
                  {weekDays.map((day, idx) => {
                    const apt = getAppointmentForSlot(tech.id, day, hour);
                    return (
                      <div 
                        key={idx} 
                        className={`p-1 min-h-[60px] border-l ${
                          day.toDateString() === today.toDateString() ? 'bg-blue-50/30' : ''
                        }`}
                      >
                        {apt && (
                          <div 
                            className={`p-2 rounded text-xs h-full cursor-pointer hover:opacity-80 transition-opacity ${
                              apt.status === 'bestätigt' ? 'bg-green-100 border-l-4 border-green-500' :
                              apt.status === 'abgesagt' ? 'bg-red-100 border-l-4 border-red-500 opacity-50' :
                              apt.status === 'blocker' ? 'bg-blue-100 border-l-4 border-blue-500' :
                              'bg-yellow-100 border-l-4 border-yellow-500'
                            }`}
                            title={`${apt.customerName}\n${apt.customerAddress}`}
                          >
                            <p className="font-medium truncate">{apt.customerName}</p>
                            <p className="text-gray-600 truncate text-[10px]">{apt.customerAddress}</p>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div className="p-4 bg-gray-50 border-t flex items-center gap-6">
        <span className="text-sm text-gray-500">Legende:</span>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-green-500" />
          <span className="text-sm text-gray-600">Bestätigt</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-blue-500" />
          <span className="text-sm text-gray-600">Blocker</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-yellow-500" />
          <span className="text-sm text-gray-600">Offen</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded bg-red-500 opacity-50" />
          <span className="text-sm text-gray-600">Abgesagt</span>
        </div>
      </div>
    </div>
  );
}
