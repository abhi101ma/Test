import React, { useState } from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle, Play, Pause, Eye } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';
import { formatDateTime } from '../utils/enhancedCalculations';
interface ScheduledPost {
  post_id: string;
  influencer_id: string;
  influencer_name: string;
  campaign_id: string;
  post_type: string;
  content_title: string;
  scheduled_date: string;
  scheduled_time: string;
  platform: string;
  status: 'scheduled' | 'published' | 'failed' | 'cancelled';
  estimated_reach: number;
  priority: 'high' | 'medium' | 'low';
  approval_status: 'approved' | 'pending' | 'rejected';
  auto_publish: boolean;
  reminder_sent: boolean;
  published_url?: string;
  failure_reason?: string;
}

interface CampaignSchedulingProps {
  scheduledPosts: ScheduledPost[];
  onSchedulePost: (post: Partial<ScheduledPost>) => void;
  onUpdateSchedule: (postId: string, updates: Partial<ScheduledPost>) => void;
  onCancelSchedule: (postId: string) => void;
  onPublishNow: (postId: string) => void;
}

const CampaignScheduling: React.FC<CampaignSchedulingProps> = ({
  scheduledPosts,
  onSchedulePost,
  onUpdateSchedule,
  onCancelSchedule,
  onPublishNow
}) => {
  const { settings } = useSettings();
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  const [filterStatus, setFilterStatus] = useState<'all' | 'scheduled' | 'published' | 'failed'>('all');

  // Get posts for selected date
  const postsForDate = scheduledPosts.filter(post => 
    post.scheduled_date === selectedDate &&
    (filterStatus === 'all' || post.status === filterStatus)
  );

  // Get upcoming posts (next 7 days)
  const upcomingPosts = scheduledPosts.filter(post => {
    const postDate = new Date(post.scheduled_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return postDate >= today && postDate <= nextWeek && post.status === 'scheduled';
  }).sort((a, b) => new Date(a.scheduled_date + ' ' + a.scheduled_time).getTime() - 
                   new Date(b.scheduled_date + ' ' + b.scheduled_time).getTime());

  const getStatusColor = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled': return 'text-blue-600 bg-blue-100 border-blue-200';
      case 'published': return 'text-green-600 bg-green-100 border-green-200';
      case 'failed': return 'text-red-600 bg-red-100 border-red-200';
      case 'cancelled': return 'text-gray-600 bg-gray-100 border-gray-200';
      default: return 'text-gray-600 bg-gray-100 border-gray-200';
    }
  };

  const getStatusIcon = (status: ScheduledPost['status']) => {
    switch (status) {
      case 'scheduled': return <Clock className="w-4 h-4 text-blue-500" />;
      case 'published': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <AlertCircle className="w-4 h-4 text-red-500" />;
      case 'cancelled': return <Pause className="w-4 h-4 text-gray-500" />;
      default: return <Clock className="w-4 h-4 text-gray-400" />;
    }
  };

  const getPriorityColor = (priority: ScheduledPost['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-500';
      case 'medium': return 'bg-yellow-500';
      case 'low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  // Generate calendar days for current month
  const generateCalendarDays = () => {
    const date = new Date(selectedDate);
    const year = date.getFullYear();
    const month = date.getMonth();
    
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDate = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      const dayPosts = scheduledPosts.filter(post => 
        post.scheduled_date === currentDate.toISOString().split('T')[0]
      );
      
      days.push({
        date: new Date(currentDate),
        isCurrentMonth: currentDate.getMonth() === month,
        isToday: currentDate.toDateString() === new Date().toDateString(),
        isSelected: currentDate.toISOString().split('T')[0] === selectedDate,
        posts: dayPosts
      });
      
      currentDate.setDate(currentDate.getDate() + 1);
    }
    
    return days;
  };

  const calendarDays = generateCalendarDays();

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-2">
          <Calendar className="w-5 h-5 text-blue-500" />
          <h3 className="text-lg font-semibold text-gray-900">Campaign Scheduling</h3>
        </div>
        
        <div className="flex items-center space-x-3">
          {/* View Mode Toggle */}
          <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setViewMode('calendar')}
              className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
                viewMode === 'calendar'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Calendar
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`px-3 py-2 rounded-md font-medium transition-all text-sm ${
                viewMode === 'list'
                  ? 'bg-white text-blue-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              List
            </button>
          </div>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Status</option>
            <option value="scheduled">Scheduled</option>
            <option value="published">Published</option>
            <option value="failed">Failed</option>
          </select>
        </div>
      </div>

      {viewMode === 'calendar' ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {/* Calendar View */}
          <div className="lg:col-span-2">
            <div className="mb-4">
              <input
                type="month"
                value={selectedDate.substring(0, 7)}
                onChange={(e) => setSelectedDate(e.target.value + '-01')}
                className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            
            <div className="border border-gray-200 rounded-lg overflow-hidden overflow-x-auto">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 bg-gray-50 min-w-[600px]">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                  <div key={day} className="p-2 sm:p-3 text-center text-xs sm:text-sm font-medium text-gray-700 border-r border-gray-200 last:border-r-0">
                    {day}
                  </div>
                ))}
              </div>
              
              {/* Calendar Body */}
              <div className="grid grid-cols-7 min-w-[600px]">
                {calendarDays.map((day, index) => (
                  <div
                    key={index}
                    onClick={() => setSelectedDate(day.date.toISOString().split('T')[0])}
                    className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border-r border-b border-gray-200 last:border-r-0 cursor-pointer transition-colors ${
                      day.isSelected ? 'bg-blue-50' :
                      day.isToday ? 'bg-yellow-50' :
                      day.isCurrentMonth ? 'bg-white hover:bg-gray-50' : 'bg-gray-50'
                    }`}
                  >
                    <div className={`text-xs sm:text-sm font-medium mb-1 ${
                      day.isCurrentMonth ? 'text-gray-900' : 'text-gray-400'
                    }`}>
                      {day.date.getDate()}
                    </div>
                    
                    {/* Post indicators */}
                    <div className="space-y-1">
                      {day.posts.slice(0, 2).map(post => (
                        <div
                          key={post.post_id}
                          className={`w-full h-1.5 rounded-full ${
                            post.status === 'scheduled' ? 'bg-blue-500' :
                            post.status === 'published' ? 'bg-green-500' :
                            post.status === 'failed' ? 'bg-red-500' : 'bg-gray-500'
                          }`}
                        />
                      ))}
                      {day.posts.length > 2 && (
                        <div className="text-xs text-gray-500 hidden sm:block">+{day.posts.length - 2}</div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Selected Date Details */}
          <div className="space-y-4">
            <h4 className="font-medium text-gray-900">
              {new Date(selectedDate).toLocaleDateString('en-US', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </h4>
            
            {postsForDate.length > 0 ? (
              <div className="space-y-3">
                {postsForDate.map(post => (
                  <div key={post.post_id} className="border border-gray-200 rounded-lg p-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-medium text-gray-900">{post.influencer_name}</span>
                      <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                        {getStatusIcon(post.status)}
                        <span>{post.status.toUpperCase()}</span>
                      </div>
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-2">{post.content_title}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{post.scheduled_time}</span>
                      <span className="flex items-center space-x-1">
                        <div className={`w-2 h-2 rounded-full ${getPriorityColor(post.priority)}`} />
                        <span>{post.priority}</span>
                      </span>
                    </div>
                    
                    {post.status === 'scheduled' && (
                      <div className="flex space-x-2 mt-3">
                        <button
                          onClick={() => onPublishNow(post.post_id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                        >
                          <Play className="w-3 h-3" />
                          <span>Publish Now</span>
                        </button>
                        <button
                          onClick={() => onCancelSchedule(post.post_id)}
                          className="flex items-center space-x-1 px-2 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700"
                        >
                          <Pause className="w-3 h-3" />
                          <span>Cancel</span>
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Calendar className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                <p className="text-gray-500">No posts scheduled for this date</p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* List View */
        <div className="space-y-4">
          {scheduledPosts.filter(post => filterStatus === 'all' || post.status === filterStatus).map(post => (
            <div key={post.post_id} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${getPriorityColor(post.priority)}`} />
                  <span className="font-medium text-gray-900">{post.influencer_name}</span>
                  <span className="text-sm text-gray-500">•</span>
                  <span className="text-sm text-gray-500">{post.platform}</span>
                </div>
                
                <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(post.status)}`}>
                  {getStatusIcon(post.status)}
                  <span>{post.status.toUpperCase()}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-700">Content</p>
                  <p className="text-sm text-gray-600">{post.content_title}</p>
                  <p className="text-xs text-gray-500">{post.post_type}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Scheduled</p>
                  <p className="text-sm text-gray-600">{formatDateTime(post.scheduled_date, settings.timeZone)}</p>
                  <p className="text-xs text-gray-500">{post.scheduled_time}</p>
                </div>
                
                <div>
                  <p className="text-sm font-medium text-gray-700">Estimated Reach</p>
                  <p className="text-sm text-gray-600">{post.estimated_reach.toLocaleString()}</p>
                  <p className="text-xs text-gray-500">Expected audience</p>
                </div>
                
                <div className="flex items-center space-x-2">
                  {post.status === 'scheduled' && (
                    <>
                      <button
                        onClick={() => onPublishNow(post.post_id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <Play className="w-4 h-4" />
                        <span>Publish</span>
                      </button>
                      <button
                        onClick={() => onCancelSchedule(post.post_id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Pause className="w-4 h-4" />
                      </button>
                    </>
                  )}
                  
                  {post.status === 'published' && post.published_url && (
                    <button
                      onClick={() => window.open(post.published_url, '_blank')}
                      className="flex items-center space-x-1 px-3 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View</span>
                    </button>
                  )}
                  
                  {post.status === 'failed' && (
                    <div className="text-xs text-red-600">
                      {post.failure_reason}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Upcoming Posts Summary */}
      {upcomingPosts.length > 0 && (
        <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-200">
          <h4 className="font-medium text-blue-900 mb-3">Upcoming Posts (Next 7 Days)</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {upcomingPosts.slice(0, 6).map(post => (
              <div key={post.post_id} className="bg-white rounded-lg p-3 border border-blue-200">
                <div className="flex items-center justify-between mb-1">
                  <span className="font-medium text-gray-900 text-sm">{post.influencer_name}</span>
                  <div className={`w-2 h-2 rounded-full ${getPriorityColor(post.priority)}`} />
                </div>
                <p className="text-xs text-gray-600 mb-1">{post.content_title}</p>
                <p className="text-xs text-blue-600">{formatDateTime(post.scheduled_date, settings.timeZone)} at {post.scheduled_time}</p>
              </div>
            ))}
          </div>
          {upcomingPosts.length > 6 && (
            <p className="text-sm text-blue-700 mt-2">
              +{upcomingPosts.length - 6} more posts scheduled
            </p>
          )}
        </div>
      )}
    </div>
  );
};

export default CampaignScheduling;