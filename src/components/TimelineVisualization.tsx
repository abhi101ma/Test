import React from 'react';
import { CheckCircle, Clock, AlertCircle, Calendar } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  description: string;
  date: string;
  status: 'completed' | 'in_progress' | 'pending' | 'overdue';
  type: 'campaign' | 'content' | 'payment' | 'approval';
}

interface TimelineVisualizationProps {
  events: TimelineEvent[];
  title?: string;
}

const TimelineVisualization: React.FC<TimelineVisualizationProps> = ({ events, title }) => {
  const getStatusIcon = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'in_progress':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'overdue':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusColor = (status: TimelineEvent['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-500';
      case 'in_progress':
        return 'bg-blue-500';
      case 'overdue':
        return 'bg-red-500';
      default:
        return 'bg-gray-300';
    }
  };

  const getTypeColor = (type: TimelineEvent['type']) => {
    switch (type) {
      case 'campaign':
        return 'bg-purple-100 text-purple-800';
      case 'content':
        return 'bg-blue-100 text-blue-800';
      case 'payment':
        return 'bg-green-100 text-green-800';
      case 'approval':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      {title && (
        <div className="flex items-center space-x-2 mb-6">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        </div>
      )}
      
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-6 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        {/* Timeline events */}
        <div className="space-y-6">
          {events.map((event, index) => (
            <div key={event.id} className="relative flex items-start space-x-4">
              {/* Timeline dot */}
              <div className={`relative z-10 flex items-center justify-center w-12 h-12 rounded-full border-4 border-white ${getStatusColor(event.status)} shadow-lg`}>
                {getStatusIcon(event.status)}
              </div>
              
              {/* Event content */}
              <div className="flex-1 min-w-0 pb-6">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">{event.title}</h4>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTypeColor(event.type)}`}>
                    {event.type}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{event.description}</p>
                <div className="flex items-center space-x-2 text-xs text-gray-500">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(event.date).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimelineVisualization;