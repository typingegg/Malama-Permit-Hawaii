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
  Sparkles,
  Navigation
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
  
  const [currentPage, setCurrentPage] = useState<'home' | 'map' | 'cart'>('home');
  const [selectedMapItem, setSelectedMapItem] = useState<DestinationItem | null>(null);

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
      setCurrentPage('cart'); 
    } finally {
      setIsCurating(false);
    }
  };

  const checkAvailability = async (id: string) => {
    setItems(prev => prev.map(i => i.id === id ? { ...i, availabilityStatus: 'checking' } : i));
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const isAvailable = Math.random() > 0.15; 
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

  const removeItem = (id: string) => setItems(items.filter(item => item.id !== id));
  const updateDateTime = (id: string, val: string) => setItems(items.map(item => item.id === id ? { ...item, dateTime: val, availabilityStatus: 'unchecked' as const } : item));

  // Top Nav (Mobile Adjusted)
  const TopNavBar = () => (
    <nav className="sticky top-0 z-40 w-full bg-white/80 backdrop-blur-xl border-b border-gray-200/80 pt-safe">
      <div className="px-5 h-14 flex items-center justify-between sm:mt-4">
        <div className="flex items-center gap-2 cursor-pointer" onClick={() => setCurrentPage('home')}>
          <div className="w-8 h-8 bg-[#111827] rounded-[10px] flex items-center justify-center text-white font-bold text-sm">M</div>
          <span className="text-lg font-bold tracking-tight text-[#111827]">Mālama Hawaii</span>
        </div>
      </div>
    </nav>
  );

  // Bottom Nav (Always visible in Phone view)
  const BottomNavBar = () => (
    <div className="absolute bottom-0 w-full bg-white/90 backdrop-blur-xl border-t border-gray-200/80 pb-6 pt-2 z-50">
      <div className="flex justify-around items-center h-14 px-2">
        <button onClick={() => setCurrentPage('home')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'home' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <Home size={22} strokeWidth={currentPage === 'home' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Explore</span>
        </button>
        <button onClick={() => setCurrentPage('map')} className={`flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'map' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <MapIcon size={22} strokeWidth={currentPage === 'map' ? 2.5 : 2} />
          <span className="text-[10px] font-semibold">Map</span>
        </button>
        <button onClick={() => setCurrentPage('cart')} className={`relative flex flex-col items-center justify-center w-full h-full gap-1 ${currentPage === 'cart' ? 'text-[#111827]' : 'text-gray-400'}`}>
          <div className="relative">
            <Ticket size={22} strokeWidth={currentPage === 'cart' ? 2.5 : 2} />
            {items.length > 0 && <span className="absolute -top-1.5 -right-2 bg-red-500 text-white text-[8px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">{items.length}</span>}
          </div>
          <span className="text-[10px] font-semibold">Itinerary</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>

      {/* Desktop Wrapper Background */}
      <div className="min-h-screen bg-gray-200 sm:bg-gradient-to-br sm:from-gray-100 sm:to-gray-300 flex items-center justify-center p-0 sm:p-8 font-sans selection:bg-gray-200 text-[#111827]">
        
        {/* Simulated Phone Device Frame */}
        <div className="relative w-full h-[100dvh] sm:h-[850px] sm:max-w-[400px] bg-[#F9FAFB] sm:rounded-[3rem] sm:border-[14px] border-gray-900 shadow-2xl overflow-hidden flex flex-col">
          
          {/* Dynamic Island Notch (Only visible on desktop/sm views to complete the illusion) */}
          <div className="hidden sm:flex absolute top-0 inset-x-0 h-6 justify-center z-[60] pointer-events-none">
            <div className="w-32 h-6 bg-gray-900 rounded-b-3xl"></div>
          </div>

          <TopNavBar />

          {/* Scrollable Main App Area */}
          <main className="flex-1 overflow-y-auto hide-scrollbar px-4 pt-6 pb-28 relative">
            <AnimatePresence mode="wait">
              
              {/* ================= HOME VIEW ================= */}
              {currentPage === 'home' && (
                <motion.div key="home" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-8">
                  
                  {/* AI Curator Widget */}
                  <section>
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-blue-50 text-blue-600 rounded-xl"><Sparkles size={18} /></div>
                        <h2 className="text-lg font-bold tracking-tight">AI Trip Curator</h2>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Island</label>
                            <select value={islandPreference} onChange={(e) => setIslandPreference(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                              {ISLANDS.map(island => <option key={island} value={island}>{island}</option>)}
                            </select>
                          </div>
                          <div className="space-y-1">
                            <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Time</label>
                            <select value={startTime} onChange={(e) => setStartTime(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm font-semibold outline-none focus:ring-2 focus:ring-black transition-all appearance-none">
                              {TIMES.map(time => <option key={time} value={time}>{time}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider ml-1">Vibe</label>
                          <div className="flex flex-wrap gap-2">
                            {FEELS.map(feel => (
                              <button key={feel} onClick={() => toggleFeel(feel)} className={`px-3 py-1.5 rounded-full text-xs font-bold transition-all active:scale-95 ${selectedFeels.includes(feel) ? 'bg-[#111827] text-white shadow-md' : 'bg-gray-50 text-gray-600 border border-gray-200'}`}>
                                {feel}
                              </button>
                            ))}
                          </div>
                        </div>

                        <button onClick={curateItinerary} disabled={isCurating || selectedFeels.length === 0} className="w-full py-3 mt-2 rounded-xl text-sm font-bold transition-all flex items-center justify-center gap-2 bg-[#111827] text-white disabled:bg-gray-200 disabled:text-gray-400 active:scale-[0.98] shadow-md">
                          {isCurating ? <><Loader2 size={16} className="animate-spin" /> Curating...</> : 'Generate Itinerary'}
                        </button>
                      </div>
                    </div>
                  </section>

                  {/* Browse Destinations */}
                  <section className="space-y-4">
                    <h2 className="text-xl font-bold tracking-tight">Explore Parks</h2>

                    {/* Horizontal Scroll Tabs */}
                    <div className="flex overflow-x-auto pb-2 -mx-4 px-4 hide-scrollbar gap-2">
                      {Object.keys(DESTINATIONS_DATA).map((county) => (
                        <button key={county} onClick={() => setActiveTab(county)} className={`whitespace-nowrap px-4 py-2 rounded-full text-sm font-bold transition-all ${activeTab === county ? 'bg-[#111827] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
                          {county}
                        </button>
                      ))}
                    </div>

                    <div className="flex flex-col gap-4">
                      {DESTINATIONS_DATA[activeTab].map((dest) => {
                        const isInCart = items.some(i => i.id === dest.id);
                        return (
                          <motion.div layout key={dest.id} className="bg-white rounded-[24px] p-2 shadow-sm border border-gray-100 flex flex-col gap-3 transition-all active:scale-[0.98]">
                            <div className="w-full h-36 rounded-[18px] overflow-hidden relative bg-gray-100">
                               <img src={dest.image} alt={dest.name} className="w-full h-full object-cover" />
                               <div className="absolute top-2 left-2 bg-white/90 backdrop-blur-md px-2 py-1 rounded-full">
                                 <span className="text-[9px] font-bold uppercase tracking-wider" style={{ color: getCategoryColor(dest.category) }}>{dest.category}</span>
                               </div>
                            </div>

                            <div className="px-2 pb-2 flex flex-col gap-3">
                              <div className="flex justify-between items-start gap-2">
                                <div>
                                  <h4 className="text-sm font-bold leading-tight mb-1">{dest.name}</h4>
                                  <p className="text-[10px] text-gray-400 flex items-center gap-1"><MapPin size={10}/> {dest.location.split(' - ')[0]}</p>
                                </div>
                                <span className="text-base font-bold text-gray-900">${dest.fee.toFixed(2)}</span>
                              </div>
                              <button 
                                onClick={() => addItem(dest)} 
                                disabled={isInCart}
                                className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all flex justify-center items-center gap-2 ${isInCart ? 'bg-green-50 text-green-700' : 'bg-gray-50 text-[#111827] hover:bg-gray-100'}`}
                              >
                                {isInCart ? <><CheckCircle2 size={14}/> Added</> : <><Plus size={14}/> Add to Itinerary</>}
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
                <motion.div key="map" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4 h-full flex flex-col">
                  
                  <div className="flex overflow-x-auto pb-1 -mx-4 px-4 hide-scrollbar gap-2 shrink-0">
                      {Object.keys(DESTINATIONS_DATA).map((county) => (
                        <button key={county} onClick={() => { setActiveTab(county); setSelectedMapItem(null); }} className={`whitespace-nowrap px-4 py-2 rounded-full text-xs font-bold transition-all ${activeTab === county ? 'bg-[#111827] text-white shadow-md' : 'bg-white text-gray-600 border border-gray-200'}`}>
                          {county}
                        </button>
                      ))}
                  </div>
                  
                  <div className="w-full flex-1 min-h-[500px] rounded-[24px] overflow-hidden border border-gray-200 relative bg-gray-100 shadow-inner">
                    <Map center={getMapCenter(activeTab)} zoom={activeTab === 'Big Island' ? 8 : 10} provider={(x, y, z, dpr) => `https://a.basemaps.cartocdn.com/rastertiles/voyager/${z}/${x}/${y}${dpr >= 2 ? '@2x' : ''}.png`}>
                      <ZoomControl />
                      {DESTINATIONS_DATA[activeTab].map(dest => (
                        <Overlay key={dest.id} anchor={[dest.lat, dest.lng]} offset={[10, 10]}>
                            <div 
                              onClick={() => setSelectedMapItem(dest)} 
                              className="w-5 h-5 rounded-full border-[3px] border-white cursor-pointer transition-transform active:scale-125 shadow-md"
                              style={{ backgroundColor: getCategoryColor(dest.category) }} 
                            />
                        </Overlay>
                      ))}
                    </Map>

                    {/* Bottom Floating Card for Map View */}
                    <AnimatePresence>
                      {selectedMapItem && (
                        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }} className="absolute bottom-4 left-4 right-4 bg-white p-4 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
                          <div className="w-[calc(100%+32px)] h-24 -mt-4 -mx-4 mb-3 relative bg-gray-100">
                             <img src={selectedMapItem.image} className="w-full h-full object-cover" />
                             <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-transparent"></div>
                             <button onClick={() => setSelectedMapItem(null)} className="absolute top-2 right-2 text-white bg-black/30 backdrop-blur-md p-1 rounded-full"><X size={14} /></button>
                          </div>
                          <h4 className="font-bold text-sm leading-tight mb-1 pr-4">{selectedMapItem.name}</h4>
                          <div className="flex items-center justify-between mt-3">
                            <p className="text-lg font-bold">${selectedMapItem.fee.toFixed(2)}</p>
                            <button 
                              onClick={() => { addItem(selectedMapItem); setSelectedMapItem(null); }}
                              disabled={items.some(i => i.id === selectedMapItem.id)}
                              className="bg-[#111827] disabled:bg-gray-100 disabled:text-gray-400 text-white px-4 py-2 rounded-xl text-xs font-bold active:scale-95 transition-all"
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
                <motion.div key="cart" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="flex flex-col gap-6">
                  
                  <div className="space-y-4">
                    <h2 className="text-2xl font-bold tracking-tight">Your Itinerary</h2>
                    
                    {items.length === 0 ? (
                      <div className="bg-white rounded-3xl p-8 text-center border border-gray-100 shadow-sm flex flex-col items-center">
                        <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-400 mb-3"><Ticket size={20}/></div>
                        <h3 className="text-base font-bold mb-1">No permits yet</h3>
                        <p className="text-xs text-gray-500 mb-4">Add destinations to your itinerary.</p>
                        <button onClick={() => setCurrentPage('home')} className="bg-[#111827] text-white px-5 py-2.5 rounded-full text-xs font-bold active:scale-95 shadow-md">Explore Parks</button>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {items.map((item) => (
                          <motion.div layout key={item.id} className="bg-white rounded-2xl p-3 border border-gray-100 shadow-sm">
                            <div className="flex gap-3 mb-3">
                              <div className="w-16 h-16 shrink-0 rounded-xl overflow-hidden bg-gray-100">
                                 <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              </div>
                              <div className="flex-1 flex flex-col justify-between py-0.5">
                                <div className="flex justify-between items-start gap-1">
                                  <div>
                                    <h3 className="font-bold text-xs leading-tight line-clamp-2">{item.name}</h3>
                                    <p className="text-[10px] text-gray-500 mt-1">{item.location.split(' - ')[0]}</p>
                                  </div>
                                  <button onClick={() => removeItem(item.id)} className="text-gray-300 hover:text-red-500 p-1"><Trash2 size={14} /></button>
                                </div>
                                <span className="font-bold text-sm">${item.fee.toFixed(2)}</span>
                              </div>
                            </div>
                            
                            <div className="bg-gray-50 rounded-xl p-2 flex items-center justify-between gap-2">
                              <input 
                                type="datetime-local" 
                                value={item.dateTime}
                                onChange={(e) => updateDateTime(item.id, e.target.value)}
                                className="bg-transparent text-[10px] font-semibold outline-none w-full"
                              />
                              <div className="shrink-0">
                                {item.availabilityStatus === 'checking' && <span className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Loader2 size={10} className="animate-spin"/> Checking</span>}
                                {item.availabilityStatus === 'available' && <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-1"><CheckCircle2 size={10}/> Available</span>}
                                {item.availabilityStatus === 'unavailable' && <span className="text-[10px] font-bold text-red-500 flex items-center gap-1"><X size={10}/> Full</span>}
                              </div>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Checkout Area - Stacked vertically inside the mobile view */}
                  <div className="bg-white rounded-3xl border border-gray-100 shadow-sm p-5 space-y-5">
                    <h3 className="text-lg font-bold">Summary</h3>
                    
                    <div className="space-y-2 text-xs font-medium">
                      <div className="flex justify-between text-gray-600"><span>Permits ({items.length})</span><span>${subtotal.toFixed(2)}</span></div>
                      <div className="flex justify-between text-gray-600"><span>Taxes</span><span>${taxes.toFixed(2)}</span></div>
                    </div>

                    <div className="pt-3 border-t border-gray-100">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-xs font-bold">Donation</span>
                        <span className="text-xs font-bold">${donation}</span>
                      </div>
                      <input 
                        type="range" min="0" max="100" step="5" value={donation} onChange={(e) => setDonation(parseInt(e.target.value))}
                        className="w-full h-1.5 bg-gray-100 rounded-full appearance-none accent-black mb-1"
                      />
                    </div>

                    <div className="pt-3 border-t border-gray-100 flex justify-between items-end">
                      <span className="font-bold text-sm text-gray-500">Total</span>
                      <span className="text-2xl font-bold tracking-tight">${total.toFixed(2)}</span>
                    </div>

                    <button 
                      onClick={() => setShowSuccess(true)}
                      disabled={items.length === 0}
                      className="w-full bg-[#111827] text-white py-3.5 rounded-full font-bold text-sm active:scale-[0.98] disabled:opacity-50 shadow-md mt-2"
                    >
                      Confirm & Pay
                    </button>
                  </div>
                </motion.div>
              )}

            </AnimatePresence>
          </main>

          <BottomNavBar />

          {/* Success Modal overlay within the phone frame */}
          <AnimatePresence>
            {showSuccess && (
              <div className="absolute inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowSuccess(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
                <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} exit={{ scale: 0.9, opacity: 0, y: 20 }} className="relative bg-white w-full max-w-sm rounded-3xl p-6 text-center shadow-2xl">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-3"><CheckCircle2 size={24} strokeWidth={3}/></div>
                  <h2 className="text-xl font-bold mb-1">Confirmed!</h2>
                  <p className="text-gray-500 text-xs mb-6">Your permits have been generated.</p>
                  <button onClick={() => { setShowSuccess(false); setItems([]); setCurrentPage('home'); }} className="w-full bg-gray-100 text-black py-3 rounded-full font-bold text-sm active:scale-95">
                    Done
                  </button>
                </motion.div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </>
  );
}
