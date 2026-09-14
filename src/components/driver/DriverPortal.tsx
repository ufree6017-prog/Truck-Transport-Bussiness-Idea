import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DriverProfile, ReturnTripLoad, WalletTransaction, DriverDocument } from '../../types';
import { 
  mockNearbyLoadRequests, 
  mockReturnLoads, 
  mockWalletTransactions, 
  mockDrivers,
  mockCredentials
} from '../../data/mockData';
import { DocumentUploadSection } from './DocumentUploadSection';
import { 
  Truck, 
  Wallet, 
  FileCheck, 
  ArrowLeftRight, 
  Clock, 
  DollarSign, 
  ShieldAlert, 
  CheckCircle2, 
  XCircle, 
  Upload, 
  AlertTriangle, 
  KeyRound, 
  PlusCircle, 
  PhoneCall, 
  MapPin, 
  Sparkles,
  UserCheck,
  RotateCcw,
  Calendar,
  Lock,
  Eye,
  EyeOff,
  Smartphone,
  ShieldCheck,
  User
} from 'lucide-react';

interface DriverPortalProps {
  onOpenAuth: () => void;
}

export const DriverPortal: React.FC<DriverPortalProps> = ({ onOpenAuth }) => {
  const { user, role, driverData, updateDriverProfile, switchRolePersona, login } = useAuth();

  // Active driver sub-tab
  const [activeTab, setActiveTab] = useState<
    'requests' | 'wallet' | 'return_trips' | 'pod_upload' | 'earnings' | 'documents'
  >('requests');

  // Driver Login form states
  const [driverIdentifier, setDriverIdentifier] = useState(mockCredentials.driverApproved.username);
  const [driverPassword, setDriverPassword] = useState(mockCredentials.driverApproved.password);
  const [showDriverPassword, setShowDriverPassword] = useState(false);
  const [driverLoginLoading, setDriverLoginLoading] = useState(false);
  const [driverLoginError, setDriverLoginError] = useState('');
  const [showActiveCredentialsBanner, setShowActiveCredentialsBanner] = useState(true);
  const [showActivePass, setShowActivePass] = useState(false);

  // Local state for interactive live requests
  const [incomingRequests, setIncomingRequests] = useState(mockNearbyLoadRequests);
  const [acceptedRequestId, setAcceptedRequestId] = useState<string | null>(null);

  // Return loads local state
  const [returnLoads, setReturnLoads] = useState<ReturnTripLoad[]>(mockReturnLoads);

  // Wallet local state
  const [walletBalance, setWalletBalance] = useState<number>(driverData?.walletBalance || 3450);
  const [transactions, setTransactions] = useState<WalletTransaction[]>(mockWalletTransactions);
  const [showTopUpModal, setShowTopUpModal] = useState(false);
  const [topUpAmount, setTopUpAmount] = useState('1000');

  // POD upload state
  const [podTripNumber, setPodTripNumber] = useState('TS-2026-9480');
  const [podFileUploaded, setPodFileUploaded] = useState(false);
  const [podReceiverName, setPodReceiverName] = useState('Suresh Gowda (Warehouse Supervisor)');
  const [podSubmitted, setPodSubmitted] = useState(false);

  // Document photo upload section toggle in approved view
  const [showUploadSection, setShowUploadSection] = useState(false);

  // Ensure user is driver or show role switcher helper
  const isDriver = role === 'driver';
  const isApproved = driverData?.verificationStatus === 'approved';

  const handleDriverDirectLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setDriverLoginLoading(true);
    setDriverLoginError('');
    try {
      if (!driverIdentifier) {
        setDriverLoginError('Please enter your Driver Username or Mobile Number');
        setDriverLoginLoading(false);
        return;
      }
      await login(driverIdentifier, driverPassword, 'driver');
    } catch (err: any) {
      setDriverLoginError(err.message || 'Driver login failed');
    } finally {
      setDriverLoginLoading(false);
    }
  };

  const handleQuickDriverFill = (type: 'approved' | 'pending') => {
    if (type === 'approved') {
      const d = mockCredentials.driverApproved;
      setDriverIdentifier(d.username);
      setDriverPassword(d.password);
      switchRolePersona('driver', 'approved');
    } else {
      const d = mockCredentials.driverPending;
      setDriverIdentifier(d.username);
      setDriverPassword(d.password);
      switchRolePersona('driver', 'pending');
    }
  };

  const toggleVerificationStatusDemo = () => {
    if (driverData?.verificationStatus === 'approved') {
      switchRolePersona('driver', 'pending');
    } else {
      switchRolePersona('driver', 'approved');
    }
  };

  const handleDocumentsSubmitted = (updatedDocs: DriverDocument[]) => {
    if (driverData) {
      updateDriverProfile({
        documents: updatedDocs,
        verificationStatus: 'pending'
      });
      // Synchronize with mockDrivers array so Admin view immediately sees updated documents
      const idx = mockDrivers.findIndex(d => d.id === driverData.id);
      if (idx !== -1) {
        mockDrivers[idx].documents = updatedDocs;
        mockDrivers[idx].verificationStatus = 'pending';
      }
    }
  };

  const handleAcceptRequest = (reqId: string) => {
    setAcceptedRequestId(reqId);
    setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
    // simulate earning credit in wallet
    setTimeout(() => {
      alert(`Trip Accepted! Head to pickup location. Share OTP with customer.`);
    }, 200);
  };

  const handleDeclineRequest = (reqId: string) => {
    setIncomingRequests(prev => prev.filter(r => r.id !== reqId));
  };

  const handleClaimReturnLoad = (loadId: string) => {
    setReturnLoads(prev => prev.map(l => l.id === loadId ? { ...l, status: 'claimed' } : l));
    alert(`Return Load Claimed successfully! Consignor dispatch details have been sent to your registered mobile.`);
  };

  const handleTopUpWallet = (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(topUpAmount) || 500;
    const newBal = walletBalance + amt;
    setWalletBalance(newBal);

    const newTx: WalletTransaction = {
      id: `wt-${Date.now()}`,
      driverId: driverData?.id || 'drv-101',
      type: 'wallet_recharge',
      amount: amt,
      balanceAfter: newBal,
      description: `Instant UPI Wallet Recharge (Ref: ${Math.floor(10000000 + Math.random() * 90000000)})`,
      timestamp: 'Just now',
      isCredit: true
    };

    setTransactions([newTx, ...transactions]);
    if (driverData) {
      updateDriverProfile({ walletBalance: newBal });
    }
    setShowTopUpModal(false);
  };

  const handlePodSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPodSubmitted(true);
  };

  if (!isDriver) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Title Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
            <Truck className="w-3.5 h-3.5" />
            <span>Driver & Fleet Partner Portal</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
            Driver Partner Sign In
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Attach your Tata Ace, Bolero Pickup, Tata 407, or Eicher truck to TruckSetu and receive direct trip dispatches, instant UPI wallet payouts, and return backhauls.
          </p>
        </div>

        {/* DRIVER LOGIN CREDENTIALS SECTION (User requirement) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Driver Section Login Credentials</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Use either the User Name or Mobile Number along with the Password to log in:
              </p>
            </div>
            <span className="text-[11px] bg-slate-800 text-slate-300 px-3 py-1 rounded-full border border-slate-700 self-start sm:self-auto font-medium">
              Demo Test Environment
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Approved Driver Card */}
            <div className="bg-slate-800/80 border border-emerald-500/30 rounded-2xl p-5 space-y-3 hover:border-emerald-500 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Approved Driver</h3>
                    <p className="text-[11px] text-emerald-400">Tata Ace Pilot (Active)</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/40">
                  Verified
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">User Name:</span>
                  <span className="text-slate-200 font-bold select-all">{mockCredentials.driverApproved.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">Mobile No.:</span>
                  <span className="text-emerald-400 font-bold select-all">{mockCredentials.driverApproved.mobileNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">Password:</span>
                  <span className="text-amber-400 font-bold select-all">{mockCredentials.driverApproved.password}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDriverFill('approved')}
                className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Fill & Login as Approved Driver (Ramesh)</span>
              </button>
            </div>

            {/* Pending Driver Card */}
            <div className="bg-slate-800/80 border border-amber-500/30 rounded-2xl p-5 space-y-3 hover:border-amber-500 transition">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white">Pending Driver</h3>
                    <p className="text-[11px] text-amber-400">Eicher 14ft (Under Review)</p>
                  </div>
                </div>
                <span className="text-[10px] uppercase font-black bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40">
                  Audit State
                </span>
              </div>

              <div className="bg-slate-950/60 rounded-xl p-3 border border-slate-800 space-y-2 text-xs font-mono">
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">User Name:</span>
                  <span className="text-slate-200 font-bold select-all">{mockCredentials.driverPending.username}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">Mobile No.:</span>
                  <span className="text-amber-400 font-bold select-all">{mockCredentials.driverPending.mobileNo}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-sans text-slate-400 text-[11px]">Password:</span>
                  <span className="text-amber-400 font-bold select-all">{mockCredentials.driverPending.password}</span>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleQuickDriverFill('pending')}
                className="w-full py-2 px-3 bg-amber-600 hover:bg-amber-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-1.5 transition shadow-sm"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Fill & Login as Pending Driver (Vikram)</span>
              </button>
            </div>
          </div>
        </div>

        {/* DIRECT LOGIN FORM */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-lg mx-auto">
          <h2 className="text-lg font-bold font-display text-slate-900 mb-1 flex items-center gap-2">
            <Truck className="w-5 h-5 text-emerald-600" />
            <span>Driver Section Authentication</span>
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Enter your Driver User Name, Email, or 10-digit Mobile Number along with Password to access loads.
          </p>

          {driverLoginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{driverLoginError}</span>
            </div>
          )}

          <form onSubmit={handleDriverDirectLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Driver User Name or Mobile No. *
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98204 11234 or ramesh.kumar@trucksetu.com"
                  value={driverIdentifier}
                  onChange={(e) => setDriverIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Driver Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowDriverPassword(!showDriverPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  {showDriverPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showDriverPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showDriverPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter driver password"
                  value={driverPassword}
                  onChange={(e) => setDriverPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={driverLoginLoading}
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <Truck className="w-4 h-4" />
              <span>{driverLoginLoading ? 'Authenticating Driver...' : 'Sign In as Driver'}</span>
            </button>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <span className="text-slate-500">Do not have a driver partner account?</span>
            <button
              type="button"
              onClick={onOpenAuth}
              className="font-bold text-emerald-700 hover:text-emerald-800 hover:underline"
            >
              Attach Your Truck Now →
            </button>
          </div>
        </div>
      </div>
    );
  }

  // PENDING VERIFICATION VIEW (Prompt requirement)
  if (!isApproved) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-6">
        {/* State Switcher for Demo Purposes */}
        <div className="bg-amber-50 border border-amber-300 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xs">
          <div className="flex items-center gap-2.5">
            <Sparkles className="w-5 h-5 text-amber-600 flex-shrink-0" />
            <div className="text-xs text-amber-950">
              <strong>Evaluation State: Pending Driver Application</strong>
              <p className="text-[11px] text-amber-800">You are viewing the onboarding state prior to admin clearance.</p>
            </div>
          </div>
          <button
            onClick={toggleVerificationStatusDemo}
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 flex-shrink-0 shadow-sm"
          >
            <span>Preview Approved Dashboard →</span>
          </button>
        </div>

        {/* Pending Screen Content */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden">
          <div className="bg-slate-900 text-white p-6 sm:p-8">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider bg-amber-500 text-slate-950 px-2.5 py-0.5 rounded">
                Application Under Verification
              </span>
              <span className="text-xs text-slate-400">Driver ID: {driverData?.id}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black font-display text-white">
              Welcome, {driverData?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              Vehicle Registered: <strong>{driverData?.vehicleCategory} ({driverData?.vehicleNumber})</strong>
            </p>

            {/* Active Driver Credentials Box (User Requirement) */}
            <div className="mt-4 p-3.5 bg-slate-800/90 border border-slate-700 rounded-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center flex-shrink-0">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <span className="font-bold text-amber-300">Active Driver Login Credentials:</span>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-slate-300 mt-0.5">
                    <span>User Name: <strong className="text-white font-mono">{driverData?.email || mockCredentials.driverPending.username}</strong></span>
                    <span>Mobile No: <strong className="text-amber-400 font-mono">{driverData?.phone || mockCredentials.driverPending.mobileNo}</strong></span>
                    <span className="flex items-center gap-1.5">
                      Password: <strong className="text-amber-300 font-mono">{showActivePass ? mockCredentials.driverPending.password : '••••••••'}</strong>
                      <button
                        type="button"
                        onClick={() => setShowActivePass(!showActivePass)}
                        className="text-slate-400 hover:text-white"
                        title={showActivePass ? 'Hide password' : 'Show password'}
                      >
                        {showActivePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </span>
                  </div>
                </div>
              </div>
              <span className="text-[10px] font-bold bg-amber-500/20 text-amber-300 px-2.5 py-1 rounded-lg border border-amber-500/30 whitespace-nowrap">
                Audit Status: In Review
              </span>
            </div>
          </div>

          <div className="p-6 sm:p-8 space-y-6">
            {/* Status Steps Tracker */}
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl space-y-4">
              <h2 className="text-sm font-bold font-display text-slate-900">4-Stage Verification Workflow</h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 text-xs">
                <div className="p-3 bg-white border border-emerald-300 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-emerald-700 font-bold mb-1">
                    <CheckCircle2 className="w-4 h-4" /> 1. Registration
                  </div>
                  <p className="text-[11px] text-slate-500">Personal & vehicle details recorded.</p>
                </div>

                <div className="p-3 bg-white border border-amber-300 rounded-xl shadow-2xs">
                  <div className="flex items-center gap-1.5 text-amber-700 font-bold mb-1">
                    <Clock className="w-4 h-4 animate-spin" /> 2. Docs Audit
                  </div>
                  <p className="text-[11px] text-slate-500">DL, RC, and Insurance under RTO check.</p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <span>3. Background</span>
                  </div>
                  <p className="text-[11px]">Police & commercial fitness verification.</p>
                </div>

                <div className="p-3 bg-white border border-slate-200 rounded-xl text-slate-400">
                  <div className="flex items-center gap-1.5 font-bold mb-1">
                    <span>4. Activation</span>
                  </div>
                  <p className="text-[11px]">Ready to receive live booking requests.</p>
                </div>
              </div>
            </div>

            {/* Document Photo Upload Section (User requirement: Upload RC, Insurance & License) */}
            <DocumentUploadSection
              currentDocuments={driverData?.documents || []}
              onDocumentsSubmitted={handleDocumentsSubmitted}
              driverName={driverData?.name}
              vehicleNumber={driverData?.vehicleNumber}
              isApproved={false}
            />

            <div className="p-4 bg-blue-50 border border-blue-200 rounded-2xl text-xs text-blue-900 flex items-start gap-3">
              <PhoneCall className="w-4 h-4 text-blue-700 flex-shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Need fast-track document clearance?</span>{' '}
                Our driver onboarding hub at New Delhi / Mumbai can verify documents on WhatsApp or visit our local hub.{' '}
                Call <strong>1800 209 8899 (Option 2 for Driver Partners)</strong>.
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // APPROVED DRIVER DASHBOARD VIEW
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Top Driver Header with Profile Summary & Demo State Toggle */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={driverData?.avatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={driverData?.name}
            className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-500 shadow-sm"
          />
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl font-black font-display text-slate-900">{driverData?.name}</h1>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full border border-emerald-200">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                Verified Pilot
              </span>
              <span className="text-xs text-slate-500 font-medium">★ {driverData?.rating} ({driverData?.tripsCount} trips)</span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              Vehicle: <strong className="text-slate-800">{driverData?.vehicleCategory}</strong> • Plate:{' '}
              <span className="font-mono font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                {driverData?.vehicleNumber}
              </span>
            </p>
          </div>
        </div>

        {/* Quick Balance & State switcher */}
        <div className="flex items-center gap-4 flex-wrap">
          <div className="bg-slate-900 text-white p-3.5 rounded-2xl flex items-center gap-4">
            <div>
              <p className="text-[10px] uppercase font-bold text-slate-400">Driver Wallet Balance</p>
              <p className="text-xl font-mono font-black text-amber-400">₹{walletBalance.toFixed(2)}</p>
            </div>
            <button
              onClick={() => setShowTopUpModal(true)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
            >
              + Top Up
            </button>
          </div>

          <button
            onClick={toggleVerificationStatusDemo}
            className="px-3 py-2 text-xs bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-xl border border-slate-300 transition flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
            Switch to Pending State
          </button>
        </div>
      </div>

      {/* Active Driver Credentials Card (User requirement) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-emerald-400">Driver Credentials Active:</span>
              <span className="text-[10px] bg-emerald-500/20 text-emerald-300 font-bold px-2 py-0.5 rounded border border-emerald-500/30">
                Verified Commercial Pilot
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-300 mt-1">
              <span>User Name: <strong className="text-white font-mono">{driverData?.email || mockCredentials.driverApproved.username}</strong></span>
              <span>Mobile No.: <strong className="text-emerald-400 font-mono">{driverData?.phone || mockCredentials.driverApproved.mobileNo}</strong></span>
              <span className="flex items-center gap-1.5">
                Password: <strong className="text-amber-400 font-mono">{showActivePass ? mockCredentials.driverApproved.password : '••••••••'}</strong>
                <button
                  type="button"
                  onClick={() => setShowActivePass(!showActivePass)}
                  className="text-slate-400 hover:text-white"
                  title={showActivePass ? 'Hide password' : 'Show password'}
                >
                  {showActivePass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 self-start md:self-auto">
          <span className="text-slate-400 text-[11px] font-mono">
            MH 02 CW 4821 (Tata Ace)
          </span>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'requests'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Truck className="w-3.5 h-3.5 text-amber-400" />
          <span>Live Requests ({incomingRequests.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('wallet')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'wallet'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Wallet className="w-3.5 h-3.5 text-emerald-400" />
          <span>Wallet & Commission</span>
        </button>

        <button
          onClick={() => setActiveTab('return_trips')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'return_trips'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ArrowLeftRight className="w-3.5 h-3.5 text-blue-400" />
          <span>Return Trip Board</span>
        </button>

        <button
          onClick={() => setActiveTab('pod_upload')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'pod_upload'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Upload className="w-3.5 h-3.5 text-purple-400" />
          <span>Upload POD / LR</span>
        </button>

        <button
          onClick={() => setActiveTab('earnings')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'earnings'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <DollarSign className="w-3.5 h-3.5 text-amber-400" />
          <span>Earnings & History</span>
        </button>

        <button
          onClick={() => setActiveTab('documents')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'documents'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Document Status</span>
        </button>
      </div>

      {/* TAB 1: LIVE INCOMING REQUESTS FEED */}
      {activeTab === 'requests' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold font-display text-slate-900 flex items-center gap-2">
              <span>Nearby Cargo Dispatches Ready For Pickup</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            </h2>
            <span className="text-xs text-slate-500">Auto-refreshing live corridor</span>
          </div>

          {incomingRequests.length === 0 ? (
            <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">No Pending Nearby Requests Right Now</h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
                You are online! New pickup requests in your operating radius will appear automatically.
              </p>
              <button
                onClick={() => setIncomingRequests(mockNearbyLoadRequests)}
                className="px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Reset Demo Requests Feed
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {incomingRequests.map((req) => (
                <div
                  key={req.id}
                  className="bg-white rounded-2xl border-2 border-amber-400/80 p-5 shadow-sm space-y-4 relative"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-900 px-2 py-0.5 rounded">
                      {req.vehicleCategory}
                    </span>
                    <span className="text-xs font-mono font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" /> {req.timeRemainingSecs}s left
                    </span>
                  </div>

                  <div className="space-y-2 text-xs">
                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Pickup: {req.pickupArea}</span>
                        <p className="text-[11px] text-slate-500">{req.pickupLandmark}</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-2">
                      <MapPin className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-slate-900">Drop: {req.dropArea}</span>
                        <p className="text-[11px] text-slate-500">Trip Distance: ~{req.distanceKm} km</p>
                      </div>
                    </div>

                    <div className="pt-2 border-t border-slate-100 flex justify-between text-slate-600">
                      <span>Cargo: <strong>{req.goodsType}</strong></span>
                      {req.driverHelperRequested && (
                        <span className="text-amber-700 font-bold bg-amber-50 px-1.5 py-0.5 rounded">
                          + Helper (+₹350)
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl flex items-center justify-between border border-slate-200">
                    <div>
                      <span className="text-[10px] text-slate-500 uppercase font-semibold">Net Driver Payout</span>
                      <p className="text-lg font-black text-emerald-700 font-display">₹{req.netPayout}</p>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <span>Gross Fare: ₹{req.grossFare}</span>
                      <p className="text-[10px] text-slate-400">12% platform fee deducted</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <button
                      onClick={() => handleDeclineRequest(req.id)}
                      className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
                    >
                      Decline
                    </button>
                    <button
                      onClick={() => handleAcceptRequest(req.id)}
                      className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <CheckCircle2 className="w-4 h-4" /> Accept Trip
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: DRIVER WALLET & COMMISSION DEDUCTION */}
      {activeTab === 'wallet' && (
        <div className="space-y-6">
          {/* Top Wallet Alert regarding minimum balance */}
          <div className="p-4 bg-amber-50 border border-amber-300 rounded-2xl flex items-start gap-3 text-xs text-amber-950">
            <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
            <div>
              <strong className="font-bold text-sm">Wallet Minimum Balance Policy:</strong>
              <p className="mt-1 text-amber-900 leading-relaxed">
                Drivers must maintain a minimum active balance of <strong>₹500.00</strong> to receive instant trip dispatches.
                Our standard platform commission (12%) is automatically deducted from your wallet upon trip completion.
              </p>
            </div>
          </div>

          {/* Balance Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-slate-900 text-white p-5 rounded-2xl space-y-2">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Current Working Balance</span>
              <p className="text-3xl font-mono font-black text-amber-400">₹{walletBalance.toFixed(2)}</p>
              <button
                onClick={() => setShowTopUpModal(true)}
                className="mt-2 w-full py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs transition"
              >
                + Top Up Wallet via UPI
              </button>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Total Net Payouts (This Month)</span>
              <p className="text-2xl font-mono font-black text-emerald-700">₹42,850.00</p>
              <p className="text-[11px] text-slate-400">32 Completed trips in Mumbai MIDC</p>
            </div>

            <div className="bg-white border border-slate-200 p-5 rounded-2xl space-y-1">
              <span className="text-xs text-slate-500 uppercase font-semibold">Commission Deductions (12%)</span>
              <p className="text-2xl font-mono font-black text-slate-800">₹5,142.00</p>
              <p className="text-[11px] text-slate-400">Platform tech fee with GTA tax credits</p>
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Wallet & Commission Deduction Ledger
              </h3>
              <span className="text-xs text-slate-500">Past 30 Days</span>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="p-4 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold ${
                      tx.isCredit ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {tx.isCredit ? '+' : '-'}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900">{tx.description}</p>
                      <p className="text-[11px] text-slate-400">{tx.timestamp}</p>
                    </div>
                  </div>

                  <div className="text-right">
                    <p className={`font-mono font-bold text-sm ${
                      tx.isCredit ? 'text-emerald-700' : 'text-red-700'
                    }`}>
                      {tx.isCredit ? `+₹${tx.amount}` : `-₹${tx.amount}`}
                    </p>
                    <p className="text-[10px] text-slate-400">Bal: ₹{tx.balanceAfter}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: RETURN TRIP (BACKHAUL) BOARD (Prompt requirement) */}
      {activeTab === 'return_trips' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">
                Return Trip (Backhaul) Load Board
              </h2>
              <p className="text-xs text-slate-600">
                Never drive your truck back empty! Available return loads heading towards your home city hub at discounted backhaul rates.
              </p>
            </div>
            <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-800 rounded-full border border-blue-200">
              Home Hub: <strong>{driverData?.homeCity || 'Mumbai'}</strong>
            </span>
          </div>

          <div className="space-y-3">
            {returnLoads.map((load) => (
              <div
                key={load.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs font-mono font-bold bg-slate-900 text-white px-2 py-0.5 rounded">
                      {load.loadNumber}
                    </span>
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                      {load.discountPercent}% Backhaul Discount
                    </span>
                    <span className="text-xs text-slate-500">Pickup: {load.pickupDate}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm font-bold text-slate-900">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{load.originCity}</span>
                    <span className="text-slate-400">➔</span>
                    <MapPin className="w-4 h-4 text-red-600" />
                    <span>{load.destinationCity}</span>
                  </div>

                  <p className="text-xs text-slate-600">
                    Cargo: <strong>{load.cargoType}</strong> ({load.weightTons} Tons) • Requires: {load.vehicleRequired}
                  </p>
                  <p className="text-[11px] text-slate-400">{load.notes}</p>
                </div>

                <div className="flex md:flex-col items-center md:items-end justify-between border-t md:border-t-0 md:border-l border-slate-200 pt-3 md:pt-0 md:pl-6 flex-shrink-0">
                  <div className="text-left md:text-right">
                    <span className="text-[10px] text-slate-400 line-through">Std Rate: ₹{load.standardRate}</span>
                    <p className="text-xl font-black font-display text-emerald-700">
                      ₹{load.discountedBackhaulRate}
                    </p>
                    <span className="text-[10px] text-slate-500">Guaranteed Return Payout</span>
                  </div>

                  <div className="mt-2">
                    {load.status === 'claimed' ? (
                      <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-xl inline-block">
                        Claimed
                      </span>
                    ) : (
                      <button
                        onClick={() => handleClaimReturnLoad(load.id)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl text-xs transition shadow"
                      >
                        Claim Return Load
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: UPLOAD POD / LORRY RECEIPT (Prompt requirement) */}
      {activeTab === 'pod_upload' && (
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="border-b border-slate-200 pb-3">
            <h2 className="text-base font-bold font-display text-slate-900">Upload Proof of Delivery (POD) / Bilty</h2>
            <p className="text-xs text-slate-500">
              Submit signed delivery receipt or stamp photo to instantly release payment and mark delivery complete.
            </p>
          </div>

          {podSubmitted ? (
            <div className="bg-emerald-50 border border-emerald-300 rounded-2xl p-8 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
              <h3 className="text-lg font-bold text-emerald-950">POD Uploaded & Delivery Completed!</h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto">
                Proof of Delivery for trip <strong>{podTripNumber}</strong> has been logged. Payout has been credited to your driver wallet.
              </p>
              <button
                onClick={() => setPodSubmitted(false)}
                className="mt-2 px-4 py-2 bg-slate-900 text-white text-xs font-bold rounded-xl"
              >
                Upload Another POD
              </button>
            </div>
          ) : (
            <form onSubmit={handlePodSubmit} className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4 shadow-xs">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Consignment / Trip Number *</label>
                <input
                  type="text"
                  required
                  value={podTripNumber}
                  onChange={(e) => setPodTripNumber(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Receiver Name & Designation *</label>
                <input
                  type="text"
                  required
                  value={podReceiverName}
                  onChange={(e) => setPodReceiverName(e.target.value)}
                  placeholder="e.g. Suresh Kumar (Store Supervisor)"
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              {/* Document upload simulation */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Signed Physical POD Photo / Consignment Note Stamp *
                </label>
                <div
                  onClick={() => setPodFileUploaded(true)}
                  className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition ${
                    podFileUploaded ? 'border-emerald-500 bg-emerald-50/50' : 'border-slate-300 hover:border-amber-500 bg-slate-50'
                  }`}
                >
                  <Upload className={`w-8 h-8 mx-auto mb-2 ${podFileUploaded ? 'text-emerald-600' : 'text-slate-400'}`} />
                  {podFileUploaded ? (
                    <div>
                      <p className="text-xs font-bold text-emerald-800">pod_signed_receipt_TS9480.jpg (Ready)</p>
                      <p className="text-[10px] text-emerald-600">Click to change file</p>
                    </div>
                  ) : (
                    <div>
                      <p className="text-xs font-bold text-slate-700">Click to capture / browse POD photo</p>
                      <p className="text-[10px] text-slate-400">Supports JPG, PNG, PDF up to 10MB</p>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={!podFileUploaded}
                className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition disabled:opacity-40"
              >
                Submit POD & Finalize Trip
              </button>
            </form>
          )}
        </div>
      )}

      {/* TAB 5: EARNINGS & TRIP HISTORY (Prompt requirement) */}
      {activeTab === 'earnings' && (
        <div className="space-y-4">
          <h2 className="text-base font-bold font-display text-slate-900">Weekly Earnings & Completed Trips</h2>
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Trip Number</th>
                  <th className="py-3 px-4">Route</th>
                  <th className="py-3 px-4">Distance</th>
                  <th className="py-3 px-4">Date</th>
                  <th className="py-3 px-4">Gross Fare</th>
                  <th className="py-3 px-4">Commission (12%)</th>
                  <th className="py-3 px-4 text-right">Net Payout</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">TS-2026-9480</td>
                  <td className="py-3 px-4">Peenya Stage 2 ➔ Electronic City</td>
                  <td className="py-3 px-4">34 km</td>
                  <td className="py-3 px-4 text-slate-500">Today, 09:30 AM</td>
                  <td className="py-3 px-4 font-semibold">₹1,435</td>
                  <td className="py-3 px-4 text-red-600">-₹172</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-700 font-mono">₹1,263</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">TS-2026-9475</td>
                  <td className="py-3 px-4">Andheri East MIDC ➔ Navi Mumbai</td>
                  <td className="py-3 px-4">38 km</td>
                  <td className="py-3 px-4 text-slate-500">Yesterday</td>
                  <td className="py-3 px-4 font-semibold">₹1,590</td>
                  <td className="py-3 px-4 text-red-600">-₹190</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-700 font-mono">₹1,400</td>
                </tr>
                <tr>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">TS-2026-9468</td>
                  <td className="py-3 px-4">Dadar Wholesale ➔ Thane Wagle</td>
                  <td className="py-3 px-4">26 km</td>
                  <td className="py-3 px-4 text-slate-500">11 Sep 2026</td>
                  <td className="py-3 px-4 font-semibold">₹950</td>
                  <td className="py-3 px-4 text-red-600">-₹114</td>
                  <td className="py-3 px-4 text-right font-black text-emerald-700 font-mono">₹836</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: DOCUMENT STATUS & EXPIRY VIEW (Prompt requirement) */}
      {activeTab === 'documents' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold font-display text-slate-900">Commercial Regulatory Compliance & KYC</h2>
              <p className="text-xs text-slate-500">Monitor RTO fitness, commercial driving license, and carrier insurance renewal dates.</p>
            </div>
            <button
              onClick={() => setShowUploadSection(!showUploadSection)}
              className="px-3.5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs transition flex items-center gap-1.5 self-start sm:self-auto shadow-sm"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-400" />
              <span>{showUploadSection ? 'Close Document Upload' : '+ Upload Photos of RC, Insurance & License'}</span>
            </button>
          </div>

          {/* Interactive Document Photo Upload Section (User requirement) */}
          {showUploadSection && (
            <div className="animate-in fade-in duration-300">
              <DocumentUploadSection
                currentDocuments={driverData?.documents || []}
                onDocumentsSubmitted={(docs) => {
                  handleDocumentsSubmitted(docs);
                  setShowUploadSection(false);
                }}
                driverName={driverData?.name}
                vehicleNumber={driverData?.vehicleNumber}
                isApproved={true}
              />
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {driverData?.documents.map((doc) => {
              const isExpiring = doc.status === 'expiring_soon';
              const isExpired = doc.status === 'expired';

              return (
                <div
                  key={doc.id}
                  className={`bg-white rounded-2xl border p-5 space-y-3 shadow-xs ${
                    isExpired ? 'border-red-400 bg-red-50/20' :
                    isExpiring ? 'border-amber-400 bg-amber-50/20' : 'border-slate-200'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-900 text-sm">{doc.name}</span>
                    <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider ${
                      isExpired ? 'bg-red-100 text-red-800 border border-red-200' :
                      isExpiring ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                      'bg-emerald-100 text-emerald-800 border border-emerald-200'
                    }`}>
                      {doc.status.replace('_', ' ')}
                    </span>
                  </div>

                  <div className="text-xs space-y-1 text-slate-600">
                    <p>Registration No: <strong className="font-mono text-slate-900">{doc.documentNumber}</strong></p>
                    <p className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      Expiry Date: <strong className={isExpired ? 'text-red-700' : isExpiring ? 'text-amber-700' : 'text-slate-800'}>{doc.expiryDate}</strong>
                    </p>
                  </div>

                  {isExpiring && (
                    <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-xl text-[11px] text-amber-900 flex items-center justify-between">
                      <span>⚠️ Renewal due in less than 30 days. Upload renewal slip to prevent account hold.</span>
                    </div>
                  )}

                  {isExpired && (
                    <div className="p-2.5 bg-red-50 border border-red-200 rounded-xl text-[11px] text-red-900 flex items-center justify-between">
                      <span>❌ Policy expired! Upload renewed insurance copy immediately.</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* WALLET TOP UP MODAL */}
      {showTopUpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="font-bold text-base text-slate-900 font-display">Recharge Driver Wallet</h3>
            <p className="text-xs text-slate-500">
              Top up via UPI (Google Pay, PhonePe, Paytm). Instant balance credit with 0% transaction fee.
            </p>

            <form onSubmit={handleTopUpWallet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select / Enter Amount (₹)</label>
                <div className="grid grid-cols-3 gap-2 mb-2">
                  {['500', '1000', '2000'].map((amt) => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className={`py-1.5 text-xs font-bold rounded-lg border ${
                        topUpAmount === amt ? 'bg-amber-50 border-amber-500 text-amber-900' : 'bg-slate-50 border-slate-200'
                      }`}
                    >
                      ₹{amt}
                    </button>
                  ))}
                </div>
                <input
                  type="number"
                  min="200"
                  step="100"
                  required
                  value={topUpAmount}
                  onChange={(e) => setTopUpAmount(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-xl"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowTopUpModal(false)}
                  className="flex-1 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow"
                >
                  Confirm Recharge
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
