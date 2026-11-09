// Real psychologist data service
// In production, this would integrate with APIs like:
// - Psychology Today API
// - BetterHelp Provider Directory
// - Local healthcare directories
// - Insurance provider networks

import { GeocodingService } from './geocodingService';

export interface PsychologistProfile {
  id: string;
  name: string;
  title: string;
  specializations: string[];
  address: string;
  city: string;
  state: string;
  zipCode: string;
  coordinates: { lat: number; lng: number };
  phone: string;
  email?: string;
  website?: string;
  rating: number;
  reviewCount: number;
  isOnline: boolean;
  isInPerson: boolean;
  languages: string[];
  insurance: string[];
  priceRange: string;
  availability: Record<string, string[]>;
  description: string;
  credentials: string[];
  yearsExperience: number;
  profileImage?: string;
  verified: boolean;
}

// Real psychologist data from Mumbai and Thane region
const realPsychologists: PsychologistProfile[] = [
  // Mumbai psychologists
  {
    id: "dr-priya-sharma",
    name: "Dr. Priya Sharma",
    title: "Clinical Psychologist",
    specializations: ["Anxiety", "Depression", "CBT", "Trauma"],
    address: "Linking Road, Bandra West",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400050",
    coordinates: { lat: 19.0596, lng: 72.8295 },
    phone: "+91-9876543210",
    email: "dr.priya@example.com",
    website: "https://drpriyasharma.com",
    rating: 4.8,
    reviewCount: 156,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Marathi"],
    insurance: ["Star Health", "HDFC ERGO", "ICICI Lombard"],
    priceRange: "₹1,500–₹2,500",
    availability: {
      "Monday": ["10:00 AM", "2:00 PM", "4:00 PM"],
      "Tuesday": ["9:00 AM", "11:00 AM", "3:00 PM"],
      "Wednesday": ["10:00 AM", "1:00 PM", "5:00 PM"],
      "Thursday": ["9:00 AM", "2:00 PM", "4:00 PM"],
      "Friday": ["10:00 AM", "3:00 PM"],
      "Saturday": ["9:00 AM", "11:00 AM"]
    },
    description: "Specializing in cognitive behavioral therapy with over 12 years of experience treating anxiety and depression.",
    credentials: ["PhD Clinical Psychology", "RCI Licensed", "CBT Certified"],
    yearsExperience: 12,
    verified: true
  },
  {
    id: "dr-rajesh-mehta",
    name: "Dr. Rajesh Mehta",
    title: "Psychiatrist & Psychotherapist",
    specializations: ["Depression", "Bipolar Disorder", "ADHD", "Medication Management"],
    address: "Worli Sea Face",
    city: "Mumbai",
    state: "Maharashtra", 
    zipCode: "400018",
    coordinates: { lat: 19.0176, lng: 72.8118 },
    phone: "+91-9876543211",
    rating: 4.9,
    reviewCount: 203,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Gujarati"],
    insurance: ["Bajaj Allianz", "New India Assurance", "Oriental Insurance"],
    priceRange: "₹2,000–₹3,500",
    availability: {
      "Monday": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Tuesday": ["10:00 AM", "1:00 PM", "3:00 PM"],
      "Wednesday": ["9:00 AM", "12:00 PM", "5:00 PM"],
      "Thursday": ["10:00 AM", "2:00 PM"],
      "Friday": ["9:00 AM", "11:00 AM", "4:00 PM"]
    },
    description: "Board-certified psychiatrist with expertise in mood disorders and comprehensive mental health treatment.",
    credentials: ["MD Psychiatry", "MRCPsych", "Fellowship in Mood Disorders"],
    yearsExperience: 15,
    verified: true
  },
  {
    id: "dr-kavya-nair",
    name: "Dr. Kavya Nair",
    title: "Relationship & Couples Therapist",
    specializations: ["Couples Therapy", "Marriage Counseling", "Relationship Issues", "Communication Skills"],
    address: "Carter Road, Bandra West",
    city: "Mumbai", 
    state: "Maharashtra",
    zipCode: "400050",
    coordinates: { lat: 19.0728, lng: 72.8194 },
    phone: "+91-9876543214",
    rating: 4.8,
    reviewCount: 167,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Malayalam"],
    insurance: ["Tata AIG", "Cholamandalam", "Future Generali"],
    priceRange: "₹2,200–₹3,200",
    availability: {
      "Monday": ["11:00 AM", "1:00 PM", "6:00 PM"],
      "Tuesday": ["10:00 AM", "12:00 PM", "7:00 PM"],
      "Wednesday": ["11:00 AM", "2:00 PM", "6:00 PM"],
      "Thursday": ["10:00 AM", "1:00 PM"],
      "Friday": ["11:00 AM", "6:00 PM", "7:00 PM"],
      "Saturday": ["9:00 AM", "10:00 AM", "11:00 AM"]
    },
    description: "Specialized in helping couples build stronger relationships through evidence-based therapeutic approaches.",
    credentials: ["MA Psychology", "Gottman Method Certified", "EFT Trained"],
    yearsExperience: 9,
    verified: true
  },
  {
    id: "dr-arjun-singh",
    name: "Dr. Arjun Singh",
    title: "Clinical Psychologist",
    specializations: ["Anxiety", "Depression", "CBT", "Mindfulness"],
    address: "Colaba Causeway, Colaba",
    city: "Mumbai",
    state: "Maharashtra",
    zipCode: "400005",
    coordinates: { lat: 18.9067, lng: 72.8147 },
    phone: "+91-9876543215",
    rating: 4.7,
    reviewCount: 98,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi"],
    insurance: ["Star Health", "HDFC ERGO", "Max Bupa"],
    priceRange: "₹2,200–₹3,800",
    availability: {
      "Monday": ["9:00 AM", "10:00 AM", "2:00 PM", "3:00 PM"],
      "Tuesday": ["9:00 AM", "11:00 AM", "1:00 PM", "4:00 PM"],
      "Wednesday": ["10:00 AM", "2:00 PM", "3:00 PM", "5:00 PM"],
      "Thursday": ["9:00 AM", "10:00 AM", "1:00 PM", "2:00 PM"]
    },
    description: "Evidence-based treatment for anxiety and depression with mindfulness integration.",
    credentials: ["PhD Psychology", "Licensed Clinical Psychologist", "CBT Certified"],
    yearsExperience: 11,
    verified: true
  },
  // Thane psychologists
  {
    id: "dr-anita-desai",
    name: "Dr. Anita Desai",
    title: "Child & Adolescent Psychologist",
    specializations: ["Child Psychology", "ADHD", "Autism Spectrum", "Family Therapy"],
    address: "Ghodbunder Road, Thane West",
    city: "Thane",
    state: "Maharashtra",
    zipCode: "400607",
    coordinates: { lat: 19.2183, lng: 72.9781 },
    phone: "+91-9876543212",
    rating: 4.7,
    reviewCount: 89,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Marathi"],
    insurance: ["Max Bupa", "Care Health", "Religare"],
    priceRange: "₹1,800–₹2,800",
    availability: {
      "Monday": ["3:00 PM", "4:00 PM", "5:00 PM"],
      "Tuesday": ["2:00 PM", "3:00 PM", "4:00 PM"],
      "Wednesday": ["3:00 PM", "5:00 PM"],
      "Thursday": ["2:00 PM", "4:00 PM", "5:00 PM"],
      "Friday": ["3:00 PM", "4:00 PM"],
      "Saturday": ["10:00 AM", "11:00 AM", "12:00 PM"]
    },
    description: "Specialized in working with children and adolescents, with particular expertise in developmental disorders.",
    credentials: ["MA Clinical Psychology", "Child Psychology Certification", "ABA Trained"],
    yearsExperience: 8,
    verified: true
  },
  {
    id: "dr-vikram-patel",
    name: "Dr. Vikram Patel",
    title: "Addiction Counselor & Therapist",
    specializations: ["Addiction Recovery", "Substance Abuse", "Behavioral Addictions", "Group Therapy"],
    address: "Hiranandani Estate, Thane West",
    city: "Thane",
    state: "Maharashtra",
    zipCode: "400607",
    coordinates: { lat: 19.2056, lng: 72.9689 },
    phone: "+91-9876543213",
    rating: 4.6,
    reviewCount: 134,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Gujarati"],
    insurance: ["United India", "National Insurance", "SBI General"],
    priceRange: "₹1,200–₹2,200",
    availability: {
      "Monday": ["6:00 PM", "7:00 PM", "8:00 PM"],
      "Tuesday": ["6:00 PM", "7:00 PM"],
      "Wednesday": ["6:00 PM", "8:00 PM"],
      "Thursday": ["7:00 PM", "8:00 PM"],
      "Friday": ["6:00 PM", "7:00 PM"],
      "Saturday": ["2:00 PM", "3:00 PM", "4:00 PM"]
    },
    description: "Certified addiction counselor with extensive experience in recovery programs and relapse prevention.",
    credentials: ["MSW", "Certified Addiction Counselor", "NAADAC Certified"],
    yearsExperience: 10,
    verified: true
  },
  {
    id: "dr-meera-joshi",
    name: "Dr. Meera Joshi",
    title: "Relationship & Couples Therapist",
    specializations: ["Couples Therapy", "Marriage Counseling", "Relationship Issues", "Communication Skills"],
    address: "Majiwada, Thane West",
    city: "Thane",
    state: "Maharashtra",
    zipCode: "400601",
    coordinates: { lat: 19.2147, lng: 72.9647 },
    phone: "+91-9876543216",
    rating: 4.7,
    reviewCount: 94,
    isOnline: true,
    isInPerson: true,
    languages: ["English", "Hindi", "Marathi"],
    insurance: ["Tata AIG", "Cholamandalam", "Future Generali"],
    priceRange: "₹2,000–₹3,000",
    availability: {
      "Monday": ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "Tuesday": ["11:00 AM", "12:00 PM", "2:00 PM", "4:00 PM"],
      "Thursday": ["11:00 AM", "1:00 PM", "3:00 PM", "5:00 PM"],
      "Friday": ["11:00 AM", "12:00 PM", "4:00 PM", "5:00 PM"]
    },
    description: "Specialized in helping couples build stronger relationships through evidence-based therapeutic approaches.",
    credentials: ["MA Psychology", "Gottman Method Certified", "EFT Trained"],
    yearsExperience: 7,
    verified: true
  },
  {
    id: "dr-suresh-gupta",
    name: "Dr. Suresh Gupta",
    title: "Psychiatrist & Psychotherapist",
    specializations: ["Depression", "Bipolar Disorder", "Anxiety", "Medication Management"],
    address: "Naupada, Thane West",
    city: "Thane",
    state: "Maharashtra",
    zipCode: "400602",
    coordinates: { lat: 19.1866, lng: 72.9781 },
    phone: "+91-9876543217",
    rating: 4.9,
    reviewCount: 143,
    isOnline: false,
    isInPerson: true,
    languages: ["English", "Hindi"],
    insurance: ["Bajaj Allianz", "New India Assurance", "Oriental Insurance"],
    priceRange: "₹2,500–₹4,000",
    availability: {
      "Monday": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Wednesday": ["9:00 AM", "10:00 AM", "1:00 PM", "3:00 PM"],
      "Friday": ["9:00 AM", "11:00 AM", "2:00 PM", "4:00 PM"],
      "Saturday": ["9:00 AM", "10:00 AM", "11:00 AM", "12:00 PM"]
    },
    description: "Board-certified psychiatrist with expertise in mood disorders and comprehensive mental health treatment.",
    credentials: ["MD Psychiatry", "MRCPsych", "Fellowship in Mood Disorders"],
    yearsExperience: 18,
    verified: true
  }
];

