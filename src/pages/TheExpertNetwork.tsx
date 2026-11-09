import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Slider } from "@/components/ui/slider";
import { 
  Search, 
  Filter, 
  Video, 
  MessageCircle, 
  Star, 
  MapPin, 
  Clock, 
  Shield, 
  Users, 
  BookOpen, 
  Heart,
  Brain,
  Phone,
  Calendar,
  Award,
  CheckCircle,
  AlertCircle,
  ExternalLink,
  Navigation,
  Map,
  List,
  Locate,
  Car,
  Train,
  Accessibility,
  ParkingCircle,
  Globe
} from "lucide-react";
import { SEO } from "@/components/SEO";
import { toast } from "@/hooks/use-toast";
import ErrorBoundary from "@/components/ErrorBoundary";
import { type PsychologistProfile } from "@/services/psychologistService";
import { GeocodingService } from "@/services/geocodingService";
import { BookingDialog } from "@/components/BookingDialog";

// Using PsychologistProfile interface from service instead

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

// Using real psychologist data from PsychologistService instead

const crisisResources = [
  {
    name: "AASRA",
    number: "+91-9820466726",
    description: "24/7 suicide prevention and emotional support helpline",
    icon: Phone
  },
  {
    name: "Tele MANAS",
    number: "14416",
    description: "Government mental health helpline for counseling and support",
    icon: MessageCircle
  },
  {
    name: "BMC Helpline",
    number: "022-24131212",
    description: "Brihanmumbai Municipal Corporation helpline",
    icon: Heart
  }
];

