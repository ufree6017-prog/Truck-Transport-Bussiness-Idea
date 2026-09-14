import React from 'react';
import { HeroBookingWidget } from './HeroBookingWidget';
import { VehicleCategory } from '../../types';
import { mockVehicleCategories, mockIndianCities } from '../../data/mockData';
import { 
  Truck, 
  ShieldCheck, 
  Clock, 
  MapPin, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  CreditCard, 
  PhoneCall, 
  Star,
  Users,
  AlertCircle
} from 'lucide-react';

interface HomePageProps {
  onStartBooking: (params?: {
    pickup?: string;
    drop?: string;
    city?: string;
    tripType?: 'intracity' | 'intercity';
    vehicleId?: string;
  }) => void;
  onOpenBulkEnquiry: () => void;
  onNavigateFleet: () => void;
  onNavigateTracking: () => void;
  onOpenDriverPortal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  onStartBooking,
  onOpenBulkEnquiry,
  onNavigateFleet,
  onNavigateTracking,
  onOpenDriverPortal
}) => {
  const retailFleet = mockVehicleCategories.filter(v => v.categoryType === 'intracity').slice(0, 4);
  const heavyFleet = mockVehicleCategories.filter(v => v.categoryType === 'intercity').slice(0, 3);

  return (
    <div className="space-y-16">
      {/* 1. Hero with immediate functional booking console */}
      <HeroBookingWidget
        onStartBooking={(params) => onStartBooking(params)}
        onOpenBulkEnquiry={onOpenBulkEnquiry}
        onViewFleet={onNavigateFleet}
      />

      {/* 2. Intracity Fleet Quick Showcase (Retail) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-bold border border-amber-200">
              <Truck className="w-3.5 h-3.5 text-amber-700" />
              <span>Instant On-Demand Booking</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
              Popular City Mini-Trucks
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Ideal for household shifting, furniture, home appliances, electricals, and local shop dispatches.
              Dispatched with verified commercial drivers in 8-12 minutes.
            </p>
          </div>
          <button
            onClick={onNavigateFleet}
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 group whitespace-nowrap"
          >
            <span>View all {mockVehicleCategories.length} fleet categories & tariffs</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {retailFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs hover:shadow-md transition flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                    {vehicle.capacityDisplay}
                  </span>
                  {vehicle.badge && (
                    <span className="text-[10px] font-bold bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                      {vehicle.badge}
                    </span>
                  )}
                </div>

                <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-700 flex items-center justify-center mb-3 group-hover:scale-105 transition">
                  <Truck className="w-6 h-6" />
                </div>

                <h3 className="font-bold font-display text-slate-900 text-base">{vehicle.name}</h3>
                <p className="text-xs text-slate-500 font-medium">({vehicle.hindiName})</p>

                <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                  {vehicle.description}
                </p>

                <div className="mt-3 pt-3 border-t border-slate-100 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span>Base Fare (incl {vehicle.baseKmIncluded}km):</span>
                    <span className="font-bold text-slate-900">₹{vehicle.baseFare}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Rate / addl km:</span>
                    <span className="font-bold text-slate-900">₹{vehicle.perKmRate}/km</span>
                  </div>
                  <div className="flex justify-between text-emerald-700">
                    <span>Avg. Pickup:</span>
                    <span className="font-bold">~{vehicle.estimatedEtaMins} mins</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={() => onStartBooking({ vehicleId: vehicle.id })}
                  className="w-full py-2 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <span>Book {vehicle.name.split('/')[0]}</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Transparent Tolls & Pricing Rules Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-800 shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-4">
              <span className="text-xs uppercase font-bold tracking-widest bg-amber-500/20 text-amber-400 px-3 py-1 rounded-full border border-amber-500/30">
                Zero Hidden Charges Guarantee
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                How TruckSetu Guarantees Honest, Transparent Tariffs
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                Unlike unorganized brokers who spring surprise fees on delivery, every rupee on TruckSetu
                is mathematically accounted for upfront:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-xs">
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="font-bold text-amber-400 mb-0.5">Tolls & State Taxes at Actuals</p>
                  <p className="text-slate-400 text-[11px]">
                    Fastag plaza deductions are never inflated or bundled. Paid against electronic receipts.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="font-bold text-amber-400 mb-0.5">Free 5-Min Cancellation</p>
                  <p className="text-slate-400 text-[11px]">
                    Cancel with 100% instant refund within 5 minutes of driver dispatch if plans change.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="font-bold text-amber-400 mb-0.5">Optional Loading Helper (₹350)</p>
                  <p className="text-slate-400 text-[11px]">
                    Add certified ground-floor loading assistance directly during checkout.
                  </p>
                </div>
                <div className="p-3 bg-slate-800/80 rounded-xl border border-slate-700">
                  <p className="font-bold text-amber-400 mb-0.5">GST Invoices (SAC 9965)</p>
                  <p className="text-slate-400 text-[11px]">
                    Automated B2B invoices with registered GSTIN and full Input Tax Credit eligibility.
                  </p>
                </div>
              </div>
            </div>

            <div className="lg:col-span-5 bg-slate-800 p-6 rounded-2xl border border-slate-700 space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                4-Point Verification Checklist
              </h3>
              <ul className="space-y-2.5 text-xs text-slate-300">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Commercial transport driver license with RTO validity checks</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Vehicle Registration Certificate (RC) and active Fitness Certificate</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>Carrier commercial insurance coverage active throughout transit</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>4-Digit Secure OTP Handover protocol before cargo mobilization</span>
                </li>
              </ul>
              <button
                onClick={() => onStartBooking()}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center justify-center gap-2"
              >
                <span>Try Booking Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 4. Heavy Intercity & B2B Enterprise Freight Spotlight */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-100 text-blue-900 text-xs font-bold border border-blue-200">
              <Building2 className="w-3.5 h-3.5 text-blue-700" />
              <span>Full Truckload (FTL) & Corporate Freight</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-2">
              National Highway Corridors & Heavy Fleets
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-xl">
              Containers (20/32ft SXL/MXL) and 40ft Trailers for multi-ton manufacturing, FMCG,
              and industrial machinery consignments. Dedicated Key Account Manager and E-Way Bill integration.
            </p>
          </div>
          <button
            onClick={onOpenBulkEnquiry}
            className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center gap-2 shadow"
          >
            <span>Open Bulk Enquiry Form</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {heavyFleet.map((vehicle) => (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-900 px-2.5 py-0.5 rounded">
                    Heavy Hauler
                  </span>
                  <span className="text-xs font-mono font-bold text-slate-900">
                    {vehicle.capacityDisplay}
                  </span>
                </div>

                <h3 className="font-bold font-display text-slate-900 text-base">{vehicle.name}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{vehicle.description}</p>

                <div className="p-3 bg-slate-50 rounded-xl space-y-1 text-xs">
                  <div className="flex justify-between text-slate-600">
                    <span>Base Freight:</span>
                    <span className="font-bold text-slate-900">From ₹{vehicle.baseFare.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Highway Per Km:</span>
                    <span className="font-bold text-slate-900">₹{vehicle.perKmRate}/km</span>
                  </div>
                  <div className="flex justify-between text-slate-600">
                    <span>Deck Dimensions:</span>
                    <span className="font-medium text-slate-800">{vehicle.dimensions}</span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100">
                <button
                  onClick={onOpenBulkEnquiry}
                  className="w-full py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
                >
                  <Building2 className="w-3.5 h-3.5 text-blue-400" />
                  <span>Request Corporate Quote</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. Attach Your Truck (Driver Partner Callout) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-emerald-900 to-slate-900 text-white rounded-3xl p-8 sm:p-10 border border-emerald-800/50 shadow-xl">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <span className="text-xs font-bold uppercase tracking-widest text-emerald-400 bg-emerald-950/80 px-3 py-1 rounded-full border border-emerald-700/50">
                Driver & Transporter Partner Program
              </span>
              <h2 className="text-2xl sm:text-3xl font-black font-display text-white">
                Own a Truck? Earn ₹35,000 to ₹75,000+ Every Month.
              </h2>
              <p className="text-xs sm:text-sm text-emerald-200 leading-relaxed">
                Attach your Tata Ace, Bolero Pickup, Tata 407, or Eicher. Get regular daily loads,
                discounted backhaul return loads so you never drive empty, and instant daily wallet withdrawals.
              </p>
              <div className="flex items-center gap-4 text-xs text-emerald-300 pt-1">
                <span>✓ 0% Onboarding Fee</span>
                <span>✓ Direct UPI Daily Payouts</span>
                <span>✓ Backhaul Return Loads</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 flex-shrink-0">
              <button
                onClick={onOpenDriverPortal}
                className="px-6 py-3.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-2 shadow-lg shadow-amber-500/20"
              >
                <Truck className="w-4 h-4" />
                <span>Attach Truck & Open Driver Portal</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Active Hubs Pan-India Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <h2 className="text-xl font-bold font-display text-slate-900">
            Operating Across 200+ Indian Logistics Hubs
          </h2>
          <p className="text-xs text-slate-500">
            Seamless intra-state and national highway connectivity with local dispatch supervisors.
          </p>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-2">
          {mockIndianCities.map((city) => (
            <button
              key={city}
              onClick={() => onStartBooking({ city })}
              className="px-3.5 py-1.5 bg-white hover:bg-amber-50 hover:border-amber-400 border border-slate-200 rounded-xl text-xs text-slate-700 font-semibold transition flex items-center gap-1.5 shadow-2xs"
            >
              <MapPin className="w-3 h-3 text-amber-600" />
              <span>{city}</span>
            </button>
          ))}
        </div>
      </section>
    </div>
  );
};
