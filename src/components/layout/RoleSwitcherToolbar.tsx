import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { ShieldCheck, Truck, User, ArrowRightLeft, Sparkles } from 'lucide-react';

interface RoleSwitcherToolbarProps {
  currentView?: string;
  setCurrentView?: (view: string) => void;
  onNavigate?: (view: string) => void;
}

export const RoleSwitcherToolbar: React.FC<RoleSwitcherToolbarProps> = ({ 
  currentView, 
  setCurrentView,
  onNavigate 
}) => {
  const { user, role, switchRolePersona, driverData } = useAuth();

  const navigate = (view: string) => {
    if (typeof onNavigate === 'function') {
      onNavigate(view);
    } else if (typeof setCurrentView === 'function') {
      setCurrentView(view);
    }
  };

  return (
    <aside 
      id="role-switcher-toolbar"
      aria-label="Role Switcher & Simulation"
      className="bg-slate-900 text-slate-200 text-xs border-b border-slate-800 px-3 py-2 sm:px-6 relative z-50 shadow-md"
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-400 font-semibold border border-emerald-800/80">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Role-Based Demo
          </span>
          <span className="text-slate-400 hidden sm:inline">Active Role:</span>
          <span className="font-bold text-white uppercase tracking-wider bg-slate-800 px-2 py-0.5 rounded border border-slate-700">
            {role || 'Guest'}
          </span>
          <span className="text-slate-300 font-medium">
            ({user?.name} {role === 'driver' ? `• ${driverData?.verificationStatus === 'approved' ? 'Verified Driver' : 'Pending Review'}` : ''})
          </span>
        </div>

        <div className="flex items-center gap-1.5 flex-wrap justify-center">
          <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
            <ArrowRightLeft className="w-3 h-3 text-amber-400" /> Switch Role:
          </span>

          <button
            id="role-switch-customer"
            onClick={() => {
              switchRolePersona('customer');
              navigate('home');
            }}
            className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
              role === 'customer'
                ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <User className="w-3 h-3" />
            Customer
          </button>

          <button
            id="role-switch-driver-approved"
            onClick={() => {
              switchRolePersona('driver', 'approved');
              navigate('driver-portal');
            }}
            className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
              role === 'driver' && driverData?.verificationStatus === 'approved'
                ? 'bg-emerald-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Truck className="w-3 h-3" />
            Driver (Approved)
          </button>

          <button
            id="role-switch-driver-pending"
            onClick={() => {
              switchRolePersona('driver', 'pending');
              navigate('driver-portal');
            }}
            className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
              role === 'driver' && driverData?.verificationStatus === 'pending'
                ? 'bg-amber-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-300" />
            Driver (Pending)
          </button>

          <button
            id="role-switch-admin"
            onClick={() => {
              switchRolePersona('admin');
              navigate('admin-dashboard');
            }}
            className={`px-2.5 py-1 rounded transition-colors font-medium flex items-center gap-1 ${
              role === 'admin'
                ? 'bg-indigo-600 text-white font-bold shadow-sm'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-300'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            Admin Portal
          </button>
        </div>
      </div>
    </aside>
  );
};
