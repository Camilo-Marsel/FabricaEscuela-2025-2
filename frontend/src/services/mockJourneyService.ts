// Mock service for journey management
// TODO: Replace with real API calls to Supabase/Backend when integrating

import driverData from '@/mocks/driverData.json';
import routesData from '@/mocks/routesData.json';

export interface Journey {
  id: string;
  date: string;
  startTime: string;
  estimatedEndTime: string;
  workedHours: number;
  workedMinutes: number;
  totalHours: number;
  status: 'active' | 'inactive';
  isActive: boolean;
}

export interface Route {
  id: string;
  name: string;
  origin: string;
  destination: string;
  startTime: string;
  endTime: string;
  duration: string;
  status: 'completed' | 'in-progress' | 'scheduled';
  passengers: number;
  distance: string;
}

export interface Driver {
  id: string;
  name: string;
  email: string;
  phone: string;
  license: string;
  status: string;
}

export interface NotificationSettings {
  email: boolean;
  push: boolean;
}

class MockJourneyService {
  private journey: Journey = driverData.journey as Journey;
  private routes: Route[] = routesData as Route[];
  private driver: Driver = driverData.driver as Driver;
  private notifications: NotificationSettings = driverData.notifications;
  private journeyStartTimestamp: number | null = null;

  // Get current journey status
  async getJourney(): Promise<Journey> {
    // TODO: Replace with actual API call
    // return await fetch('/api/journey/current').then(res => res.json());
    
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 300));
    
    if (this.journeyStartTimestamp && this.journey.isActive) {
      const elapsed = Date.now() - this.journeyStartTimestamp;
      const hours = Math.floor(elapsed / (1000 * 60 * 60));
      const minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
      
      return {
        ...this.journey,
        workedHours: hours,
        workedMinutes: minutes
      };
    }
    
    return this.journey;
  }

  // Start journey
  async startJourney(): Promise<Journey> {
    // TODO: Replace with actual API call
    // return await fetch('/api/journey/start', { method: 'POST' }).then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.journeyStartTimestamp = Date.now();
    this.journey = {
      ...this.journey,
      status: 'active',
      isActive: true,
      workedHours: 0,
      workedMinutes: 0
    };
    
    return this.journey;
  }

  // Stop journey
  async stopJourney(): Promise<Journey> {
    // TODO: Replace with actual API call
    // return await fetch('/api/journey/stop', { method: 'POST' }).then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    
    this.journeyStartTimestamp = null;
    this.journey = {
      ...this.journey,
      status: 'inactive',
      isActive: false
    };
    
    return this.journey;
  }

  // Get assigned routes
  async getAssignedRoutes(): Promise<Route[]> {
    // TODO: Replace with actual API call
    // return await fetch('/api/routes/assigned').then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.routes;
  }

  // Get driver info
  async getDriverInfo(): Promise<Driver> {
    // TODO: Replace with actual API call
    // return await fetch('/api/driver/me').then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.driver;
  }

  // Get notification settings
  async getNotificationSettings(): Promise<NotificationSettings> {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications/settings').then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    return this.notifications;
  }

  // Update notification settings
  async updateNotificationSettings(settings: NotificationSettings): Promise<NotificationSettings> {
    // TODO: Replace with actual API call
    // return await fetch('/api/notifications/settings', { 
    //   method: 'PUT', 
    //   body: JSON.stringify(settings) 
    // }).then(res => res.json());
    
    await new Promise(resolve => setTimeout(resolve, 300));
    this.notifications = settings;
    return this.notifications;
  }
}

export const journeyService = new MockJourneyService();
