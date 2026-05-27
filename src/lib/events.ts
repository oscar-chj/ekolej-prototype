import { EventEmitter } from 'events';
import { ActivityAction } from '../../generated/prisma/client';

export interface EventPayloads {
  [ActivityAction.MERIT_ADDED]: {
    actorId: string;
    studentId: string;
    points: number;
    category: string;
    description: string;
    newTotal: number;
    eventId?: string;
  };
  [ActivityAction.MERIT_UPDATED]: {
    actorId: string;
    studentId: string;
    points: number;
    category: string;
    description: string;
    newTotal: number;
    eventId?: string;
    oldPoints: number;
  };
  [ActivityAction.MERIT_DELETED]: {
    actorId: string;
    studentId: string;
    points: number;
    category: string;
    description: string;
    newTotal: number;
    eventId?: string;
  };
  [ActivityAction.REGISTRATION_COMPLETED]: {
    actorId: string;
    studentId: string;
    eventId: string;
    registrationId: string;
    eventTitle: string;
    eventCategory: string;
    eventPoints: number;
    eventDate: string;
    eventTime: string;
    eventLocation: string;
  };
  [ActivityAction.REGISTRATION_CANCELLED]: {
    actorId: string;
    studentId: string;
    eventId: string;
    eventTitle: string;
    eventDate: string;
    wasPromotedFromWaitlist: boolean;
  };
  [ActivityAction.EVENT_CREATED]: {
    actorId: string;
    eventId: string;
    title: string;
    category: string;
    points: number;
    capacity: number;
    date: string;
    time: string;
    location: string;
  };
  [ActivityAction.EVENT_STATUS_CHANGED]: {
    actorId: string;
    eventId: string;
    oldStatus: string;
    newStatus: string;
  };
}

class TypedEventEmitter extends EventEmitter {
  emit<K extends keyof EventPayloads>(event: K, payload: EventPayloads[K]): boolean {
    return super.emit(event, payload);
  }

  on<K extends keyof EventPayloads>(event: K, listener: (payload: EventPayloads[K]) => void): this {
    return super.on(event, listener);
  }

  once<K extends keyof EventPayloads>(event: K, listener: (payload: EventPayloads[K]) => void): this {
    return super.once(event, listener);
  }

  off<K extends keyof EventPayloads>(event: K, listener: (payload: EventPayloads[K]) => void): this {
    return super.off(event, listener);
  }
}

export const eventBroker = new TypedEventEmitter();
