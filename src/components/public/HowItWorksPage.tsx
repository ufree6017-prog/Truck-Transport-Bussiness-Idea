import React from 'react';
import { 
  MapPin, 
  Truck, 
  KeyRound, 
  CheckCircle2, 
  ShieldCheck, 
  CreditCard, 
  Clock, 
  FileText,
  PhoneCall,
  ArrowRight
} from 'lucide-react';

interface HowItWorksPageProps {
  onStartBooking: () => void;
  onOpenDriverPortal: () => void;
}

export const HowItWorksPage: React.FC<HowItWorksPageProps> = ({
  onStartBooking,
  onOpenDriverPortal
}) => {
  const steps = [
    {
      num: '01',
      title: 'Enter Route & Select Vehicle',
      desc: 'Specify pickup and drop addresses anywhere in India. Pick from 3-Wheeler Tempo, Tata Ace, Pickup 8ft, Tata 407, or Eicher based on your cargo payload.',
      highlight: 'Transparent pricing: Tolls & taxes clearly disclosed upfront.',
      icon: MapPin,
      badge: 'Step 1'
    },
    {
      num: '02',
      title: 'Instant Driver Match & Pre-ETA',
      desc: 'Our algorithmic dispatcher assigns the nearest verified commercial driver within minutes. View pilot photo, rating, and real-time arrival countdown.',
      highlight: 'Avg. pickup ETA: 8-12 minutes in top 50 cities.',
      icon: Truck,
      badge: 'Step 2'
    },
    {
      num: '03',
      title: 'Secure OTP Handover & Loading',
      desc: 'Driver arrives at your doorstep. Hand over cargo and share your 4-digit pickup OTP to authorize mobilization. Add a driver helper if you need ground-floor lifting.',
      highlight: 'OTP ensures verified custody before departure.',
      icon: KeyRound,
      badge: 'Step 3'
    },
    {
      num: '04',
      title: 'Live Tracking & Digital POD',
      desc: 'Track vehicle progress in real-time. On delivery, receiver signs digital Proof of Delivery (POD). Pay online via UPI or pay driver cash on delivery, and download your GST invoice.',
      highlight: 'Instant SAC 9965 GTA Tax Invoice with Input Tax Credit.',
      icon: CheckCircle2,
      badge: 'Step 4'
    }
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <span className="text-xs uppercase font-bold tracking-widest bg-amber-100 text-amber-900 px-3 py-1 rounded-full border border-amber-200">
          Seamless Logistics Flow
        </span>
        <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
          How TruckSetu Moves Your Goods
        </h1>
        <p className="text-sm text-slate-600 leading-relaxed">
          Modeled on India's top logistics networks. Simple, reliable, and secure for retail customers,
          commercial traders, and industrial shippers.
        </p>
      </div>

      {/* 4 Steps Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {steps.map((s, idx) => {
          const Icon = s.icon;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs relative flex flex-col justify-between hover:shadow-md transition group"
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black font-mono text-amber-600 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {s.num}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-slate-100 group-hover:bg-amber-500 group-hover:text-slate-950 transition flex items-center justify-center text-slate-700">
                    <Icon className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-base font-bold font-display text-slate-900 mb-2">{s.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed mb-4">{s.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/70 p-2 rounded-lg border border-emerald-100">
                  ★ {s.highlight}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Key Guarantees Row */}
      <div className="bg-slate-900 text-white rounded-3xl p-8 shadow-xl border border-slate-800">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-display text-white">4-Tier Driver Verification</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Every driver holds an active Commercial Transport DL, valid vehicle RC book, comprehensive
              insurance, and Aadhaar background certification.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              <CreditCard className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-display text-white">Transparent Toll & Tax Rules</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              We never inflate estimates with speculative tolls. Fastag tolls and border taxes are
              itemized separately so you never overpay.
            </p>
          </div>

          <div className="space-y-2">
            <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center font-bold">
              <PhoneCall className="w-6 h-6" />
            </div>
            <h4 className="text-base font-bold font-display text-white">24x7 Control Room Support</h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Dial 1800 209 8899 anytime during pickup, transit, or delivery. Our logistics control room
              monitors every active trip on national highways.
            </p>
          </div>
        </div>

        {/* CTA Bar */}
        <div className="mt-8 pt-8 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h5 className="font-bold text-white text-sm">Ready to shift goods or dispatch cargo?</h5>
            <p className="text-xs text-slate-400">Instant intracity mini-trucks or contract fleet for your business.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenDriverPortal}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-bold rounded-xl transition border border-slate-700"
            >
              Attach Your Truck
            </button>
            <button
              onClick={onStartBooking}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-black rounded-xl transition flex items-center gap-1.5 shadow"
            >
              <span>Book a Mini-Truck</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
