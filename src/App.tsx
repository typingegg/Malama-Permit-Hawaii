/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Map, 
  Ticket, 
  ShoppingCart, 
  Trash2, 
  CheckCircle2, 
  ShieldCheck, 
  X,
  QrCode,
  Info,
  ExternalLink,
  Plus,
  Menu,
  Loader2,
  AlertCircle,
  RefreshCw,
  MapPin,
  Car,
  Footprints,
  Navigation,
  Flag,
  Sparkles,
  Calendar
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { GoogleGenAI } from "@google/genai";

interface DestinationItem {
  id: string;
  name: string;
  location: string;
  county: string;
  category: 'State Parks' | 'National Parks' | 'Museums & Culture' | 'Botanical Gardens' | 'Historic Sites';
  fee: number;
  dateTime: string;
  website: string;
  availabilityStatus?: 'unchecked' | 'checking' | 'available' | 'unavailable' | 'error';
  availabilityMessage?: string;
}

const DESTINATIONS_DATA: Record<string, DestinationItem[]> = {
  'Honolulu (Oahu)': [
    {
      id: 'o1',
      name: 'Hanauma Bay Nature Preserve',
      location: 'Oahu - City & County',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 25.00,
      dateTime: '',
      website: 'https://www.honolulu.gov/parks-hbay/home.html'
    },
    {
      id: 'o2',
      name: 'Diamond Head State Monument',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/diamond-head-state-monument/'
    },
    {
      id: 'o3',
      name: 'Pearl Harbor National Memorial',
      location: 'Oahu - National Park Service',
      county: 'Honolulu (Oahu)',
      category: 'National Parks',
      fee: 1.00,
      dateTime: '',
      website: 'https://www.nps.gov/valr/index.htm'
    },
    {
      id: 'o4',
      name: 'Ahupua\'a \'O Kahana State Park',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/ahupuaa-o-kahana-state-park/'
    },
    {
      id: 'o5',
      name: 'Keaiwa Heiau State Rec Area',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 5.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/keaiwa-heiau-state-recreation-area/'
    },
    {
      id: 'o6',
      name: 'Ka\'ena Point State Park',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/kaena-point-state-park/'
    },
    {
      id: 'o7',
      name: 'Malaekahana State Rec Area',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 5.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/malaekahana-state-recreation-area/'
    },
    {
      id: 'o8',
      name: 'Nu\'uanu Pali State Wayside',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 7.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/nuuanu-pali-state-wayside/'
    },
    {
      id: 'o9',
      name: 'Sand Island State Rec Area',
      location: 'Oahu - State DLNR',
      county: 'Honolulu (Oahu)',
      category: 'State Parks',
      fee: 5.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/sand-island-state-recreation-area/'
    },
    {
      id: 'o10',
      name: 'Bishop Museum',
      location: 'Honolulu - Private',
      county: 'Honolulu (Oahu)',
      category: 'Museums & Culture',
      fee: 25.00,
      dateTime: '',
      website: 'https://www.bishopmuseum.org/'
    },
    {
      id: 'o11',
      name: 'Honolulu Museum of Art',
      location: 'Honolulu - Private',
      county: 'Honolulu (Oahu)',
      category: 'Museums & Culture',
      fee: 20.00,
      dateTime: '',
      website: 'https://honolulumuseum.org/'
    },
    {
      id: 'o12',
      name: 'Polynesian Cultural Center',
      location: 'Laie - Private',
      county: 'Honolulu (Oahu)',
      category: 'Museums & Culture',
      fee: 80.00,
      dateTime: '',
      website: 'https://www.polynesia.com/'
    },
    {
      id: 'o13',
      name: 'Foster Botanical Garden',
      location: 'Honolulu - City & County',
      county: 'Honolulu (Oahu)',
      category: 'Botanical Gardens',
      fee: 5.00,
      dateTime: '',
      website: 'https://www.honolulu.gov/dpr/honolulu-botanical-gardens/foster-botanical-garden/'
    }
  ],
  'Maui County': [
    {
      id: 'm1',
      name: 'Haleakalā National Park',
      location: 'Maui - National Park Service',
      county: 'Maui County',
      category: 'National Parks',
      fee: 30.00,
      dateTime: '',
      website: 'https://www.nps.gov/hale/index.htm'
    },
    {
      id: 'm2',
      name: 'Iao Valley State Monument',
      location: 'Maui - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 5.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/maui/iao-valley-state-monument/'
    },
    {
      id: 'm3',
      name: 'Wai\'anapanapa State Park',
      location: 'Maui - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/maui/waianapanapa-state-park/'
    },
    {
      id: 'm4',
      name: 'Pala\'au State Park',
      location: 'Molokai - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/molokai/palaau-state-park/'
    },
    {
      id: 'm5',
      name: 'Makena State Park',
      location: 'Maui - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/maui/makena-state-park/'
    },
    {
      id: 'm6',
      name: 'Polipoli Spring State Rec Area',
      location: 'Maui - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/maui/polipoli-spring-state-recreation-area/'
    },
    {
      id: 'm7',
      name: 'Pua\'a Ka\'a State Wayside',
      location: 'Maui - State DLNR',
      county: 'Maui County',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/maui/puaa-kaa-state-wayside/'
    },
    {
      id: 'm8',
      name: 'Maui Historical Society',
      location: 'Wailuku - Private',
      county: 'Maui County',
      category: 'Museums & Culture',
      fee: 10.00,
      dateTime: '',
      website: 'https://www.mauimuseum.org/'
    },
    {
      id: 'm9',
      name: 'Kula Botanical Garden',
      location: 'Kula - Private',
      county: 'Maui County',
      category: 'Botanical Gardens',
      fee: 10.00,
      dateTime: '',
      website: 'http://www.kulabotanicalgarden.com/'
    }
  ],
  'Hawaii (Big Island)': [
    {
      id: 'h1',
      name: 'Hawai\'i Volcanoes National Park',
      location: 'Big Island - NPS',
      county: 'Hawaii (Big Island)',
      category: 'National Parks',
      fee: 30.00,
      dateTime: '',
      website: 'https://www.nps.gov/havo/index.htm'
    },
    {
      id: 'h2',
      name: 'Akaka Falls State Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 5.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/akaka-falls-state-park/'
    },
    {
      id: 'h3',
      name: 'Pu\'uhonua o Hōnaunau',
      location: 'Big Island - NPS',
      county: 'Hawaii (Big Island)',
      category: 'National Parks',
      fee: 20.00,
      dateTime: '',
      website: 'https://www.nps.gov/puho/index.htm'
    },
    {
      id: 'h4',
      name: 'Hāpuna Beach State Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/hapuna-beach-state-recreation-area/'
    },
    {
      id: 'h5',
      name: 'Kalopa State Recreation Area',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/kalopa-state-recreation-area/'
    },
    {
      id: 'h6',
      name: 'Kekaha Kai State Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/kekaha-kai-kona-coast-state-park/'
    },
    {
      id: 'h7',
      name: 'Kealakekua Bay State Hist Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'Historic Sites',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/kealakekua-bay-state-historical-park/'
    },
    {
      id: 'h8',
      name: 'Lapakahi State Historical Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'Historic Sites',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/lapakahi-state-historical-park/'
    },
    {
      id: 'h9',
      name: 'Lava Tree State Monument',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/lava-tree-state-monument/'
    },
    {
      id: 'h10',
      name: 'Wailuku River State Park',
      location: 'Big Island - State DLNR',
      county: 'Hawaii (Big Island)',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/wailuku-river-state-park/'
    },
    {
      id: 'h11',
      name: 'Lyman Museum & Mission House',
      location: 'Hilo - Private',
      county: 'Hawaii (Big Island)',
      category: 'Museums & Culture',
      fee: 15.00,
      dateTime: '',
      website: 'https://lymanmuseum.org/'
    },
    {
      id: 'h12',
      name: 'Hawaii Tropical Botanical Garden',
      location: 'Papaikou - Private',
      county: 'Hawaii (Big Island)',
      category: 'Botanical Gardens',
      fee: 25.00,
      dateTime: '',
      website: 'https://htbg.com/'
    }
  ],
  'Kauai': [
    {
      id: 'k1',
      name: 'Waimea Canyon State Park',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/'
    },
    {
      id: 'k2',
      name: 'Ha\'ena State Park',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 35.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/haena-state-park/'
    },
    {
      id: 'k3',
      name: 'Kōke\'e State Park',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 10.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/kokee-state-park/'
    },
    {
      id: 'k4',
      name: 'Wailua River State Park',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/wailua-river-state-park/'
    },
    {
      id: 'k5',
      name: 'Polihale State Park',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/polihale-state-park/'
    },
    {
      id: 'k6',
      name: 'Ahukini Recreation Pier',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'State Parks',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/ahukini-state-recreational-pier/'
    },
    {
      id: 'k7',
      name: 'Pa\'ula\'ula State Monument',
      location: 'Kauai - State DLNR',
      county: 'Kauai',
      category: 'Historic Sites',
      fee: 0.00,
      dateTime: '',
      website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/pa%ca%bbula%ca%bbula-state-historic-site/'
    },
    {
      id: 'k8',
      name: 'Kauai Museum',
      location: 'Lihue - Private',
      county: 'Kauai',
      category: 'Museums & Culture',
      fee: 15.00,
      dateTime: '',
      website: 'https://www.kauaimuseum.org/'
    },
    {
      id: 'k9',
      name: 'Allerton Garden',
      location: 'Koloa - NTBG',
      county: 'Kauai',
      category: 'Botanical Gardens',
      fee: 60.00,
      dateTime: '',
      website: 'https://ntbg.org/gardens/allerton/'
    }
  ]
};

