/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo } from 'react';
import { 
  Home, 
  Map as MapIcon, 
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
  RefreshCw,
  MapPin,
  Navigation,
  Flag,
  Sparkles,
  Calendar,
  List
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { Map, Overlay, ZoomControl } from 'pigeon-maps';

interface DestinationItem {
  id: string;
  name: string;
  location: string;
  county: string;
  category: 'State Parks' | 'National Parks' | 'Museums & Culture' | 'Botanical Gardens' | 'Historic Sites';
  fee: number;
  dateTime: string;
  website: string;
  lat: number;
  lng: number;
  availabilityStatus?: 'unchecked' | 'checking' | 'available' | 'unavailable' | 'error';
  availabilityMessage?: string;
}

const DESTINATIONS_DATA: Record<string, DestinationItem[]> = {
  'Honolulu (Oahu)': [
    { id: 'o1', name: 'Hanauma Bay Nature Preserve', location: 'Oahu - City & County', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 25.00, dateTime: '', website: 'https://www.honolulu.gov/parks-hbay/home.html', lat: 21.2690, lng: -157.6938 },
    { id: 'o2', name: 'Diamond Head State Monument', location: 'Oahu - State DLNR', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/diamond-head-state-monument/', lat: 21.2618, lng: -157.8045 },
    { id: 'o3', name: 'Pearl Harbor National Memorial', location: 'Oahu - National Park Service', county: 'Honolulu (Oahu)', category: 'National Parks', fee: 1.00, dateTime: '', website: 'https://www.nps.gov/valr/index.htm', lat: 21.3650, lng: -157.9396 },
    { id: 'o4', name: 'Ahupua\'a \'O Kahana State Park', location: 'Oahu - State DLNR', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 0.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/ahupuaa-o-kahana-state-park/', lat: 21.5560, lng: -157.8760 },
    { id: 'o10', name: 'Bishop Museum', location: 'Honolulu - Private', county: 'Honolulu (Oahu)', category: 'Museums & Culture', fee: 25.00, dateTime: '', website: 'https://www.bishopmuseum.org/', lat: 21.3333, lng: -157.8711 },
    { id: 'o12', name: 'Polynesian Cultural Center', location: 'Laie - Private', county: 'Honolulu (Oahu)', category: 'Museums & Culture', fee: 80.00, dateTime: '', website: 'https://www.polynesia.com/', lat: 21.6390, lng: -157.9200 }
  ],
  'Maui County': [
    { id: 'm1', name: 'Haleakalā National Park', location: 'Maui - National Park Service', county: 'Maui County', category: 'National Parks', fee: 30.00, dateTime: '', website: 'https://www.nps.gov/hale/index.htm', lat: 20.7161, lng: -156.1736 },
    { id: 'm2', name: 'Iao Valley State Monument', location: 'Maui - State DLNR', county: 'Maui County', category: 'State Parks', fee: 5.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/maui/iao-valley-state-monument/', lat: 20.8803, lng: -156.5445 },
    { id: 'm3', name: 'Wai\'anapanapa State Park', location: 'Maui - State DLNR', county: 'Maui County', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/maui/waianapanapa-state-park/', lat: 20.7844, lng: -155.9961 }
  ],
  'Hawaii (Big Island)': [
    { id: 'h1', name: 'Hawai\'i Volcanoes National Park', location: 'Big Island - NPS', county: 'Hawaii (Big Island)', category: 'National Parks', fee: 30.00, dateTime: '', website: 'https://www.nps.gov/havo/index.htm', lat: 19.4194, lng: -155.2805 },
    { id: 'h2', name: 'Akaka Falls State Park', location: 'Big Island - State DLNR', county: 'Hawaii (Big Island)', category: 'State Parks', fee: 5.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/akaka-falls-state-park/', lat: 19.8533, lng: -155.1522 },
    { id: 'h3', name: 'Pu\'uhonua o Hōnaunau', location: 'Big Island - NPS', county: 'Hawaii (Big Island)', category: 'National Parks', fee: 20.00, dateTime: '', website: 'https://www.nps.gov/puho/index.htm', lat: 19.4217, lng: -155.9125 }
  ],
  'Kauai': [
    { id: 'k1', name: 'Waimea Canyon State Park', location: 'Kauai - State DLNR', county: 'Kauai', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/', lat: 22.0744, lng: -159.6631 },
    { id: 'k2', name: 'Ha\'ena State Park', location: 'Kauai - State DLNR', county: 'Kauai', category: 'State Parks', fee: 35.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/haena-state-park/', lat: 22.2198, lng: -159.5750 }
  ]
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'State Parks': return '#2E7D32'; 
    case 'National Parks': return '#00695C'; 
    case 'Museums & Culture': return '#1565C0'; 
    case 'Botanical Gardens': return '#AD1457'; 
    case 'Historic Sites': return '#F57F17'; 
    default: return '#5A5A40';
  }
};

const getMapCenter = (county: string): [number, number] => {
  switch (county) {
    case 'Honolulu (Oahu)': return [21.4389, -158.0001];
    case 'Maui County': return [20.7984, -156.3319];
    case 'Hawaii (Big Island)': return [19.5000, -155.5000];
    case 'Kauai': return [22.0964, -159.5261];
    default: return [21.0943, -157.4983];
  }
};

const getMapZoom = (county: string): number => {
  return county === 'Hawaii (Big Island)' ? 8 : 10;
};

export default function App() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [donation, setDonation] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(DESTINATIONS_DATA)[0]);
  const [activeCategory, setActiveCategory] = useState<'All' | 'State Parks' | 'National Parks' | 'Museums & Culture' | 'Botanical Gardens' | 'Historic Sites'>('All');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Page Navigation State
  const [currentPage, setCurrentPage] = useState<'home' | 'map'>('home');
  const [selectedMapItem, setSelectedMapItem] = useState<DestinationItem | null>(null);

  // Wayfinding State
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  
  const [selectedFeels, setSelectedFeels] = useState<string[]>([]);
  const [isCurating, setIsCurating] = useState(false);
  const [islandPreference, setIslandPreference] = useState<string>("Honolulu (Oahu)");
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("17:00");

  const FEELS = ['Relaxed', 'Adventurous', 'Cultural', 'Nature', 'Energetic', 'Romantic', 'Family-friendly'];
  const ISLANDS = Object.keys(DESTINATIONS_DATA);
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

  const curateItinerary = async () => {
    if (selectedFeels.length === 0) return;
    setIsCurating(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1800));

      const islandDestinations = DESTINATIONS_DATA[islandPreference] || [];
      const shuffled = [...islandDestinations].sort(() => 0.5 - Math.random());
      const numItems = Math.min(Math.floor(Math.random() * 2) + 2, shuffled.length); 
      const selectedPlan = shuffled.slice(0, numItems);

      const curatedItems: DestinationItem[] = [];
      const now = new Date();
      const [startHour, startMin] = startTime.split(':').map(Number);
      
      selectedPlan.forEach((dest, index) => {
        const itemDate = new Date(now);
        itemDate.setHours(startHour + (index * 3), startMin, 0, 0);
        const tzOffset = itemDate.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(itemDate.getTime() - tzOffset)).toISOString().slice(0, 16);

        curatedItems.push({ ...dest, dateTime: localISOTime, availabilityStatus: 'unchecked' });
      });
      
      curatedItems.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime());
      setItems(curatedItems);
      
      curatedItems.forEach(item => {
        setTimeout(() => checkAvailability(item.id), 500);
      });

    } catch (error) {
      console.error("Error curating itinerary:", error);
    } finally {
      setIsCurating(false);
    }
  };

  const checkAvailability = async (id: string) => {
    const item = items.find(i => i.id === id);
    if (!item) return;

    setItems(prev => prev.map(i => i.id === id ? { ...i, availabilityStatus: 'checking' } : i));

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      const isAvailable = Math.random() > 0.2;
      
      setItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        availabilityStatus: isAvailable ? 'available' : 'unavailable',
        availabilityMessage: isAvailable ? "Availability confirmed." : "Fully booked for this time."
      } : i));
    } catch (error) {
      setItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        availabilityStatus: 'error',
        availabilityMessage: "Could not verify real-time availability. Please check the official website."
      } : i));
    }
  };

  const TAX_RATE = 0.04712; 
  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.fee, 0), [items]);
  const taxes = subtotal * TAX_RATE;
  const total = subtotal + donation + taxes;

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const addItem = (dest: DestinationItem) => {
    if (items.find(i => i.id === dest.id)) return;
    const now = new Date();
    const dateTimeStr = now.toISOString().slice(0, 16);
    const newItem = { ...dest, dateTime: dateTimeStr, availabilityStatus: 'unchecked' as const };
    setItems([...items, newItem]);
    
    setTimeout(() => {
      checkAvailability(dest.id);
    }, 500);
  };

  const updateDateTime = (id: string, val: string) => {
    setItems(items.map(item => item.id === id ? { ...item, dateTime: val, availabilityStatus: 'unchecked' as const } : item));
  };

  const openGoogleMaps = () => {
    const allPoints = [];
    if (startLocation) allPoints.push(startLocation);
    items.forEach(i => allPoints.push(`${i.name}, ${i.location}`));
    if (endLocation) allPoints.push(endLocation);

    if (allPoints.length === 0) return;
    if (allPoints.length === 1) {
      window.open(`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(allPoints[0])}`, '_blank');
      return;
    }

    const origin = encodeURIComponent(allPoints[0]);
    const destination = encodeURIComponent(allPoints[allPoints.length - 1]);
    const waypoints = allPoints.slice(1, -1).map(p => encodeURIComponent(p)).join('|');
    
    const url = `https://www.google.com/maps/dir/?api=1&origin=${origin}&destination=${destination}${waypoints ? `&waypoints=${waypoints}` : ''}&travelmode=driving`;
    window.open(url, '_blank');
  };

  const filteredDestinations = DESTINATIONS_DATA[activeTab].filter(dest => activeCategory === 'All' || dest.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#FDFCFB] text-[#1A1A1A] font-sans pb-20">
      <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-md border-b border-[#E5E5E5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
              <div className="w-8 h-8 bg-[#5A5A40] rounded-full flex items-center justify-center text-white font-bold">M</div>
              <span className="text-xl font-serif font-bold tracking-tight text-[#5A5A40]">Mālama Permit Hawaii</span>
            </div>
            
            <div className="hidden md:flex items-center space-x-8 text-sm font-medium">
              <button 
                onClick={() => setCurrentPage('home')} 
                className={`flex items-center gap-1.5 transition-colors ${currentPage === 'home' ? 'text-[#5A5A40] font-bold' : 'text-[#8E9299] hover:text-[#1A1A1A]'}`}
              >
                <Home size={16} /> Home
              </button>
              <button 
                onClick={() => { setCurrentPage('map'); setSelectedMapItem(null); }} 
                className={`flex items-center gap-1.5 transition-colors ${currentPage === 'map' ? 'text-[#5A5A40] font-bold' : 'text-[#8E9299] hover:text-[#1A1A1A]'}`}
              >
                <MapIcon size={16} /> Map Explorer
              </button>
              <button className="flex items-center gap-1.5 text-[#8E9299] hover:text-[#1A1A1A] transition-colors">
                <Ticket size={16} /> My Permits
              </button>
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
      </nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div 
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-white border-b border-[#E5E5E5] overflow-hidden"
          >
            <div className="px-4 py-4 flex flex-col gap-4 text-sm font-medium">
               <button onClick={() => { setCurrentPage('home'); setIsMenuOpen(false); }} className={`flex items-center gap-2 ${currentPage === 'home' ? 'text-[#5A5A40] font-bold' : 'text-[#8E9299]'}`}><Home size={16}/> Home</button>
               <button onClick={() => { setCurrentPage('map'); setIsMenuOpen(false); }} className={`flex items-center gap-2 ${currentPage === 'map' ? 'text-[#5A5A40] font-bold' : 'text-[#8E9299]'}`}><MapIcon size={16}/> Map Explorer</button>
               <button className="flex items-center gap-2 text-[#8E9299]"><Ticket size={16}/> My Permits</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
          
          {/* Main Content Area (Swaps between Home List and Map Explorer) */}
          <div className="lg:w-[60%] xl:w-[65%]">
            
            {currentPage === 'home' ? (
              <div className="space-y-12">
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

                <div className="space-y-4">
                  <div className="flex items-center gap-2 ml-1">
                    <Sparkles size={18} className="text-[#5A5A40]" />
                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Chart Your Course (Demo Mode)</h2>
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

                <section className="space-y-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-2 ml-1">
                      <Calendar size={18} className="text-[#5A5A40]" />
                      <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Your Itinerary</h2>
                    </div>
                    
                    {items.length > 0 && (
                      <button 
                        onClick={openGoogleMaps}
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
                        <p className="text-[#8E9299] text-sm">Your itinerary is empty. Browse destinations below or use the Map Explorer to start building your trip.</p>
                      </div>
                    ) : (
                      items.map((item) => (
                        <motion.div 
                          layout
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.98 }}
                          key={item.id} 
                          className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden flex shadow-sm"
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
                                    className="text-[10px] border border-[#E5E5E5] rounded px-2 py-0.5 focus:outline-none"
                                  />
                                  <button 
                                    onClick={() => checkAvailability(item.id)}
                                    className="p-1 text-[#5A5A40] hover:bg-[#F5F5F0] rounded transition-colors"
                                  >
                                    <RefreshCw size={12} className={item.availabilityStatus === 'checking' ? 'animate-spin' : ''} />
                                  </button>
                                </div>
                              </div>
                            </div>

                            <div className="mt-2 flex flex-wrap items-center gap-4">
                              {item.availabilityStatus === 'checking' && (
                                <div className="flex items-center gap-1.5 text-[9px] text-[#5A5A40] font-medium animate-pulse">
                                  <Loader2 size={10} className="animate-spin" /> Verifying...
                                </div>
                              )}
                              {item.availabilityStatus === 'available' && (
                                <div className="flex items-center gap-1.5 text-[9px] text-[#2E7D32] font-medium">
                                  <CheckCircle2 size={10} /> {item.availabilityMessage}
                                </div>
                              )}
                              {item.availabilityStatus === 'unavailable' && (
                                <div className="flex items-center gap-1.5 text-[9px] text-[#D32F2F] font-medium">
                                  <X size={10} /> {item.availabilityMessage}
                                </div>
                              )}
                            </div>
                          </div>
                        </motion.div>
                      ))
                    )}
                  </div>
                </section>

                <section className="space-y-6 pt-8 border-t border-[#E5E5E5]">
                  <div className="flex items-center gap-2 ml-1">
                    <List size={18} className="text-[#5A5A40]" />
                    <h2 className="text-xl font-serif font-bold text-[#1A1A1A]">Browse Destinations</h2>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {Object.keys(DESTINATIONS_DATA).map((county) => (
                      <button
                        key={county}
                        onClick={() => setActiveTab(county)}
                        className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                          activeTab === county ? 'bg-[#5A5A40] text-white shadow-md' : 'bg-white border border-[#E5E5E5] text-[#8E9299] hover:border-[#5A5A40]/30'
                        }`}
                      >
                        {county}
                      </button>
                    ))}
                  </div>

                  <div className="flex flex-col gap-3">
                    {filteredDestinations.map((dest) => {
                      const isInCart = items.some(i => i.id === dest.id);
                      return (
                        <motion.div layout key={dest.id} className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden flex shadow-sm hover:border-[#5A5A40]/30 transition-all">
                          <div className="flex-1 p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-1.5 mb-1">
                                <span className="text-[8px] font-bold uppercase px-1.5 py-0.5 rounded text-white" style={{ backgroundColor: getCategoryColor(dest.category) }}>
                                  {dest.category}
                                </span>
                              </div>
                              <h4 className="text-sm font-bold text-[#1A1A1A] truncate">{dest.name}</h4>
                              <p className="text-[10px] text-[#8E9299] truncate">{dest.location}</p>
                            </div>
                            <div className="flex items-center justify-between sm:justify-end gap-4 sm:w-auto w-full">
                              <div className="flex flex-col items-start sm:items-end">
                                <p className="text-sm font-bold text-[#5A5A40]">${dest.fee.toFixed(2)}</p>
                              </div>
                              <button 
                                onClick={() => addItem(dest)}
                                disabled={isInCart}
                                className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
                                  isInCart ? 'bg-[#E8F5E9] text-[#2E7D32] cursor-default' : 'bg-[#5A5A40] text-white hover:bg-[#4A4A30] active:scale-95'
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
              </div>
            ) : (
              /* ======================= MAP EXPLORER PAGE ======================= */
              <div className="space-y-6">
                <div className="flex flex-col gap-2 ml-1">
                  <div className="flex items-center gap-2">
                    <MapIcon size={24} className="text-[#5A5A40]" />
                    <h2 className="text-2xl font-serif font-bold text-[#1A1A1A]">Interactive Map Explorer</h2>
                  </div>
                  <p className="text-sm text-[#8E9299]">Explore parks, monuments, and cultural sites across the islands.</p>
                </div>

                <div className="flex flex-wrap gap-2">
                  {Object.keys(DESTINATIONS_DATA).map((county) => (
                    <button
                      key={county}
                      onClick={() => { setActiveTab(county); setSelectedMapItem(null); }}
                      className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                        activeTab === county ? 'bg-[#5A5A40] text-white shadow-md' : 'bg-white border border-[#E5E5E5] text-[#8E9299] hover:border-[#5A5A40]/30'
                      }`}
                    >
                      {county}
                    </button>
                  ))}
                </div>

                <div className="w-full h-[600px] rounded-3xl overflow-hidden border border-[#E5E5E5] relative bg-[#F5F5F0] shadow-sm">
                  <Map 
                    center={getMapCenter(activeTab)} 
                    zoom={getMapZoom(activeTab)} 
                    provider={(x, y, z, dpr) => `https://a.basemaps.cartocdn.com/light_all/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`}
                  >
                    <ZoomControl />
                    {filteredDestinations.map(dest => (
                      <Overlay key={dest.id} anchor={[dest.lat, dest.lng]} offset={[8, 8]}>
                          <div 
                            onClick={() => setSelectedMapItem(dest)} 
                            className="w-4 h-4 rounded-full border-2 border-white cursor-pointer hover:scale-125 transition-transform"
                            style={{ 
                              backgroundColor: getCategoryColor(dest.category),
                              boxShadow: '0 2px 4px rgba(0,0,0,0.3)'
                            }} 
                          />
                      </Overlay>
                    ))}
                  </Map>

                  <AnimatePresence>
                    {selectedMapItem && (
                      <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 20 }}
                        className="absolute bottom-6 left-6 right-6 sm:left-auto sm:right-6 sm:w-[320px] bg-white p-5 rounded-2xl shadow-2xl border border-[#E5E5E5] z-[1000]"
                      >
                        <button 
                          onClick={() => setSelectedMapItem(null)}
                          className="absolute top-4 right-4 text-[#8E9299] hover:text-[#1A1A1A] p-1 rounded-full hover:bg-[#F5F5F0] transition-colors"
                        >
                          <X size={16} />
                        </button>
                        <span className="text-[9px] font-bold uppercase px-2 py-1 rounded text-white mb-3 inline-block tracking-wider" style={{ backgroundColor: getCategoryColor(selectedMapItem.category) }}>
                            {selectedMapItem.category}
                        </span>
                        <h4 className="font-serif font-bold text-lg text-[#1A1A1A] mb-1 leading-tight pr-6">{selectedMapItem.name}</h4>
                        <p className="text-xs text-[#8E9299] mb-4 flex items-center gap-1.5 font-medium">
                          <MapPin size={12} /> {selectedMapItem.location}
                        </p>
                        <div className="flex items-center justify-between pt-4 border-t border-[#F5F5F0]">
                          <p className="text-xl font-bold text-[#5A5A40]">${selectedMapItem.fee.toFixed(2)}</p>
                          <button 
                            onClick={() => {
                                addItem(selectedMapItem);
                                setSelectedMapItem(null);
                            }}
                            disabled={items.some(i => i.id === selectedMapItem.id)}
                            className="bg-[#5A5A40] disabled:bg-[#E8F5E9] disabled:text-[#2E7D32] text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-[#4A4A30] transition-all shadow-md active:scale-95"
                          >
                            {items.some(i => i.id === selectedMapItem.id) ? 'Added' : 'Add to Itinerary'}
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="flex flex-wrap gap-x-6 gap-y-3 px-2">
                  {[
                    { label: 'State Parks', color: '#2E7D32' },
                    { label: 'National Parks', color: '#00695C' },
                    { label: 'Museums & Culture', color: '#1565C0' },
                    { label: 'Botanical Gardens', color: '#AD1457' },
                    { label: 'Historic Sites', color: '#F57F17' }
                  ].map(cat => (
                    <div key={cat.label} className="flex items-center gap-2 text-xs font-bold text-[#8E9299] uppercase tracking-wider">
                      <div className="w-3 h-3 rounded-full shadow-sm" style={{ backgroundColor: cat.color }} />
                      {cat.label}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Persistent Summary & Checkout sidebar */}
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
                    </span>
                    <span className="font-bold">${taxes.toFixed(2)}</span>
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
                  className="w-full bg-[#5A5A40] hover:bg-[#4A4A30] disabled:opacity-50 disabled:cursor-not-allowed text-white py-4 rounded-2xl font-bold text-lg transition-all"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>

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
              className="relative bg-white w-full max-w-md rounded-[40px] p-8 text-center shadow-2xl overflow-hidden z-[1001]"
            >
              <h2 className="text-3xl font-serif font-bold mb-2">Payment Successful!</h2>
              <p className="text-[#8E9299] text-sm mb-8">Your mock permits are confirmed.</p>
              <button 
                onClick={() => setShowSuccess(false)}
                className="w-full bg-[#5A5A40] text-white py-3 rounded-xl font-bold text-sm"
              >
                Return to Dashboard
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
