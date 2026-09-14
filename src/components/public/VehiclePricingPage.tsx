import React, { useState } from 'react';
import { mockVehicleCategories } from '../../data/mockData';
import { VehicleCategory } from '../../types';
import { 
  Truck, 
  Clock, 
  Check, 
  ShieldCheck, 
  AlertTriangle, 
  Calculator, 
  ArrowRight,
  Sparkles,
  Building2,
  FileCheck
} from 'lucide-react';

interface VehiclePricingPageProps {
  onSelectVehicle: (vehicle: VehicleCategory) => void;
  onOpenBulkEnquiry: () => void;
}

export const VehiclePricingPage: React.FC<VehiclePricingPageProps> = ({
  onSelectVehicle,
  onOpenBulkEnquiry
}) => {
  const [filterType, setFilterType] = useState<'all' | 'intracity' | 'intercity'>('all');
  const [calcDistanceKm, setCalcDistanceKm] = useState<number>(25);

  const displayedVehicles = mockVehicleCategories.filter(v => {
    if (filterType === 'all') return true;
    return v.categoryType === filterType;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
          Transparent Logistics Tariffs
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
          Fleet Types, Specifications & Fare Calculator
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          From 500kg intracity mini-trucks for home shifting to 35-ton multi-axle trailers for industrial freight.
          Transparent base fares and per-km pricing with no hidden charges.
        </p>
      </div>

      {/* Interactive Distance Fare Estimator Bar */}
      <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-bold">
              <Calculator className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold font-display text-white">Instant Route Fare Simulator</h2>
              <p className="text-xs text-slate-400">Slide distance to compare estimated fares across entire fleet</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-slate-800 px-4 py-2 rounded-xl border border-slate-700">
            <span className="text-xs text-slate-300">Estimated Distance:</span>
            <span className="text-xl font-mono font-black text-amber-400">{calcDistanceKm} km</span>
          </div>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="range"
            min="2"
            max="350"
            step="1"
            value={calcDistanceKm}
            onChange={(e) => setCalcDistanceKm(Number(e.target.value))}
            className="w-full accent-amber-500 h-2 bg-slate-700 rounded-lg cursor-pointer"
          />
          <div className="flex items-center gap-2 flex-shrink-0 text-xs">
            <button
              onClick={() => setCalcDistanceKm(12)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
            >
              12 km (Local)
            </button>
            <button
              onClick={() => setCalcDistanceKm(45)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
            >
              45 km (City)
            </button>
            <button
              onClick={() => setCalcDistanceKm(180)}
              className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 rounded text-slate-300"
            >
              180 km (Intercity)
            </button>
          </div>
        </div>
      </div>

      {/* Mandatory Toll & Tax Disclosure Banner */}
      <div className="bg-amber-50 border-l-4 border-amber-500 p-4 rounded-r-xl flex items-start gap-3 text-xs text-amber-950">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div>
          <strong className="text-sm font-bold">MANDATORY DISCLOSURE: Tolls & State Taxes Extra</strong>
          <p className="mt-1 text-amber-900 leading-relaxed">
            All rates shown include truck hire, fuel, and pilot fee. National highway Fastag tolls, state border transit
            taxes, and green cess are <strong>never silently bundled</strong> into the baseline estimates and will be paid
            at actuals. Loading helper (₹350 flat) and transit insurance (0.25%) are optional at checkout.
          </p>
        </div>
      </div>

      {/* Category Filter Tabs */}
      <div className="flex items-center justify-between border-b border-slate-200 pb-4 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setFilterType('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterType === 'all'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            All Vehicles ({mockVehicleCategories.length})
          </button>
          <button
            onClick={() => setFilterType('intracity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterType === 'intracity'
                ? 'bg-amber-500 text-slate-950 shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Intracity Mini-Trucks (Instant Booking)
          </button>
          <button
            onClick={() => setFilterType('intercity')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition ${
              filterType === 'intercity'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Intercity Containers & Trailers (B2B Bulk)
          </button>
        </div>

        <span className="text-xs text-slate-500">
          Showing <strong>{displayedVehicles.length}</strong> categories
        </span>
      </div>

      {/* Fleet Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayedVehicles.map((vehicle) => {
          const extraKm = Math.max(0, calcDistanceKm - vehicle.baseKmIncluded);
          const computedEstimate = vehicle.baseFare + extraKm * vehicle.perKmRate;
          const isIntercityHeavy = vehicle.categoryType === 'intercity';

          return (
            <div
              key={vehicle.id}
              className="bg-white rounded-2xl border border-slate-200 shadow-xs hover:shadow-md transition overflow-hidden flex flex-col justify-between"
            >
              <div>
                {/* Card Header */}
                <div className="p-5 border-b border-slate-100 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                      isIntercityHeavy 
                        ? 'bg-blue-100 text-blue-800 border border-blue-200' 
                        : 'bg-amber-100 text-amber-900 border border-amber-200'
                    }`}>
                      {isIntercityHeavy ? 'Intercity / B2B Freight' : 'Intracity Mini-Truck'}
                    </span>
                    {vehicle.badge && (
                      <span className="text-[10px] bg-slate-900 text-white font-bold px-2 py-0.5 rounded">
                        {vehicle.badge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-700">
                      <Truck className="w-6 h-6" />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900 font-display">{vehicle.name}</h3>
                      <p className="text-xs text-slate-500 font-medium">({vehicle.hindiName})</p>
                    </div>
                  </div>
                </div>

                {/* Specs List */}
                <div className="p-5 space-y-3 text-xs">
                  <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 rounded-xl">
                    <div>
                      <span className="text-slate-500 text-[11px]">Payload Capacity:</span>
                      <p className="font-extrabold text-slate-900 text-sm">{vehicle.capacityDisplay}</p>
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px]">Deck Dimensions:</span>
                      <p className="font-bold text-slate-900">{vehicle.dimensions}</p>
                    </div>
                  </div>

                  <p className="text-slate-600 text-xs leading-relaxed">
                    {vehicle.description}
                  </p>

                  <div className="pt-2 border-t border-slate-100">
                    <p className="text-[11px] font-bold uppercase text-slate-700 mb-1.5">Ideal For:</p>
                    <div className="flex flex-wrap gap-1.5">
                      {vehicle.suitableFor.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded font-medium"
                        >
                          ✓ {item}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Pricing Details */}
                  <div className="pt-3 border-t border-slate-100 space-y-1">
                    <div className="flex justify-between text-slate-600">
                      <span>Base Fare (First {vehicle.baseKmIncluded} km):</span>
                      <span className="font-bold text-slate-900">₹{vehicle.baseFare}</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Rate per additional km:</span>
                      <span className="font-bold text-slate-900">₹{vehicle.perKmRate}/km</span>
                    </div>
                    <div className="flex justify-between text-slate-600">
                      <span>Typical Driver ETA:</span>
                      <span className="font-bold text-emerald-700">~{vehicle.estimatedEtaMins} mins</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Dynamic Estimated Fare & Action Button */}
              <div className="p-5 bg-slate-50 border-t border-slate-200 space-y-3">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-500">
                      Est. for {calcDistanceKm} km:
                    </span>
                    <p className="text-xl font-black text-slate-950 font-display">
                      ₹{computedEstimate.toLocaleString()}
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-500 text-right">
                    Tolls Extra • GST 5%
                  </span>
                </div>

                {isIntercityHeavy ? (
                  <button
                    onClick={onOpenBulkEnquiry}
                    className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <Building2 className="w-3.5 h-3.5" />
                    <span>Get Corporate Bulk Quote</span>
                  </button>
                ) : (
                  <button
                    onClick={() => onSelectVehicle(vehicle)}
                    className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow"
                  >
                    <span>Book {vehicle.name.split('/')[0]}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-amber-400" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
