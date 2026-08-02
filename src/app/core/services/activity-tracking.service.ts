import { Injectable, signal } from '@angular/core';

export interface ActivityLog {
  id: string;
  action: string;
  label: string;
  metadata?: any;
  timestamp: string;
}

@Injectable({
  providedIn: 'root'
})
export class ActivityTrackingService {
  private readonly STORAGE_KEY = 'sasya_activity_logs';

  // Read initial logs from localStorage if available
  private getSavedLogs(): ActivityLog[] {
    if (typeof window !== 'undefined') {
      try {
        const saved = localStorage.getItem(this.STORAGE_KEY);
        return saved ? JSON.parse(saved) : [];
      } catch (e) {
        console.error('Failed to parse activity logs from localStorage', e);
        return [];
      }
    }
    return [];
  }

  readonly logs = signal<ActivityLog[]>(this.getSavedLogs());

  track(action: string, label: string, metadata?: any) {
    const newEntry: ActivityLog = {
      id: `act_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      action,
      label,
      metadata,
      timestamp: new Date().toISOString()
    };

    // Update in-memory signal state
    this.logs.update(current => [newEntry, ...current]);

    // Save to localStorage
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.logs()));
      } catch (e) {
        console.error('Failed to save activity logs to localStorage', e);
      }
    }

    // Console-log each tracked action in development
    console.log(
      `%c[Activity: ${action}]%c ${label}`,
      'color: #10b981; font-weight: bold; background-color: #f0fdf4; padding: 2px 6px; border-radius: 4px;',
      'color: inherit;',
      metadata || ''
    );
  }

  clearLogs() {
    this.logs.set([]);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.STORAGE_KEY);
    }
    this.track('CLEAR_LOGS', 'Activity tracking log history cleared');
  }
}