export default function TheExpertNetwork() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedInsurance, setSelectedInsurance] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [maxDistance, setMaxDistance] = useState([25]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [psychologists, setPsychologists] = useState<PsychologistProfile[]>([]);
  const [filteredPsychologists, setFilteredPsychologists] = useState<PsychologistProfile[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(true);

  // Removed logging to prevent re-render issues

  const specializations = ["all", "Anxiety", "Depression", "Trauma", "CBT", "ADHD", "Addiction Recovery", "Couples Therapy", "Child Psychology"];
  const insuranceProviders = ["all", "Star Health", "HDFC ERGO", "ICICI Lombard", "Bajaj Allianz", "Max Bupa", "Care Health"];
  const languages = ["all", "English", "Hindi", "Marathi", "Gujarati", "Malayalam", "Punjabi"];

  // Updated Mumbai and Thane psychologists data
  useEffect(() => {
    const dummyPsychologists: PsychologistProfile[] = [
      {
        id: "1",
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
        profileImage: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      {
        id: "2",
        name: "Dr. Rajesh Mehta",
        title: "Counseling Psychologist",
        specializations: ["Trauma", "ADHD", "Family Therapy"],
        address: "Majiwada, Thane West",
        city: "Thane",
        state: "Maharashtra",
        zipCode: "400601",
        coordinates: { lat: 19.2147, lng: 72.9647 },
        phone: "+91-9876543211",
        email: "michael.chen@example.com",
        website: "www.michaelchen.com",
        rating: 4.6,
        reviewCount: 89,
        isOnline: true,
        isInPerson: false,
        languages: ["English", "Marathi"],
        insurance: ["ICICI Lombard", "Bajaj Allianz"],
        priceRange: "₹2,000 - ₹3,000",
        availability: {
          "Tuesday": ["9:00 AM", "1:00 PM"],
          "Thursday": ["2:00 PM", "6:00 PM"],
          "Saturday": ["10:00 AM", "2:00 PM"]
        },
        description: "Expert in trauma therapy and ADHD treatment for children and adults.",
        credentials: ["MA in Counseling Psychology", "Trauma Specialist"],
        yearsExperience: 8,
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      {
        id: "3",
        name: "Dr. Kavya Nair",
        title: "Child Psychologist",
        specializations: ["Child Psychology", "Autism Spectrum", "Behavioral Issues"],
        address: "Fort Area, Mumbai",
        city: "Mumbai",
        state: "Maharashtra",
        zipCode: "400001",
        coordinates: { lat: 18.9389, lng: 72.8357 },
        phone: "+91-9876543212",
        email: "emily.rodriguez@example.com",
        website: "www.emilyrodriguez.com",
        rating: 4.9,
        reviewCount: 156,
        isOnline: false,
        isInPerson: true,
        languages: ["English", "Hindi", "Gujarati"],
        insurance: ["Max Bupa", "Care Health"],
        priceRange: "₹1,800 - ₹2,800",
        availability: {
          "Monday": ["10:00 AM", "3:00 PM"],
          "Wednesday": ["9:00 AM", "2:00 PM"],
          "Friday": ["11:00 AM", "4:00 PM"]
        },
        description: "Dedicated to helping children with developmental and behavioral challenges.",
        credentials: ["PhD in Child Psychology", "ABA Certified"],
        yearsExperience: 12,
        profileImage: "https://images.unsplash.com/photo-1594824475317-3b5a3e3e3c3e?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      {
        id: "4",
        name: "Dr. Arjun Singh",
        title: "Addiction Counselor",
        specializations: ["Addiction Recovery", "Substance Abuse", "Group Therapy"],
        address: "Naupada, Thane West",
        city: "Thane",
        state: "Maharashtra",
        zipCode: "400602",
        coordinates: { lat: 19.1866, lng: 72.9781 },
        phone: "+91-9876543213",
        email: "david.kumar@example.com",
        website: "www.davidkumar.com",
        rating: 4.7,
        reviewCount: 98,
        isOnline: true,
        isInPerson: true,
        languages: ["English", "Hindi", "Marathi"],
        insurance: ["Star Health", "Max Bupa"],
        priceRange: "₹1,200 - ₹2,200",
        availability: {
          "Tuesday": ["8:00 AM", "12:00 PM"],
          "Thursday": ["1:00 PM", "5:00 PM"],
          "Saturday": ["9:00 AM", "1:00 PM"]
        },
        description: "Compassionate support for individuals seeking recovery from addiction.",
        credentials: ["MA in Addiction Counseling", "CADC Certified"],
        yearsExperience: 15,
        profileImage: "https://images.unsplash.com/photo-1582750433449-648ed127bb54?w=400&h=400&fit=crop&crop=face",
        verified: true
      },
      {
        id: "5",
        name: "Dr. Anita Desai",
        title: "Marriage & Family Therapist",
        specializations: ["Couples Therapy", "Family Therapy", "Relationship Issues"],
        address: "Ghodbunder Road, Thane West",
        city: "Thane",
        state: "Maharashtra",
        zipCode: "400607",
        coordinates: { lat: 19.2183, lng: 72.9781 },
        phone: "+91-9876543214",
        email: "lisa.thompson@example.com",
        website: "www.lisathompson.com",
        rating: 4.5,
        reviewCount: 73,
        isOnline: true,
        isInPerson: true,
        languages: ["English", "Hindi"],
        insurance: ["HDFC ERGO", "ICICI Lombard"],
        priceRange: "₹2,200 - ₹3,200",
        availability: {
          "Monday": ["2:00 PM", "6:00 PM"],
          "Wednesday": ["10:00 AM", "2:00 PM"],
          "Friday": ["3:00 PM", "7:00 PM"]
        },
        description: "Helping couples and families build stronger, healthier relationships.",
        credentials: ["LMFT", "Gottman Method Certified"],
        yearsExperience: 9,
        profileImage: "https://images.unsplash.com/photo-1551836022-deb4988cc6c0?w=400&h=400&fit=crop&crop=face",
        verified: false
      },
      {
        id: "6",
        name: "Dr. Vikram Patel",
        title: "Geriatric Psychologist",
        specializations: ["Geriatric Psychology", "Dementia Care", "Depression"],
        address: "Hiranandani Estate, Thane West",
        city: "Thane",
        state: "Maharashtra",
        zipCode: "400607",
        coordinates: { lat: 19.2056, lng: 72.9689 },
        phone: "+91-9876543215",
        email: "james.wilson@example.com",
        website: "www.jameswilson.com",
        rating: 4.4,
        reviewCount: 62,
        isOnline: false,
        isInPerson: true,
        languages: ["English"],
        insurance: ["Care Health", "Bajaj Allianz"],
        priceRange: "₹1,600 - ₹2,600",
        availability: {
          "Tuesday": ["9:00 AM", "1:00 PM"],
          "Thursday": ["10:00 AM", "2:00 PM"],
          "Saturday": ["11:00 AM", "3:00 PM"]
        },
        description: "Specialized care for older adults dealing with mental health challenges.",
        credentials: ["PhD in Geropsychology", "Board Certified"],
        yearsExperience: 18,
        profileImage: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face",
        verified: true
      }
    ];

    setPsychologists(dummyPsychologists);
    setFilteredPsychologists(dummyPsychologists);
  }, []);

  // Filter by search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPsychologists(psychologists);
      return;
    }

    const filtered = psychologists.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.specializations.some(spec => spec.toLowerCase().includes(searchTerm.toLowerCase())) ||
      p.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.address.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredPsychologists(filtered);
  }, [searchTerm, psychologists]);

  // Calculate distance between two coordinates using Haversine formula
  const calculateDistance = (lat1: number, lng1: number, lat2: number, lng2: number): number => {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      toast({
        title: "Location not supported",
        description: "Geolocation is not supported by this browser.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setUserLocation({
          lat: latitude,
          lng: longitude,
          address: "Current Location"
        });
        setLocationInput("Current Location");
        setLoading(false);
        toast({
          title: "Location detected",
          description: "Found your current location successfully."
        });
      },
      (error) => {
        setLoading(false);
        toast({
          title: "Location error",
          description: "Unable to detect your location. Please enter your address manually.",
          variant: "destructive"
        });
      }
    );
  };

  // Old filtering logic removed - now using PsychologistService

  const handleLocationSearch = () => {
    if (!locationInput.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search for nearby psychologists.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    // Mock location search - just update user location and show existing psychologists
    const mockLocations: Record<string, { lat: number; lng: number; city: string }> = {
      'mumbai': { lat: 19.0760, lng: 72.8777, city: 'Mumbai' },
      'delhi': { lat: 28.6139, lng: 77.2090, city: 'Delhi' },
      'bangalore': { lat: 12.9716, lng: 77.5946, city: 'Bangalore' },
      'pune': { lat: 18.5204, lng: 73.8567, city: 'Pune' },
      'chennai': { lat: 13.0827, lng: 80.2707, city: 'Chennai' },
      'kolkata': { lat: 22.5726, lng: 88.3639, city: 'Kolkata' },
      'hyderabad': { lat: 17.3850, lng: 78.4867, city: 'Hyderabad' }
    };
    
    const cityKey = locationInput.toLowerCase().trim();
    const location = mockLocations[cityKey];
    
    setTimeout(() => {
      if (location) {
        setUserLocation({
          lat: location.lat,
          lng: location.lng,
          address: `${location.city}, India`
        });
        
        toast({
          title: "Location found",
          description: `Showing psychologists near ${location.city}`
        });
      } else {
        toast({
          title: "Location not supported",
          description: "Try: Mumbai, Delhi, Bangalore, Pune, Chennai, Kolkata, or Hyderabad",
          variant: "destructive"
        });
      }
      setLoading(false);
    }, 500);
  };

  const getDirections = (psychologist: PsychologistProfile) => {
    try {
      // Validate and get the best address format
      const validatedLocation = GeocodingService.validateAddress(
        psychologist.address,
        psychologist.coordinates
      );
      
      // Use the geocoding service to create the most accurate maps URL
      const mapsUrl = GeocodingService.createMapsUrl(
        psychologist.address,
        psychologist.city,
        psychologist.state,
        psychologist.zipCode
      );
      
      window.open(mapsUrl, '_blank');
      
      // Show success message with address verification
      if (validatedLocation.verified) {
        toast({
          title: "Directions opened",
          description: `Opening directions to ${validatedLocation.formattedAddress}`,
        });
      } else {
        toast({
          title: "Directions opened",
          description: "Opening directions to the specified address",
          variant: "default"
        });
      }
    } catch (error) {
      console.error('Error opening directions:', error);
      toast({
        title: "Error opening directions",
        description: "Unable to open Google Maps. Please try again.",
        variant: "destructive"
      });
    }
  };

  return (
    <ErrorBoundary>
    <div className="container py-6 animate-enter">
      <SEO
        title="The Expert Network — WellBeingConnect"
        description="Connect with licensed psychologists and mental health professionals in your area. Search by location, specialization, and insurance."
        path="/psychologists"
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">The Expert Network</h1>
        <p className="text-muted-foreground mt-2">
          Connect with licensed psychologists and mental health professionals in your area.
        </p>
      </header>

      {/* Crisis Support Banner */}
      {showCrisisResources && (
        <Card className="mb-8 border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <AlertCircle className="h-5 w-5 text-red-600" />
                <div>
                  <h3 className="font-semibold text-red-900">In Crisis? Need Immediate Help?</h3>
                  <p className="text-sm text-red-700">
                    If you're experiencing a mental health crisis, please reach out to these resources immediately.
                  </p>
                </div>
              </div>
              {/* Removed close button for emergency banner */}
            </div>
            <div className="mt-4 grid gap-3 md:grid-cols-3">
              {crisisResources.map((resource, index) => (
                <div key={index} className="flex items-center gap-3 p-3 bg-white rounded-lg border border-red-200">
                  <resource.icon className="h-4 w-4 text-red-600" />
                  <div>
                    <p className="font-medium text-red-900">{resource.name}</p>
                    <p className="text-sm text-red-700 font-mono">{resource.number}</p>
                    <p className="text-xs text-red-600">{resource.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Location Search */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            Search Location
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Enter your address, city, or ZIP code..."
                  value={locationInput}
                  onChange={(e) => setLocationInput(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Button onClick={handleLocationSearch} className="md:w-auto">
              Search Location
            </Button>
            <Button
              variant="outline"
              onClick={getCurrentLocation}
              disabled={loading}
              className="md:w-auto"
            >
              <Locate className="h-4 w-4 mr-2" />
              {loading ? "Detecting..." : "Use My Location"}
            </Button>
          </div>
          
          {userLocation && (
            <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-700">
                  Searching near: <strong>{userLocation.address}</strong>
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Filters */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filters
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Specialization</label>
              <Select value={selectedSpecialization} onValueChange={setSelectedSpecialization}>
                <SelectTrigger>
                  <SelectValue placeholder="All Specializations" />
                </SelectTrigger>
                <SelectContent>
                  {specializations.map((spec) => (
                    <SelectItem key={spec} value={spec}>
                      {spec === "all" ? "All Specializations" : spec}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Insurance</label>
              <Select value={selectedInsurance} onValueChange={setSelectedInsurance}>
                <SelectTrigger>
                  <SelectValue placeholder="All Insurance" />
                </SelectTrigger>
                <SelectContent>
                  {insuranceProviders.map((insurance) => (
                    <SelectItem key={insurance} value={insurance}>
                      {insurance === "all" ? "All Insurance" : insurance}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Language</label>
              <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                <SelectTrigger>
                  <SelectValue placeholder="All Languages" />
                </SelectTrigger>
                <SelectContent>
                  {languages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      {lang === "all" ? "All Languages" : lang}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">
                Max Distance: {maxDistance[0]} miles
              </label>
              <Slider
                value={maxDistance}
                onValueChange={setMaxDistance}
                max={100}
                step={5}
                className="w-full"
              />
            </div>
          </div>

          <div className="mt-4 flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Search className="h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name or specialization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="max-w-md"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant={viewMode === "list" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("list")}
              >
                <List className="h-4 w-4 mr-1" />
                List
              </Button>
              <Button
                variant={viewMode === "map" ? "default" : "outline"}
                size="sm"
                onClick={() => setViewMode("map")}
              >
                <Map className="h-4 w-4 mr-1" />
                Map
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">
            {loading ? "Searching..." : `${filteredPsychologists.length} Psychologist${filteredPsychologists.length !== 1 ? 's' : ''} Found`}
            {userLocation && ` within ${maxDistance[0]} km`}
          </h2>
        </div>

        {viewMode === "list" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {loading ? (
              // Loading skeleton
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader>
                    <div className="flex items-start gap-4">
                      <div className="h-16 w-16 bg-gray-200 rounded-full"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                  </CardHeader>
                </Card>
              ))
            ) : (
              filteredPsychologists.map((psychologist) => (
              <Card key={psychologist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/100/100" />
                      <AvatarFallback>{psychologist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{psychologist.name}</h3>
                        {psychologist.isOnline && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        )}
                        {psychologist.isInPerson && (
                          <Badge variant="outline">
                            In-Person
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{psychologist.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{psychologist.rating}</span>
                        <span className="text-sm text-muted-foreground">({psychologist.reviewCount} reviews)</span>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {/* Location Info */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="h-4 w-4 text-muted-foreground" />
                        <span>{psychologist.address}, {psychologist.city}, {psychologist.state} {psychologist.zipCode}</span>
                      </div>
                      {userLocation && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Navigation className="h-4 w-4" />
                          <span>{calculateDistance(userLocation.lat, userLocation.lng, psychologist.coordinates.lat, psychologist.coordinates.lng).toFixed(1)} km away</span>
                          <span>•</span>
                          <span>~15 min drive</span>
                        </div>
                      )}
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1">
                      {psychologist.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {psychologist.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{psychologist.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Professional Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                        <Award className="h-3 w-3" />
                        <span>{psychologist.yearsExperience} years exp</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>Verified</span>
                        </div>
                        <div className="flex items-center gap-1">
                        <Globe className="h-3 w-3" />
                        <span>{psychologist.languages.slice(0, 2).join(", ")}</span>
                        </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-lg font-semibold">{psychologist.priceRange}</span>
                        <span className="text-sm text-muted-foreground">/session</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => getDirections(psychologist)}>
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <BookingDialog psychologist={psychologist}>
                          <Button size="sm">
                            <Calendar className="h-4 w-4 mr-1" />
                            Book
                          </Button>
                        </BookingDialog>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <Card className="w-full h-96">
              <CardContent className="p-6 flex items-center justify-center h-full">
                <div className="text-center">
                  <Map className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
                  <h3 className="text-lg font-semibold mb-2">Map View</h3>
                  <p className="text-muted-foreground">
                    Showing {filteredPsychologists.length} psychologists in the area
                  </p>
                </div>
              </CardContent>
            </Card>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 max-h-96 overflow-y-auto">
              {filteredPsychologists.map((psychologist) => (
                <Card key={psychologist.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={psychologist.profileImage || "/api/placeholder/100/100"} />
                        <AvatarFallback>{psychologist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <h4 className="font-semibold text-sm truncate">{psychologist.name}</h4>
                          {psychologist.verified && (
                            <CheckCircle className="h-3 w-3 text-green-600 flex-shrink-0" />
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">{psychologist.title}</p>
                        <div className="flex items-center gap-1 mt-1">
                          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                          <span className="text-xs font-medium">{psychologist.rating}</span>
                          <span className="text-xs text-muted-foreground">({psychologist.reviewCount})</span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span className="truncate">{psychologist.address}</span>
                        </div>
                        <div className="flex gap-1 mt-2">
                          <Button size="sm" variant="outline" className="h-7 text-xs px-2" onClick={() => {
                            if (psychologist.phone) {
                              window.open(`tel:${psychologist.phone}`, '_blank');
                            }
                          }}>
                            <Phone className="h-3 w-3 mr-1" />
                            Call
                          </Button>
                          <BookingDialog psychologist={psychologist}>
                            <Button size="sm" className="h-7 text-xs px-2">
                              Book
                            </Button>
                          </BookingDialog>
                        </div>
                </div>
              </div>
            </CardContent>
          </Card>
              ))}
            </div>
          </div>
        )}

        {filteredPsychologists.length === 0 && !loading && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No psychologists found</h3>
                <p className="text-muted-foreground mb-4">
                  Try adjusting your search criteria or expanding your search radius.
                </p>
                <Button onClick={() => {
                  setSearchTerm("");
                  setSelectedSpecialization("all");
                  setSelectedInsurance("all");
                  setSelectedLanguage("all");
                  setMaxDistance([50]);
                }}>
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
    </ErrorBoundary>
  );
}
