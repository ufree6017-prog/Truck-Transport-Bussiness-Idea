import React from 'react';
import { Truck, ShieldCheck, PhoneCall, Mail, MapPin, Award, CheckCircle2 } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-slate-950 text-slate-300 pt-14 pb-8 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Trust Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 pb-12 border-b border-slate-800/80">
          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">100% Verified Drivers</p>
              <p className="text-xs text-slate-400">RC, DL, Aadhaar & Police verified</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Transparent Pricing</p>
              <p className="text-xs text-slate-400">Tolls & taxes itemized clearly</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MapPin className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">Pan-India Network</p>
              <p className="text-xs text-slate-400">Intracity mini & Intercity FTL</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <p className="text-sm font-bold text-white">24x7 Control Room</p>
              <p className="text-xs text-slate-400">Toll-free active trip assistance</p>
            </div>
          </div>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 py-12">
          {/* Col 1: Brand info */}
          <div className="md:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500 flex items-center justify-center text-slate-950 font-black">
                <Truck className="w-5 h-5 text-slate-950" />
              </div>
              <span className="font-display font-black text-2xl text-white tracking-tight">
                Truck<span className="text-amber-500">Setu</span>
              </span>
            </div>
            <p className="text-xs leading-relaxed text-slate-400 max-w-sm">
              India's tech-driven truck and logistics marketplace. Connecting retail customers,
              wholesalers, MSMEs, and industrial shippers with certified mini-trucks and long-haul
              heavy carriers across 200+ cities.
            </p>
            <div className="space-y-1 text-xs text-slate-400">
              <p className="flex items-center gap-2">
                <PhoneCall className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-slate-300 font-semibold">1800 209 8899</span> (Toll-Free 24x7)
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>support@trucksetu.com</span>
              </p>
              <p className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                <span>GST Registered GTA • SAC Code: 996511</span>
              </p>
            </div>
          </div>

          {/* Col 2: Customers & Retail */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Customer Services</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-amber-400 transition text-left">
                  Book Intracity Mini-Truck
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vehicles-pricing')} className="hover:text-amber-400 transition text-left">
                  Vehicle Types & Fare Estimator
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('live-tracking')} className="hover:text-amber-400 transition text-left">
                  Live Consignment Tracking
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-amber-400 transition text-left">
                  How Booking & OTP Works
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('cancellation-policy')} className="hover:text-amber-400 transition text-left">
                  Cancellation & Refund Policy
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Business & Fleet */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Enterprise & Shippers</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('business-bulk')} className="hover:text-amber-400 transition text-left">
                  Business & Bulk Freight Enquiry
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business-bulk')} className="hover:text-amber-400 transition text-left">
                  Full Truckload (FTL) Contracts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('business-bulk')} className="hover:text-amber-400 transition text-left">
                  E-Way Bill & GST Compliance
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('vehicles-pricing')} className="hover:text-amber-400 transition text-left">
                  Containers (20/32ft) & Trailers
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-amber-400 transition text-left">
                  Logistics Admin Portal
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Driver Partners & Legal */}
          <div className="space-y-3">
            <p className="text-xs font-bold text-white uppercase tracking-wider">Driver Partners</p>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => onNavigate('driver-portal')} className="hover:text-amber-400 transition text-left">
                  Driver Portal & Onboarding
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('driver-portal')} className="hover:text-amber-400 transition text-left">
                  Return Trip / Backhaul Board
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('driver-portal')} className="hover:text-amber-400 transition text-left">
                  Driver Wallet & Instant Payouts
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('terms-conditions')} className="hover:text-amber-400 transition text-left">
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('privacy-policy')} className="hover:text-amber-400 transition text-left">
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>

        {/* Pan-India Cities Strip */}
        <div className="py-4 border-t border-slate-900 text-[11px] text-slate-500">
          <span className="text-slate-400 font-semibold mr-2">Operational Hubs:</span>
          Mumbai • Delhi NCR • Bengaluru • Hyderabad • Pune • Chennai • Ahmedabad • Kolkata • Jaipur • Surat • Lucknow • Chandigarh • Indore • Nagpur • Vadodara • Coimbatore
        </div>

        {/* Bottom copyright & disclaimer */}
        <div className="pt-6 border-t border-slate-900 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} TruckSetu Logistics Marketplace India. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <button onClick={() => onNavigate('terms-conditions')} className="hover:underline">Terms</button>
            <span>•</span>
            <button onClick={() => onNavigate('privacy-policy')} className="hover:underline">Privacy</button>
            <span>•</span>
            <button onClick={() => onNavigate('cancellation-policy')} className="hover:underline">Cancellation</button>
            <span>•</span>
            <button onClick={() => onNavigate('contact-support')} className="hover:underline">24x7 Help</button>
          </div>
        </div>
      </div>
    </footer>
  );
};