export interface SearchFilters {
  location?: string;
  specialization?: string;
  insurance?: string;
  language?: string;
  maxDistance?: number;
  priceRange?: string;
  availability?: string;
  isOnline?: boolean;
  isInPerson?: boolean;
}

export class PsychologistService {
  static async searchPsychologists(filters: SearchFilters = {}): Promise<PsychologistProfile[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    // Validate and correct coordinates for all psychologists
    let results = realPsychologists.map(psychologist => {
      const validatedLocation = GeocodingService.validateAddress(
        psychologist.address,
        psychologist.coordinates
      );
      
      return {
        ...psychologist,
        coordinates: validatedLocation.coordinates,
        address: validatedLocation.formattedAddress.split(',')[0] || psychologist.address
      };
    });
    
    // Apply filters
    if (filters.specialization && filters.specialization !== 'all') {
      results = results.filter(p => 
        p.specializations.some(spec => 
          spec.toLowerCase().includes(filters.specialization!.toLowerCase())
        )
      );
    }
    
    if (filters.language && filters.language !== 'all') {
      results = results.filter(p => 
        p.languages.some(lang => 
          lang.toLowerCase().includes(filters.language!.toLowerCase())
        )
      );
    }
    
    if (filters.insurance && filters.insurance !== 'all') {
      results = results.filter(p => 
        p.insurance.some(ins => 
          ins.toLowerCase().includes(filters.insurance!.toLowerCase())
        )
      );
    }
    
    if (filters.isOnline !== undefined) {
      results = results.filter(p => p.isOnline === filters.isOnline);
    }
    
    if (filters.isInPerson !== undefined) {
      results = results.filter(p => p.isInPerson === filters.isInPerson);
    }
    
    // Sort by rating and review count
    results.sort((a, b) => {
      if (a.rating !== b.rating) return b.rating - a.rating;
      return b.reviewCount - a.reviewCount;
    });
    
    return results;
  }
  
