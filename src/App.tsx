import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { RoleSwitcherToolbar } from './components/layout/RoleSwitcherToolbar';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/public/HomePage';
import { VehiclePricingPage } from './components/public/VehiclePricingPage';
import { BusinessBulkEnquiryPage } from './components/public/BusinessBulkEnquiryPage';
import { HowItWorksPage } from './components/public/HowItWorksPage';
import { LiveOrderTracking } from './components/public/LiveOrderTracking';
import { DriverPortal } from './components/driver/DriverPortal';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { PolicyPages } from './components/public/PolicyPages';
import { BookingFlowModal } from './components/public/BookingFlowModal';
import { AuthModal } from './components/auth/AuthModal';
import { SupportChatWidget } from './components/public/SupportChatWidget';
import { Booking, BulkEnquiry, VehicleCategory } from './types';
import { mockBookings } from './data/mockData';

// Main Inner Shell component consuming AuthContext
const AppShell: React.FC = () => {
  const { user, role, switchRolePersona } = useAuth();

  // Navigation State
  const [currentView, setCurrentView] = useState<string>('home');

  // Modal States
  const [isBookingModalOpen, setIsBookingModalOpen] = useState<boolean>(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [bookingModalParams, setBookingModalParams] = useState<{
    pickup?: string;
    drop?: string;
    city?: string;
    tripType?: 'intracity' | 'intercity';
    vehicleId?: string;
  }>({});

  // Active Consignment Tracking State
  const [activeBooking, setActiveBooking] = useState<Booking | null>(mockBookings[0] || null);

  // Dynamic Custom Enquiries created by user
  const [sessionEnquiries, setSessionEnquiries] = useState<BulkEnquiry[]>([]);

  // Handlers
  const handleStartBooking = (params?: {
    pickup?: string;
    drop?: string;
    city?: string;
    tripType?: 'intracity' | 'intercity';
    vehicleId?: string;
  }) => {
    if (params) {
      setBookingModalParams(params);
    }
    setIsBookingModalOpen(true);
  };

  const handleBookingConfirmed = (newBooking: Booking) => {
    setActiveBooking(newBooking);
    setIsBookingModalOpen(false);
    setCurrentView('live-tracking');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectVehicleFromPricing = (vehicle: VehicleCategory) => {
    setBookingModalParams({ vehicleId: vehicle.id });
    setIsBookingModalOpen(true);
  };

  const handleBulkEnquirySubmitted = (newEnquiry: BulkEnquiry) => {
    setSessionEnquiries(prev => [newEnquiry, ...prev]);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col font-sans selection:bg-amber-500 selection:text-slate-950">
      
      {/* 1. Evaluation Demo Toolbar (Switches Customer / Driver / Admin roles easily) */}
      <RoleSwitcherToolbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 2. Main Navigation Bar */}
      <Navbar
        currentView={currentView}
        setCurrentView={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        hasActiveBooking={Boolean(activeBooking)}
      />

      {/* 3. Main Dynamic Content Views */}
      <main className="flex-1">
        {/* HOMEPAGE */}
        {currentView === 'home' && (
          <HomePage
            onStartBooking={handleStartBooking}
            onOpenBulkEnquiry={() => {
              setCurrentView('business-bulk');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateFleet={() => {
              setCurrentView('vehicles-pricing');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onNavigateTracking={() => {
              setCurrentView('live-tracking');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenDriverPortal={() => {
              if (role !== 'driver') {
                switchRolePersona('driver', 'approved');
              }
              setCurrentView('driver-portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* FLEET TYPES & PRICING CALCULATOR */}
        {currentView === 'vehicles-pricing' && (
          <VehiclePricingPage
            onSelectVehicle={handleSelectVehicleFromPricing}
            onOpenBulkEnquiry={() => {
              setCurrentView('business-bulk');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* BUSINESS & BULK ENQUIRY (with E-Way Bill and Heavy categories) */}
        {currentView === 'business-bulk' && (
          <BusinessBulkEnquiryPage
            onSubmitEnquiry={handleBulkEnquirySubmitted}
            onNavigateHome={() => {
              setCurrentView('home');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* HOW IT WORKS */}
        {currentView === 'how-it-works' && (
          <HowItWorksPage
            onStartBooking={() => handleStartBooking()}
            onOpenDriverPortal={() => {
              if (role !== 'driver') {
                switchRolePersona('driver', 'approved');
              }
              setCurrentView('driver-portal');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {/* LIVE CONSIGNMENT TRACKING */}
        {currentView === 'live-tracking' && (
          <LiveOrderTracking
            booking={activeBooking}
            onUpdateStatus={(newStatus) => {
              if (activeBooking) {
                setActiveBooking({ ...activeBooking, status: newStatus });
              }
            }}
            onUpdateBooking={(updatedBooking) => {
              setActiveBooking(updatedBooking);
            }}
            onCancelBooking={() => {
              if (activeBooking) {
                setActiveBooking({ ...activeBooking, status: 'cancelled' });
              }
            }}
            onBookAnother={() => handleStartBooking()}
          />
        )}

        {/* DRIVER PORTAL */}
        {currentView === 'driver-portal' && (
          <DriverPortal
            onOpenAuth={() => setIsAuthModalOpen(true)}
          />
        )}

        {/* ADMIN DASHBOARD */}
        {currentView === 'admin-dashboard' && (
          <AdminDashboard
            customEnquiries={sessionEnquiries}
          />
        )}

        {/* POLICY & INFORMATIONAL PAGES */}
        {currentView === 'cancellation-policy' && (
          <PolicyPages type="cancellation" onNavigateBooking={() => handleStartBooking()} />
        )}
        {currentView === 'terms-conditions' && (
          <PolicyPages type="terms" />
        )}
        {currentView === 'privacy-policy' && (
          <PolicyPages type="privacy" />
        )}
        {currentView === 'about-us' && (
          <PolicyPages type="about" />
        )}
        {currentView === 'contact-support' && (
          <PolicyPages type="contact" />
        )}
      </main>

      {/* 4. Global 24x7 Support Floating Widget */}
      <SupportChatWidget />

      {/* 5. Porter-Style Multi-Step Booking Modal */}
      <BookingFlowModal
        isOpen={isBookingModalOpen}
        onClose={() => setIsBookingModalOpen(false)}
        initialPickup={bookingModalParams.pickup}
        initialDrop={bookingModalParams.drop}
        initialCity={bookingModalParams.city}
        initialTripType={bookingModalParams.tripType}
        onBookingConfirmed={handleBookingConfirmed}
        onSwitchToBulkEnquiry={() => {
          setIsBookingModalOpen(false);
          setCurrentView('business-bulk');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* 6. Authentication Modal (with 1-click Demo Logins for Customer, Driver, Admin) */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSuccessRedirect={(destRole) => {
          if (destRole === 'driver') setCurrentView('driver-portal');
          else if (destRole === 'admin') setCurrentView('admin-dashboard');
          else setCurrentView('home');
        }}
      />

      {/* 7. Comprehensive Footer */}
      <Footer
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

    </div>
  );
};

// Root App wrapping AuthProvider
export default function App() {
  return (
    <AuthProvider>
      <AppShell />
    </AuthProvider>
  );
}
