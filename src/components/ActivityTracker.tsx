import React from 'react';
import { Activity } from '../types';
import { Activity as ActivityIcon, Timer, MapPin } from 'lucide-react';
import { format } from 'date-fns';

interface ActivityTrackerProps {
  activities: Activity[];
}

export function ActivityTracker({ activities }: ActivityTrackerProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6">
      <div className="flex items-center gap-2 mb-4">
        <ActivityIcon className="w-6 h-6 text-indigo-600" />
        <h2 className="text-xl font-semibold">Activity Log</h2>
      </div>

      <div className="space-y-4">
        {activities.map((activity) => (
          <div key={activity.id} className="border-l-4 border-indigo-500 pl-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">{activity.type}</span>
              <span className="text-sm text-gray-500">
                {format(activity.timestamp, 'PPp')}
              </span>
            </div>
            
            {activity.duration && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <Timer className="w-4 h-4" />
                <span>{activity.duration} minutes</span>
              </div>
            )}
            
            {activity.location && (
              <div className="flex items-center gap-1 text-sm text-gray-600">
                <MapPin className="w-4 h-4" />
                <span>
                  {activity.location.latitude.toFixed(4)}, 
                  {activity.location.longitude.toFixed(4)}
                </span>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}