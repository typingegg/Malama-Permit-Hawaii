/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useMemo, useEffect } from 'react';
import { 
  Home, 
  Map as MapIcon, 
  Ticket, 
  ShoppingCart, 
  Trash2, 
  CheckCircle2, 
  X,
  Plus,
  Loader2,
  RefreshCw,
  MapPin,
  Navigation,
  Flag,
  Sparkles,
  Calendar,
  List,
  ChevronRight
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
  image: string;
  availabilityStatus?: 'unchecked' | 'checking' | 'available' | 'unavailable' | 'error';
  availabilityMessage?: string;
}

const DESTINATIONS_DATA: Record<string, DestinationItem[]> = {
  'Oahu': [
    { id: 'o1', name: 'Hanauma Bay Nature Preserve', location: 'Oahu - City & County', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 25.00, dateTime: '', website: 'https://www.honolulu.gov/parks-hbay/home.html', lat: 21.2690, lng: -157.6938, image: 'https://images.unsplash.com/photo-1542259009477-d625272157b7?auto=format&fit=crop&w=800&q=80' },
    { id: 'o2', name: 'Diamond Head State Monument', location: 'Oahu - State DLNR', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/diamond-head-state-monument/', lat: 21.2618, lng: -157.8045, image: 'https://images.unsplash.com/photo-1589330694653-efa637388cb2?auto=format&fit=crop&w=800&q=80' },
    { id: 'o3', name: 'Pearl Harbor Memorial', location: 'Oahu - National Park Service', county: 'Honolulu (Oahu)', category: 'National Parks', fee: 1.00, dateTime: '', website: 'https://www.nps.gov/valr/index.htm', lat: 21.3650, lng: -157.9396, image: 'https://images.unsplash.com/photo-1582967788606-a171c1080cb0?auto=format&fit=crop&w=800&q=80' },
    { id: 'o4', name: 'Ahupua\'a \'O Kahana', location: 'Oahu - State DLNR', county: 'Honolulu (Oahu)', category: 'State Parks', fee: 0.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/oahu/ahupuaa-o-kahana-state-park/', lat: 21.5560, lng: -157.8760, image: 'https://images.unsplash.com/photo-1552089123-2d26226fc2b7?auto=format&fit=crop&w=800&q=80' },
    { id: 'o10', name: 'Bishop Museum', location: 'Honolulu - Private', county: 'Honolulu (Oahu)', category: 'Museums & Culture', fee: 25.00, dateTime: '', website: 'https://www.bishopmuseum.org/', lat: 21.3333, lng: -157.8711, image: 'https://images.unsplash.com/photo-1568213816046-0ee1c42bd559?auto=format&fit=crop&w=800&q=80' }
  ],
  'Maui': [
    { id: 'm1', name: 'Haleakalā National Park', location: 'Maui - National Park Service', county: 'Maui County', category: 'National Parks', fee: 30.00, dateTime: '', website: 'https://www.nps.gov/hale/index.htm', lat: 20.7161, lng: -156.1736, image: 'https://images.unsplash.com/photo-1534008897995-27a23e859048?auto=format&fit=crop&w=800&q=80' },
    { id: 'm2', name: 'Iao Valley State Monument', location: 'Maui - State DLNR', county: 'Maui County', category: 'State Parks', fee: 5.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/maui/iao-valley-state-monument/', lat: 20.8803, lng: -156.5445, image: 'https://images.unsplash.com/photo-1542332606-b6fb1aee8944?auto=format&fit=crop&w=800&q=80' },
    { id: 'm3', name: 'Wai\'anapanapa State Park', location: 'Maui - State DLNR', county: 'Maui County', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/maui/waianapanapa-state-park/', lat: 20.7844, lng: -155.9961, image: 'https://images.unsplash.com/photo-1505839673365-e3971f8d9184?auto=format&fit=crop&w=800&q=80' }
  ],
  'Big Island': [
    { id: 'h1', name: 'Hawai\'i Volcanoes', location: 'Big Island - NPS', county: 'Hawaii (Big Island)', category: 'National Parks', fee: 30.00, dateTime: '', website: 'https://www.nps.gov/havo/index.htm', lat: 19.4194, lng: -155.2805, image: 'https://images.unsplash.com/photo-1542409540-3773177894a8?auto=format&fit=crop&w=800&q=80' },
    { id: 'h2', name: 'Akaka Falls State Park', location: 'Big Island - State DLNR', county: 'Hawaii (Big Island)', category: 'State Parks', fee: 5.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/hawaii/akaka-falls-state-park/', lat: 19.8533, lng: -155.1522, image: 'https://images.unsplash.com/photo-1588628566587-bf5c302fcba9?auto=format&fit=crop&w=800&q=80' },
    { id: 'h3', name: 'Pu\'uhonua o Hōnaunau', location: 'Big Island - NPS', county: 'Hawaii (Big Island)', category: 'National Parks', fee: 20.00, dateTime: '', website: 'https://www.nps.gov/puho/index.htm', lat: 19.4217, lng: -155.9125, image: 'https://images.unsplash.com/photo-1580137189272-c9379f8864fd?auto=format&fit=crop&w=800&q=80' }
  ],
  'Kauai': [
    { id: 'k1', name: 'Waimea Canyon', location: 'Kauai - State DLNR', county: 'Kauai', category: 'State Parks', fee: 10.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/waimea-canyon-state-park/', lat: 22.0744, lng: -159.6631, image: 'https://images.unsplash.com/photo-1601053150036-edb6389fccbe?auto=format&fit=crop&w=800&q=80' },
    { id: 'k2', name: 'Ha\'ena State Park', location: 'Kauai - State DLNR', county: 'Kauai', category: 'State Parks', fee: 35.00, dateTime: '', website: 'https://dlnr.hawaii.gov/dsp/parks/kauai/haena-state-park/', lat: 22.2198, lng: -159.5750, image: 'https://images.unsplash.com/photo-1498804103079-a6351b050096?auto=format&fit=crop&w=800&q=80' }
  ]
};

const getCategoryColor = (category: string) => {
  switch (category) {
    case 'State Parks': return '#10B981'; // Emerald 500
    case 'National Parks': return '#0F766E'; // Teal 700
    case 'Museums & Culture': return '#3B82F6'; // Blue 500
    case 'Botanical Gardens': return '#EC4899'; // Pink 500
    case 'Historic Sites': return '#F59E0B'; // Amber 500
    default: return '#111827';
  }
};

const getMapCenter = (county: string): [number, number] => {
  switch (county) {
    case 'Oahu': return [21.4389, -158.0001];
    case 'Maui': return [20.7984, -156.3319];
    case 'Big Island': return [19.5000, -155.5000];
    case 'Kauai': return [22.0964, -159.5261];
    default: return [21.0943, -157.4983];
  }
};

export default function App() {
  const [items, setItems] = useState<DestinationItem[]>([]);
  const [donation, setDonation] = useState(10);
  const [showSuccess, setShowSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState(Object.keys(DESTINATIONS_DATA)[0]);
  
  // App Navigation State
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'cart'>('home');
  const [selectedMapItem, setSelectedMapItem] = useState<DestinationItem | null>(null);

  // Form States
  const [startLocation, setStartLocation] = useState("");
  const [endLocation, setEndLocation] = useState("");
  const [selectedFeels, setSelectedFeels] = useState<string[]>([]);
  const [isCurating, setIsCurating] = useState(false);
  const [islandPreference, setIslandPreference] = useState<string>("Oahu");
  const [startTime, setStartTime] = useState("09:00");

  const FEELS = ['Relaxed', 'Adventurous', 'Cultural', 'Nature', 'Romantic', 'Family'];
  const ISLANDS = Object.keys(DESTINATIONS_DATA);
  const TIMES = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);

  const toggleFeel = (feel: string) => {
    setSelectedFeels(prev => prev.includes(feel) ? prev.filter(f => f !== feel) : [...prev, feel]);
  };

  const curateItinerary = async () => {
    if (selectedFeels.length === 0) return;
    setIsCurating(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
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
      curatedItems.forEach(item => setTimeout(() => checkAvailability(item.id), 500));
      setCurrentPage('cart'); // Auto-navigate to cart to show results
    } finally {
      setIsCurating(false);
    }
  };

  const checkAvailability = async (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, availabilityStatus: 'checking' } : i));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isAvailable = Math.random() > 0.15; // 85% chance available
      setItems(prev => prev.map(i => i.id === id ? { 
        ...i, 
        availabilityStatus: isAvailable ? 'available' : 'unavailable',
        availabilityMessage: isAvailable ? "Available" : "Fully Booked"
      } : i));
    } catch {
      setItems(prev => prev.map(i => i.id === id ? { ...i, availabilityStatus: 'error', availabilityMessage: "Error" } : i));
    }
  };

  const subtotal = useMemo(() => items.reduce((acc, item) => acc + item.fee, 0), [items]);
  const taxes = subtotal * 0.04712;
  const total = subtotal + donation + taxes;

  const addItem = (dest: DestinationItem) => {
    if (items.find(i => i.id === dest.id)) return;
    const now = new Date();
    const dateTimeStr = now.toISOString().slice(0, 16);
    const newItem = { ...dest, dateTime: dateTimeStr, availabilityStatus: 'unchecked' as const };
    setItems([...items, newItem]);
    setTimeout(() => checkAvailability(dest.id), 500);
  };

  const removeItem = (id: string) => {
    setItems(items.filter(item => item.id !== id));
  };

  const updateDateTime = (id: string, val: string) => {
    setItems(items.map(item => item.id === id ? { ...item, dateTime: val, availabilityStatus: 'unchecked' as const } : item));
  };

  // Scroll to top when page changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentPage]);

  // View Components
  const TopNavBar = () => (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/80">
      <div className="max-w-5xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-8 h-8 bg-[#111827] rounded-[10px] flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold tracking-tight text-[#111827]">Mālama Hawaii</span>
        </div>
        <div className="hidden md:flex items-center gap-6">
          <button onClick={() => setCurrentPage('home')} className={`text-sm font-semibold transition-colors ${currentPage === 'home' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Explore</button>
          <button onClick={() => setCurrentPage('map')} className={`text-sm font-semibold transition-colors ${currentPage === 'map' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>Map</button>
          <button onClick={() => setCurrentPage('cart')} className={`text-sm font-semibold transition-colors flex items-center gap-1.5 ${currentPage === 'cart' ? 'text-black' : 'text-gray-400 hover:text-black'}`}>
            Itinerary
            {items.length > 0 && <span className="bg-[#111827] text-white text-[10px] px-1.5 py-0.5 rounded-full">{items.length}</span>}
          </button>
        </div>
      </div>
    </nav>
  );

  const BottomNavBar = () => (
    <div className="md:hidden fixed bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200/80 pb-safe z-50">
      <div className="flex justify-around items-center h-16 px-2">
        <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'home' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <Home size={20} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Explore</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'map' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <MapIcon size={20} strokeWidth={currentPage === 'map' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Map</span>
        </button>
        <button onClick={() => setCurrentPage('cart')} className={`relative flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'cart' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <div className="relative">
            <Ticket size={20} strokeWidth={currentPage === 'cart' ? 2.5 : 2} />
            {items.length > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">{items.length}</span>}
          </div>
          <span className="text-[10px] font-semibold">Itinerary</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#F9FAFB] text-[#111827] font-sans pb-24 md:pb-12 selection:bg-gray-200">
      <TopNavBar />

      <main className="max-w-5xl mx-auto px-4 pt-6 sm:pt-8">
        <AnimatePresence mode="wait">
          
          {/* ================= HOME VIEW ================= */}
          {currentPage === 'home' && (
            <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-10">
              
              {/* AI Curator Widget */}
              <section>
                <div className="bg-white rounded-[32px] p-6 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100">
                  <div className="flex items-center gap-2 mb-6">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-2xl"><Sparkles size={20} /></div>
                    <h2 className="text-xl font-bold tracking-tight">AI Trip Curator</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Island</label>
                        <select value={islandPreference} onChange={(e) => setIslandPreference(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                          {ISLANDS.map(island => <option key={island} value={island}>{island}</option>)}
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-xs font-semibold text-gray-500 ml-1">Start Time</label>
                        <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-4 py-3.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                          {TIMES.map(time => <option key={time} value={time}>{time}</option>)}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-semibold text-gray-500 ml-1">Vibe</label>
                      <div className="flex flex-wrap gap-2">
                        {FEELS.map(feel => (
                          <button key={feel} onClick={() => toggleFeel(feel)} className={`px-4 py-2.5 rounded-full text-xs font-bold transition-all active:scale-95 ${selectedFeels.includes(feel) ? 'bg-[#111827] text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200 hover:border-gray-300'}`}>
                            {feel}
                          </button>
                        ))}
                      </div>
                    </div>

                    <button onClick={curateItinerary} disabled={isCurating || selectedFeels.length === 0} className="w-full py-4 rounded-full text-sm font-bold transition-all flex items-center justify-center gap-2 bg-[#111827] text-white disabled:bg-gray-200 disabled:text-gray-400 active:scale-[0.98] shadow-lg shadow-black/10">
                      {isCurating ? <><Loader2 size={18} className="animate-spin" /> Generating...</> : 'Generate Itinerary'}
                    </button>
                  </div>
                </div>
              </section>

              {/* Browse Destinations */}
              <section className="space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold tracking-tight">Explore Parks</h2>
                </div>

                {/* Apple-style Segmented Control */}
                <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
                  {Object.keys(DESTINATIONS_DATA).map((county) => (
                    <button key={county} onClick={() => setActiveTab(county)} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === county ? 'bg-[#111827] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
                      {county}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {DESTINATIONS_DATA[activeTab].map((dest) => {
                    const isInCart = items.some(i => i.id === dest.id);
                    return (
                      <motion.div layout key={dest.id} className="bg-white rounded-[28px] p-3 shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 flex flex-col gap-4 transition-all hover:shadow-md group overflow-hidden">
                        
                        {/* Image Header */}
                        <div className="w-full h-44 rounded-2xl overflow-hidden relative bg-gray-100">
                           <img src={dest.image} alt={dest.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                           <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-full shadow-sm">
                             <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color: getCategoryColor(dest.category) }}>{dest.category}</span>
                           </div>
                        </div>

                        <div className="px-2 pb-1 flex flex-col justify-between flex-1 gap-4">
                          <div className="flex justify-between items-start gap-4">
                            <div>
                              <h4 className="text-base font-bold leading-tight mb-1">{dest.name}</h4>
                              <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10}/> {dest.location.split(' - ')[0]}</p>
                            </div>
                            <span className="text-lg font-bold text-gray-900">${dest.fee.toFixed(2)}</span>
                          </div>
                          <button 
                            onClick={() => addItem(dest)} 
                            disabled={isInCart}
                            className={`w-full py-3 rounded-2xl text-sm font-bold transition-all active:scale-[0.98] flex justify-center items-center gap-2 ${isInCart ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-[#111827] hover:bg-gray-100'}`}
                          >
                            {isInCart ? <><CheckCircle2 size={16}/> Added</> : <><Plus size={16}/> Add to Itinerary</>}
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </section>
            </motion.div>
          )}

          {/* ================= MAP VIEW ================= */}
          {currentPage === 'map' && (
            <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
              <div className="flex overflow-x-auto pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 hide-scrollbar gap-2">
                  {Object.keys(DESTINATIONS_DATA).map((county) => (
                    <button key={county} onClick={() => { setActiveTab(county); setSelectedMapItem(null); }} className={`whitespace-nowrap px-5 py-2.5 rounded-full text-sm font-bold transition-all ${activeTab === county ? 'bg-[#111827] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
                      {county}
                    </button>
                  ))}
              </div>
              
              <div className="w-full h-[70vh] rounded-[32px] overflow-hidden border border-gray-200 relative bg-gray-100 shadow-inner">
                <Map center={getMapCenter(activeTab)} zoom={activeTab === 'Big Island' ? 8 : 10} provider={(x, y, z, dpr) => `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`}>
                  <ZoomControl />
                  {DESTINATIONS_DATA[activeTab].map(dest => (
                    <Overlay key={dest.id} anchor={[dest.lat, dest.lng]} offset={[12, 12]}>
                        <div 
                          onClick={() => setSelectedMapItem(dest)} 
                          className="w-6 h-6 rounded-full border-4 border-white cursor-pointer hover:scale-125 transition-transform flex items-center justify-center shadow-lg"
                          style={{ backgroundColor: getCategoryColor(dest.category) }} 
                        />
                    </Overlay>
                  ))}
                </Map>

                <AnimatePresence>
                  {selectedMapItem && (
                    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-4 left-4 right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-[360px] bg-white p-5 rounded-[28px] shadow-2xl border border-gray-100 overflow-hidden">
                      {/* Popup Image Banner */}
                      <div className="w-[calc(100%+40px)] h-32 -mt-5 -mx-5 mb-4 relative bg-gray-100">
                         <img src={selectedMapItem.image} className="w-full h-full object-cover" />
                         <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                         <button onClick={() => setSelectedMapItem(null)} className="absolute top-4 right-4 text-white bg-black/30 backdrop-blur-md p-1.5 rounded-full hover:bg-black/50 transition-colors"><X size={16} /></button>
                      </div>

                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mb-1 block">{selectedMapItem.category}</span>
                      <h4 className="font-bold text-lg leading-tight mb-1 pr-8">{selectedMapItem.name}</h4>
                      <p className="text-xs text-gray-400 flex items-center gap-1"><MapPin size={10}/> {selectedMapItem.location.split(' - ')[0]}</p>
                      
                      <div className="flex items-center justify-between mt-4">
                        <p className="text-xl font-bold">${selectedMapItem.fee.toFixed(2)}</p>
                        <button 
                          onClick={() => { addItem(selectedMapItem); setSelectedMapItem(null); }}
                          disabled={items.some(i => i.id === selectedMapItem.id)}
                          className="bg-[#111827] disabled:bg-gray-100 disabled:text-gray-400 text-white px-5 py-2.5 rounded-full text-sm font-bold active:scale-95 transition-all"
                        >
                          {items.some(i => i.id === selectedMapItem.id) ? 'Added' : 'Add to List'}
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ================= CART / CHECKOUT VIEW ================= */}
          {currentPage === 'cart' && (
            <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col lg:flex-row gap-8">
              
              <div className="flex-1 space-y-6">
                <h2 className="text-2xl font-bold tracking-tight">Your Itinerary</h2>
                
                {items.length === 0 ? (
                  <div className="bg-white rounded-[32px] p-12 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                    <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-4"><Ticket size={24}/></div>
                    <h3 className="text-lg font-bold mb-2">No permits yet</h3>
                    <p className="text-sm text-gray-500 mb-6">Explore the islands and add destinations to your itinerary.</p>
                    <button onClick={() => setCurrentPage('home')} className="bg-[#111827] text-white px-6 py-3 rounded-full text-sm font-bold active:scale-95 shadow-lg shadow-black/10">Explore Parks</button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {items.map((item) => (
                      <motion.div layout key={item.id} className="bg-white rounded-[24px] p-4 border border-gray-100 shadow-[0_2px_12px_rgb(0,0,0,0.03)]">
                        <div className="flex gap-4 mb-4">
                          {/* Cart Thumbnail Image */}
                          <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                             <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                          </div>
                          
                          <div className="flex-1 flex flex-col justify-between py-0.5">
                            <div className="flex justify-between items-start gap-2">
                              <div>
                                <h3 className="font-bold text-sm leading-tight line-clamp-2">{item.name}</h3>
                                <p className="text-xs text-gray-500 mt-1">{item.location.split(' - ')[0]}</p>
                              </div>
                              <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 hover:bg-red-50 p-1.5 rounded-full transition-colors"><Trash2 size={16} /></button>
                            </div>
                            <span className="font-bold text-base">${item.fee.toFixed(2)}</span>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 rounded-2xl p-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                          <input 
                            type="datetime-local" 
                            value={item.dateTime}
                            onChange={(e) => updateDateTime(item.id, e.target.value)}
                            className="bg-transparent text-sm font-semibold outline-none w-full sm:w-auto"
                          />
                          <div className="flex items-center gap-2">
                            {item.availabilityStatus === 'checking' && <span className="text-xs font-bold text-gray-400 flex items-center gap-1 bg-white px-3 py-1.5 rounded-full shadow-sm"><Loader2 size={12} className="animate-spin"/> Checking</span>}
                            {item.availabilityStatus === 'available' && <span className="text-xs font-bold text-emerald-600 flex items-center gap-1 bg-emerald-50 px-3 py-1.5 rounded-full"><CheckCircle2 size={12}/> Available</span>}
                            {item.availabilityStatus === 'unavailable' && <span className="text-xs font-bold text-red-500 flex items-center gap-1 bg-red-50 px-3 py-1.5 rounded-full"><X size={12}/> Full</span>}
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>

              {/* Checkout Sidebar */}
              <div className="lg:w-[380px]">
                <div className="sticky top-20 bg-white rounded-[32px] border border-gray-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] p-6 space-y-6">
                  <h3 className="text-xl font-bold">Summary</h3>
                  
                  <div className="space-y-3 text-sm font-medium">
                    <div className="flex justify-between text-gray-600"><span>Permits ({items.length})</span><span>${subtotal.toFixed(2)}</span></div>
                    <div className="flex justify-between text-gray-600"><span>Taxes</span><span>${taxes.toFixed(2)}</span></div>
                  </div>

                  <div className="pt-4 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-bold">Donation</span>
                      <span className="text-sm font-bold">${donation}</span>
                    </div>
                    <input 
                      type="range" min="0" max="100" step="5" value={donation} onChange={(e) => setDonation(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-100 rounded-full appearance-none cursor-pointer accent-black mb-1"
                    />
                    <p className="text-[10px] text-gray-400 text-center">Support Hawaii's reefs and trails.</p>
                  </div>

                  <div className="pt-4 border-t border-gray-100 flex justify-between items-end">
                    <span className="font-bold text-gray-500">Total</span>
                    <span className="text-3xl font-bold tracking-tight">${total.toFixed(2)}</span>
                  </div>

                  <button 
                    onClick={() => setShowSuccess(true)}
                    disabled={items.length === 0}
                    className="w-full bg-[#111827] text-white py-4 rounded-full font-bold text-base transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 shadow-lg shadow-black/10"
                  >
                    Confirm & Pay
                  </button>
                </div>
              </div>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      <BottomNavBar />

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuccess(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-sm rounded-[32px] p-8 text-center shadow-2xl">
              <div className="w-16 h-16 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-4"><CheckCircle2 size={32} strokeWidth={3}/></div>
              <h2 className="text-2xl font-bold mb-2">Confirmed!</h2>
              <p className="text-gray-500 text-sm mb-8">Your permits have been generated.</p>
              <button onClick={() => { setShowSuccess(false); setItems([]); setCurrentPage('home'); }} className="w-full bg-gray-100 text-black py-3.5 rounded-full font-bold text-sm hover:bg-gray-200 transition-colors">
                Done
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
