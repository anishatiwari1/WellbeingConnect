import { 
  BookingRequest, 
  BookingSlot, 
  BookingConfirmation, 
  BookingCalendar, 
  UserBooking,
  PaymentInfo 
} from '@/types/booking';
import { PsychologistProfile } from './psychologistService';

export class BookingService {
  private static bookings: Map<string, BookingRequest> = new Map();
  private static userBookings: Map<string, UserBooking[]> = new Map();
  private static confirmations: Map<string, BookingConfirmation> = new Map();

  /**
   * Get available time slots for a psychologist on a specific date
   */
  static getAvailableSlots(psychologistId: string, date: string): BookingSlot[] {
    const psychologist = this.mockPsychologists.find(p => p.id === psychologistId);
    if (!psychologist) return [];

    const slots: BookingSlot[] = [];
    const workingHours = this.getWorkingHours();
    const existingBookings = this.getExistingBookings(psychologistId, date);

    // Generate slots based on working hours
    for (let hour = workingHours.start; hour < workingHours.end; hour += 0.5) {
      const timeString = `${Math.floor(hour)}:${hour % 1 === 0.5 ? '30' : '00'}`;
      
      // Check if slot is available
      const isBooked = existingBookings.some(booking => booking.time === timeString);
      const sessionType = psychologist.isInPerson && psychologist.isOnline ? 
        (Math.random() > 0.3 ? 'in-person' : 'online') : 
        (psychologist.isInPerson ? 'in-person' : 'online');

      slots.push({
        date,
        time: timeString,
        isAvailable: !isBooked,
        sessionType: sessionType as 'online' | 'in-person'
      });
    }

    return slots;
  }