const GREEN_FEE = 5.00;

export default function App() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [donation, setDonation] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(DESTINATIONS_DATA)[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'State Parks' | 'National Parks' | 'Museums & Culture' | 'Botanical Gardens' | 'Historic Sites'>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [selectedFeels, setSelectedFeels] = useState<string[]>([]);
  const [isCurating, setIsCurating] = useState(false);
  const [islandPreference, setIslandPreference] = useState<string>("Oahu");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const FEELS = ['Relaxed', 'Adventurous', 'Cultural', 'Nature', 'Energetic', 'Romantic', 'Family-friendly'];
  const ISLANDS = ["Oahu", "Maui", "Hawaii Island", "Kauai"];
  const TIMES = Array.from({ length: 24 }, (_, i) => {
    const hour = i.toString().padStart(2, '0');
    return `${hour}:00`;
  });

  const toggleFeel = (feel: string) => {
    if (selectedFeels.includes(feel)) {
      setSelectedFeels(selectedFeels.filter(f => f !== feel));
    } else {
      setSelectedFeels([...selectedFeels, feel]);
    }
  };

  const itineraryDescription = useMemo(() => {
    if (selectedFeels.length === 0) return "Select your desired 'Flow' to receive a curated experience tailored to your unique travel palate.";

    const feels = selectedFeels.map(f => f.toLowerCase());
    
    const descriptions: Record<string, string> = {
      'romantic': "an intimate, elegantly paced selection of the islands' most enchanting vistas, ensuring every moment is seasoned with romance",
      'adventurous': "a bold exploration of the island's most exhilarating landscapes, curated for those who seek the thrill of discovery",
      'relaxed': "a gentle, unhurried pace designed to soothe the spirit and allow the island's natural rhythm to take the lead",
      'cultural': "a deep immersion into the rich heritage and storied traditions of Hawaii, served with the respect and depth it deserves",
      'nature': "a curated journey through the islands' most pristine natural wonders, highlighting the raw beauty of our volcanic home",
      'energetic': "a high-spirited sequence of activities designed to invigorate and inspire, keeping your pulse perfectly aligned with the island's energy",
      'family-friendly': "a thoughtfully balanced collection of experiences designed to delight every generation, ensuring a harmonious flow for your entire party"
    };

    let core = "";
    if (feels.length === 1) {
      core = descriptions[feels[0]] || `a bespoke sequence meticulously crafted with a focus on ${feels[0]}`;
    } else if (feels.length > 1) {
      const primary = descriptions[feels[0]] || feels[0];
      const secondaryList = feels.slice(1).map(f => f === 'nature' ? 'natural beauty' : f === 'adventurous' ? 'adventure' : f === 'energetic' ? 'vibrant energy' : f);
      const secondary = secondaryList.join(' and ');
      core = `${primary}, while seamlessly integrating elements of ${secondary} to create a truly multi-layered experience`;
    }

    return `“Welcome. For your journey, I have curated ${core}. Much like a master chef balances flavors, we have balanced these destinations to ensure a sophisticated and memorable experience. Please, savor each moment.”`;
  }, [selectedFeels]);

  const ai = useMemo(() => new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY }), []);

  const curateItinerary = async () => {
    if (selectedFeels.length === 0) return;
    setIsCurating(true);
    try {
      const allDestinations = Object.values(DESTINATIONS_DATA).flat();
      const destinationsList = allDestinations.map(d => `${d.id}: ${d.name} (${d.category}, ${d.county})`).join('\n');

      const prompt = `You are an expert Hawaii travel concierge. 
The user wants a curated itinerary for today. 
Their "feels" (moods/preferences) are: ${selectedFeels.join(', ')}.
CRITICAL: The user ONLY wants to visit destinations on ${islandPreference}. Do not include destinations from other islands.
${startLocation ? `They are starting their trip near: ${startLocation}.` : ''}
${endLocation ? `They want to end their trip near: ${endLocation}.` : ''}
The trip should start around ${startTime} and end by ${endTime}.

Here are the available destinations:
${destinationsList}

CRITICAL CONSTRAINTS:
1. REALISTIC TIMING: Factor in how long people actually spend at these places. 
   - Polynesian Cultural Center is a full-day activity (e.g., 12:00 PM - 9:00 PM). Do not schedule anything else on the same day.
   - Pearl Harbor takes 3-4 hours.
   - Hikes (Diamond Head, etc.) take 2-3 hours.
   - Museums take 2-3 hours.
2. OPERATING HOURS: Schedule activities during the user's requested window (${startTime} to ${endTime}) and typical operating hours.
3. GEOGRAPHY & ROUTE OPTIMIZATION: Group activities by island (County). NEVER schedule activities on different islands on the SAME DAY. 
   - Optimize the sequence of activities to minimize driving time.
   - The route MUST start from the user's starting location (${startLocation || 'unspecified'}) and end at their ending location (${endLocation || 'unspecified'}).
   - Arrange the destinations in a logical, efficient path.
4. PACING: Do not overpack a day. 1-3 activities per day is realistic depending on their length. Leave time for meals and travel.

Return ONLY a JSON array of objects. Each object must have:
- "id": The ID of the destination (string).
- "day": The day number of the trip (number, starting from 1).
- "time": A suggested time to visit in 24-hour format (string, e.g., "09:00", "14:30").`;

      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                id: { type: "STRING" },
                day: { type: "NUMBER" },
                time: { type: "STRING" }
              },
              required: ["id", "day", "time"]
            }
          }
        }
      });

      const selectedPlan = JSON.parse(response.text || "[]");
      
      const curatedItems = [];
      const now = new Date();
      
      for (const plan of selectedPlan) {
        const dest = allDestinations.find(d => d.id === plan.id);
        if (dest) {
          const itemDate = new Date(now);
          itemDate.setDate(itemDate.getDate() + (plan.day - 1));
          const [hours, minutes] = plan.time.split(':').map(Number);
          itemDate.setHours(hours || 9, minutes || 0, 0, 0);
          
          const tzOffset = itemDate.getTimezoneOffset() * 60000;
          const localISOTime = (new Date(itemDate.getTime() - tzOffset)).toISOString().slice(0, 16);

          curatedItems.push({
            ...dest,
            dateTime: localISOTime,
            availabilityStatus: 'unchecked' as const
          });
        }
      }
      
      curatedItems.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      setItems(curatedItems);
      
    } catch (error) {
      console.error("Error curating itinerary:", error);
    } finally {
      setIsCurating(false);
    }
  };

  const TAX_RATE = 0.04712; // Hawaii GET rate
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.fee, 0), [items]);
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + GREEN_FEE + donation + taxes;

  const checkAvailability = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setItems(prev => prev.map(i => i.id === id ? { ...i, availabilityStatus: 'checking' } : i));

    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `Is there availability for a reservation at ${item.name} on ${item.dateTime}? Please check the official website provided in the context: ${item.website}. 
        Respond in JSON format with two fields: "available" (boolean) and "message" (string explanation). 
        If you can't be sure, assume it's available but mention that real-time verification is recommended at the gate.`,
        config: {
          tools: [{ urlContext: {} }],
          responseMimeType: "application/json"
        },
      });

      const result = JSON.parse(response.text || '{"available": true, "message": "Availability confirmed."}');
      
      setItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        availabilityStatus: result.available ? 'available' : 'unavailable',
        availabilityMessage: result.message
      } : i));
    } catch (error) {
      console.error("Availability check failed:", error);
      setItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        availabilityStatus: 'error',
        availabilityMessage: "Could not verify real-time availability. Please check the official website."
      } : i));
    }
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = (dest: DestinationItem) => {
    if (items.find(i => i.id === dest.id)) return;
    const now = new Date();
    const dateTimeStr = now.toISOString().slice(0, 16);
    const newItem = { ...dest, dateTime: dateTimeStr, availabilityStatus: 'unchecked' as const };
    setItems([...items, newItem]);
    // Automatically check availability after a short delay
    setTimeout(() => {
      checkAvailability(dest.id);
    }, 500);
  };

  const updateDateTime = (id: string, val: string) => {
    setItems(items.map(item => item.id === id ? { ...item, dateTime: val, availabilityStatus: 'unchecked' as const } : item));
  };

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans pb-20">
      {/* Navigation Bar */}
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-serif font-bold tracking-tight text-[#5A5A40]">Mālama Permit Hawaii</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <a href="#" className="text-[#5A5A40] hover:opacity-70 flex items-center gap-1.5"><Home size={16} /> Home</a>
              <a href="#browse" className="text-[#1A1A1A] hover:opacity-70 flex items-center gap-1.5"><Map size={16} /> All Parks</a>
              <a href="#" className="text-[#1A1A1A] hover:opacity-70 flex items-center gap-1.5"><Ticket size={16} /> My Permits</a>
            </div>

            <div className="flex items-center gap-2 md:gap-4">
              <button className="relative p-2 text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-full transition-colors">
                <ShoppingCart size={20} />
                {items.length > 0 && (
                  <span className="absolute top-0 right-0 bg-[#FF6321] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                    {items.length}
                  </span>
                )}
              </button>
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-[#1A1A1A] hover:bg-[#F5F5F0] rounded-full transition-colors"
              >
                {isMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="md:hidden bg-white border-b border-[#E5E5E5] overflow-hidden"
            >
              <div className="px-4 py-6 space-y-4">
                <a href="#" className="block text-sm font-bold text-[#5A5A40] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}><Home size={18} /> Home</a>
                <a href="#browse" className="block text-sm font-bold text-[#1A1A1A] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}><Map size={18} /> All Parks</a>
                <a href="#" className="block text-sm font-bold text-[#1A1A1A] flex items-center gap-3" onClick={() => setIsMenuOpen(false)}><Ticket size={18} /> My Permits</a>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Left Column: Itinerary & Browse */}
          <div className="lg:w-[60%] space-y-12">
            
            {/* Locations */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 ml-1">
                <Navigation size={18} className="text-[#5A5A40]" />
                <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Wayfinding</h2>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 bg-[#F5F5F0] p-4 rounded-3xl border border-[#E5E5E5]">
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">Original Location</label>
                <div className="relative">
                  <MapPin size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9299]" />
                  <input 
                    type="text" 
                    placeholder="e.g. Daniel K. Inouye Airport" 
                    value={startLocation}
                    onChange={(e) => setStartLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">Ending Location</label>
                <div className="relative">
                  <Flag size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8E9299]" />
                  <input 
                    type="text" 
                    placeholder="e.g. Your Hotel / Waikiki" 
                    value={endLocation}
                    onChange={(e) => setEndLocation(e.target.value)}
                    className="w-full pl-9 pr-4 py-2 bg-white border border-[#E5E5E5] rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* AI Itinerary Curator */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 ml-1">
              <Sparkles size={18} className="text-[#5A5A40]" />
              <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Chart Your Course</h2>
            </div>
            <section className="bg-[#F5F5F0] rounded-[32px] p-6 shadow-sm border border-[#E5E5E5] space-y-6">
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">Island Preference</label>
                    <select 
                      value={islandPreference}
                      onChange={(e) => setIslandPreference(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                    >
                      {ISLANDS.map(island => (
                        <option key={island} value={island}>{island}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">Start Time</label>
                    <select 
                      value={startTime}
                      onChange={(e) => setStartTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                    >
                      {TIMES.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">End Time</label>
                    <select 
                      value={endTime}
                      onChange={(e) => setEndTime(e.target.value)}
                      className="w-full px-4 py-3 bg-white border border-[#E5E5E5] rounded-2xl text-sm font-bold focus:outline-none focus:ring-2 focus:ring-[#5A5A40]/20 transition-all"
                    >
                      {TIMES.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-[#5A5A40] ml-1">FIND YOUR FLOW</label>
                  <div className="flex flex-wrap gap-2">
                    {FEELS.map(feel => (
                      <button
                        key={feel}
                        onClick={() => toggleFeel(feel)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          selectedFeels.includes(feel)
                            ? 'bg-[#5A5A40] text-white shadow-md'
                            : 'bg-white text-[#8E9299] border border-[#E5E5E5] hover:border-[#5A5A40]/30 hover:text-[#5A5A40]'
                        }`}
                      >
                        {feel}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <button
                onClick={curateItinerary}
                disabled={isCurating || selectedFeels.length === 0}
                className={`w-full py-4 rounded-2xl text-sm font-bold transition-all flex items-center justify-center gap-2 ${
                  isCurating || selectedFeels.length === 0
                    ? 'bg-[#E5E5E5] text-[#8E9299] cursor-not-allowed'
                    : 'bg-[#FF6321] text-white hover:bg-[#E55A1D] active:scale-95 shadow-md hover:shadow-lg'
                }`}
              >
                {isCurating ? (
                  <><Loader2 size={18} className="animate-spin" /> Curating your perfect trip...</>
                ) : (
                  'Generate Itinerary'
                )}
              </button>
            </section>
          </div>

            {/* Your Itinerary Section */}
            <section className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-2 ml-1">
                    <Calendar size={18} className="text-[#5A5A40]" />
                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Your Itinerary</h2>
                  </div>
                  <p className="text-xs italic text-[#5A5A40]/80 ml-1 max-w-2xl leading-relaxed">
                    {itineraryDescription}
                  </p>
                </div>
                {items.length > 0 && (
                    <button 
                      onClick={() => {
                        const allPoints = [];
                        if (startLocation) allPoints.push(startLocation);
                        items.forEach(i => allPoints.push(i.name + ' ' + i.location));
                        if (endLocation) allPoints.push(endLocation);
                        
                        const finalOrigin = encodeURIComponent(allPoints[0]);
                        const finalDestination = encodeURIComponent(allPoints[allPoints.length - 1]);
                        const finalWaypoints = allPoints.slice(1, -1).map(p => encodeURIComponent(p)).join('|');
                        
                        const url = `https://www.google.com/maps/dir/?api=1&origin=${finalOrigin}&destination=${finalDestination}${finalWaypoints ? `&waypoints=${finalWaypoints}` : ''}&travelmode=driving`;
                        window.open(url, '_blank');
                      }}
                      className="flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-white border border-[#E5E5E5] text-[#5A5A40] hover:bg-[#F5F5F0] transition-all shadow-sm"
                    >
                      <Navigation size={14} />
                      Get Directions
                    </button>
                  )}
              </div>

              <div className="space-y-3">
                {items.length === 0 ? (
                  <div className="p-12 text-center border-2 border-dashed border-[#E5E5E5] rounded-3xl bg-white/50">
                    <p className="text-[#8E9299] text-sm">Your itinerary is empty. Browse destinations below or use the AI Itinerary Curator to start building your trip.</p>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.98 }}
                      key={item.id} 
                      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden flex shadow-sm hover:shadow-md transition-shadow"
                    >
                      <div className="flex-1 p-3 flex flex-col gap-2 min-w-0">
                        <div className="flex justify-between items-start gap-2">
                          <div className="min-w-0">
                            <h3 className="text-sm font-bold text-[#1A1A1A] truncate">{item.name}</h3>
                            <p className="text-[10px] text-[#8E9299] font-medium uppercase tracking-wide truncate">{item.location}</p>
                          </div>
                          <div className="flex items-center gap-3 flex-shrink-0">
                            <p className="text-sm font-bold text-[#5A5A40]">${item.fee.toFixed(2)}</p>
                            <button 
                              onClick={() => removeItem(item.id)}
                              className="text-[#FF4444] hover:bg-[#FFF5F5] p-1.5 rounded-full transition-colors"
                              title="Remove"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pt-2 border-t border-[#E5E5E5]/50">
                          <div className="flex flex-col">
                            <label className="text-[8px] font-bold uppercase text-[#8E9299]">Date & Time</label>
                            <div className="flex items-center gap-2">
                              <input 
                                type="datetime-local" 
                                value={item.dateTime}
                                onChange={(e) => updateDateTime(item.id, e.target.value)}
                                className="text-[10px] border border-[#E5E5E5] rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-[#5A5A40]/20"
                              />
                              <button 
                                onClick={() => checkAvailability(item.id)}
                                className="p-1 text-[#5A5A40] hover:bg-[#F5F5F0] rounded transition-colors"
                                title="Refresh Availability"
                              >
                                <RefreshCw size={12} className={item.availabilityStatus === 'checking' ? 'animate-spin' : ''} />
                              </button>
                            </div>
                          </div>
                          <a 
                            href={item.website} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[10px] text-[#5A5A40] hover:underline flex items-center gap-1 font-medium"
                          >
                            Official Website <ExternalLink size={10} />
                          </a>
                        </div>

                        {/* Availability Status Indicator */}
                        <div className="mt-2 flex flex-wrap items-center gap-4">
                          {item.availabilityStatus === 'checking' && (
                            <div className="flex items-center gap-1.5 text-[9px] text-[#5A5A40] font-medium animate-pulse">
                              <Loader2 size={10} className="animate-spin" />
                              Verifying...
                            </div>
                          )}
                          {item.availabilityStatus === 'available' && (
                            <div className="flex items-center gap-1.5 text-[9px] text-[#2E7D32] font-medium">
                              <CheckCircle2 size={10} />
                              {item.availabilityMessage || 'Available'}
                            </div>
                          )}
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </section>

            {/* Browse All Destinations Section */}
            <section id="browse" className="space-y-6 pt-8 border-t border-[#E5E5E5]">
              <div className="space-y-2">
                <div className="flex items-center gap-2 ml-1">
                  <Map size={18} className="text-[#5A5A40]" />
                  <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Browse Destinations</h2>
                </div>
              </div>

              {/* Tabs Navigation */}
              <div className="flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(DESTINATIONS_DATA).map((county) => (
                    <button
                      key={county}
                      onClick={() => setActiveTab(county)}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeTab === county
                          ? 'bg-[#5A5A40] text-white shadow-md'
                          : 'bg-white border border-[#E5E5E5] text-[#8E9299] hover:border-[#5A5A40]/30'
                      }`}
                    >
                      {county}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 pb-2">
                  {['All', 'State Parks', 'National Parks', 'Museums & Culture', 'Historic Sites', 'Botanical Gardens'].map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setActiveCategory(cat as any)}
                      className={`px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all ${
                        activeCategory === cat
                          ? 'bg-[#F5F5F0] text-[#5A5A40] border-[#5A5A40]/30 border'
                          : 'bg-white border border-[#E5E5E5] text-[#8E9299] hover:border-[#5A5A40]/20'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex flex-col gap-3">
                {DESTINATIONS_DATA[activeTab]
                  .filter(dest => activeCategory === 'All' || dest.category === activeCategory)
                  .map((dest) => {
                  const isInCart = items.some(i => i.id === dest.id);
                  return (
                    <motion.div 
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      key={dest.id} 
                      className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden flex shadow-sm hover:border-[#5A5A40]/30 transition-all group"
                    >
                      <div className="flex-1 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-1.5 mb-1">
                            <span className={`text-[8px] font-bold uppercase px-1.5 py-0.5 rounded ${
                              dest.category === 'State Parks' ? 'bg-green-100 text-green-700' :
                              dest.category === 'National Parks' ? 'bg-emerald-100 text-emerald-700' :
                              dest.category === 'Museums & Culture' ? 'bg-blue-100 text-blue-700' :
                              dest.category === 'Historic Sites' ? 'bg-amber-100 text-amber-700' :
                              'bg-purple-100 text-purple-700'
                            }`}>
                              {dest.category}
                            </span>
                          </div>
                          <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{dest.name}</h4>
                          <p className="text-[10px] text-[#8E9299] truncate">{dest.location}</p>
                        </div>
                        
                        <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full">
                          <div className="flex flex-col items-start sm:items-end">
                            <p className="text-sm font-bold text-[#5A5A40]">${dest.fee.toFixed(2)}</p>
                            <a 
                              href={dest.website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-[10px] text-[#8E9299] hover:text-[#5A5A40] hover:underline flex items-center gap-1"
                            >
                              Details <ExternalLink size={10} />
                            </a>
                          </div>
                          <button 
                            onClick={() => addItem(dest)}
                            disabled={isInCart}
                            className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                              isInCart 
                              ? 'bg-[#E8F5E9] text-[#2E7D32] cursor-default' 
                              : 'bg-[#5A5A40] text-white hover:bg-[#4A4A30] active:scale-95'
                            }`}
                          >
                            {isInCart ? 'Added' : <><Plus size={12} /> Add</>}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </section>

            {/* Trust Signals */}
            <div className="pt-8 border-t border-[#E5E5E5]">
              <p className="text-[10px] font-bold uppercase text-[#8E9299] mb-4 text-center">Official Aggregator Partners</p>
              <div className="flex flex-wrap justify-center items-center gap-8 opacity-40 grayscale">
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-black rounded-full" />
                  <span className="text-[8px] font-bold">DLNR</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-black rounded-full" />
                  <span className="text-[8px] font-bold">HONOLULU</span>
                </div>
                <div className="flex flex-col items-center gap-1">
                  <div className="w-10 h-10 bg-black rounded-full" />
                  <span className="text-[8px] font-bold">NPS</span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Summary & Checkout */}
          <div className="lg:w-[40%] xl:w-[35%]">
            <div className="lg:sticky lg:top-24 space-y-6">
              <div className="bg-white rounded-[32px] border border-[#E5E5E5] p-8 shadow-sm">
                <h2 className="text-2xl font-serif font-bold mb-6">Summary & Checkout</h2>
                
                <div className="space-y-4 mb-8">
                  <div className="flex justify-between text-sm">
                    <span className="text-[#8E9299]">Subtotal ({items.length} Destinations)</span>
                    <span className="font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-[#8E9299] flex items-center gap-1.5">
                      Taxes & Fees
                      <div className="group relative">
                        <Info size={12} className="cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1A1A1A] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Hawaii General Excise Tax (4.712%)
                        </div>
                      </div>
                    </span>
                    <span className="font-bold">${taxes.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-sm items-center">
                    <span className="text-[#8E9299] flex items-center gap-1.5">
                      State Green Fee 
                      <div className="group relative">
                        <Info size={12} className="cursor-help" />
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-[#1A1A1A] text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                          Mandatory 2026 Tax Compliance fee for environmental conservation.
                        </div>
                      </div>
                    </span>
                    <span className="font-bold">${GREEN_FEE.toFixed(2)}</span>
                  </div>
                  
                  <div className="pt-4 border-t border-[#F5F5F0]">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold text-[#5A5A40]">Mālama Voluntary Donation</span>
                      <span className="text-sm font-bold">${donation}</span>
                    </div>
                    <p className="text-[10px] text-[#8E9299] mb-4">Support reforestation and coral reef protection efforts across the islands.</p>
                    <input 
                      type="range" 
                      min="0" 
                      max="100" 
                      step="5"
                      value={donation}
                      onChange={(e) => setDonation(parseInt(e.target.value))}
                      className="w-full h-1.5 bg-[#F5F5F0] rounded-lg appearance-none cursor-pointer accent-[#5A5A40]"
                    />
                    <div className="flex justify-between text-[10px] font-bold text-[#8E9299] mt-2">
                      <span>$0</span>
                      <span>$50</span>
                      <span>$100</span>
                    </div>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E5E5E5] mb-8">
                  <div className="flex justify-between items-end">
                    <span className="text-lg font-bold">Total Amount</span>
                    <span className="text-3xl font-serif font-bold text-[#5A5A40]">${total.toFixed(2)}</span>
                  </div>
                </div>

                <button 
                  onClick={() => setShowSuccess(true)}
                  disabled={items.length === 0}
                  className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  Confirm & Pay
                </button>
                
                <p className="mt-4 text-[10px] text-center text-[#8E9299] leading-relaxed">
                  By clicking "Confirm & Pay", you agree to the Hawaii State Park terms of service and environmental compliance regulations.
                </p>
              </div>

              {/* Security Badge */}
              <div className="flex items-center justify-center gap-3 text-[#8E9299]">
                <ShieldCheck size={20} />
                <span className="text-xs font-medium">Secure 256-bit SSL Encrypted Payment</span>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Success Overlay */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowSuccess(false)}
              className="absolute inset-0 bg-[#1A1A1A]/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              className="relative bg-white w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-2 bg-[#5A5A40]" />
              <button 
                onClick={() => setShowSuccess(false)}
                className="absolute top-6 right-6 text-[#8E9299] hover:text-[#1A1A1A]"
              >
                <X size={24} />
              </button>

              <div className="mb-6 flex justify-center">
                <div className="w-20 h-20 bg-[#E8F5E9] text-[#2E7D32] rounded-full flex items-center justify-center">
                  <CheckCircle2 size={48} />
                </div>
              </div>

              <h2 className="text-3xl font-serif font-bold mb-2">Payment Successful!</h2>
              <p className="text-[#8E9299] text-sm mb-8">Your permits are confirmed. Mahalo for supporting Hawaii's natural beauty.</p>

              <div className="bg-[#F5F5F0] rounded-3xl p-8 mb-8 border border-[#E5E5E5]">
                <p className="text-[10px] font-bold uppercase text-[#5A5A40] mb-4">Master QR Code (Unified Access)</p>
                <div className="bg-white p-4 rounded-2xl inline-block shadow-sm">
                  <QrCode size={160} className="text-[#1A1A1A]" />
                </div>
                <p className="mt-4 text-xs font-medium text-[#1A1A1A]">Valid for all {items.length} locations</p>
                <p className="text-[10px] text-[#8E9299] mt-1">Order ID: HI-2026-99482-MLM</p>
              </div>

              <div className="space-y-3">
                <button className="w-full bg-[#5A5A40] text-white py-3 rounded-xl font-bold text-sm">Download PDF Receipt</button>
                <button 
                  onClick={() => setShowSuccess(false)}
                  className="w-full bg-white border border-[#E5E5E5] text-[#1A1A1A] py-3 rounded-xl font-bold text-sm"
                >
                  Return to Dashboard
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      <footer className="bg-white border-t border-[#E5E5E5] py-12 mt-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-xs text-[#8E9299]">© 2026 State of Hawaii - Department of Land and Natural Resources. All Rights Reserved.</p>
          <div className="mt-4 flex justify-center gap-6 text-[10px] font-bold uppercase text-[#5A5A40]">
            <a href="#" className="hover:underline">Privacy Policy</a>
            <a href="#" className="hover:underline">Terms of Use</a>
            <a href="#" className="hover:underline">Accessibility</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
