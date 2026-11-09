import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Video, 
  Phone, 
  Mail, 
  Trash2, 
  Edit3,
  RefreshCw,
  CheckCircle,
  XCircle,
  AlertCircle,
  Download,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { UserBooking } from '@/types/booking';

export default function MyBookings() {
  const [bookings, setBookings] = useState<UserBooking[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadBookings();
  }, []);

  const loadBookings = () => {
    setLoading(true);
    // Simulate loading user bookings
    setTimeout(() => {
      const mockBookings: UserBooking[] = [
        {
          id: 'booking_1',
          psychologistId: 'dr-priya-sharma',
          psychologistName: 'Dr. Priya Sharma',
          sessionType: 'online',
          date: '2024-01-15',
          time: '10:00',
          duration: 60,
          status: 'confirmed',
          confirmationCode: 'PSH123',
          notes: 'First session for anxiety treatment',
          createdAt: new Date('2024-01-10'),
          updatedAt: new Date('2024-01-10')
        },
        {
          id: 'booking_2',
          psychologistId: 'dr-rajesh-mehta',
          psychologistName: 'Dr. Rajesh Mehta',
          sessionType: 'in-person',
          date: '2024-01-20',
          time: '14:30',
          duration: 90,
          status: 'pending',
          confirmationCode: 'RME456',
          notes: 'Follow-up session',
          createdAt: new Date('2024-01-12'),
          updatedAt: new Date('2024-01-12')
        },
        {
          id: 'booking_3',
          psychologistId: 'dr-kavya-nair',
          psychologistName: 'Dr. Kavya Nair',
          sessionType: 'online',
          date: '2024-01-18',
          time: '11:00',
          duration: 60,
          status: 'pending',
          confirmationCode: 'KNA789',
          notes: 'Child psychology consultation',
          createdAt: new Date('2024-01-14'),
          updatedAt: new Date('2024-01-14')
        },
        {
          id: 'booking_4',
          psychologistId: 'dr-arjun-singh',
          psychologistName: 'Dr. Arjun Singh',
          sessionType: 'in-person',
          date: '2024-01-10',
          time: '15:00',
          duration: 90,
          status: 'completed',
          confirmationCode: 'ARS012',
          notes: 'Completed therapy session',
          createdAt: new Date('2024-01-05'),
          updatedAt: new Date('2024-01-10')
        }
      ];
      setBookings(mockBookings);
      setLoading(false);
    }, 1000);
  };

  const handleCancelBooking = (bookingId: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'cancelled', updatedAt: new Date() }
          : booking
      )
    );
    toast({
      title: "Booking cancelled",
      description: "Your appointment has been cancelled successfully.",
    });
  };

  const handleRescheduleBooking = (bookingId: string) => {
    toast({
      title: "Reschedule feature",
      description: "Rescheduling will be available soon. Please contact the psychologist directly.",
    });
  };

  const handleTimeSlotSelection = (bookingId: string, timeSlot: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, time: timeSlot, updatedAt: new Date() }
          : booking
      )
    );
    toast({
      title: "Time slot selected",
      description: `Appointment time updated to ${timeSlot}. You can now confirm your appointment.`,
    });
  };

  const handleConfirmBooking = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed', updatedAt: new Date() }
          : booking
      )
    );
    
    toast({
      title: "🎉 Appointment confirmed!",
      description: `Your appointment with ${booking.psychologistName} on ${new Date(booking.date).toLocaleDateString()} at ${booking.time} has been confirmed.`,
    });
  };

  const handleRequestReschedule = (bookingId: string) => {
    const booking = bookings.find(b => b.id === bookingId);
    if (!booking) return;

    toast({
      title: "Reschedule request sent",
      description: `Your reschedule request for ${booking.psychologistName} has been sent. You'll receive a confirmation email once they respond.`,
    });
  };

  const copyBookingDetails = (booking: UserBooking) => {
    const details = `Booking Details
Confirmation Code: ${booking.confirmationCode}
Psychologist: ${booking.psychologistName}
Date: ${new Date(booking.date).toLocaleDateString()}
Time: ${booking.time}
Duration: ${booking.duration} minutes
Type: ${booking.sessionType === 'online' ? 'Online Session' : 'In-Person Session'}`;
    
    navigator.clipboard.writeText(details);
    toast({
      title: "Details copied!",
      description: "Booking details have been copied to clipboard.",
    });
  };

  const getStatusBadge = (status: UserBooking['status']) => {
    switch (status) {
      case 'confirmed':
        return <Badge className="bg-green-100 text-green-800 border-green-200"><CheckCircle className="h-3 w-3 mr-1" />Confirmed</Badge>;
      case 'pending':
        return <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200"><Clock className="h-3 w-3 mr-1" />Pending</Badge>;
      case 'cancelled':
        return <Badge className="bg-red-100 text-red-800 border-red-200"><XCircle className="h-3 w-3 mr-1" />Cancelled</Badge>;
      case 'completed':
        return <Badge className="bg-blue-100 text-blue-800 border-blue-200"><CheckCircle className="h-3 w-3 mr-1" />Completed</Badge>;
      case 'rescheduled':
        return <Badge className="bg-purple-100 text-purple-800 border-purple-200"><RefreshCw className="h-3 w-3 mr-1" />Rescheduled</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const groupedBookings = {
    upcoming: bookings.filter(b => b.status === 'confirmed' || b.status === 'pending'),
    past: bookings.filter(b => b.status === 'completed' || b.status === 'cancelled').sort((a, b) => 
      new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  };

  const BookingCard = ({ booking }: { booking: UserBooking }) => (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-lg">{booking.psychologistName}</CardTitle>
            <div className="flex items-center gap-2">
              {booking.sessionType === 'online' ? (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Video className="h-4 w-4" />
                  Online Session
                </div>
              ) : (
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4" />
                  In-Person Session
                </div>
              )}
              <span>•</span>
              <div className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                {booking.duration} minutes
              </div>
            </div>
          </div>
          {getStatusBadge(booking.status)}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Appointment Details */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="font-medium text-gray-600 mb-1">Date & Time</div>
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              {new Date(booking.date).toLocaleDateString('en-IN', {
                weekday: 'short',
                year: 'numeric',
                month: 'short',
                day: 'numeric'
              })}
            </div>
            <div className="flex items-center gap-1 mt-1">
              <Clock className="h-4 w-4 text-gray-400" />
              {booking.time}
            </div>
          </div>
          <div>
            <div className="font-medium text-gray-600 mb-1">Confirmation Code</div>
            <div className="font-mono text-lg font-bold tracking-wider">
              {booking.confirmationCode}
            </div>
          </div>
        </div>

        {/* Notes */}
        {booking.notes && (
          <div>
            <div className="font-medium text-gray-600 mb-1">Notes</div>
            <div className="text-sm bg-gray-50 p-3 rounded-lg">
              {booking.notes}
            </div>
          </div>
        )}

        {/* Time Slot Selection for Pending Bookings */}
        {booking.status === 'pending' && (
          <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <div className="font-medium text-blue-900 flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Select Preferred Time Slot
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {[
                { time: '09:00', available: true },
                { time: '10:30', available: true },
                { time: '12:00', available: false },
                { time: '14:00', available: true },
                { time: '15:30', available: true },
                { time: '17:00', available: false }
              ].map((slot) => (
                <Button
                  key={slot.time}
                  size="sm"
                  variant={booking.time === slot.time ? "default" : "outline"}
                  disabled={!slot.available}
                  className={`h-8 text-xs ${
                    booking.time === slot.time 
                      ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                      : slot.available 
                        ? 'hover:bg-blue-100' 
                        : 'opacity-50 cursor-not-allowed'
                  }`}
                  onClick={() => slot.available && handleTimeSlotSelection(booking.id, slot.time)}
                >
                  <div className="flex flex-col items-center">
                    <span>{slot.time}</span>
                    {!slot.available && <span className="text-xs">Unavailable</span>}
                  </div>
                </Button>
              ))}
            </div>
            {booking.time && (
              <div className="text-sm text-blue-700 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Selected: {booking.time}
              </div>
            )}
            <div className="text-xs text-blue-600">
              💡 Tip: Select your preferred time slot and then confirm your appointment
            </div>
          </div>
        )}

        {/* Confirmation Actions for Pending Bookings */}
        {booking.status === 'pending' && (
          <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-medium text-green-900 flex items-center gap-2">
              <AlertCircle className="h-4 w-4" />
              Confirm Your Appointment
            </div>
            
            {/* Appointment Summary */}
            <div className="bg-white p-3 rounded-lg border border-green-200">
              <div className="text-sm space-y-1">
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">{new Date(booking.date).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{booking.time || 'Not selected'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{booking.duration} minutes</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Type:</span>
                  <span className="font-medium">{booking.sessionType === 'online' ? '📹 Online' : '📍 In-Person'}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700 flex-1"
                onClick={() => handleConfirmBooking(booking.id)}
                disabled={!booking.time}
              >
                <CheckCircle className="h-4 w-4 mr-1" />
                Confirm Appointment
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="flex-1"
                onClick={() => handleRequestReschedule(booking.id)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Request Reschedule
              </Button>
            </div>
            
            {!booking.time && (
              <div className="text-sm text-green-700 flex items-center gap-1">
                <AlertCircle className="h-3 w-3" />
                Please select a time slot before confirming
              </div>
            )}
            
            {booking.time && (
              <div className="text-sm text-green-700 flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                Ready to confirm! Click the button above to finalize your appointment.
              </div>
            )}
          </div>
        )}

        {/* Confirmed Booking Actions */}
        {booking.status === 'confirmed' && (
          <div className="p-4 bg-green-50 rounded-lg border border-green-200">
            <div className="font-medium text-green-900 flex items-center gap-2 mb-3">
              <CheckCircle className="h-4 w-4" />
              Your appointment is confirmed
            </div>
            <div className="flex flex-wrap gap-2">
              <Button
                size="sm"
                className="bg-green-600 hover:bg-green-700"
                onClick={() => {
                  toast({
                    title: "Meeting link opened",
                    description: "Opening your video consultation link...",
                  });
                }}
              >
                <Video className="h-4 w-4 mr-1" />
                Join Meeting
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => copyBookingDetails(booking)}
              >
                <Copy className="h-4 w-4 mr-1" />
                Copy Details
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleRescheduleBooking(booking.id)}
              >
                <Edit3 className="h-4 w-4 mr-1" />
                Reschedule
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleCancelBooking(booking.id)}
              >
                <Trash2 className="h-4 w-4 mr-1" />
                Cancel
              </Button>
            </div>
          </div>
        )}

        {/* General Action Buttons for other statuses */}
        {booking.status !== 'confirmed' && booking.status !== 'pending' && (
          <div className="flex gap-2 pt-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => copyBookingDetails(booking)}
            >
              <Copy className="h-4 w-4 mr-1" />
              Copy Details
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="container py-6">
        <div className="space-y-6">
          <div className="text-center">
            <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
            <p className="text-muted-foreground">Loading your appointments...</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="h-4 bg-gray-200 animate-pulse rounded w-3/4"></div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <div className="h-3 bg-gray-200 animate-pulse rounded"></div>
                    <div className="h-3 bg-gray-200 animate-pulse rounded w-2/3"></div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6 animate-enter">
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">My Appointments</h1>
            <p className="text-muted-foreground mt-2">
              Manage your therapy sessions and appointments
            </p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => {
                toast({
                  title: "New booking",
                  description: "Redirecting to psychologist directory...",
                });
              }}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Book New Appointment
            </Button>
            <Button
              variant="outline"
              onClick={loadBookings}
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <Tabs defaultValue="upcoming" className="space-y-6">
            
      <TabsList className="grid w-full grid-cols-2">
        <TabsTrigger value="upcoming" className="flex items-center gap-2">
          <AlertCircle className="h-4 w-4" />
          Upcoming ({groupedBookings.upcoming.length})
        </TabsTrigger>
        <TabsTrigger value="past" className="flex items-center gap-2">
        <CheckCircle className="h-4 w-4" />
        Past ({groupedBookings.past.length})

      </TabsTrigger>
      </TabsList>

            <TabsContent value="upcoming" className="space-y-4">
        {groupedBookings.upcoming.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No upcoming appointments</h3>
              <p className="text-muted-foreground mb-4">
                You don't have any scheduled appointments at the moment.
              </p>
                <Button>Book New Appointment</Button>
            </CardContent>
          </Card>
        ) : (
          
          <div className="grid gap-6 md:grid-cols-2">
            {groupedBookings.upcoming.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>

            <TabsContent value="past" className="space-y-4">
        {groupedBookings.past.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <CheckCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-semibold mb-2">No past appointments</h3>
              <p className="text-muted-foreground">
                Your completed and cancelled appointments will appear here.
              </p>
            </CardContent>
          </Card>
        ) : (
          
          <div className="grid gap-6 md:grid-cols-2">
            {groupedBookings.past.map((booking) => (
              <BookingCard key={booking.id} booking={booking} />
            ))}
          </div>
        )}
      </TabsContent>
    </Tabs>
  </div>
);
}
