import React from 'react';
import { ShieldCheck, FileText, AlertCircle, PhoneCall, Mail, MapPin, CheckCircle2 } from 'lucide-react';

interface PolicyViewProps {
  type: 'terms' | 'privacy' | 'cancellation' | 'about' | 'contact';
  onNavigateBooking?: () => void;
}

export const PolicyPages: React.FC<PolicyViewProps> = ({ type, onNavigateBooking }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
      {type === 'cancellation' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Customer & Shipper Protection
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 mt-2">
              Cancellation & Refund Policy
            </h1>
            <p className="text-xs text-slate-500 mt-1">Last revised: September 2026 • Effective Pan-India</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-xl space-y-2">
              <h3 className="font-bold text-emerald-950 text-sm flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Free Cancellation Window (5 Minutes)
              </h3>
              <p className="text-emerald-900 text-xs">
                You can cancel your booking completely free of charge within <strong>5 minutes</strong> of a driver partner
                being assigned to your ride. Any upfront online payment is refunded 100% to your original UPI/bank account
                immediately.
              </p>
            </div>

            <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-2">
              <h3 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                Cancellation Fee After 5 Minutes (₹100 Flat)
              </h3>
              <p className="text-amber-900 text-xs">
                If cancellation occurs <strong>after 5 minutes</strong> from driver assignment, or after the driver has
                arrived at the pickup location and waiting time exceeds 15 minutes without cargo handover, a standard fee
                of <strong>₹100</strong> (for mini-trucks) or ₹250 (for heavy trucks) is charged to compensate the driver
                for fuel burned and transit mobilization.
              </p>
            </div>

            <div className="space-y-3 pt-2">
              <h3 className="text-base font-bold text-slate-900 font-display">Tolls & Additional Service Charges</h3>
              <p>
                1. <strong>Tolls & State Border Taxes:</strong> Fastag toll charges are collected strictly against electronic plaza receipts. If a trip is aborted before toll plazas, no toll charges are levied.
              </p>
              <p>
                2. <strong>Driver Helper Fees:</strong> If helper service was opted for during booking but the consignment is cancelled prior to loading, helper fees are 100% refunded.
              </p>
              <p>
                3. <strong>Transit Insurance Claims:</strong> In case of accidental cargo damage during transit, claims are processed under our underwritten Goods In Transit Policy up to the declared cargo value.
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'terms' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Legal Framework
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 mt-2">
              Terms & Conditions of Service
            </h1>
            <p className="text-xs text-slate-500 mt-1">Applicable to all Shippers, Consignors, Drivers & Transporters</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <div>
              <h3 className="font-bold text-slate-900 mb-1">1. Marketplace Intermediary Status</h3>
              <p>
                TruckSetu operates as a digital technology marketplace facilitating contracts between shippers/customers and independent commercial truck owners and drivers. All transport contracts are subject to the Carriage by Road Act, 2007.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">2. Goods Transport Agency (GTA) & GST Compliance</h3>
              <p>
                TruckSetu issues electronic Consignment Notes (Bilty / Lorry Receipt) under SAC Code 996511. Applicable GST rates (5% without ITC or 12% with ITC) are levied on taxable freight value.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">3. Prohibited Cargo</h3>
              <p>
                Consignors are strictly forbidden from loading hazardous chemicals, flammable substances, firearms, contraband, or contraband wildlife. Shippers bear sole legal liability for contraband contents.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">4. E-Way Bill Responsibilities</h3>
              <p>
                For any inter-state consignment with invoice value exceeding ₹50,000, generation and provision of a valid E-Way Bill is the statutory responsibility of the consignor/business shipper.
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'privacy' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Data Privacy & Protection
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 mt-2">
              Privacy Policy & Security
            </h1>
            <p className="text-xs text-slate-500 mt-1">Digital Personal Data Protection Act (DPDPA) Compliance</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              TruckSetu is committed to safeguarding user data, driver telemetry, and consignment details.
            </p>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">1. Information We Collect</h3>
              <p>
                We collect your name, phone number, pickup/drop addresses, GSTIN, and OTP logs purely for dispatch coordination, billing, and statutory tax compliance.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">2. Location & Telemetry Tracking</h3>
              <p>
                Driver location is tracked while on active duty to calculate ETAs, provide route safety monitoring, and calculate accurate distance milestones.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-slate-900 mb-1">3. No Third-Party Selling</h3>
              <p>
                We never monetize or sell personal data to advertisers. Consignment documents are stored in secure cloud containers for accounting and tax audit purposes.
              </p>
            </div>
          </div>
        </div>
      )}

      {type === 'about' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              Our Mission
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 mt-2">
              About TruckSetu
            </h1>
            <p className="text-xs text-slate-500 mt-1">Bridging Shippers and Truckers Across India</p>
          </div>

          <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
            <p>
              Founded to modernize India's fragmented road freight ecosystem, TruckSetu provides a unified digital highway
              for goods transport. Whether you are an urban family moving into a new home or a multinational manufacturer
              shipping 100 tons of industrial coils, TruckSetu guarantees transparent pricing, verified drivers, and live
              visibility.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-2xl font-black text-amber-600 font-display">200+</p>
                <p className="text-xs text-slate-600 font-medium">Indian Cities Covered</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-2xl font-black text-slate-900 font-display">45,000+</p>
                <p className="text-xs text-slate-600 font-medium">Commercial Trucks</p>
              </div>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
                <p className="text-2xl font-black text-emerald-600 font-display">99.4%</p>
                <p className="text-xs text-slate-600 font-medium">On-Time Safe Delivery</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {type === 'contact' && (
        <div className="space-y-6">
          <div className="border-b border-slate-200 pb-4">
            <span className="text-xs uppercase font-bold text-amber-700 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200">
              24x7 Reachability
            </span>
            <h1 className="text-3xl font-black font-display text-slate-900 mt-2">
              Contact Us & Control Room
            </h1>
            <p className="text-xs text-slate-500 mt-1">Round-the-clock nationwide control room</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                <PhoneCall className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Toll-Free Helpline</h3>
              <p className="text-xs text-slate-600">1800 209 8899 (All India)</p>
              <p className="text-[11px] text-slate-400">Available 24 hours, 7 days a week</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <Mail className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">Email Support</h3>
              <p className="text-xs text-slate-600">support@trucksetu.com</p>
              <p className="text-[11px] text-slate-400">B2B freight: b2b@trucksetu.com</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-slate-200 space-y-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                <MapPin className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm">National Central Hub</h3>
              <p className="text-xs text-slate-600">Logistics Tower, Aerocity Gateway</p>
              <p className="text-[11px] text-slate-400">New Delhi, Delhi NCR 110037</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
