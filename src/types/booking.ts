export interface BookingSlot {
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format
  isAvailable: boolean;
  sessionType?: 'online' | 'in-person';
}

export interface BookingRequest {
  id: string;
  psychologistId: string;
  psychologistName: string;
  userId?: string;
  userName: string;
  userEmail: string;
  userPhone: string;
  sessionType: 'online' | 'in-person';
  preferredDate: string;
  preferredTime: string;
  duration: number; // in minutes
  purpose: string;
  urgency: 'low' | 'medium' | 'high';
  notes?: string;
  createdAt: Date;
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'rescheduled';
}

export interface BookingConfirmation {
  bookingId: string;
  confirmationCode: string;
  sessionType: 'online' | 'in-person';
  date: string;
  time: string;
  duration: number;
  psychologistInfo: {
    name: string;
    phone: string;
    email?: string;
    address?: string;
    meetingLink?: string;
  };
  userInfo: {
    name: string;
    email: string;
    phone: string;
  };
  totalCost?: number;
  paymentStatus?: 'pending' | 'paid' | 'refunded';
  cancellationPolicy?: string;
}

export interface BookingCalendar {
  psychologistId: string;
  slots: BookingSlot[];
  timezone: string;
  workingHours: {
    start: string;
    end: string;
  };
  breakTimes: Array<{
    start: string;
    end: string;
  }>;
  blockedDates: string[];
}

export interface PaymentInfo {
  amount: number;
  currency: string;
  method: 'card' | 'upi' | 'netbanking' | 'wallet';
  paymentId?: string;
  status: 'pending' | 'completed' | 'failed' | 'refunded';
}

export interface UserBooking {
  id: string;
  psychologistId: string;
  psychologistName: string;
  sessionType: 'online' | 'in-person';
  date: string;
  time: string;
  duration: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled' | 'rescheduled';
  confirmationCode: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}
