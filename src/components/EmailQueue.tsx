import { Mail, CheckCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';
import type { EmailQueueItem } from '../types';

interface EmailQueueProps {
  items: EmailQueueItem[];
}

export default function EmailQueue({ items }: EmailQueueProps) {
  const pending = items.filter(i => i.status === 'pending');
  const sent = items.filter(i => i.status === 'sent');
  const failed = items.filter(i => i.status === 'failed');

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'sent':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      default:
        return <Clock className="h-4 w-4 text-yellow-500" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'sent':
        return 'bg-green-100 text-green-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-yellow-100 text-yellow-800';
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleString('de-DE', {
      day: '2-digit',
      month: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Ausstehend</p>
              <p className="text-3xl font-bold text-yellow-600 mt-1">{pending.length}</p>
            </div>
            <div className="bg-yellow-100 p-3 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Gesendet</p>
              <p className="text-3xl font-bold text-green-600 mt-1">{sent.length}</p>
            </div>
            <div className="bg-green-100 p-3 rounded-lg">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl p-6 shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500 font-medium">Fehlgeschlagen</p>
              <p className="text-3xl font-bold text-red-600 mt-1">{failed.length}</p>
            </div>
            <div className="bg-red-100 p-3 rounded-lg">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Email List */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Mail className="h-5 w-5 text-gray-500" />
            <h2 className="text-lg font-semibold text-gray-900">E-Mail Queue</h2>
          </div>
          <button className="flex items-center gap-2 px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors">
            <RefreshCw className="h-4 w-4" />
            Aktualisieren
          </button>
        </div>

        <div className="divide-y">
          {items.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              Keine E-Mails in der Queue
            </div>
          ) : (
            items.map(item => (
              <div key={item.id} className="p-4 hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-4">
                  {getStatusIcon(item.status)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium text-gray-900 truncate">{item.to}</p>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(item.status)}`}>
                        {item.status === 'sent' ? 'Gesendet' : item.status === 'failed' ? 'Fehlgeschlagen' : 'Ausstehend'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">{item.subject}</p>
                  </div>
                  <div className="text-right text-sm text-gray-500">
                    {item.status === 'sent' && item.sentAt && (
                      <p>{formatDate(item.sentAt)}</p>
                    )}
                    {item.status === 'failed' && item.error && (
                      <p className="text-red-500 text-xs">{item.error}</p>
                    )}
                  </div>
                  {item.status === 'failed' && (
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
                      <RefreshCw className="h-4 w-4" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
