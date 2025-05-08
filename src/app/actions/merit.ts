'use server';

import { getMeritService } from '@/services/merit/meritService';
import { MeritSummary, MeritActivity, MeritEvent } from '@/services/merit/meritService';

/**
 * Server action to get merit summary data
 */
export async function getMeritSummary(userId?: string): Promise<MeritSummary> {
  try {
    const meritService = await getMeritService();
    return await meritService.getMeritSummary(userId);
  } catch (error) {
    console.error('Error fetching merit summary:', error);
    throw new Error('Failed to fetch merit summary');
  }
}

/**
 * Server action to get all merit activities
 */
export async function getActivities(userId?: string): Promise<MeritActivity[]> {
  try {
    const meritService = await getMeritService();
    return await meritService.getActivities(userId);
  } catch (error) {
    console.error('Error fetching activities:', error);
    throw new Error('Failed to fetch activities');
  }
}

/**
 * Server action to get upcoming events
 */
export async function getUpcomingEvents(): Promise<MeritEvent[]> {
  try {
    const meritService = await getMeritService();
    return await meritService.getUpcomingEvents();
  } catch (error) {
    console.error('Error fetching upcoming events:', error);
    throw new Error('Failed to fetch upcoming events');
  }
}

/**
 * Server action to register for an event
 */
export async function registerForEvent(formData: FormData) {
  const eventId = Number(formData.get('eventId'));
  const userId = formData.get('userId') as string;

  if (!eventId || !userId) {
    return { success: false, error: 'Missing required information' };
  }

  try {
    const meritService = await getMeritService();
    const success = await meritService.registerForEvent(eventId, userId);
    if (success) {
      return { success: true };
    } else {
      return { success: false, error: 'Registration failed. The event might be full.' };
    }
  } catch (error) {
    console.error('Error registering for event:', error);
    return { success: false, error: 'An error occurred during registration' };
  }
}