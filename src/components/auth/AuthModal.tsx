import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { 
  X, 
  Lock, 
  Mail, 
  Phone, 
  User, 
  Truck, 
  ShieldAlert, 
  CheckCircle2,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Smartphone
} from 'lucide-react';
import { mockVehicleCategories, mockCredentials } from '../../data/mockData';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultRole?: UserRole;
  initialMode?: 'login' | 'signup';
  onSuccessRedirect?: (destRole: UserRole) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  defaultRole = 'customer',
  initialMode = 'login',
  onSuccessRedirect
}) => {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [selectedRole, setSelectedRole] = useState<UserRole>(defaultRole);
  
  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Delhi NCR');
  const [showPassword, setShowPassword] = useState(false);
  
  // Driver extra fields
  const [vehicleCategory, setVehicleCategory] = useState(mockVehicleCategories[1].name); // Tata Ace default
  const [vehicleNumber, setVehicleNumber] = useState('');
  const [dlNumber, setDlNumber] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (mode === 'login') {
        if (!email) {
          setError('Please enter your username, mobile number, or email');
          setLoading(false);
          return;
        }
        await login(email, password, selectedRole);
        setSuccessMsg('Signed in successfully! Redirecting...');
        setTimeout(() => {
          onClose();
          if (onSuccessRedirect) {
            onSuccessRedirect(selectedRole);
          }
        }, 600);
      } else {
        if (!name || !email || !phone) {
          setError('Please complete all required fields');
          setLoading(false);
          return;
        }

        await signup(name, email, phone, selectedRole, {
          city,
          vehicleCategory,
          vehicleNumber: vehicleNumber || 'DL 1L TR 4410',
          dlNumber: dlNumber || 'DL-2026-COMM-9812'
        });
        setSuccessMsg(
          selectedRole === 'driver' 
            ? 'Driver application submitted! Pending verification.' 
            : 'Account registered successfully!'
        );
        setTimeout(() => {
          onClose();
          if (onSuccessRedirect) {
            onSuccessRedirect(selectedRole);
          }
        }, 800);
      }
    } catch (err: any) {
      setError(err.message || 'Authentication failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleFillDemo = (role: UserRole) => {
    setSelectedRole(role);
    if (role === 'customer') {
      const c = mockCredentials.customer;
      setEmail(c.username);
      setPassword(c.password);
      setName(c.name);
      setPhone(c.mobileNo);
    } else if (role === 'driver') {
      const d = mockCredentials.driverApproved;
      setEmail(d.username);
      setPassword(d.password);
      setName(d.name);
      setPhone(d.mobileNo);
      setVehicleCategory('Tata Ace / Chota Hathi');
      setVehicleNumber('MH 02 CW 4821');
    } else if (role === 'admin') {
      const a = mockCredentials.admin;
      setEmail(a.username);
      setPassword(a.password);
      setName(a.name);
      setPhone(a.mobileNo);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div 
        id="auth-modal-dialog"
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-slate-200 animate-in fade-in zoom-in-95 duration-200"
      >
        {/* Header */}
        <div className="bg-slate-900 p-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500 flex items-center justify-center text-slate-950 font-black">
              TS
            </div>
            <span className="font-display font-bold text-lg">TruckSetu Auth</span>
          </div>
          <h2 className="text-xl font-bold font-display">
            {mode === 'login' ? 'Sign In to Your Account' : 'Create an Account'}
          </h2>
          <p className="text-xs text-slate-300 mt-1">
            Access customer bookings, driver earnings & loads, or admin dashboard.
          </p>
        </div>

        {/* Form Body */}
        <div className="p-6">
          {/* Quick Demo Pre-fill helper */}
          <div className="mb-5 p-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs">
            <div className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1.5">
              <span>Quick Test Fill:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => handleFillDemo('customer')}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:border-amber-500 hover:text-amber-700 font-medium"
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('driver')}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:border-emerald-500 hover:text-emerald-700 font-medium"
              >
                Driver (Ramesh)
              </button>
              <button
                type="button"
                onClick={() => handleFillDemo('admin')}
                className="px-2 py-1 bg-white border border-slate-300 rounded text-slate-700 hover:border-indigo-500 hover:text-indigo-700 font-medium"
              >
                Admin (Rajesh)
              </button>
            </div>
          </div>

          {/* Role selector tabs */}
          <div className="mb-4">
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Select Your Role
            </label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setSelectedRole('customer')}
                className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition ${
                  selectedRole === 'customer'
                    ? 'bg-amber-50 border-amber-500 text-amber-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Customer
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('driver')}
                className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition ${
                  selectedRole === 'driver'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Truck Driver
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`py-2 px-2 text-center text-xs font-semibold rounded-lg border transition ${
                  selectedRole === 'admin'
                    ? 'bg-indigo-50 border-indigo-500 text-indigo-900 shadow-sm'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Admin
              </button>
            </div>
          </div>

          {/* Dedicated Login Credentials Details Card for Driver and Admin */}
          {mode === 'login' && selectedRole === 'driver' && (
            <div className="mb-4 p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                  <Truck className="w-4 h-4 text-emerald-600" />
                  <span>Driver Login Details</span>
                </div>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded border border-emerald-300">
                  Tata Ace & Fleet
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-emerald-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">User Name:</span>
                  <span className="font-bold text-slate-800 select-all">{mockCredentials.driverApproved.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">Mobile No.:</span>
                  <span className="font-bold text-slate-800 select-all">{mockCredentials.driverApproved.mobileNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">Password:</span>
                  <span className="font-bold text-emerald-700 select-all">{mockCredentials.driverApproved.password}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('driver')}
                  className="flex-1 py-1 px-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Auto-Fill Driver Details</span>
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && selectedRole === 'admin' && (
            <div className="mb-4 p-3.5 bg-indigo-50 border border-indigo-200 rounded-xl text-xs space-y-2.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 font-bold text-indigo-900">
                  <ShieldCheck className="w-4 h-4 text-indigo-600" />
                  <span>Admin Section Login Details</span>
                </div>
                <span className="text-[10px] font-bold bg-indigo-100 text-indigo-800 px-2 py-0.5 rounded border border-indigo-300">
                  Operations Desk (L4)
                </span>
              </div>
              <div className="bg-white rounded-lg p-2.5 border border-indigo-100 space-y-1.5 font-mono text-[11px]">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">User Name:</span>
                  <span className="font-bold text-slate-800 select-all">{mockCredentials.admin.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">Mobile No.:</span>
                  <span className="font-bold text-slate-800 select-all">{mockCredentials.admin.mobileNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-500">Password:</span>
                  <span className="font-bold text-indigo-700 select-all">{mockCredentials.admin.password}</span>
                </div>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => handleFillDemo('admin')}
                  className="flex-1 py-1 px-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg text-[11px] flex items-center justify-center gap-1 transition shadow-xs"
                >
                  <KeyRound className="w-3 h-3" />
                  <span>Auto-Fill Admin Details</span>
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-xs text-red-700 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 bg-emerald-50 border border-emerald-200 rounded-lg text-xs text-emerald-700 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 flex-shrink-0 text-emerald-500" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Full Name / Company Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      required
                      placeholder="e.g. Ramesh Kumar"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Mobile Number (SMS / OTP) *
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="tel"
                      required
                      placeholder="+91 98200 00000"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                {mode === 'login' ? 'User Name, Mobile No. or Email *' : 'Email Address *'}
              </label>
              <div className="relative">
                {mode === 'login' ? (
                  <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                ) : (
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                )}
                <input
                  type={mode === 'login' ? 'text' : 'email'}
                  required
                  placeholder={
                    selectedRole === 'driver' 
                      ? 'e.g. ramesh.kumar@trucksetu.com or +91 98204 11234'
                      : selectedRole === 'admin'
                      ? 'e.g. admin@trucksetu.com or +91 98200 99881'
                      : 'e.g. priya.sharma@example.com or +91 98210 44556'
                  }
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password *
                </label>
                {mode === 'login' && (
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                  >
                    {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                    <span>{showPassword ? 'Hide' : 'Show'}</span>
                  </button>
                )}
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            {/* Extra Driver Fields on Signup */}
            {mode === 'signup' && selectedRole === 'driver' && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Driver Vehicle Info</span>
                </div>
                <div>
                  <label className="block text-[11px] text-slate-600 mb-1">Vehicle Category</label>
                  <select
                    value={vehicleCategory}
                    onChange={(e) => setVehicleCategory(e.target.value)}
                    className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                  >
                    {mockVehicleCategories.map((v) => (
                      <option key={v.id} value={v.name}>{v.name} ({v.capacityDisplay})</option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Vehicle No. (RC)</label>
                    <input
                      type="text"
                      placeholder="MH 02 XX 1234"
                      value={vehicleNumber}
                      onChange={(e) => setVehicleNumber(e.target.value)}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-slate-600 mb-1">Commercial DL No.</label>
                    <input
                      type="text"
                      placeholder="DL-2024..."
                      value={dlNumber}
                      onChange={(e) => setDlNumber(e.target.value)}
                      className="w-full py-1.5 px-2 text-xs border border-slate-300 rounded-lg bg-white"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow transition duration-150 disabled:opacity-50 mt-2"
            >
              {loading ? 'Processing...' : mode === 'login' ? 'Sign In' : 'Complete Registration'}
            </button>
          </form>

          {/* Toggle login vs signup */}
          <div className="mt-4 pt-3 border-t border-slate-100 text-center text-xs text-slate-600">
            {mode === 'login' ? (
              <span>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setMode('signup')}
                  className="font-bold text-amber-600 hover:text-amber-700 underline ml-1"
                >
                  Sign Up Here
                </button>
              </span>
            ) : (
              <span>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => setMode('login')}
                  className="font-bold text-amber-600 hover:text-amber-700 underline ml-1"
                >
                  Sign In
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
