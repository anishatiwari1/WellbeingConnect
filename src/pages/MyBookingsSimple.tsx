import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Calendar, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Copy
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface SimpleBooking {
  id: string;
  psychologistName: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'completed';
}

export default function MyBookingsSimple() {
  const [bookings, setBookings] = useState<SimpleBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [confirming, setConfirming] = useState<string | null>(null);

  useEffect(() => {
    // Simulate loading
    setTimeout(() => {
      setBookings([
        {
          id: '1',
          psychologistName: 'Dr. Priya Sharma',
          date: '2024-01-15',
          time: '10:00',
          status: 'pending'
        },
        {
          id: '2',
          psychologistName: 'Dr. Rajesh Mehta',
          date: '2024-01-20',
          time: '14:30',
          status: 'confirmed'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleTimeSlotSelection = (bookingId: string, timeSlot: string) => {
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, time: timeSlot }
          : booking
      )
    );
    toast({
      title: "Time slot selected",
      description: `Appointment time updated to ${timeSlot}`,
    });
  };

  const handleConfirmBooking = async (bookingId: string) => {
    console.log('Confirming booking:', bookingId);
    setConfirming(bookingId);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setBookings(prev => 
      prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: 'confirmed' }
          : booking
      )
    );
    
    setConfirming(null);
    
    toast({
      title: "🎉 Appointment confirmed!",
      description: "Your appointment has been confirmed successfully. You will receive a confirmation email shortly.",
    });
  };

  if (loading) {
    return (
      <div className="container py-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">My Appointments</h1>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-6">
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
                  title: "Debug info",
                  description: `Total bookings: ${bookings.length}, Confirming: ${confirming}`,
                });
              }}
            >
              Debug Info
            </Button>
          </div>
        </div>
      </header>

      <div className="grid gap-6 md:grid-cols-2">
        {bookings.map((booking) => (
          <Card key={booking.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{booking.psychologistName}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm text-muted-foreground">
                      {new Date(booking.date).toLocaleDateString()} at {booking.time}
                    </span>
                  </div>
                </div>
                <Badge className={
                  booking.status === 'confirmed' 
                    ? 'bg-green-100 text-green-800' 
                    : booking.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-blue-100 text-blue-800'
                }>
                  {booking.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Time Slot Selection for Pending Bookings */}
              {booking.status === 'pending' && (
                <div className="space-y-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="font-medium text-blue-900 flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    Select Preferred Time Slot
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    {['09:00', '10:30', '14:00', '15:30', '16:00', '17:30'].map((time) => (
                      <Button
                        key={time}
                        size="sm"
                        variant={booking.time === time ? "default" : "outline"}
                        className={`h-8 text-xs ${
                          booking.time === time 
                            ? 'bg-blue-600 hover:bg-blue-700 text-white' 
                            : 'hover:bg-blue-100'
                        }`}
                        onClick={() => handleTimeSlotSelection(booking.id, time)}
                      >
                        {time}
                      </Button>
                    ))}
                  </div>
                  {booking.time && (
                    <div className="text-sm text-blue-700 flex items-center gap-1">
                      <CheckCircle className="h-3 w-3" />
                      Selected: {booking.time}
                    </div>
                  )}
                </div>
              )}

              {/* Confirmation Actions for Pending Bookings */}
              {booking.status === 'pending' && (
                <div className="space-y-3 p-4 bg-green-50 rounded-lg border border-green-200">
                  <div className="font-medium text-green-900 flex items-center gap-2">
                    <AlertCircle className="h-4 w-4" />
                    Confirm Your Appointment
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      className="bg-green-600 hover:bg-green-700"
                      onClick={() => handleConfirmBooking(booking.id)}
                      disabled={!booking.time || confirming === booking.id}
                    >
                      {confirming === booking.id ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                          Confirming...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Confirm Appointment
                        </>
                      )}
                    </Button>
                  </div>
                  {!booking.time && (
                    <div className="text-sm text-green-700 flex items-center gap-1">
                      <AlertCircle className="h-3 w-3" />
                      Please select a time slot before confirming
                    </div>
                  )}
                  {booking.time && !confirming && (
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
                    ✅ Your appointment is confirmed
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
                      <Calendar className="h-4 w-4 mr-1" />
                      Join Meeting
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const details = `Booking Details
Psychologist: ${booking.psychologistName}
Date: ${booking.date}
Time: ${booking.time}
Status: Confirmed`;
                        navigator.clipboard.writeText(details);
                        toast({
                          title: "Details copied!",
                          description: "Booking details have been copied to clipboard.",
                        });
                      }}
                    >
                      <Copy className="h-4 w-4 mr-1" />
                      Copy Details
                    </Button>
                  </div>
                </div>
              )}

              {/* Action Buttons for other statuses */}
              {booking.status !== 'confirmed' && booking.status !== 'pending' && (
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      const details = `Booking Details
Psychologist: ${booking.psychologistName}
Date: ${booking.date}
Time: ${booking.time}`;
                      navigator.clipboard.writeText(details);
                      toast({
                        title: "Details copied!",
                        description: "Booking details have been copied to clipboard.",
                      });
                    }}
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Details
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
