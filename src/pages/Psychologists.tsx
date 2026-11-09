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
import GoogleMap from "@/components/GoogleMap";
import { PsychologistService, type PsychologistProfile, type SearchFilters } from "@/services/psychologistService";
import { BookingDialog } from "@/components/BookingDialog";

interface TherapistLocation {
  id: string;
  name: string;
  title: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  distance?: number;
  travelTime?: number;
  officeHours: string[];
  phone: string;
  website?: string;
  specializations: string[];
  insuranceAccepted: string[];
  languages: string[];
  accessibility: {
    wheelchairAccessible: boolean;
    elevatorAccess: boolean;
    parkingAvailable: boolean;
    publicTransitNearby: boolean;
  };
  photos: string[];
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  isInPerson: boolean;
  priceRange: string;
  availability: {
    [key: string]: string[];
  };
  description: string;
  credentials: string[];
}

interface UserLocation {
  lat: number;
  lng: number;
  address: string;
}

const mockTherapists: TherapistLocation[] = [
  // Mumbai therapists
  {
    id: "1",
    name: "Dr. Priya Sharma",
    title: "Consultant Clinical Psychologist",
    address: "Bandra Kurla Complex, Bandra East",
    city: "Mumbai",
    state: "MH",
    zipCode: "400051",
    coordinates: { lat: 19.060, lng: 72.870 },
    officeHours: ["Mon 9AM-6PM", "Tue 9AM-6PM", "Wed 9AM-6PM", "Thu 9AM-6PM"],
    phone: "+91 98200 00001",
    website: "www.priyasharma.in",
    specializations: ["Anxiety", "Depression", "Trauma", "CBT"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi", "Marathi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: true,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    rating: 4.9,
    reviewCount: 127,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹2000–₹3500",
    availability: {
      "Monday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      "Tuesday": ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
      "Wednesday": ["10:00 AM", "2:00 PM", "3:00 PM", "5:00 PM"],
      "Thursday": ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM"]
    },
    description: "Specializes in CBT with a focus on anxiety and mood disorders.",
    credentials: ["PhD Psychology", "Licensed Clinical Psychologist", "CBT Certified"]
  },
  {
    id: "2",
    name: "Dr. Rajesh Mehta",
    title: "Marriage & Family Therapist",
    address: "Andheri West, Lokhandwala Complex",
    city: "Mumbai",
    state: "MH",
    zipCode: "400053",
    coordinates: { lat: 19.141, lng: 72.829 },
    officeHours: ["Mon 10AM-7PM", "Wed 10AM-7PM", "Fri 10AM-7PM", "Sat 9AM-5PM"],
    phone: "+91 98330 00002",
    website: "www.rajeshmehta.in",
    specializations: ["Couples Therapy", "Family Therapy", "Relationship Issues"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: false,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.8,
    reviewCount: 89,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹1800–₹3000",
    availability: {
      "Monday": ["10:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Wednesday": ["10:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "Friday": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"],
      "Saturday": ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM"]
    },
    description: "Helps couples and families build stronger, healthier relationships.",
    credentials: ["LMFT", "Gottman Method Certified", "Family Systems Specialist"]
  },
  {
    id: "3",
    name: "Dr. Kavya Nair",
    title: "Clinical Social Worker",
    address: "Hiranandani Gardens, Powai",
    city: "Mumbai",
    state: "MH",
    zipCode: "400076",
    coordinates: { lat: 19.1197, lng: 72.9050 },
    officeHours: ["Tue 8AM-5PM", "Wed 8AM-5PM", "Thu 8AM-5PM", "Fri 8AM-5PM"],
    phone: "+91 98700 00003",
    website: "www.kavyanair.in",
    specializations: ["Trauma", "PTSD", "EMDR", "Grief Counseling"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi", "Marathi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: true,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
    rating: 4.9,
    reviewCount: 156,
    isOnline: false,
    isInPerson: true,
    priceRange: "₹2000–₹3200",
    availability: {
      "Tuesday": ["8:00 AM", "9:00 AM", "1:00 PM", "2:00 PM"],
      "Wednesday": ["8:00 AM", "10:00 AM", "2:00 PM", "4:00 PM"],
      "Thursday": ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
      "Friday": ["8:00 AM", "9:00 AM", "2:00 PM", "3:00 PM"]
    },
    description: "Trauma specialist with extensive experience in EMDR therapy.",
    credentials: ["LCSW", "EMDR Certified", "Trauma Specialist"]
  },
  {
    id: "4",
    name: "Dr. Arjun Singh",
    title: "Consultant Clinical Psychologist",
    address: "Colaba Causeway, Colaba",
    city: "Mumbai",
    state: "MH",
    zipCode: "400005",
    coordinates: { lat: 18.9067, lng: 72.8147 },
    officeHours: ["Mon 9AM-6PM", "Tue 9AM-6PM", "Wed 9AM-6PM", "Thu 9AM-6PM"],
    phone: "+91 98190 00004",
    website: "www.arjunsingh.in",
    specializations: ["Anxiety", "Depression", "CBT", "Mindfulness"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: true,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.7,
    reviewCount: 98,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹2200–₹3800",
    availability: {
      "Monday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      "Tuesday": ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
      "Wednesday": ["10:00 AM", "2:00 PM", "3:00 PM", "5:00 PM"],
      "Thursday": ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM"]
    },
    description: "Evidence-based treatment for anxiety and depression.",
    credentials: ["PhD Psychology", "Licensed Clinical Psychologist", "CBT Certified"]
  },
  // Thane therapists
  {
    id: "5",
    name: "Dr. Anita Desai",
    title: "Child & Adolescent Psychologist",
    address: "Ghodbunder Road, Thane West",
    city: "Thane",
    state: "MH",
    zipCode: "400607",
    coordinates: { lat: 19.2183, lng: 72.9781 },
    officeHours: ["Mon 3PM-8PM", "Tue 3PM-8PM", "Wed 3PM-8PM", "Sat 10AM-5PM"],
    phone: "+91 98400 00005",
    website: "www.anitadesai.in",
    specializations: ["Child Psychology", "ADHD", "Autism Spectrum", "Family Therapy"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi", "Marathi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: true,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.8,
    reviewCount: 112,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹1800–₹2800",
    availability: {
      "Monday": ["3:00 PM", "4:00 PM", "5:00 PM", "6:00 PM"],
      "Tuesday": ["3:00 PM", "4:00 PM", "5:00 PM", "7:00 PM"],
      "Wednesday": ["3:00 PM", "5:00 PM", "6:00 PM", "7:00 PM"],
      "Saturday": ["10:00 AM", "11:00 AM", "2:00 PM", "3:00 PM"]
    },
    description: "Specialized in working with children and adolescents, with particular expertise in developmental disorders.",
    credentials: ["MA Clinical Psychology", "Child Psychology Certification", "ABA Trained"]
  },
  {
    id: "6",
    name: "Dr. Vikram Patel",
    title: "Addiction Counselor & Therapist",
    address: "Hiranandani Estate, Thane West",
    city: "Thane",
    state: "MH",
    zipCode: "400607",
    coordinates: { lat: 19.2056, lng: 72.9689 },
    officeHours: ["Mon 6PM-9PM", "Tue 6PM-9PM", "Wed 6PM-9PM", "Sat 2PM-7PM"],
    phone: "+91 98500 00006",
    website: "www.vikrampatel.in",
    specializations: ["Addiction Recovery", "Substance Abuse", "Behavioral Addictions", "Group Therapy"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi", "Gujarati"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: true,
      publicTransitNearby: false
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.6,
    reviewCount: 87,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹1200–₹2200",
    availability: {
      "Monday": ["6:00 PM", "7:00 PM", "8:00 PM"],
      "Tuesday": ["6:00 PM", "7:00 PM", "8:00 PM"],
      "Wednesday": ["6:00 PM", "7:00 PM", "8:00 PM"],
      "Saturday": ["2:00 PM", "3:00 PM", "4:00 PM", "5:00 PM"]
    },
    description: "Certified addiction counselor with extensive experience in recovery programs and relapse prevention.",
    credentials: ["MSW", "Certified Addiction Counselor", "NAADAC Certified"]
  },
  {
    id: "7",
    name: "Dr. Meera Joshi",
    title: "Relationship & Couples Therapist",
    address: "Majiwada, Thane West",
    city: "Thane",
    state: "MH",
    zipCode: "400601",
    coordinates: { lat: 19.2147, lng: 72.9647 },
    officeHours: ["Mon 11AM-6PM", "Tue 11AM-6PM", "Thu 11AM-6PM", "Fri 11AM-6PM"],
    phone: "+91 98600 00007",
    website: "www.meerajoshi.in",
    specializations: ["Couples Therapy", "Marriage Counseling", "Relationship Issues", "Communication Skills"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi", "Marathi"],
    accessibility: {
      wheelchairAccessible: false,
      elevatorAccess: false,
      parkingAvailable: true,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.7,
    reviewCount: 94,
    isOnline: true,
    isInPerson: true,
    priceRange: "₹2000–₹3000",
    availability: {
      "Monday": ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "Tuesday": ["11:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      "Thursday": ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "Friday": ["11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM"]
    },
    description: "Specialized in helping couples build stronger relationships through evidence-based therapeutic approaches.",
    credentials: ["MA Psychology", "Gottman Method Certified", "EFT Trained"]
  },
  {
    id: "8",
    name: "Dr. Suresh Gupta",
    title: "Psychiatrist & Psychotherapist",
    address: "Naupada, Thane West",
    city: "Thane",
    state: "MH",
    zipCode: "400602",
    coordinates: { lat: 19.1866, lng: 72.9781 },
    officeHours: ["Mon 9AM-5PM", "Wed 9AM-5PM", "Fri 9AM-5PM", "Sat 9AM-2PM"],
    phone: "+91 98700 00008",
    website: "www.sureshgupta.in",
    specializations: ["Depression", "Bipolar Disorder", "Anxiety", "Medication Management"],
    insuranceAccepted: ["Private"],
    languages: ["English", "Hindi"],
    accessibility: {
      wheelchairAccessible: true,
      elevatorAccess: true,
      parkingAvailable: false,
      publicTransitNearby: true
    },
    photos: ["/api/placeholder/400/300"],
    rating: 4.9,
    reviewCount: 143,
    isOnline: false,
    isInPerson: true,
    priceRange: "₹2500–₹4000",
    availability: {
      "Monday": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Wednesday": ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
      "Friday": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Saturday": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
    },
    description: "Board-certified psychiatrist with expertise in mood disorders and comprehensive mental health treatment.",
    credentials: ["MD Psychiatry", "MRCPsych", "Fellowship in Mood Disorders"]
  }
];

// Debug: Log the therapists data
console.log('Total therapists loaded:', mockTherapists.length);
console.log('Cities:', [...new Set(mockTherapists.map(t => t.city))]);

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

export default function PsychologistsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSpecialization, setSelectedSpecialization] = useState("all");
  const [selectedInsurance, setSelectedInsurance] = useState("all");
  const [selectedLanguage, setSelectedLanguage] = useState("all");
  const [maxDistance, setMaxDistance] = useState([25]);
  const [viewMode, setViewMode] = useState<"list" | "map">("list");
  const [userLocation, setUserLocation] = useState<UserLocation | null>(null);
  const [locationInput, setLocationInput] = useState("");
  const [filteredTherapists, setFilteredTherapists] = useState<TherapistLocation[]>([]);
  const [loading, setLoading] = useState(false);
  const [showCrisisResources, setShowCrisisResources] = useState(true);

  const specializations = ["all", "Anxiety", "Depression", "Trauma", "Couples Therapy", "Family Therapy", "CBT", "EMDR", "Grief Counseling"];
  const insuranceProviders = ["all", "Aetna", "Blue Cross", "Cigna", "UnitedHealth", "Kaiser", "Medicaid", "Medicare"];
  const languages = ["all", "English", "Hindi", "Marathi"];

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

  // Filter therapists based on search criteria
  useEffect(() => {
    let filtered = [...mockTherapists];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(therapist =>
        therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specializations.some(spec =>
          spec.toLowerCase().includes(searchTerm.toLowerCase())
        ) ||
        therapist.city.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Filter by specialization
    if (selectedSpecialization !== "all") {
      filtered = filtered.filter(therapist =>
        therapist.specializations.includes(selectedSpecialization)
      );
    }

    // Filter by insurance
    if (selectedInsurance !== "all") {
      filtered = filtered.filter(therapist =>
        therapist.insuranceAccepted.includes(selectedInsurance)
      );
    }

    // Filter by language
    if (selectedLanguage !== "all") {
      filtered = filtered.filter(therapist =>
        therapist.languages.includes(selectedLanguage)
      );
    }

    // Calculate distances and filter by max distance
    if (userLocation) {
      filtered = filtered.map(therapist => ({
        ...therapist,
        distance: calculateDistance(
          userLocation.lat,
          userLocation.lng,
          therapist.coordinates.lat,
          therapist.coordinates.lng
        )
      })).filter(therapist => therapist.distance! <= maxDistance[0]);
    }

    setFilteredTherapists(filtered);
  }, [searchTerm, selectedSpecialization, selectedInsurance, selectedLanguage, maxDistance, userLocation]);

  const handleLocationSearch = async () => {
    if (!locationInput.trim()) {
      toast({
        title: "Location required",
        description: "Please enter a location to search for nearby therapists.",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);
    
    try {
      // Use a free geocoding service (Nominatim) for demo purposes
      // In production, you would use Google Maps Geocoding API or similar
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationInput)}&limit=1`
      );
      
      if (!response.ok) {
        throw new Error('Geocoding failed');
      }
      
      const data = await response.json();
      
      if (data.length === 0) {
        throw new Error('Location not found');
      }
      
      const result = data[0];
      const lat = parseFloat(result.lat);
      const lng = parseFloat(result.lon);
      
      setUserLocation({
        lat,
        lng,
        address: result.display_name
      });
      
      toast({
        title: "Location found",
        description: `Searching for therapists near ${result.display_name}`
      });
      
    } catch (error) {
      console.error('Geocoding error:', error);
      
      // Fallback to mock coordinates for demo purposes
      // Added Mumbai coordinates for demo in India
      const mockCoordinates = {
        'mumbai': { lat: 19.0760, lng: 72.8777 },
        'new york': { lat: 40.7589, lng: -73.9851 },
        'los angeles': { lat: 34.0522, lng: -118.2437 },
        'chicago': { lat: 41.8781, lng: -87.6298 },
        'houston': { lat: 29.7604, lng: -95.3698 },
        'phoenix': { lat: 33.4484, lng: -112.0740 },
        'philadelphia': { lat: 39.9526, lng: -75.1652 },
        'san antonio': { lat: 29.4241, lng: -98.4936 },
        'san diego': { lat: 32.7157, lng: -117.1611 },
        'dallas': { lat: 32.7767, lng: -96.7970 },
        'san jose': { lat: 37.3382, lng: -121.8863 },
        'austin': { lat: 30.2672, lng: -97.7431 },
        'jacksonville': { lat: 30.3322, lng: -81.6557 },
        'fort worth': { lat: 32.7555, lng: -97.3308 },
        'columbus': { lat: 39.9612, lng: -82.9988 },
        'charlotte': { lat: 35.2271, lng: -80.8431 },
        'san francisco': { lat: 37.7749, lng: -122.4194 },
        'indianapolis': { lat: 39.7684, lng: -86.1581 },
        'seattle': { lat: 47.6062, lng: -122.3321 },
        'denver': { lat: 39.7392, lng: -104.9903 },
        'washington': { lat: 38.9072, lng: -77.0369 },
        'boston': { lat: 42.3601, lng: -71.0589 },
        'el paso': { lat: 31.7619, lng: -106.4850 },
        'nashville': { lat: 36.1627, lng: -86.7816 },
        'detroit': { lat: 42.3314, lng: -83.0458 },
        'oklahoma city': { lat: 35.4676, lng: -97.5164 },
        'portland': { lat: 45.5152, lng: -122.6784 },
        'las vegas': { lat: 36.1699, lng: -115.1398 },
        'memphis': { lat: 35.1495, lng: -90.0490 },
        'louisville': { lat: 38.2527, lng: -85.7585 },
        'baltimore': { lat: 39.2904, lng: -76.6122 },
        'milwaukee': { lat: 43.0389, lng: -87.9065 },
        'albuquerque': { lat: 35.0844, lng: -106.6504 },
        'tucson': { lat: 32.2226, lng: -110.9747 },
        'fresno': { lat: 36.7378, lng: -119.7871 },
        'sacramento': { lat: 38.5816, lng: -121.4944 },
        'mesa': { lat: 33.4152, lng: -111.8315 },
        'kansas city': { lat: 39.0997, lng: -94.5786 },
        'atlanta': { lat: 33.7490, lng: -84.3880 },
        'long beach': { lat: 33.7701, lng: -118.1937 },
        'colorado springs': { lat: 38.8339, lng: -104.8214 },
        'raleigh': { lat: 35.7796, lng: -78.6382 },
        'miami': { lat: 25.7617, lng: -80.1918 },
        'virginia beach': { lat: 36.8529, lng: -75.9780 },
        'omaha': { lat: 41.2565, lng: -95.9345 },
        'oakland': { lat: 37.8044, lng: -122.2712 },
        'minneapolis': { lat: 44.9778, lng: -93.2650 },
        'tulsa': { lat: 36.1540, lng: -95.9928 },
        'arlington': { lat: 32.7357, lng: -97.1081 },
        'tampa': { lat: 27.9506, lng: -82.4572 }
      };
      
      const cityKey = locationInput.toLowerCase().trim();
      const coordinates = mockCoordinates[cityKey as keyof typeof mockCoordinates];
      
      if (coordinates) {
        setUserLocation({
          lat: coordinates.lat,
          lng: coordinates.lng,
          address: locationInput
        });
        
        toast({
          title: "Location found",
          description: `Searching for therapists near ${locationInput}`
        });
      } else {
        // Default to Mumbai if city not found
        setUserLocation({
          lat: 19.0760,
          lng: 72.8777,
          address: locationInput
        });
        
        toast({
          title: "Location not found",
          description: `Using default location. Please try a different city name.`,
          variant: "destructive"
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const getDirections = (therapist: TherapistLocation) => {
    const url = `https://www.google.com/maps/dir/?api=1&destination=${therapist.coordinates.lat},${therapist.coordinates.lng}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container py-6 animate-enter">
      <SEO
        title="The Expert Network — WellBeingConnect"
        description="Connect with licensed therapists and mental health professionals in your area. Search by location, specialization, and insurance."
        path="/psychologists"
      />

      <header className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">The Expert Network - UPDATED WITH MUMBAI & THANE</h1>
        <p className="text-muted-foreground mt-2">
          Connect with licensed therapists and mental health professionals in Mumbai and Thane areas. Total doctors: {mockTherapists.length}
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
            {filteredTherapists.length} Therapist{filteredTherapists.length !== 1 ? 's' : ''} Found (Total Available: {mockTherapists.length} - Mumbai & Thane)
            {userLocation && ` within ${maxDistance[0]} km`}
          </h2>
        </div>

        {viewMode === "list" ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredTherapists.map((therapist) => (
              <Card key={therapist.id} className="hover:shadow-lg transition-shadow">
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/api/placeholder/100/100" />
                      <AvatarFallback>{therapist.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-semibold">{therapist.name}</h3>
                        {therapist.isOnline && (
                          <Badge variant="secondary" className="bg-green-100 text-green-800">
                            Online
                          </Badge>
                        )}
                        {therapist.isInPerson && (
                          <Badge variant="outline">
                            In-Person
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{therapist.title}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-medium">{therapist.rating}</span>
                        <span className="text-sm text-muted-foreground">({therapist.reviewCount} reviews)</span>
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
                        <span>{therapist.address}, {therapist.city}, {therapist.state} {therapist.zipCode}</span>
                      </div>
                      {therapist.distance && (
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Navigation className="h-4 w-4" />
                          <span>{therapist.distance.toFixed(1)} km away</span>
                          <span>•</span>
                          <span>{therapist.travelTime || "~15 min"} drive</span>
                        </div>
                      )}
                    </div>

                    {/* Specializations */}
                    <div className="flex flex-wrap gap-1">
                      {therapist.specializations.slice(0, 3).map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          {spec}
                        </Badge>
                      ))}
                      {therapist.specializations.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{therapist.specializations.length - 3} more
                        </Badge>
                      )}
                    </div>

                    {/* Accessibility Info */}
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      {therapist.accessibility.wheelchairAccessible && (
                        <div className="flex items-center gap-1">
                          <Accessibility className="h-3 w-3" />
                          <span>Wheelchair Accessible</span>
                        </div>
                      )}
                      {therapist.accessibility.parkingAvailable && (
                        <div className="flex items-center gap-1">
                          <ParkingCircle className="h-3 w-3" />
                          <span>Parking Available</span>
                        </div>
                      )}
                      {therapist.accessibility.publicTransitNearby && (
                        <div className="flex items-center gap-1">
                          <Train className="h-3 w-3" />
                          <span>Near Transit</span>
                        </div>
                      )}
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between pt-2">
                      <div>
                        <span className="text-lg font-semibold">{therapist.priceRange}</span>
                        <span className="text-sm text-muted-foreground">/session</span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline" onClick={() => getDirections(therapist)}>
                          <Navigation className="h-4 w-4 mr-1" />
                          Directions
                        </Button>
                        <BookingDialog psychologist={therapist}>
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
            ))}
          </div>
        ) : (
          <Card className="h-96">
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-full text-muted-foreground">
                <div className="text-center">
                  <Map className="h-12 w-12 mx-auto mb-4" />
                  <p>Interactive map view coming soon!</p>
                  <p className="text-sm">For now, please use the list view to see therapist locations.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredTherapists.length === 0 && (
          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-8">
                <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No therapists found</h3>
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
  );
}
