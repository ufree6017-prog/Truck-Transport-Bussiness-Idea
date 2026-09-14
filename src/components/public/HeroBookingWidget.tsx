import React, { useState } from 'react';
import { 
  Truck, 
  MapPin, 
  Clock, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  Building2, 
  Zap, 
  ChevronRight,
  Info
} from 'lucide-react';
import { VehicleCategory } from '../../types';
import { mockVehicleCategories, mockIndianCities, mockCityHubs } from '../../data/mockData';

interface HeroBookingWidgetProps {
  onStartBooking: (params: {
    pickup: string;
    drop: string;
    city: string;
    tripType: 'intracity' | 'intercity';
    vehicleId?: string;
  }) => void;
  onOpenBulkEnquiry: () => void;
  onViewFleet: () => void;
}

export const HeroBookingWidget: React.FC<HeroBookingWidgetProps> = ({
  onStartBooking,
  onOpenBulkEnquiry,
  onViewFleet
}) => {
  const [tripType, setTripType] = useState<'intracity' | 'intercity'>('intracity');
  const [selectedCity, setSelectedCity] = useState('Delhi NCR');
  const [pickup, setPickup] = useState('Okhla Industrial Area Phase 2, New Delhi');
  const [drop, setDrop] = useState('Gurugram Udyog Vihar Phase 4, Haryana');
  
  // For intercity
  const [intercityOrigin, setIntercityOrigin] = useState('Delhi NCR');
  const [intercityDestination, setIntercityDestination] = useState('Jaipur (Rajasthan)');
  
  const retailVehicles = mockVehicleCategories.filter(v => v.categoryType === 'intracity');
  const [activeVehicleId, setActiveVehicleId] = useState<string>('tata-ace');

  const handleCityChange = (newCity: string) => {
    setSelectedCity(newCity);
    const hubs = mockCityHubs[newCity] || mockCityHubs['Mumbai'];
    setPickup(hubs[0] || `${newCity} Hub`);
    setDrop(hubs[1] || `${newCity} Center`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (tripType === 'intracity') {
      onStartBooking({
        pickup,
        drop,
        city: selectedCity,
        tripType: 'intracity',
        vehicleId: activeVehicleId
      });
    } else {
      // If user wants large freight intercity, direct to bulk enquiry; if smaller intercity, start booking
      onStartBooking({
        pickup: `${intercityOrigin} Hub`,
        drop: `${intercityDestination} Logistics Park`,
        city: intercityOrigin,
        tripType: 'intercity'
      });
    }
  };

  return (
    <section className="relative bg-slate-900 text-white overflow-hidden py-10 lg:py-16">
      {/* Subtle geometric pattern overlay */}
      <div className="absolute inset-0 opacity-5 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          
          {/* Left Column: Direct Service Value & Trust Metrics */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Zap className="w-3.5 h-3.5 fill-amber-400" />
              <span>Pan-India On-Demand Logistics Network</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black font-display tracking-tight text-white leading-tight">
              Book Trucks & Mini-Trucks In <span className="text-amber-500">Minutes</span>.
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
              From intracity house shifting and shop dispatches (Tata Ace, 8ft Pickup, Tata 407)
              to long-haul intercity freight and heavy industrial trailers. Verified commercial drivers,
              transparent fares, and instant OTP security across 200+ Indian cities.
            </p>

            {/* Quick Proof Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <p className="text-xl font-black text-amber-400 font-display">8-12 Mins</p>
                <p className="text-[11px] text-slate-400 font-medium">Avg. Driver ETA</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80">
                <p className="text-xl font-black text-white font-display">45,000+</p>
                <p className="text-[11px] text-slate-400 font-medium">Verified Trucks</p>
              </div>
              <div className="bg-slate-800/80 p-3 rounded-xl border border-slate-700/80 col-span-2 sm:col-span-1">
                <p className="text-xl font-black text-emerald-400 font-display">SAC 9965</p>
                <p className="text-[11px] text-slate-400 font-medium">GST Compliant GTA</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-xs text-slate-400 pt-1">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Tolls & Taxes itemized
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Loading helper option
              </span>
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" /> Transit insurance
              </span>
            </div>
          </div>

          {/* Right Column: Interactive Booking Console */}
          <div className="lg:col-span-6">
            <div className="bg-white text-slate-900 rounded-3xl shadow-2xl p-6 sm:p-7 border border-slate-200">
              
              {/* Trip Type Segmented Tabs */}
              <div className="flex items-center p-1 bg-slate-100 rounded-2xl mb-6">
                <button
                  type="button"
                  onClick={() => setTripType('intracity')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                    tripType === 'intracity'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Truck className="w-4 h-4 text-amber-600" />
                  <span>Intracity (Within City)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTripType('intercity')}
                  className={`flex-1 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-bold transition flex items-center justify-center gap-2 ${
                    tripType === 'intercity'
                      ? 'bg-white text-slate-950 shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Building2 className="w-4 h-4 text-amber-600" />
                  <span>Intercity (City to City)</span>
                </button>
              </div>

              {/* Form Area */}
              <form onSubmit={handleSubmit} className="space-y-4">
                
                {tripType === 'intracity' ? (
                  <>
                    {/* City Dropdown */}
                    <div>
                      <div className="flex justify-between items-center mb-1">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Operating City Hub
                        </label>
                        <span className="text-[11px] text-emerald-700 font-semibold">Active in 200+ Cities</span>
                      </div>
                      <select
                        value={selectedCity}
                        onChange={(e) => handleCityChange(e.target.value)}
                        className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-xl bg-slate-50 font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                      >
                        {mockIndianCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    {/* Pickup Point */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Pickup Address / Landmark
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={pickup}
                          onChange={(e) => setPickup(e.target.value)}
                          placeholder="e.g. Okhla Phase 2, Gate 4"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Drop-off Point */}
                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Drop-off Address / Destination
                      </label>
                      <div className="relative">
                        <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-3.5" />
                        <input
                          type="text"
                          required
                          value={drop}
                          onChange={(e) => setDrop(e.target.value)}
                          placeholder="e.g. Udyog Vihar Phase 4, Gurugram"
                          className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500"
                        />
                      </div>
                    </div>

                    {/* Quick Vehicle Picker strip (retail only) */}
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                          Select Vehicle Category
                        </label>
                        <button
                          type="button"
                          onClick={onViewFleet}
                          className="text-[11px] text-amber-700 font-bold hover:underline"
                        >
                          View all specs & rates →
                        </button>
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {retailVehicles.slice(0, 3).map((v) => {
                          const isActive = activeVehicleId === v.id;
                          return (
                            <div
                              key={v.id}
                              onClick={() => setActiveVehicleId(v.id)}
                              className={`p-2.5 rounded-xl border text-center cursor-pointer transition ${
                                isActive
                                  ? 'border-amber-500 bg-amber-50/70 font-bold text-amber-950 ring-1 ring-amber-500/30'
                                  : 'border-slate-200 hover:border-slate-300 bg-white text-slate-700'
                              }`}
                            >
                              <p className="text-xs font-extrabold truncate">{v.name.split('/')[0]}</p>
                              <p className="text-[10px] text-slate-500">{v.capacityDisplay}</p>
                              <p className="text-xs font-bold text-slate-900 mt-1">From ₹{v.baseFare}</p>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </>
                ) : (
                  /* Intercity Mode Form */
                  <div className="space-y-3.5">
                    <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl text-xs text-blue-900 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Info className="w-4 h-4 text-blue-700" />
                        National Highway Intercity Freight Desk
                      </p>
                      <p className="text-[11px] text-blue-800">
                        Door-to-door full truckload (FTL) and multi-ton cargo across India with live GPS
                        and E-Way Bill support.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Origin City
                      </label>
                      <select
                        value={intercityOrigin}
                        onChange={(e) => setIntercityOrigin(e.target.value)}
                        className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                      >
                        {mockIndianCities.map((c) => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
                        Destination City
                      </label>
                      <input
                        type="text"
                        value={intercityDestination}
                        onChange={(e) => setIntercityDestination(e.target.value)}
                        placeholder="e.g. Jaipur, Pune, Bengaluru, Ahmedabad"
                        className="w-full px-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                      />
                    </div>

                    <div className="p-3 bg-amber-50 border border-amber-200 rounded-xl text-xs text-amber-900">
                      <p className="font-bold">Need Container SXL/MXL (20/32ft) or 40ft Trailers?</p>
                      <p className="text-[11px] text-amber-800 mt-0.5">
                        Submit a bulk requirement to receive instant corporate freight quotes.
                      </p>
                      <button
                        type="button"
                        onClick={onOpenBulkEnquiry}
                        className="mt-2 text-xs font-bold text-white bg-slate-900 hover:bg-slate-800 px-3 py-1.5 rounded-lg inline-flex items-center gap-1"
                      >
                        Open B2B Bulk Enquiry Form →
                      </button>
                    </div>
                  </div>
                )}

                {/* Toll Notice Callout */}
                <div className="text-[11px] text-slate-500 flex items-center gap-1">
                  <span className="font-bold text-slate-700">Note:</span>
                  <span>Tolls & state taxes extra • Free cancellation within 5 mins of booking</span>
                </div>

                {/* Submit Action */}
                <button
                  type="submit"
                  className="w-full py-3.5 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-black rounded-xl text-sm transition flex items-center justify-center gap-2 shadow-lg shadow-amber-500/25"
                >
                  <span>Check Live Fares & Book Truck</span>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </button>
              </form>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
