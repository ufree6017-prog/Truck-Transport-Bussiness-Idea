import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { DriverProfile, BulkEnquiry, GSTInvoiceRecord } from '../../types';
import { 
  mockDrivers, 
  mockBulkEnquiries, 
  mockInvoices,
  mockBookings,
  mockCredentials
} from '../../data/mockData';
import { 
  ShieldCheck, 
  Users, 
  Truck, 
  TrendingUp, 
  CheckCircle2, 
  XCircle, 
  FileText, 
  Building2, 
  Clock, 
  AlertTriangle, 
  DollarSign, 
  Download, 
  Search, 
  Filter, 
  Eye, 
  EyeOff, 
  Lock, 
  Smartphone, 
  KeyRound, 
  ShieldAlert, 
  UserCheck,
  ExternalLink,
  FileCheck,
  Image as ImageIcon,
  Check
} from 'lucide-react';

interface AdminDashboardProps {
  customEnquiries?: BulkEnquiry[];
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ customEnquiries = [] }) => {
  const { user, role, driverData, updateDriverProfile, switchRolePersona, login } = useAuth();

  // Admin login form states for unauthenticated / non-admin access
  const [adminIdentifier, setAdminIdentifier] = useState(mockCredentials.admin.username);
  const [adminPassword, setAdminPassword] = useState(mockCredentials.admin.password);
  const [showAdminPassword, setShowAdminPassword] = useState(false);
  const [adminLoginLoading, setAdminLoginLoading] = useState(false);
  const [adminLoginError, setAdminLoginError] = useState('');
  const [showActiveAdminPass, setShowActiveAdminPass] = useState(false);

  // Active admin tab
  const [activeTab, setActiveTab] = useState<'overview' | 'drivers' | 'enquiries' | 'invoices'>('overview');

  // Local drivers list with dynamic approval/rejection state
  const [driversList, setDriversList] = useState<DriverProfile[]>(mockDrivers);

  // Keep drivers list synced if driverData updates in AuthContext (e.g., driver uploaded new documents)
  useEffect(() => {
    if (driverData) {
      setDriversList(prev => prev.map(d => (d.id === driverData.id ? { ...d, ...driverData } : d)));
      if (previewDriver?.id === driverData.id) {
        setPreviewDriver(prev => (prev ? { ...prev, ...driverData } : null));
      }
    }
  }, [driverData]);

  // Combine mock enquiries with any created during this session
  const [enquiriesList, setEnquiriesList] = useState<BulkEnquiry[]>([
    ...customEnquiries,
    ...mockBulkEnquiries
  ]);

  // Selected driver for document modal preview
  const [previewDriver, setPreviewDriver] = useState<DriverProfile | null>(null);
  const [inspectingPhoto, setInspectingPhoto] = useState<{ url: string; title: string } | null>(null);

  // Filter terms
  const [driverSearch, setDriverSearch] = useState('');
  const [enquirySearch, setEnquirySearch] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminLoginLoading(true);
    setAdminLoginError('');
    try {
      if (!adminIdentifier) {
        setAdminLoginError('Please enter Admin User Name or Mobile Number');
        setAdminLoginLoading(false);
        return;
      }
      await login(adminIdentifier, adminPassword, 'admin');
    } catch (err: any) {
      setAdminLoginError(err.message || 'Admin authentication failed');
    } finally {
      setAdminLoginLoading(false);
    }
  };

  const handleAutoFillAdmin = () => {
    setAdminIdentifier(mockCredentials.admin.username);
    setAdminPassword(mockCredentials.admin.password);
    switchRolePersona('admin');
  };

  // Handle Driver Approval
  const handleApproveDriver = (driverId: string) => {
    setDriversList(prev => prev.map(d => 
      d.id === driverId ? { ...d, verificationStatus: 'approved' } : d
    ));
    if (driverData && driverData.id === driverId) {
      updateDriverProfile({ verificationStatus: 'approved' });
    }
    if (previewDriver?.id === driverId) {
      setPreviewDriver(prev => prev ? { ...prev, verificationStatus: 'approved' } : null);
    }
  };

  // Handle Driver Rejection
  const handleRejectDriver = (driverId: string) => {
    setDriversList(prev => prev.map(d => 
      d.id === driverId ? { ...d, verificationStatus: 'rejected' } : d
    ));
    if (driverData && driverData.id === driverId) {
      updateDriverProfile({ verificationStatus: 'rejected' });
    }
    if (previewDriver?.id === driverId) {
      setPreviewDriver(prev => prev ? { ...prev, verificationStatus: 'rejected' } : null);
    }
  };

  // Handle Enquiry Status Update
  const handleUpdateEnquiryStatus = (enqId: string, newStatus: BulkEnquiry['status']) => {
    setEnquiriesList(prev => prev.map(e => 
      e.id === enqId ? { ...e, status: newStatus } : e
    ));
  };

  // Metrics (Prompt requirement)
  const activeDriversCount = driversList.filter(d => d.verificationStatus === 'approved').length;
  const pendingApprovalsCount = driversList.filter(d => d.verificationStatus === 'pending').length;
  const completedTripsToday = 142;
  const gmvToday = 485900; // in INR (₹4.85 Lakhs)

  const filteredDrivers = driversList.filter(d => 
    d.name.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.vehicleNumber.toLowerCase().includes(driverSearch.toLowerCase()) ||
    d.homeCity.toLowerCase().includes(driverSearch.toLowerCase())
  );

  const filteredEnquiries = enquiriesList.filter(e => 
    e.companyName.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.originCity.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.destinationCity.toLowerCase().includes(enquirySearch.toLowerCase()) ||
    e.enquiryNumber.toLowerCase().includes(enquirySearch.toLowerCase())
  );

  // UNAUTHENTICATED / NON-ADMIN VIEW (User requirement)
  if (role !== 'admin') {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
        {/* Clearance Header */}
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-xs font-bold uppercase tracking-wider">
            <ShieldAlert className="w-3.5 h-3.5 text-red-600" />
            <span>Platform Operations & Security Clearance</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-black font-display text-slate-900">
            Admin Clearance Login
          </h1>
          <p className="text-sm text-slate-600 leading-relaxed">
            Restricted access for TruckSetu dispatch supervisors, RTO document auditors, and platform accounting administrators.
          </p>
        </div>

        {/* ADMIN CREDENTIALS DETAILS BOX (User requirement) */}
        <div className="bg-slate-900 text-white rounded-3xl p-6 sm:p-8 shadow-xl border border-slate-800 relative overflow-hidden">
          <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 border-b border-slate-800 pb-4">
            <div>
              <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
                <KeyRound className="w-4 h-4" />
                <span>Admin Section Login Credentials</span>
              </div>
              <p className="text-xs text-slate-400 mt-0.5">
                Use the credentials below or click auto-fill to authenticate as Level 4 Administrator:
              </p>
            </div>
            <span className="text-[11px] bg-red-950/80 text-red-400 px-3 py-1 rounded-full border border-red-800 self-start sm:self-auto font-bold uppercase tracking-wider">
              Level 4 Clearance
            </span>
          </div>

          <div className="bg-slate-800/90 border border-indigo-500/30 rounded-2xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-white">Rajesh Nair</h3>
                  <p className="text-xs text-indigo-300">Head of Platform Operations & Compliance Desk</p>
                </div>
              </div>
              <span className="text-xs font-mono bg-indigo-900/60 text-indigo-200 px-2.5 py-1 rounded-lg border border-indigo-700">
                GST SAC 9965
              </span>
            </div>

            <div className="bg-slate-950/70 rounded-xl p-4 border border-slate-800 space-y-2.5 text-xs font-mono">
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-400 text-xs">Admin User Name:</span>
                <span className="text-slate-100 font-bold select-all text-sm">{mockCredentials.admin.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-400 text-xs">Admin Mobile No.:</span>
                <span className="text-emerald-400 font-bold select-all text-sm">{mockCredentials.admin.mobileNo}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-sans text-slate-400 text-xs">Admin Password:</span>
                <span className="text-amber-400 font-bold select-all text-sm">{mockCredentials.admin.password}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={handleAutoFillAdmin}
              className="w-full py-2.5 px-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold rounded-xl text-xs flex items-center justify-center gap-2 transition shadow-md"
            >
              <KeyRound className="w-4 h-4" />
              <span>Fill & Login as Super Admin (Rajesh Nair)</span>
            </button>
          </div>
        </div>

        {/* DIRECT ADMIN LOGIN FORM */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md max-w-lg mx-auto">
          <h2 className="text-lg font-bold font-display text-slate-900 mb-1 flex items-center gap-2">
            <ShieldCheck className="w-5 h-5 text-indigo-600" />
            <span>Admin Clearance Authentication</span>
          </h2>
          <p className="text-xs text-slate-500 mb-5">
            Authenticate using the Admin User Name or registered Admin Mobile Number along with password.
          </p>

          {adminLoginError && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-700 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />
              <span>{adminLoginError}</span>
            </div>
          )}

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Admin User Name or Mobile No. *
              </label>
              <div className="relative">
                <Smartphone className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. +91 98200 99881 or admin@trucksetu.com"
                  value={adminIdentifier}
                  onChange={(e) => setAdminIdentifier(e.target.value)}
                  className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-bold text-slate-700">
                  Admin Password *
                </label>
                <button
                  type="button"
                  onClick={() => setShowAdminPassword(!showAdminPassword)}
                  className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 font-medium"
                >
                  {showAdminPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                  <span>{showAdminPassword ? 'Hide' : 'Show'}</span>
                </button>
              </div>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                <input
                  type={showAdminPassword ? 'text' : 'password'}
                  required
                  placeholder="Enter admin password"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={adminLoginLoading}
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl text-sm transition shadow-md flex items-center justify-center gap-2"
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{adminLoginLoading ? 'Verifying Clearance...' : 'Authenticate Admin Clearance'}</span>
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Admin Header with Active Credentials Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black tracking-widest bg-red-100 text-red-800 px-2.5 py-0.5 rounded border border-red-200">
              Admin Ops Center
            </span>
            <span className="text-xs text-slate-500">Security Clearance Level 4</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display text-slate-900 mt-1">
            Platform Operations & Compliance Desk
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 text-xs text-slate-600 bg-slate-100 px-3 py-1.5 rounded-xl">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Gateway Live • 200+ Hubs Connected</span>
          </div>
        </div>
      </div>

      {/* Persistent Admin Credentials Badge (User requirement) */}
      <div className="bg-slate-900 text-white rounded-2xl p-4 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center flex-shrink-0">
            <KeyRound className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-indigo-400">Admin Clearance Active:</span>
              <span className="text-[10px] bg-red-500/20 text-red-300 font-bold px-2 py-0.5 rounded border border-red-500/30">
                Rajesh Nair (Level 4 Officer)
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-1 text-slate-300 mt-1">
              <span>User Name: <strong className="text-white font-mono">{mockCredentials.admin.username}</strong></span>
              <span>Mobile No.: <strong className="text-emerald-400 font-mono">{mockCredentials.admin.mobileNo}</strong></span>
              <span className="flex items-center gap-1.5">
                Password: <strong className="text-amber-400 font-mono">{showActiveAdminPass ? mockCredentials.admin.password : '••••••••••••'}</strong>
                <button
                  type="button"
                  onClick={() => setShowActiveAdminPass(!showActiveAdminPass)}
                  className="text-slate-400 hover:text-white"
                  title={showActiveAdminPass ? 'Hide password' : 'Show password'}
                >
                  {showActiveAdminPass ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={() => switchRolePersona('customer')}
          className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 text-xs transition whitespace-nowrap self-start md:self-auto font-medium"
        >
          Exit Admin Desk
        </button>
      </div>

      {/* METRICS PANEL (Prompt mandate) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Active Verified Drivers</span>
            <Users className="w-5 h-5 text-emerald-600" />
          </div>
          <p className="text-3xl font-black font-display text-slate-900">{activeDriversCount}</p>
          <p className="text-[11px] text-emerald-700 font-medium">98.2% online and compliant</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-amber-300 shadow-xs space-y-2 bg-amber-50/30">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-bold text-amber-900 uppercase tracking-wider">Pending Driver Approvals</span>
            <Clock className="w-5 h-5 text-amber-600 animate-spin" />
          </div>
          <p className="text-3xl font-black font-display text-amber-900">{pendingApprovalsCount}</p>
          <p className="text-[11px] text-amber-800 font-medium">Requires RTO document review</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Completed Trips Today</span>
            <Truck className="w-5 h-5 text-blue-600" />
          </div>
          <p className="text-3xl font-black font-display text-slate-900">{completedTripsToday}</p>
          <p className="text-[11px] text-blue-700 font-medium">+18% vs yesterday</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200 shadow-xs space-y-2">
          <div className="flex items-center justify-between text-slate-500">
            <span className="text-xs font-semibold uppercase tracking-wider">Gross Merchandise Value (GMV)</span>
            <TrendingUp className="w-5 h-5 text-purple-600" />
          </div>
          <p className="text-3xl font-mono font-black text-slate-900">
            ₹{(gmvToday / 100000).toFixed(2)} L
          </p>
          <p className="text-[11px] text-slate-500">₹{gmvToday.toLocaleString()} gross freight</p>
        </div>
      </div>

      {/* Admin Tab Navigation */}
      <div className="bg-white rounded-2xl border border-slate-200 p-1.5 flex items-center gap-1 overflow-x-auto shadow-2xs">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          Operations Overview
        </button>

        <button
          onClick={() => setActiveTab('drivers')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'drivers'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
          <span>Driver Document Verification ({pendingApprovalsCount} pending)</span>
        </button>

        <button
          onClick={() => setActiveTab('enquiries')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'enquiries'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-3.5 h-3.5 text-blue-400" />
          <span>B2B Bulk Enquiries ({enquiriesList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition flex items-center gap-2 whitespace-nowrap ${
            activeTab === 'invoices'
              ? 'bg-slate-900 text-white shadow-xs'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileText className="w-3.5 h-3.5 text-emerald-400" />
          <span>GST 9965 Invoices & E-Way Bills</span>
        </button>
      </div>

      {/* TAB 1: OVERVIEW SCREEN */}
      {activeTab === 'overview' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-base text-slate-900 font-display">Urgent Action Items</h3>
                <span className="text-xs text-amber-700 bg-amber-50 px-2 py-0.5 rounded font-semibold">
                  {pendingApprovalsCount} Items Require Review
                </span>
              </div>

              <div className="space-y-3 text-xs">
                {driversList.filter(d => d.verificationStatus === 'pending').map((d) => (
                  <div key={d.id} className="p-4 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between">
                    <div>
                      <span className="font-bold text-slate-900">{d.name}</span>{' '}
                      <span className="text-slate-500">({d.vehicleCategory} - {d.vehicleNumber})</span>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Applied from {d.homeCity} • DL & RC uploaded
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setPreviewDriver(d);
                          setActiveTab('drivers');
                        }}
                        className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-bold"
                      >
                        Review Docs
                      </button>
                      <button
                        onClick={() => handleApproveDriver(d.id)}
                        className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold"
                      >
                        Quick Approve
                      </button>
                    </div>
                  </div>
                ))}

                {pendingApprovalsCount === 0 && (
                  <p className="text-slate-500 italic py-2">All driver applications have been reviewed and resolved.</p>
                )}
              </div>
            </div>

            {/* Recent Bookings Dispatch Stream */}
            <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
              <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <h3 className="font-bold text-sm text-slate-900">Live Consignment Dispatches</h3>
                <span className="text-xs text-slate-500">Pan-India corridors</span>
              </div>
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 text-slate-600 border-b border-slate-200">
                  <tr>
                    <th className="py-2.5 px-4">Booking ID</th>
                    <th className="py-2.5 px-4">Route</th>
                    <th className="py-2.5 px-4">Vehicle</th>
                    <th className="py-2.5 px-4">Driver</th>
                    <th className="py-2.5 px-4">Fare</th>
                    <th className="py-2.5 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {mockBookings.map((b) => (
                    <tr key={b.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-mono font-bold text-slate-900">{b.bookingNumber}</td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-800">{b.pickupLocation.split(',')[0]}</span>
                        <span className="text-slate-400"> ➔ </span>
                        <span className="text-slate-600">{b.dropLocation.split(',')[0]}</span>
                      </td>
                      <td className="py-3 px-4">{b.vehicleCategoryName}</td>
                      <td className="py-3 px-4">{b.driverDetails ? b.driverDetails.name : 'Searching...'}</td>
                      <td className="py-3 px-4 font-mono font-semibold">₹{b.totalEstimatedFare}</td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-800">
                          {b.status.replace('_', ' ')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-6">
            <div className="bg-slate-900 text-white rounded-2xl p-5 space-y-4">
              <h3 className="font-bold font-display text-white text-sm">Pan-India Fleet Health</h3>
              
              <div className="space-y-3 text-xs">
                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Delhi NCR Fleet Fill Rate</span>
                    <span className="font-mono text-emerald-400">94%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[94%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Mumbai MMR Fleet Fill Rate</span>
                    <span className="font-mono text-emerald-400">91%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-emerald-500 h-full w-[91%]"></div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-slate-400 mb-1">
                    <span>Bengaluru Tech Corridor</span>
                    <span className="font-mono text-amber-400">86%</span>
                  </div>
                  <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
                    <div className="bg-amber-500 h-full w-[86%]"></div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 text-[11px] text-slate-400 space-y-1">
                <p>• Average Platform Matching Time: <strong>2.1 minutes</strong></p>
                <p>• Driver OTP Verification Rate: <strong>100.0%</strong></p>
                <p>• Fastag Toll Settlement: <strong>Automated via NHAI</strong></p>
              </div>
            </div>

            {/* Quick GST Summary */}
            <div className="bg-white rounded-2xl border border-slate-200 p-5 space-y-3 text-xs">
              <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
                Tax & Regulatory Audit
              </h4>
              <p className="text-slate-600 leading-relaxed">
                TruckSetu operates as a registered Goods Transport Agency (GTA) under SAC 996511. All consignments are generated with electronic bilty copies.
              </p>
              <button
                onClick={() => setActiveTab('invoices')}
                className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-bold transition"
              >
                View GST Invoices Registry →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DRIVER VERIFICATION SCREEN (Prompt requirement) */}
      {activeTab === 'drivers' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                Driver Application Verification & Compliance
              </h2>
              <p className="text-xs text-slate-500">
                Review Commercial Driving License, Vehicle Registration Certificate (RC), and Carrier Insurance.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={driverSearch}
                onChange={(e) => setDriverSearch(e.target.value)}
                placeholder="Search driver name, plate..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          {/* Drivers List Table */}
          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Driver Profile</th>
                  <th className="py-3 px-4">Vehicle Specs</th>
                  <th className="py-3 px-4">Home Hub</th>
                  <th className="py-3 px-4">Documents</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Verification Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredDrivers.map((driver) => {
                  const isPending = driver.verificationStatus === 'pending';
                  const isApproved = driver.verificationStatus === 'approved';

                  return (
                    <tr key={driver.id} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={driver.avatar}
                            alt={driver.name}
                            className="w-9 h-9 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <p className="font-bold text-slate-900">{driver.name}</p>
                            <p className="text-[11px] text-slate-500">{driver.phone}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <p className="font-semibold text-slate-800">{driver.vehicleCategory}</p>
                        <p className="font-mono text-[11px] text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded inline-block mt-0.5">
                          {driver.vehicleNumber}
                        </p>
                      </td>

                      <td className="py-3 px-4">{driver.homeCity}</td>

                      <td className="py-3 px-4">
                        <button
                          onClick={() => setPreviewDriver(driver)}
                          className="text-amber-700 font-bold hover:underline flex items-center gap-1"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>{driver.documents.length} Docs Uploaded</span>
                        </button>
                      </td>

                      <td className="py-3 px-4">
                        <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isApproved ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                          isPending ? 'bg-amber-100 text-amber-800 border border-amber-200 animate-pulse' :
                          'bg-red-100 text-red-800 border border-red-200'
                        }`}>
                          {driver.verificationStatus}
                        </span>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {isApproved ? (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Verified
                            </span>
                          ) : (
                            <>
                              <button
                                onClick={() => handleApproveDriver(driver.id)}
                                className="px-3 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold transition flex items-center gap-1 shadow-2xs"
                              >
                                <CheckCircle2 className="w-3.5 h-3.5" /> Approve
                              </button>
                              <button
                                onClick={() => handleRejectDriver(driver.id)}
                                className="px-2.5 py-1 bg-slate-100 hover:bg-red-50 hover:text-red-700 text-slate-700 rounded-lg text-xs font-bold transition"
                              >
                                Reject
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Document Preview Modal with Photo Inspection for Admin Verification */}
          {previewDriver && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs overflow-y-auto">
              <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4 my-8">
                <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-base text-slate-900 font-display">
                        RTO & KYC Audit: {previewDriver.name}
                      </h3>
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        previewDriver.verificationStatus === 'approved' ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' :
                        previewDriver.verificationStatus === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-200' :
                        'bg-red-100 text-red-800 border border-red-200'
                      }`}>
                        {previewDriver.verificationStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5">
                      {previewDriver.vehicleCategory} ({previewDriver.vehicleNumber}) • Hub: {previewDriver.homeCity} • Phone: {previewDriver.phone}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewDriver(null)}
                    className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center font-bold text-sm transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-2xl flex items-center gap-2.5 text-xs text-amber-900">
                  <ShieldCheck className="w-4 h-4 text-amber-700 flex-shrink-0" />
                  <span>
                    Verify driver's uploaded <strong>Vehicle RC</strong>, <strong>Commercial License</strong>, and <strong>Carrier Insurance</strong> photos against Parivahan / RTO records before approving.
                  </span>
                </div>

                <div className="space-y-3 max-h-[55vh] overflow-y-auto pr-1">
                  {previewDriver.documents.map((doc) => (
                    <div key={doc.id} className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-3 text-xs">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-bold text-slate-900 text-sm">{doc.name}</p>
                          <p className="text-slate-500 text-[11px] mt-0.5">
                            Doc ID: <span className="font-mono font-bold text-slate-800">{doc.documentNumber}</span>
                            {doc.expiryDate && (
                              <span className="ml-2.5">
                                Expires: <strong className="text-slate-800">{doc.expiryDate}</strong>
                              </span>
                            )}
                          </p>
                        </div>
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                          doc.status === 'valid' ? 'bg-emerald-100 text-emerald-800' :
                          doc.status === 'under_review' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {doc.status.replace('_', ' ')}
                        </span>
                      </div>

                      {/* Uploaded Photo / Document Scan */}
                      {doc.fileUrl ? (
                        <div className="p-2.5 bg-white rounded-xl border border-slate-200 flex items-center gap-3">
                          <div 
                            onClick={() => setInspectingPhoto({ url: doc.fileUrl!, title: `${doc.name} - ${previewDriver.name}` })}
                            className="relative group cursor-pointer w-20 h-16 rounded-lg overflow-hidden border border-slate-300 flex-shrink-0 shadow-2xs"
                          >
                            <img
                              src={doc.fileUrl}
                              alt={doc.name}
                              referrerPolicy="no-referrer"
                              className="w-full h-full object-cover transition duration-200 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                              <Eye className="w-4 h-4" />
                            </div>
                          </div>

                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 text-emerald-700 font-bold text-[11px]">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              <span>Photo Scanned & Uploaded by Driver</span>
                            </div>
                            <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                              Tap thumbnail to zoom and inspect official stamp & seal
                            </p>
                            <button
                              onClick={() => setInspectingPhoto({ url: doc.fileUrl!, title: `${doc.name} - ${previewDriver.name}` })}
                              className="mt-1 text-[11px] font-bold text-amber-700 hover:text-amber-800 inline-flex items-center gap-1 underline"
                            >
                              <Eye className="w-3 h-3" /> Inspect High-Resolution Photo
                            </button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-2.5 bg-white rounded-xl border border-dashed border-amber-300 text-[11px] text-amber-700 flex items-center gap-2">
                          <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                          <span>No photo file uploaded yet. Driver has only entered registration number.</span>
                        </div>
                      )}

                      <div className="flex justify-between items-center text-[11px] text-slate-400 pt-1 border-t border-slate-200/60">
                        <span>Type: <strong className="text-slate-600 uppercase font-mono">{doc.type.replace('_', ' ')}</strong></span>
                        <span className="text-emerald-700 font-medium">✓ Cryptographic RTO Hash Verified</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-slate-200 flex flex-col sm:flex-row justify-between items-center gap-3">
                  <span className="text-xs text-slate-500">
                    Application status: <strong className="capitalize text-slate-800">{previewDriver.verificationStatus}</strong>
                  </span>
                  <div className="flex gap-2 w-full sm:w-auto">
                    <button
                      onClick={() => handleRejectDriver(previewDriver.id)}
                      className="flex-1 sm:flex-none px-4 py-2.5 bg-red-50 hover:bg-red-100 text-red-700 border border-red-200 text-xs font-bold rounded-xl transition flex items-center justify-center gap-1.5"
                    >
                      <XCircle className="w-3.5 h-3.5" />
                      Reject Documents
                    </button>
                    <button
                      onClick={() => handleApproveDriver(previewDriver.id)}
                      className="flex-1 sm:flex-none px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow transition flex items-center justify-center gap-1.5"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Approve & Verify Driver
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Photo Inspection Lightbox Modal */}
          {inspectingPhoto && (
            <div 
              className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-black/85 backdrop-blur-sm"
              onClick={() => setInspectingPhoto(null)}
            >
              <div 
                className="bg-slate-900 rounded-2xl max-w-3xl w-full p-4 border border-slate-700 shadow-2xl space-y-3"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex items-center justify-between text-white pb-2 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-amber-400" />
                    <span className="text-xs font-bold">{inspectingPhoto.title}</span>
                  </div>
                  <button
                    onClick={() => setInspectingPhoto(null)}
                    className="w-7 h-7 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white flex items-center justify-center text-xs font-bold transition"
                  >
                    ✕
                  </button>
                </div>

                <div className="relative rounded-xl overflow-hidden bg-black flex items-center justify-center min-h-[300px] max-h-[70vh]">
                  <img
                    src={inspectingPhoto.url}
                    alt={inspectingPhoto.title}
                    referrerPolicy="no-referrer"
                    className="max-h-[68vh] w-auto max-w-full object-contain rounded-lg"
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Tamper-proof compliance scan preview</span>
                  <button
                    onClick={() => setInspectingPhoto(null)}
                    className="px-3 py-1 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold"
                  >
                    Close Preview
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: BUSINESS / BULK ENQUIRIES SCREEN (Prompt requirement) */}
      {activeTab === 'enquiries' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                Corporate & Bulk Freight Enquiries
              </h2>
              <p className="text-xs text-slate-500">
                Incoming enterprise FTL, contract logistics, and heavy container transport queries.
              </p>
            </div>

            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={enquirySearch}
                onChange={(e) => setEnquirySearch(e.target.value)}
                placeholder="Search company, route, ref..."
                className="w-full pl-9 pr-3 py-2 text-xs border border-slate-300 rounded-xl"
              />
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Ref & Date</th>
                  <th className="py-3 px-4">Enterprise / Shipper</th>
                  <th className="py-3 px-4">Corridor (Origin ➔ Drop)</th>
                  <th className="py-3 px-4">Vehicle & Tonnage</th>
                  <th className="py-3 px-4">Cargo Description</th>
                  <th className="py-3 px-4">E-Way Bill Status</th>
                  <th className="py-3 px-4">Status & Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {filteredEnquiries.map((enq) => (
                  <tr key={enq.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4">
                      <p className="font-mono font-bold text-slate-900">{enq.enquiryNumber}</p>
                      <p className="text-[11px] text-slate-400">{enq.createdAt}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900">{enq.companyName}</p>
                      <p className="text-[11px] text-slate-500">
                        {enq.contactPerson} • {enq.phone}
                      </p>
                      <p className="font-mono text-[10px] text-slate-400">GST: {enq.gstin}</p>
                    </td>

                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {enq.originCity} ➔ {enq.destinationCity}
                      <p className="text-[10px] text-slate-400 font-normal capitalize">Freq: {enq.frequency.replace('_', ' ')}</p>
                    </td>

                    <td className="py-3 px-4">
                      <p className="font-semibold text-blue-900">{enq.vehicleTypeRequired}</p>
                      <p className="text-[11px] font-bold text-slate-700">{enq.cargoWeightTons} Metric Tons</p>
                    </td>

                    <td className="py-3 px-4 max-w-xs truncate text-slate-600" title={enq.cargoDescription}>
                      {enq.cargoDescription}
                    </td>

                    <td className="py-3 px-4">
                      {enq.eWayBillAvailable ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded">
                          ✓ E-Way Ready
                        </span>
                      ) : (
                        <span className="text-[10px] text-slate-500 italic">Not generated</span>
                      )}
                    </td>

                    <td className="py-3 px-4">
                      <select
                        value={enq.status}
                        onChange={(e) => handleUpdateEnquiryStatus(enq.id, e.target.value as any)}
                        className="text-xs font-semibold py-1 px-2 border border-slate-300 rounded-lg bg-slate-50 focus:ring-1 focus:ring-amber-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="quoted">Quoted</option>
                        <option value="closed">Closed / Dispatched</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: GST 9965 INVOICES & BILTY ARCHIVE */}
      {activeTab === 'invoices' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold font-display text-slate-900">
                GST Tax Invoices & Consignment Notes (SAC 9965)
              </h2>
              <p className="text-xs text-slate-500">
                All trips generate formal GST tax invoices with reverse charge mechanism (RCM) or forward charge declaration.
              </p>
            </div>
            <button
              onClick={() => alert('Exporting monthly GSTR-1 & GTA filing CSV (Mock).')}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Export GSTR-1 Ledger</span>
            </button>
          </div>

          <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                <tr>
                  <th className="py-3 px-4">Invoice No</th>
                  <th className="py-3 px-4">Trip ID</th>
                  <th className="py-3 px-4">Shipper / Entity</th>
                  <th className="py-3 px-4">SAC Code</th>
                  <th className="py-3 px-4">Taxable Freight</th>
                  <th className="py-3 px-4">GST (5%)</th>
                  <th className="py-3 px-4">Total Amount</th>
                  <th className="py-3 px-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700">
                {mockInvoices.map((inv) => (
                  <tr key={inv.id} className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">{inv.invoiceNumber}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">{inv.bookingNumber}</td>
                    <td className="py-3 px-4 font-semibold text-slate-800">{inv.consignorName}</td>
                    <td className="py-3 px-4 font-mono text-slate-500">{inv.sacCode}</td>
                    <td className="py-3 px-4 font-mono">₹{inv.taxableValue.toLocaleString()}</td>
                    <td className="py-3 px-4 font-mono text-slate-600">₹{(inv.cgst + inv.sgst + inv.igst).toFixed(2)}</td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-900">₹{inv.totalInvoiceAmount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => alert(`Downloading PDF invoice: ${inv.invoiceNumber}.pdf with SAC 9965 (Mock).`)}
                        className="text-amber-700 font-bold hover:underline inline-flex items-center gap-1"
                      >
                        <Download className="w-3 h-3" /> PDF
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};
