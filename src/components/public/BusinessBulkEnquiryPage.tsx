import React, { useState } from 'react';
import { BulkEnquiry } from '../../types';
import { 
  Building2, 
  CheckCircle2, 
  FileCheck, 
  Truck, 
  ShieldCheck, 
  Clock, 
  PhoneCall, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { mockIndianCities } from '../../data/mockData';

interface BusinessBulkEnquiryPageProps {
  onSubmitEnquiry: (newEnquiry: BulkEnquiry) => void;
  onNavigateHome: () => void;
}

export const BusinessBulkEnquiryPage: React.FC<BusinessBulkEnquiryPageProps> = ({
  onSubmitEnquiry,
  onNavigateHome
}) => {
  const [submitted, setSubmitted] = useState(false);
  const [createdEnquiryNumber, setCreatedEnquiryNumber] = useState('');

  // Form State
  const [companyName, setCompanyName] = useState('Tata Consumer Products Logistics');
  const [gstin, setGstin] = useState('27AABCT1928K1Z5');
  const [contactPerson, setContactPerson] = useState('Manish Varma');
  const [phone, setPhone] = useState('+91 98201 55432');
  const [email, setEmail] = useState('m.varma@tataconsumer.com');
  const [originCity, setOriginCity] = useState('Mumbai');
  const [destinationCity, setDestinationCity] = useState('Delhi NCR');
  const [frequency, setFrequency] = useState<'one_time' | 'daily' | 'weekly' | 'monthly_contract'>('weekly');
  const [vehicleTypeRequired, setVehicleTypeRequired] = useState('32ft Container MXL (Multi-Axle)');
  const [cargoWeightTons, setCargoWeightTons] = useState<number>(16.5);
  const [cargoDescription, setCargoDescription] = useState('Packaged Tea, Coffee & FMCG crates on standard EUR pallets');
  const [eWayBillNumber, setEWayBillNumber] = useState('2819 4018 9201');
  const [eWayBillAvailable, setEWayBillAvailable] = useState(true);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEnqNum = `ENQ-B2B-${Math.floor(1000 + Math.random() * 9000)}`;
    const newEnq: BulkEnquiry = {
      id: `enq-${Date.now()}`,
      enquiryNumber: newEnqNum,
      companyName,
      gstin,
      contactPerson,
      phone,
      email,
      originCity,
      destinationCity,
      frequency,
      vehicleTypeRequired,
      cargoWeightTons,
      cargoDescription,
      eWayBillAvailable,
      status: 'new',
      createdAt: new Date().toISOString().split('T')[0]
    };

    onSubmitEnquiry(newEnq);
    setCreatedEnquiryNumber(newEnqNum);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-5 shadow-sm">
          <CheckCircle2 className="w-9 h-9 text-emerald-600" />
        </div>
        <span className="text-xs uppercase font-bold tracking-wider bg-emerald-50 text-emerald-800 px-3 py-1 rounded-full border border-emerald-200">
          Enquiry Received • Reference: {createdEnquiryNumber}
        </span>
        <h1 className="text-3xl font-black font-display text-slate-900 mt-3 mb-3">
          Your Enterprise Freight Enquiry is Logged
        </h1>
        <p className="text-sm text-slate-600 max-w-lg mx-auto leading-relaxed mb-6">
          Our dedicated Corporate Freight Desk has received your requirement for{' '}
          <strong>{originCity} to {destinationCity}</strong> ({vehicleTypeRequired}). A Key Account
          Manager will contact you within <strong>30 minutes</strong> with spot rates and contract proposals.
        </p>

        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left max-w-lg mx-auto mb-8 space-y-2 text-xs">
          <p className="font-bold text-slate-800 uppercase tracking-wider pb-1 border-b border-slate-200">
            Enquiry Snapshot (Viewable in Admin Portal)
          </p>
          <div className="flex justify-between text-slate-600">
            <span>Company:</span>
            <span className="font-semibold text-slate-900">{companyName}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>GSTIN:</span>
            <span className="font-mono font-semibold text-slate-900">{gstin}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>E-Way Bill:</span>
            <span className="font-mono font-semibold text-slate-900">{eWayBillNumber || 'To be generated'}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Route:</span>
            <span className="font-semibold text-slate-900">{originCity} → {destinationCity}</span>
          </div>
          <div className="flex justify-between text-slate-600">
            <span>Cargo Tonnage:</span>
            <span className="font-semibold text-slate-900">{cargoWeightTons} Tons</span>
          </div>
        </div>

        <div className="flex justify-center gap-3">
          <button
            onClick={() => setSubmitted(false)}
            className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition"
          >
            Submit Another Requirement
          </button>
          <button
            onClick={onNavigateHome}
            className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition"
          >
            Return to Homepage
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-xs uppercase font-bold tracking-widest bg-blue-100 text-blue-900 px-3 py-1 rounded-full border border-blue-200">
          Enterprise Logistics & Long-Haul Freight
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
          Business & Bulk Freight Enquiry
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Full Truckload (FTL), dedicated contract fleets, and heavy containers (20/32ft) & trailers
          (21–35 tons) across national highway corridors.
        </p>
      </div>

      {/* Trust Grid for Corporates */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">Dedicated Key Account Manager</p>
            <p className="text-[11px] text-slate-500">Single point of contact for dispatches</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <FileCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">E-Way Bill & GST Compliant</p>
            <p className="text-[11px] text-slate-500">Digital LR & automated POD uploads</p>
          </div>
        </div>
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-900">₹25L+ In-Transit Insurance</p>
            <p className="text-[11px] text-slate-500">Institutional risk underwriting</p>
          </div>
        </div>
      </div>

      {/* Main Form */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
        <div className="bg-slate-900 text-white p-6 sm:p-8">
          <h2 className="text-xl font-bold font-display text-white">Consignment & Shifting Requirements</h2>
          <p className="text-xs text-slate-400 mt-1">
            Fill in your route and tonnage. Our algorithm will match verified fleet operators and provide competitive rates.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 space-y-6">
          {/* Section 1: Company & Contact */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
              1. Enterprise & Contact Details
            </p>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company / Organization Name *</label>
                <input
                  type="text"
                  required
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Company GSTIN (15 Digits) *</label>
                <input
                  type="text"
                  required
                  value={gstin}
                  onChange={(e) => setGstin(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Contact Person Name *</label>
                <input
                  type="text"
                  required
                  value={contactPerson}
                  onChange={(e) => setContactPerson(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Direct Phone *</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Work Email *</label>
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 2: Route, Frequency & E-Way Bill */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
              2. Route Corridor & Dispatch Frequency
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Origin City / Hub *</label>
                <select
                  value={originCity}
                  onChange={(e) => setOriginCity(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                >
                  {mockIndianCities.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Destination City / Hub *</label>
                <input
                  type="text"
                  required
                  value={destinationCity}
                  onChange={(e) => setDestinationCity(e.target.value)}
                  placeholder="e.g. Pune, Chennai, Kolkata"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Dispatch Frequency *</label>
                <select
                  value={frequency}
                  onChange={(e) => setFrequency(e.target.value as any)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                >
                  <option value="one_time">One-Time Spot Load</option>
                  <option value="daily">Daily Scheduled Dispatches</option>
                  <option value="weekly">Weekly Shipments (2-4 loads)</option>
                  <option value="monthly_contract">Dedicated Monthly Fleet Contract</option>
                </select>
              </div>
            </div>

            {/* E-Way Bill Number Field (Prompt Mandate: shown only in business/bulk flow) */}
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-700" />
                  <span className="text-xs font-bold text-slate-900">E-Way Bill Number (B2B Cargo Mandatory)</span>
                </div>
                <div className="flex items-center gap-2">
                  <label className="text-[11px] text-slate-600 cursor-pointer">E-Way Bill Ready?</label>
                  <input
                    type="checkbox"
                    checked={eWayBillAvailable}
                    onChange={(e) => setEWayBillAvailable(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded cursor-pointer"
                  />
                </div>
              </div>

              {eWayBillAvailable ? (
                <div>
                  <input
                    type="text"
                    value={eWayBillNumber}
                    onChange={(e) => setEWayBillNumber(e.target.value)}
                    placeholder="Enter 12-digit E-Way Bill Number (e.g. 2810 4910 2931)"
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg font-mono bg-white focus:outline-none focus:ring-1 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-500 mt-1">
                    Mandatory for inter-state consignment value exceeding ₹50,000 under Indian GST rules.
                  </p>
                </div>
              ) : (
                <p className="text-[11px] text-slate-500 italic">
                  E-Way Bill not yet generated. TruckSetu operations will assist with part-A generation before dispatch.
                </p>
              )}
            </div>
          </div>

          {/* Section 3: Heavy Vehicle & Cargo Tonnage */}
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-wider text-slate-800 pb-1 border-b border-slate-200">
              3. Heavy Vehicle Category & Cargo Payload
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Required Heavy Vehicle Category *
                </label>
                <select
                  value={vehicleTypeRequired}
                  onChange={(e) => setVehicleTypeRequired(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl bg-slate-50 font-semibold"
                >
                  <option value="20ft Container SXL (6.5–9 Tons)">20ft Container SXL (6.5–9 Tons)</option>
                  <option value="32ft Container SXL/MXL (7–18 Tons)">32ft Container SXL/MXL (7–18 Tons)</option>
                  <option value="Open Body / Flatbed / Trailer (15–25 Tons)">Open Body / Flatbed / Trailer (15–25 Tons)</option>
                  <option value="40ft High-Bed / Low-Bed Trailer (21–35 Tons)">40ft High-Bed / Low-Bed Trailer (21–35 Tons)</option>
                  <option value="14/17/19ft Eicher Open/Closed (4–7 Tons)">14/17/19ft Eicher Open/Closed (4–7 Tons)</option>
                  <option value="Multi-Axle Hydraulic Heavy Hauler (Over-Dimensional)">Multi-Axle Hydraulic Heavy Hauler (ODC)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Estimated Cargo Weight (Metric Tons) *
                </label>
                <input
                  type="number"
                  step="0.5"
                  min="1"
                  max="45"
                  required
                  value={cargoWeightTons}
                  onChange={(e) => setCargoWeightTons(Number(e.target.value) || 0)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Cargo Description & Handling Specifications *
                </label>
                <textarea
                  rows={2}
                  required
                  value={cargoDescription}
                  onChange={(e) => setCargoDescription(e.target.value)}
                  placeholder="Describe goods, packaging (wooden boxes, pallets, loose, drum), loading crane requirement, etc."
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                ></textarea>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <Clock className="w-4 h-4 text-amber-600" />
              <span>Response within 30 minutes • Competitive contract rates</span>
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto px-8 py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-2 shadow-lg"
            >
              <span>Submit Enterprise Freight Requirement</span>
              <ArrowRight className="w-4 h-4 text-amber-400" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