  /**
   * Create a new booking request
   */
  static async createBooking(request: Omit<BookingRequest, 'id' | 'createdAt'>): Promise<string> {
    const bookingId = `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const booking: BookingRequest = {
      ...request,
      id: bookingId,
      createdAt: new Date(),
      status: 'pending'
    };

    this.bookings.set(bookingId, booking);

    // Simulate processing delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    return bookingId;
  }

  /**
   * Confirm a booking and generate confirmation details
   */
  static async confirmBooking(bookingId: string): Promise<BookingConfirmation> {
    const booking = this.bookings.get(bookingId);
    if (!booking) {
      throw new Error('Booking not found');
    }

    const psychologist = this.mockPsychologists.find(p => p.id === booking.psychologistId);
    if (!psychologist) {
      throw new Error('Psychologist not found');
    }

    const confirmationCode = this.generateConfirmationCode();
    
    const confirmation: BookingConfirmation = {
      bookingId,
      confirmationCode,
      sessionType: booking.sessionType,
      date: booking.preferredDate,
      time: booking.preferredTime,
      duration: booking.duration,
      psychologistInfo: {
        name: psychologist.name,
        phone: psychologist.phone,
        email: psychologist.email,
        address: booking.sessionType === 'in-person' ? 
          `${psychologist.address}, ${psychologist.city}, ${psychologist.state} ${psychologist.zipCode}` : 
          undefined,
        meetingLink: booking.sessionType === 'online' ? 
          `https://meet.psychologist.com/${confirmationCode}` : 
          undefined
      },
      userInfo: {
        name: booking.userName,
        email: booking.userEmail,
        phone: booking.userPhone
      },
      totalCost: this.calculateCost(psychologist.priceRange, booking.duration),
      paymentStatus: 'pending',
      cancellationPolicy: 'Free cancellation up to 24 hours before appointment'
    };

    // Update booking status
    booking.status = 'confirmed';
    this.bookings.set(bookingId, booking);

    // Store confirmation
    this.confirmations.set(bookingId, confirmation);

    // Add to user bookings
    const userBooking: UserBooking = {
      id: bookingId,
      psychologistId: booking.psychologistId,
      psychologistName: booking.psychologistName,
      sessionType: booking.sessionType,
      date: booking.preferredDate,
      time: booking.preferredTime,
      duration: booking.duration,
      status: 'confirmed',
      confirmationCode,
      notes: booking.notes,
      createdAt: booking.createdAt,
      updatedAt: new Date()
    };

    const userBookings = this.userBookings.get(booking.userId || 'anonymous') || [];
    userBookings.push(userBooking);
    this.userBookings.set(booking.userId || 'anonymous', userBookings);

    return confirmation;
  }

  /**
   * Get user's bookings
   */
  static getUserBookings(userId?: string): UserBooking[] {
    return this.userBookings.get(userId || 'anonymous') || [];
  }

  /**
   * Cancel a booking
   */
  static async cancelBooking(bookingId: string, reason?: string): Promise<boolean> {
    const booking = this.bookings.get(bookingId);
    if (!booking) return false;

    booking.status = 'cancelled';
    booking.notes = reason ? `${booking.notes || ''}\nCancellation reason: ${reason}`.trim() : booking.notes;
    this.bookings.set(bookingId, booking);

    // Update user booking
    const userBookings = this.userBookings.get(booking.userId || 'anonymous') || [];
    const userBooking = userBookings.find(b => b.id === bookingId);
    if (userBooking) {
      userBooking.status = 'cancelled';
      userBooking.updatedAt = new Date();
    }

    return true;
  }

  /**
   * Get booking confirmation details
   */
  static getBookingConfirmation(bookingId: string): BookingConfirmation | null {
    return this.confirmations.get(bookingId) || null;
  }

  /**
   * Process payment for booking
   */
  static async processPayment(bookingId: string, paymentInfo: PaymentInfo): Promise<boolean> {
    const confirmation = this.confirmations.get(bookingId);
    if (!confirmation) return false;

    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    confirmation.paymentStatus = 'paid';
    this.confirmations.set(bookingId, confirmation);

    return Math.random() > 0.1; // 90% success rate for simulation
  }

  // Helper methods

  private static getWorkingHours() {
    return {
      start: 9, // 9 AM
      end: 18  // 6 PM
    };
  }

  private static getExistingBookings(psychologistId: string, date: string): Array<{time: string}> {
    // Mock existing bookings
    const randomConflicts = Math.floor(Math.random() * 3); // 0-2 conflicts
    const conflicts: Array<{time: string}> = [];
    
    for (let i = 0; i < randomConflicts; i++) {
      const randomHour = 9 + Math.floor(Math.random() * 8);
      const randomMin = Math.random() > 0.5 ? '30' : '00';
      conflicts.push({ time: `${randomHour}:${randomMin}` });
    }
    
    return conflicts;
  }

  private static generateConfirmationCode(): string {
    const letters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    let code = '';
    
    for (let i = 0; i < 3; i++) {
      code += letters.charAt(Math.floor(Math.random() * letters.length));
    }
    
    for (let i = 0; i < 3; i++) {
      code += numbers.charAt(Math.floor(Math.random() * numbers.length));
    }
    
    return code;
  }

  private static calculateCost(priceRange: string, duration: number): number {
    // Extract lower bound from price range like "₹1,500–₹2,500"
    const match = priceRange.match(/₹([0-9,]+)/);
    if (!match) return 0;
    
    const basePrice = parseInt(match[1].replace(/,/g, ''));
    return basePrice * (duration / 60); // Assume hourly rates
  }

  // Mock psychologist data for testing
  private static mockPsychologists: PsychologistProfile[] = [
    {
      id: "dr-priya-sharma",
      name: "Dr. Priya Sharma",
      title: "Clinical Psychologist",
      specializations: ["Anxiety", "Depression", "CBT"],
      address: "Bandra Kurla Complex, Bandra East",
      city: "Mumbai",
      state: "Maharashtra",
      zipCode: "400051",
      coordinates: { lat: 19.0619, lng: 72.8685 },
      phone: "+91-9876543210",
      email: "dr.priya@example.com",
      website: "www.priyasharma.com",
      rating: 4.8,
      reviewCount: 127,
      isOnline: true,
      isInPerson: true,
      languages: ["English", "Hindi", "Marathi"],
      insurance: ["Star Health", "HDFC ERGO"],
      priceRange: "₹1,500 - ₹2,500",
      availability: {
        "Monday": ["9:00 AM", "2:00 PM"],
        "Wednesday": ["10:00 AM", "4:00 PM"],
        "Friday": ["11:00 AM", "3:00 PM"]
      },
      description: "Specializing in cognitive behavioral therapy with over 12 years of experience.",
      credentials: ["PhD in Clinical Psychology", "CBT Certified"],
      yearsExperience: 12,
      verified: true
    }
  ];
}