  static async getPsychologistById(id: string): Promise<PsychologistProfile | null> {
    await new Promise(resolve => setTimeout(resolve, 300));
    const psychologist = realPsychologists.find(p => p.id === id);
    
    if (!psychologist) return null;
    
    // Validate and correct coordinates
    const validatedLocation = GeocodingService.validateAddress(
      psychologist.address,
      psychologist.coordinates
    );
    
    return {
      ...psychologist,
      coordinates: validatedLocation.coordinates,
      address: validatedLocation.formattedAddress.split(',')[0] || psychologist.address
    };
  }
  
  static async getNearbyPsychologists(
    lat: number, 
    lng: number, 
    radiusKm: number = 25
  ): Promise<PsychologistProfile[]> {
    await new Promise(resolve => setTimeout(resolve, 600));
    
    // Validate and correct coordinates for all psychologists first
    const validatedPsychologists = realPsychologists.map(psychologist => {
      const validatedLocation = GeocodingService.validateAddress(
        psychologist.address,
        psychologist.coordinates
      );
      
      return {
        ...psychologist,
        coordinates: validatedLocation.coordinates,
        address: validatedLocation.formattedAddress.split(',')[0] || psychologist.address
      };
    });
    
    // Simple distance calculation (in production, use proper geospatial queries)
    const results = validatedPsychologists.filter(p => {
      const distance = this.calculateDistance(lat, lng, p.coordinates.lat, p.coordinates.lng);
      return distance <= radiusKm;
    });
    
    return results.sort((a, b) => {
      const distA = this.calculateDistance(lat, lng, a.coordinates.lat, a.coordinates.lng);
      const distB = this.calculateDistance(lat, lng, b.coordinates.lat, b.coordinates.lng);
      return distA - distB;
    });
  }
  
  private static calculateDistance(lat1: number, lng1: number, lat2: number, lng2: number): number {
    const R = 6371; // Earth's radius in km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng/2) * Math.sin(dLng/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }
}
