import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar, Clock, MapPin, Video, Phone, Mail, DollarSign, AlertCircle, CheckCircle, Calendar as CalendarIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { BookingService } from '@/services/bookingService';
import { BookingSlot, BookingRequest, BookingConfirmation } from '@/types/booking';
import { PsychologistProfile } from '@/services/psychologistService';

interface BookingDialogProps {
  psychologist: PsychologistProfile;
  children: React.ReactNode;
}

export function BookingDialog({ psychologist, children }: BookingDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState<'form' | 'slots' | 'confirmation'>('form');
  const [bookingData, setBookingData] = useState<Partial<BookingRequest>>({});
  const [availableSlots, setAvailableSlots] = useState<BookingSlot[]>([]);
  const [selectedSlot, setSelectedSlot] = useState<BookingSlot | null>(null);
  const [confirmation, setConfirmation] = useState<BookingConfirmation | null>(null);
  const [loading, setLoading] = useState(false);

  // Form data
  const [formData, setFormData] = useState({
    sessionType: 'online' as 'online' | 'in-person',
    userName: '',
    userEmail: '',
    userPhone: '',
    purpose: '',
    urgency: 'medium' as 'low' | 'medium' | 'high',
    notes: '',
    selectedDate: '',
    duration: 60
  });

  useEffect(() => {
    if (isOpen && currentStep === 'slots' && formData.selectedDate) {
      loadAvailableSlots();
    }
  }, [isOpen, currentStep, formData.selectedDate]);

  const loadAvailableSlots = async () => {
    setLoading(true);
    try {
      const slots = BookingService.getAvailableSlots(psychologist.id, formData.selectedDate);
      setAvailableSlots(slots);
    } catch (error) {
      toast({
        title: "Error loading slots",
        description: "Unable to load available time slots. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.userName || !formData.userEmail || !formData.userPhone || !formData.purpose) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive"
      });
      return;
    }

    setBookingData({
      psychologistId: psychologist.id,
      psychologistName: psychologist.name,
      userName: formData.userName,
      userEmail: formData.userEmail,
      userPhone: formData.userPhone,
      sessionType: formData.sessionType,
      purpose: formData.purpose,
      urgency: formData.urgency,
      notes: formData.notes,
      duration: formData.duration
    });
    
    setCurrentStep('slots');
  };

  const handleSlotSelection = async (slot: BookingSlot) => {
    if (!slot.isAvailable) return;

    setSelectedSlot(slot);
    setLoading(true);

    try {
      const bookingRequest: Omit<BookingRequest, 'id' | 'createdAt'> = {
        ...bookingData,
        preferredDate: slot.date,
        preferredTime: slot.time,
        duration: formData.duration
      } as Omit<BookingRequest, 'id' | 'createdAt'>;

      const bookingId = await BookingService.createBooking(bookingRequest);
      const confirmationDetails = await BookingService.confirmBooking(bookingId);
      
      setConfirmation(confirmationDetails);
      setCurrentStep('confirmation');
      
      toast({
        title: "Booking confirmed!",
        description: `Your appointment with ${psychologist.name} has been booked successfully.`,
      });
    } catch (error) {
      toast({
        title: "Booking failed",
        description: "Unable to complete your booking. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    setIsOpen(false);
    setTimeout(() => {
      setCurrentStep('form');
      setFormData({
        sessionType: 'online',
        userName: '',
        userEmail: '',
        userPhone: '',
        purpose: '',
        urgency: 'medium',
        notes: '',
        selectedDate: '',
        duration: 60
      });
      setBookingData({});
      setSelectedSlot(null);
      setConfirmation(null);
      setAvailableSlots([]);
    }, 300);
  };

  const getNextAvailableDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      
      // Skip weekends for demo purposes
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    
    return dates;
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Calendar className="h-6 w-6" />
            Book Appointment with {psychologist.name}
          </DialogTitle>
          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Badge variant="secondary">{psychologist.title}</Badge>
            <span className="flex items-center gap-1">
              <span className="font-medium">{psychologist.rating}</span>
              <Clock className="h-3 w-3" />
              ({psychologist.reviewCount} reviews)
            </span>
          </div>
        </DialogHeader>

        <Tabs value={currentStep} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="form">Details</TabsTrigger>
            <TabsTrigger value="slots" disabled={currentStep === 'form'}>Time Slot</TabsTrigger>
            <TabsTrigger value="confirmation" disabled={currentStep !== 'confirmation'}>Confirmation</TabsTrigger>
          </TabsList>

          <TabsContent value="form">
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="grid gap-6 md:grid-cols-2">
                {/* Session Type */}
                <div className="space-y-2">
                  <Label>Session Type</Label>
                  <Select value={formData.sessionType} onValueChange={(value: 'online' | 'in-person') => 
                    setFormData(prev => ({ ...prev, sessionType: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="online">
                        <div className="flex items-center gap-2">
                          <Video className="h-4 w-4" />
                          Online Consultation
                        </div>
                      </SelectItem>
                      <SelectItem value="in-person" disabled={!psychologist.isInPerson}>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          In-Person Session
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <Label>Session Duration</Label>
                  <Select value={formData.duration.toString()} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, duration: parseInt(value) }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="30">30 minutes</SelectItem>
                      <SelectItem value="60">60 minutes</SelectItem>
                      <SelectItem value="90">90 minutes</SelectItem>
                      <SelectItem value="120">120 minutes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Date */}
                <div className="space-y-2">
                  <Label>Preferred Date</Label>
                  <Select value={formData.selectedDate} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, selectedDate: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a date" />
                    </SelectTrigger>
                    <SelectContent>
                      {getNextAvailableDates().map(date => (
                        <SelectItem key={date} value={date}>
                          {new Date(date).toLocaleDateString('en-IN', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Purpose */}
                <div className="space-y-2">
                  <Label>What brings you here? *</Label>
                  <Select value={formData.purpose} onValueChange={(value) => 
                    setFormData(prev => ({ ...prev, purpose: value }))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your main concern" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Anxiety">Anxiety Treatment</SelectItem>
                      <SelectItem value="Depression">Depression Support</SelectItem>
                      <SelectItem value="Relationship Issues">Relationship Counseling</SelectItem>
                      <SelectItem value="Work Stress">Work-Related Stress</SelectItem>
                      <SelectItem value="Trauma">Trauma Therapy</SelectItem>
                      <SelectItem value="Other">Other Concerns</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Urgency */}
                <div className="space-y-2">
                  <Label>Urgency Level</Label>
                  <Select value={formData.urgency} onValueChange={(value: 'low' | 'medium' | 'high') => 
                    setFormData(prev => ({ ...prev, urgency: value }))}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-green-500" />
                          Low - Can wait a few weeks
                        </div>
                      </SelectItem>
                      <SelectItem value="medium">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-yellow-500" />
                          Medium - Within a week
                        </div>
                      </SelectItem>
                      <SelectItem value="high">
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 rounded-full bg-red-500" />
                          High - As soon as possible
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-medium">Your Information</h3>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="userName">Full Name *</Label>
                    <Input
                      id="userName"
                      value={formData.userName}
                      onChange={(e) => setFormData(prev => ({ ...prev, userName: e.target.value }))}
                      placeholder="Enter your full name"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="userEmail">Email Address *</Label>
                    <Input
                      id="userEmail"
                      type="email"
                      value={formData.userEmail}
                      onChange={(e) => setFormData(prev => ({ ...prev, userEmail: e.target.value }))}
                      placeholder="Enter your email"
                      required
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="userPhone">Phone Number *</Label>
                    <Input
                      id="userPhone"
                      type="tel"
                      value={formData.userPhone}
                      onChange={(e) => setFormData(prev => ({ ...prev, userPhone: e.target.value }))}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Additional Notes */}
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Any specific concerns, goals, or preferences you'd like to share..."
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3">
                <Button type="button" variant="outline" onClick={handleClose}>
                  Cancel
                </Button>
                <Button type="submit" disabled={!formData.selectedDate}>
                  Continue to Time Slots
                </Button>
              </div>
            </form>
          </TabsContent>

          <TabsContent value="slots">
            <div className="space-y-4">
              <div className="text-center">
                <h3 className="text-lg font-medium mb-2">
                  Available Time Slots for {new Date(formData.selectedDate).toLocaleDateString('en-IN', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {formData.sessionType === 'online' ? 'Video consultation' : 'In-person session'} - {formData.duration} minutes
                </p>
              </div>

              {loading ? (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {Array.from({ length: 8 }).map((_, i) => (
                    <div key={i} className="h-12 bg-gray-200 animate-pulse rounded-lg" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-3 md:grid-cols-4 gap-3">
                  {availableSlots.map((slot, index) => (
                    <Button
                      key={index}
                      variant={slot.isAvailable ? "outline" : "secondary"}
                      disabled={!slot.isAvailable}
                      className={`h-12 ${slot.isAvailable ? 'hover:bg-primary hover:text-primary-foreground' : ''}`}
                      onClick={() => slot.isAvailable && handleSlotSelection(slot)}
                    >
                      <div className="text-center">
                        <div className="font-medium text-sm">{slot.time}</div>
                        {slot.sessionType && (
                          <div className="text-xs opacity-75">
                            {slot.sessionType === 'online' ? '📹' : '📍'}
                          </div>
                        )}
                      </div>
                    </Button>
                  ))}
                </div>
              )}

              <div className="flex justify-end gap-3">
                <Button variant="outline" onClick={() => setCurrentStep('form')}>
                  Back
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="confirmation">
            {confirmation && (
              <Card>
                <CardHeader className="text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                    <CheckCircle className="h-6 w-6 text-green-600" />
                  </div>
                  <CardTitle className="text-xl">Booking Confirmed!</CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Your appointment has been successfully scheduled
                  </p>
                </CardHeader>
                <CardContent className="space-y-6">
                  {/* Confirmation Code */}
                  <div className="text-center p-4 bg-gray-50 rounded-lg">
                    <div className="text-sm text-gray-600">Confirmation Code</div>
                    <div className="text-2xl font-bold tracking-wider font-mono">
                      {confirmation.confirmationCode}
                    </div>
                  </div>

                  {/* Appointment Details */}
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <CalendarIcon className="h-4 w-4" />
                        Appointment Details
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Date:</strong> {new Date(confirmation.date).toLocaleDateString('en-IN')}</div>
                        <div><strong>Time:</strong> {confirmation.time}</div>
                        <div><strong>Duration:</strong> {confirmation.duration} minutes</div>
                        <div><strong>Type:</strong> {confirmation.sessionType === 'online' ? '📹 Online Consultation' : '📍 In-Person Session'}</div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h4 className="font-medium flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        Contact Information
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Psychologist:</strong> {confirmation.psychologistInfo.name}</div>
                        <div><strong>Phone:</strong> {confirmation.psychologistInfo.phone}</div>
                        {confirmation.psychologistInfo.email && (
                          <div><strong>Email:</strong> {confirmation.psychologistInfo.email}</div>
                        )}
                        {confirmation.psychologistInfo.address && (
                          <div><strong>Address:</strong> {confirmation.psychologistInfo.address}</div>
                        )}
                        {confirmation.psychologistInfo.meetingLink && (
                          <div><strong>Meeting Link:</strong> <a href={confirmation.psychologistInfo.meetingLink} className="text-blue-600 underline">Join Meeting</a></div>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Cost Information */}
                  {confirmation.totalCost && (
                    <div className="p-4 bg-blue-50 rounded-lg">
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium">Session Cost</div>
                          <div className="text-sm text-gray-600">{confirmation.cancellationPolicy}</div>
                        </div>
                        <div className="text-xl font-bold flex items-center gap-1">
                          <DollarSign className="h-5 w-5" />
                          ₹{confirmation.totalCost.toLocaleString('en-IN')}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Next Steps */}
                  <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <div className="flex items-start gap-3">
                      <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                      <div>
                        <div className="font-medium text-yellow-900">Important Instructions</div>
                        <ul className="text-sm text-yellow-800 mt-1 space-y-1">
                          <li>• Please arrive 10 minutes early for your appointment</li>
                          <li>• Bring a valid ID and any relevant medical records</li>
                          <li>• For online sessions, ensure you have a stable internet connection</li>
                          <li>• You may reschedule up to 24 hours before your appointment</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-3">
                    <Button variant="outline" onClick={handleClose}>
                      Close
                    </Button>
                    <Button onClick={() => {
                      // Copy confirmation details to clipboard
                      const details = `Booking Confirmation
Code: ${confirmation.confirmationCode}
Date: ${confirmation.date}
Time: ${confirmation.time}
Psychologist: ${confirmation.psychologistInfo.name}
Phone: ${confirmation.psychologistInfo.phone}`;
                      navigator.clipboard.writeText(details);
                      toast({
                        title: "Details copied!",
                        description: "Booking confirmation details have been copied to clipboard.",
                      });
                    }}>
                      Copy Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
