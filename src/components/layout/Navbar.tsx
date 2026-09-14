import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { 
  Truck, 
  PhoneCall, 
  ShieldCheck, 
  Menu, 
  X, 
  User, 
  LogOut, 
  Building2, 
  HelpCircle, 
  Clock, 
  Briefcase,
  MapPin
} from 'lucide-react';

interface NavbarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onOpenAuth: () => void;
  hasActiveBooking?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentView,
  setCurrentView,
  onOpenAuth,
  hasActiveBooking = false
}) => {
  const { user, isAuthenticated, logout, role, driverData } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);

  const navigate = (view: string) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      {/* Top micro-strip for Pan-India trust & 24x7 support */}
      <div className="bg-slate-900 text-slate-300 text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] sm:text-xs">
            <span className="flex items-center gap-1.5 text-amber-400 font-semibold">
              <ShieldCheck className="w-3.5 h-3.5" />
              Pan-India Verified Fleet Network
            </span>
            <span className="hidden md:inline text-slate-400">|</span>
            <span className="hidden md:flex items-center gap-1 text-slate-300">
              <MapPin className="w-3 h-3 text-slate-400" />
              Intracity Mini-Trucks & Intercity Heavy Freight
            </span>
          </div>
          <div className="flex items-center gap-3">
            <a 
              href="tel:18002098899" 
              className="flex items-center gap-1.5 text-slate-200 hover:text-amber-400 transition font-medium"
            >
              <PhoneCall className="w-3 h-3 text-amber-400" />
              <span className="hidden sm:inline">24x7 Toll-Free:</span>
              <span className="font-bold tracking-wider">1800 209 8899</span>
            </a>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => navigate('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 to-amber-500 flex items-center justify-center text-slate-950 font-black shadow-md shadow-amber-500/20 group-hover:scale-105 transition">
              <Truck className="w-6 h-6 text-slate-950" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-display font-extrabold text-2xl tracking-tight text-slate-900">
                  Truck<span className="text-amber-600">Setu</span>
                </span>
                <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-100 text-amber-800 px-1.5 py-0.5 rounded">
                  India
                </span>
              </div>
              <p className="text-[10px] text-slate-500 font-medium -mt-1 hidden sm:block">
                Goods Transport Marketplace
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            <button
              onClick={() => navigate('home')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'home'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Book Truck
            </button>

            <button
              onClick={() => navigate('vehicles-pricing')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition ${
                currentView === 'vehicles-pricing'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              Fleet & Rates
            </button>

            <button
              onClick={() => navigate('business-bulk')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 ${
                currentView === 'business-bulk'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Building2 className="w-4 h-4 text-amber-600" />
              Business / Bulk
            </button>

            <button
              onClick={() => navigate('how-it-works')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1 ${
                currentView === 'how-it-works'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <HelpCircle className="w-4 h-4 text-slate-400" />
              How It Works
            </button>

            <button
              onClick={() => navigate('live-tracking')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition relative flex items-center gap-1.5 ${
                currentView === 'live-tracking'
                  ? 'text-amber-700 bg-amber-50'
                  : 'text-slate-700 hover:text-slate-950 hover:bg-slate-100'
              }`}
            >
              <Clock className="w-4 h-4 text-slate-500" />
              <span>Track Trip</span>
              {hasActiveBooking && (
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
              )}
            </button>

            {/* Portal link for driver */}
            <button
              onClick={() => navigate('driver-portal')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 border ${
                currentView === 'driver-portal'
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-900'
                  : 'border-emerald-200 text-emerald-800 hover:bg-emerald-50/70'
              }`}
            >
              <Truck className="w-4 h-4 text-emerald-600" />
              <span>Driver Portal</span>
            </button>

            {/* Admin link */}
            <button
              onClick={() => navigate('admin-dashboard')}
              className={`px-3 py-2 rounded-lg text-sm font-semibold transition flex items-center gap-1.5 border ${
                currentView === 'admin-dashboard'
                  ? 'border-indigo-500 bg-indigo-50 text-indigo-900'
                  : 'border-indigo-200 text-indigo-800 hover:bg-indigo-50/70'
              }`}
            >
              <Briefcase className="w-4 h-4 text-indigo-600" />
              <span>Admin</span>
            </button>
          </nav>

          {/* Right Action: Auth / User info */}
          <div className="hidden lg:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center gap-2.5 p-1.5 pr-3 rounded-xl border border-slate-200 hover:bg-slate-50 transition"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-lg object-cover border border-slate-200"
                  />
                  <div className="text-left">
                    <p className="text-xs font-bold text-slate-900 leading-tight">
                      {user.name.split(' ')[0]}
                    </p>
                    <p className="text-[10px] text-slate-500 capitalize leading-tight">
                      {role} {role === 'driver' && `(${driverData?.verificationStatus})`}
                    </p>
                  </div>
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 animate-in fade-in">
                    <div className="px-4 py-2 border-b border-slate-100">
                      <p className="text-xs font-bold text-slate-900">{user.name}</p>
                      <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      <span className="inline-block mt-1 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                        {role} account
                      </span>
                    </div>

                    {role === 'customer' && (
                      <button
                        onClick={() => navigate('live-tracking')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        My Active Bookings
                      </button>
                    )}

                    {role === 'driver' && (
                      <button
                        onClick={() => navigate('driver-portal')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <Truck className="w-3.5 h-3.5 text-slate-400" />
                        Driver Dashboard & Wallet
                      </button>
                    )}

                    {role === 'admin' && (
                      <button
                        onClick={() => navigate('admin-dashboard')}
                        className="w-full text-left px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                        Admin Control Panel
                      </button>
                    )}

                    <div className="border-t border-slate-100 my-1"></div>
                    <button
                      onClick={() => {
                        logout();
                        setProfileDropdownOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition shadow-sm"
              >
                <User className="w-3.5 h-3.5" />
                Sign In / Register
              </button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-700 hover:bg-slate-100"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-6 space-y-2 shadow-lg">
          <button
            onClick={() => navigate('home')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'home' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
            }`}
          >
            Book Truck
          </button>
          <button
            onClick={() => navigate('vehicles-pricing')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'vehicles-pricing' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
            }`}
          >
            Fleet & Rates
          </button>
          <button
            onClick={() => navigate('business-bulk')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'business-bulk' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
            }`}
          >
            Business / Bulk Freight
          </button>
          <button
            onClick={() => navigate('live-tracking')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'live-tracking' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
            }`}
          >
            Live Tracking & OTP
          </button>
          <button
            onClick={() => navigate('how-it-works')}
            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold ${
              currentView === 'how-it-works' ? 'bg-amber-50 text-amber-900' : 'text-slate-800'
            }`}
          >
            How It Works
          </button>
          <button
            onClick={() => navigate('driver-portal')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-emerald-50 text-emerald-900 flex items-center justify-between"
          >
            <span>Driver Portal & Wallet</span>
            <Truck className="w-4 h-4 text-emerald-600" />
          </button>
          <button
            onClick={() => navigate('admin-dashboard')}
            className="w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold bg-indigo-50 text-indigo-900 flex items-center justify-between"
          >
            <span>Admin Control Panel</span>
            <ShieldCheck className="w-4 h-4 text-indigo-600" />
          </button>

          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            {isAuthenticated ? (
              <div className="flex items-center justify-between p-2 bg-slate-50 rounded-lg">
                <div>
                  <p className="text-xs font-bold text-slate-800">{user?.name}</p>
                  <p className="text-[11px] text-slate-500 capitalize">{role} Account</p>
                </div>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-xs text-red-600 font-semibold hover:bg-red-50 rounded"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  onOpenAuth();
                  setMobileMenuOpen(false);
                }}
                className="w-full py-2.5 bg-slate-900 text-white text-xs font-bold rounded-xl text-center"
              >
                Sign In / Register
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};
