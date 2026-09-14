import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, DriverReview, SuggestedRoute } from '../../types';
import { DriverReviewSection } from './DriverReviewSection';
import { RealTimeRouteMap } from './RealTimeRouteMap';
import { FuelEfficientRouteSuggester } from './FuelEfficientRouteSuggester';
import { TrackingNotificationToast, TrackingNotification } from './TrackingNotificationToast';
import { mockDrivers } from '../../data/mockData';
import { useAuth } from '../../context/AuthContext';
import { 
  Truck, 
  MapPin, 
  PhoneCall, 
  ShieldCheck, 
  CheckCircle2, 
  Clock, 
  FileText, 
  AlertCircle, 
  KeyRound, 
  Download, 
  RotateCcw,
  Sparkles,
  ExternalLink,
  Info,
  ChevronRight,
  Printer,
  Star,
  Award,
  ThumbsUp,
  PackageCheck,
  Leaf
} from 'lucide-react';

interface LiveOrderTrackingProps {
  booking: Booking | null;
  onUpdateStatus?: (newStatus: BookingStatus) => void;
  onUpdateBooking?: (updatedBooking: Booking) => void;
  onCancelBooking?: () => void;
  onBookAnother?: () => void;
}

export const LiveOrderTracking: React.FC<LiveOrderTrackingProps> = ({
  booking,
  onUpdateStatus,
  onUpdateBooking,
  onCancelBooking,
  onBookAnother
}) => {
  const { updateDriverProfile, driverData } = useAuth();
  const [currentStatus, setCurrentStatus] = useState<BookingStatus>(booking?.status || 'in_transit');
  const [driverOtpInput, setDriverOtpInput] = useState('');
  const [otpError, setOtpError] = useState('');
  const [otpSuccess, setOtpSuccess] = useState(false);
  const [showGstInvoiceModal, setShowGstInvoiceModal] = useState(false);
  const [isSimulatingTrip, setIsSimulatingTrip] = useState(false);
  const [driverReview, setDriverReview] = useState<DriverReview | undefined>(booking?.review);
  const [selectedRoute, setSelectedRoute] = useState<SuggestedRoute | undefined>(undefined);
  const [notifications, setNotifications] = useState<TrackingNotification[]>([]);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [currentEta, setCurrentEta] = useState<number>(booking?.etaMins || 48);
  const [simulatedWaypointStep, setSimulatedWaypointStep] = useState<number>(0);

  const routeWaypoints = [
    { name: `${booking?.pickupCity || 'Mumbai'} Freight Depot (Bay A-12)`, message: 'Cargo loading completed and consignment verified against digital manifest.' },
    { name: 'Kharghar Expressway Flyover (KM 14)', message: 'Traversing inter-city arterial corridor; traffic moving smoothly at 54 km/h.' },
    { name: 'Navi Mumbai Fastag Toll Plaza (KM 22)', message: 'RFID electronic fastag pass verified; auto-debited ₹85.', isToll: true, tollName: 'Navi Mumbai Fastag Toll Plaza', tollAmount: 85 },
    { name: 'Panvel Outer Bypass Junction (KM 29)', message: 'Bypassed inner-city congestion zone onto express lane.' },
    { name: 'Taloja Industrial Flyover (KM 34)', message: 'Maintaining steady 52 km/h cruising speed in fuel-optimal gear.' },
    { name: `${booking?.dropLocation?.split(',')[0] || 'Destination Consignee Hub'} Perimeter`, message: 'Truck reached unloading gate; recipient alerted for delivery handover.' }
  ];

  const pushNotification = (notif: Omit<TrackingNotification, 'id' | 'timestamp'>) => {
    const newNotif: TrackingNotification = {
      ...notif,
      id: 'notif-' + Date.now() + '-' + Math.random().toString(36).substring(2, 6),
      timestamp: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
    };
    setNotifications(prev => [newNotif, ...prev.slice(0, 8)]);
  };

  const triggerWaypointNotification = (customWaypoint?: { name: string; message: string; isToll?: boolean; tollName?: string; tollAmount?: number }) => {
    const wp = customWaypoint || routeWaypoints[simulatedWaypointStep % routeWaypoints.length];
    setSimulatedWaypointStep(prev => prev + 1);

    if (wp.isToll) {
      pushNotification({
        type: 'toll_cleared',
        title: `Fastag Toll Cleared: ${wp.name}`,
        message: wp.message,
        waypointName: wp.name,
        meta: {
          tollName: wp.tollName || wp.name,
          tollAmount: wp.tollAmount || 85,
          speedKmH: 48
        }
      });
    } else {
      pushNotification({
        type: 'waypoint_reached',
        title: `Waypoint Reached: ${wp.name}`,
        message: wp.message,
        waypointName: wp.name,
        meta: {
          distanceKm: Number(((booking?.distanceKm || 38) * 0.5).toFixed(1)),
          speedKmH: 52
        }
      });
    }
  };

  const triggerEtaUpdateNotification = (newEtaVal?: number, customRouteName?: string) => {
    const targetEta = newEtaVal !== undefined ? newEtaVal : Math.max(currentEta + (Math.random() > 0.5 ? -3 : 4), 12);
    const delta = targetEta - currentEta;
    setCurrentEta(targetEta);

    pushNotification({
      type: 'eta_update',
      title: delta <= 0 ? 'ETA Updated: Faster Traffic Cleared' : 'ETA Updated: Dynamic Traffic Buffer',
      message: delta <= 0
        ? `Ahead corridor on ${customRouteName || selectedRoute?.name || 'Green Bypass'} is free of bottlenecks. Arrival advanced by ${Math.abs(delta)} mins.`
        : `Moderate signal congestion ahead. Estimated arrival recalculated to ${targetEta} mins (+${delta} mins).`,
      etaMins: targetEta,
      meta: {
        deltaMins: delta,
        routeName: customRouteName || selectedRoute?.name || 'Green Corridor Outer Bypass'
      }
    });
  };

  // Initial ETA Calibration Notification on mount
  useEffect(() => {
    if (!booking) return;
    const timer = setTimeout(() => {
      pushNotification({
        type: 'eta_update',
        title: 'Real-Time ETA Calibrated',
        message: `Initial trip ETA calibrated at ${currentEta} mins for ${booking.distanceKm || 38} km route via optimal corridor.`,
        etaMins: currentEta,
        meta: {
          routeName: selectedRoute?.name || 'Green Corridor Outer Bypass',
          distanceKm: booking.distanceKm || 38
        }
      });
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (booking?.status) {
      setCurrentStatus(booking.status);
    }
    if (booking?.review) {
      setDriverReview(booking.review);
    }
  }, [booking?.status, booking?.review]);

  const handleReviewSubmitted = (review: DriverReview) => {
    setDriverReview(review);
    if (booking) {
      const updatedBooking: Booking = {
        ...booking,
        review,
        status: 'delivered',
        deliveredAt: booking.deliveredAt || new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      };
      if (onUpdateBooking) {
        onUpdateBooking(updatedBooking);
      }
      // Dynamically recalculate and update driver's rating in mock data & context
      if (booking.driverDetails?.id) {
        const idx = mockDrivers.findIndex(d => d.id === booking.driverDetails?.id);
        if (idx !== -1) {
          const currentRating = mockDrivers[idx].rating || 4.8;
          const trips = mockDrivers[idx].tripsCount || 100;
          const newRating = Number(((currentRating * trips + review.rating) / (trips + 1)).toFixed(2));
          mockDrivers[idx].rating = newRating;
          mockDrivers[idx].tripsCount = trips + 1;
          if (driverData && driverData.id === booking.driverDetails.id && updateDriverProfile) {
            updateDriverProfile({ rating: newRating, tripsCount: trips + 1 });
          }
        }
      }
    }
  };

  const handleMarkDeliveryCompleted = () => {
    const nextStatus: BookingStatus = 'delivered';
    setCurrentStatus(nextStatus);
    if (onUpdateStatus) {
      onUpdateStatus(nextStatus);
    }
    if (booking && onUpdateBooking) {
      onUpdateBooking({
        ...booking,
        status: nextStatus,
        deliveredAt: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
      });
    }
    triggerWaypointNotification({
      name: `Consignee Hub (${booking.dropLocation?.split(',')[0] || 'Destination'})`,
      message: 'Consignment safely handed over & proof of delivery signed. Rating unlocked.'
    });
  };

  if (!booking) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-4">
          <Truck className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-2">No Active Consignment Selected</h2>
        <p className="text-sm text-slate-600 max-w-md mx-auto mb-6">
          You don't have an active trip running right now. Book a mini-truck from the homepage or pick one of your past bookings.
        </p>
        <button
          onClick={onBookAnother}
          className="px-6 py-2.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-sm transition"
        >
          Book a Truck Now
        </button>
      </div>
    );
  }

  const statuses: { key: BookingStatus; label: string; desc: string; icon: string }[] = [
    { key: 'driver_assigned', label: 'Driver Assigned', desc: 'Driver confirmed and assigned', icon: '1' },
    { key: 'en_route', label: 'Mobilizing to Pickup', desc: 'Driver en route to your pickup point', icon: '2' },
    { key: 'arrived', label: 'Arrived at Pickup', desc: 'Vehicle reached location; ready for loading', icon: '3' },
    { key: 'in_transit', label: 'Cargo In Transit', desc: 'OTP verified; en route to destination', icon: '4' },
    { key: 'delivered', label: 'Delivered & Completed', desc: 'Consignment safely handed over & POD signed', icon: '5' }
  ];

  const currentStatusIndex = statuses.findIndex(s => s.key === currentStatus);

  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    if (driverOtpInput.trim() === booking.pickupOtp) {
      setOtpSuccess(true);
      setOtpError('');
      // Advance status from arrived/driver_assigned directly to in_transit
      const nextStatus: BookingStatus = 'in_transit';
      setCurrentStatus(nextStatus);
      if (onUpdateStatus) onUpdateStatus(nextStatus);
      triggerWaypointNotification({
        name: 'Origin Dispatch Bay (OTP Verified)',
        message: 'Security inspection cleared. Consignment in transit on highway corridor.'
      });
    } else {
      setOtpError(`Invalid OTP! Please enter the 4-digit code (${booking.pickupOtp}) shown above.`);
    }
  };

  const advanceStepSim = () => {
    if (currentStatusIndex < statuses.length - 1) {
      const next = statuses[currentStatusIndex + 1].key;
      setCurrentStatus(next);
      if (onUpdateStatus) onUpdateStatus(next);

      if (next === 'en_route') {
        triggerWaypointNotification({
          name: `${booking.pickupCity} Fleet Hub`,
          message: 'Pilot mobilized and en route to pickup point.'
        });
      } else if (next === 'arrived') {
        triggerWaypointNotification({
          name: `Pickup Point (${booking.pickupCity})`,
          message: 'Vehicle arrived at loading bay; ready for OTP verification and cargo loading.'
        });
      } else if (next === 'in_transit') {
        triggerWaypointNotification({
          name: 'Highway Outer Ring Road Interchange',
          message: 'Consignment successfully loaded; truck merged onto highway transit corridor.'
        });
      } else if (next === 'delivered') {
        triggerWaypointNotification({
          name: `Consignee Hub (${booking.dropLocation?.split(',')[0] || 'Destination'})`,
          message: 'Final destination reached; consignment delivered and signed for.'
        });
      }
    }
  };

  const simulateFullTrip = () => {
    setIsSimulatingTrip(true);
    let step = 0;
    const interval = setInterval(() => {
      if (step < statuses.length) {
        setCurrentStatus(statuses[step].key);
        if (onUpdateStatus) onUpdateStatus(statuses[step].key);
        step++;
      } else {
        clearInterval(interval);
        setIsSimulatingTrip(false);
      }
    }, 2500);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 space-y-6 relative">
      {/* Live Simulated Toast Notifications for ETA Updates & Waypoints */}
      <TrackingNotificationToast
        notifications={notifications}
        onDismiss={(id) => setNotifications(prev => prev.filter(n => n.id !== id))}
        onClearAll={() => setNotifications([])}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(prev => !prev)}
      />

      {/* Top Banner with Consignment ID & Quick Switch Simulator */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-xs font-bold uppercase tracking-wider bg-slate-900 text-white px-2.5 py-0.5 rounded">
              Trip #{booking.bookingNumber}
            </span>
            <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
              Live Pan-India Tracking
            </span>
            <span className="text-xs text-slate-500">
              Booked at {booking.createdAt}
            </span>
          </div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            {booking.vehicleCategoryName}
          </h1>
          <p className="text-xs text-slate-600 mt-0.5 flex items-center gap-2 flex-wrap">
            <span>{booking.goodsType} • Approx. {selectedRoute ? selectedRoute.distanceKm : booking.distanceKm} km</span>
            <span className="text-slate-300">•</span>
            <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[11px] flex items-center gap-1">
              <Leaf className="w-3 h-3 text-emerald-600" />
              <span>{selectedRoute ? selectedRoute.name : 'Green Corridor Bypass'}</span>
              <span className="font-bold font-mono">({selectedRoute ? selectedRoute.etaMins : (booking.etaMins || 48)} mins ETA)</span>
            </span>
          </p>
        </div>

        {/* Demo Simulation Controls */}
        <div className="flex items-center gap-2 flex-wrap bg-slate-50 p-2 rounded-xl border border-slate-200">
          <span className="text-[11px] font-bold text-slate-600 flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Demo Controls:
          </span>
          <button
            onClick={advanceStepSim}
            disabled={currentStatus === 'delivered' || isSimulatingTrip}
            className="px-2.5 py-1 text-xs bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 rounded-lg font-semibold transition disabled:opacity-40"
          >
            Advance Status →
          </button>
          <button
            onClick={simulateFullTrip}
            disabled={isSimulatingTrip}
            className="px-2.5 py-1 text-xs bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-lg transition disabled:opacity-40"
          >
            {isSimulatingTrip ? 'Simulating...' : 'Auto-Run Trip ⏱'}
          </button>
          {currentStatus !== 'delivered' ? (
            <button
              onClick={handleMarkDeliveryCompleted}
              className="px-2.5 py-1 text-xs bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg transition flex items-center gap-1 shadow-2xs"
            >
              <PackageCheck className="w-3.5 h-3.5" />
              <span>Mark Completed & Rate ⭐</span>
            </button>
          ) : (
            <button
              onClick={() => {
                setCurrentStatus('in_transit');
                if (onUpdateStatus) onUpdateStatus('in_transit');
              }}
              className="px-2.5 py-1 text-xs bg-slate-200 hover:bg-slate-300 text-slate-800 font-semibold rounded-lg transition flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" />
              <span>Reset to In Transit</span>
            </button>
          )}

          {/* Toast Notification Simulation Buttons */}
          <div className="h-4 w-px bg-slate-300 mx-0.5 hidden sm:block"></div>

          <button
            onClick={() => triggerWaypointNotification()}
            className="px-2.5 py-1 text-xs bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-lg font-semibold transition flex items-center gap-1 shadow-2xs"
            title="Simulate Waypoint Reached Notification"
          >
            <MapPin className="w-3 h-3 text-emerald-600" />
            <span>Test Waypoint 📍</span>
          </button>

          <button
            onClick={() => triggerEtaUpdateNotification()}
            className="px-2.5 py-1 text-xs bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg font-semibold transition flex items-center gap-1 shadow-2xs"
            title="Simulate ETA Update Notification"
          >
            <Clock className="w-3 h-3 text-amber-600" />
            <span>Test ETA Alert ⏱</span>
          </button>
        </div>
      </div>

      {/* Main Grid: Status Pipeline + Driver Card + Map Schematic */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Pipeline, Route Map & OTP interaction */}
        <div className="lg:col-span-2 space-y-6">

          {/* STAR-RATING & FEEDBACK SECTION: Displayed prominently when delivery is marked as 'completed' */}
          {currentStatus === 'delivered' && (
            <div className="animate-in fade-in slide-in-from-top-4 duration-300">
              <DriverReviewSection
                booking={booking}
                onSubmitReview={handleReviewSubmitted}
                existingReview={driverReview}
              />
            </div>
          )}

          {/* Quick Customer Delivery Completion Action when in transit */}
          {currentStatus === 'in_transit' && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-2xl p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold flex-shrink-0 shadow-xs">
                  <PackageCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-bold text-emerald-950">Consignment Reached Destination?</h4>
                  <p className="text-xs text-emerald-800">Confirm delivery handover to sign POD and share your star-rating for {booking.driverDetails?.name || 'the driver'}.</p>
                </div>
              </div>
              <button
                onClick={handleMarkDeliveryCompleted}
                className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap active:scale-98"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Confirm Delivery & Review</span>
              </button>
            </div>
          )}

          {/* Status Pipeline Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs space-y-6">
            <h2 className="text-base font-bold font-display text-slate-900 flex items-center justify-between">
              <span>Trip Progress Sequence</span>
              <span className="text-xs font-semibold px-2.5 py-1 bg-amber-50 text-amber-900 border border-amber-200 rounded-full capitalize">
                Current: {currentStatus.replace('_', ' ')}
              </span>
            </h2>

            <div className="relative">
              {/* Progress bar background line */}
              <div className="absolute left-4 sm:left-6 top-4 bottom-4 w-0.5 bg-slate-200 -z-0"></div>

              <div className="space-y-6 relative z-10">
                {statuses.map((s, idx) => {
                  const isDone = idx < currentStatusIndex;
                  const isCurrent = idx === currentStatusIndex;
                  const isPending = idx > currentStatusIndex;

                  return (
                    <div key={s.key} className="flex items-start gap-4">
                      <div
                        className={`w-9 h-9 sm:w-12 sm:h-12 rounded-2xl flex items-center justify-center font-bold text-xs sm:text-sm flex-shrink-0 transition ${
                          isDone
                            ? 'bg-emerald-600 text-white shadow-sm'
                            : isCurrent
                            ? 'bg-amber-500 text-slate-950 ring-4 ring-amber-100 shadow-md animate-pulse'
                            : 'bg-slate-100 text-slate-400 border border-slate-200'
                        }`}
                      >
                        {isDone ? <CheckCircle2 className="w-5 h-5" /> : idx + 1}
                      </div>
                      <div className="pt-1 flex-1">
                        <div className="flex items-center justify-between flex-wrap">
                          <p className={`text-sm font-bold ${isCurrent ? 'text-slate-900 text-base font-display' : isDone ? 'text-slate-800' : 'text-slate-400'}`}>
                            {s.label}
                          </p>
                          {isCurrent && (
                            <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2 py-0.5 rounded">
                              Active State
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">
                          {s.desc}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Interactive OTP Verification UI Element */}
          <div className="bg-gradient-to-br from-slate-900 to-slate-950 text-white rounded-2xl p-6 shadow-md border border-slate-800">
            <div className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-amber-500 text-slate-950 flex items-center justify-center font-black">
                <KeyRound className="w-4 h-4" />
              </div>
              <div>
                <h3 className="text-base font-bold font-display text-white">Pickup Verification OTP</h3>
                <p className="text-xs text-slate-400">Share this code with the driver only upon physical truck arrival</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center mt-4 pt-4 border-t border-slate-800">
              {/* Customer View: 4-digit code */}
              <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700/80 text-center">
                <p className="text-xs uppercase tracking-wider font-semibold text-slate-400 mb-1">
                  Your Pickup OTP Code
                </p>
                <div className="text-3xl font-mono font-black tracking-widest text-amber-400 select-all">
                  {booking.pickupOtp}
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Driver must verify this to start loading & departure
                </p>
              </div>

              {/* Driver Input Simulator to advance state */}
              <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50">
                <p className="text-xs font-bold text-slate-200 mb-1">
                  Driver OTP Entry Simulator
                </p>
                <p className="text-[11px] text-slate-400 mb-2.5">
                  Test the driver handoff interaction: Enter code <strong>{booking.pickupOtp}</strong> below to confirm pickup.
                </p>
                <form onSubmit={handleVerifyOtp} className="flex gap-2">
                  <input
                    type="text"
                    maxLength={6}
                    value={driverOtpInput}
                    onChange={(e) => setDriverOtpInput(e.target.value)}
                    placeholder="Enter 4-digit OTP"
                    className="w-full px-3 py-2 text-sm bg-slate-900 border border-slate-600 rounded-lg text-white font-mono tracking-widest focus:outline-none focus:border-amber-400 text-center"
                  />
                  <button
                    type="submit"
                    className="px-4 py-2 bg-amber-500 hover:bg-amber-600 text-slate-950 text-xs font-bold rounded-lg transition flex-shrink-0"
                  >
                    Verify & Mobilize
                  </button>
                </form>
                {otpError && (
                  <p className="text-[11px] text-red-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {otpError}
                  </p>
                )}
                {otpSuccess && (
                  <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                    <CheckCircle2 className="w-3 h-3" /> OTP Verified! Consignment is now In Transit.
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Real-Time SVG Map & Highway Corridor Route */}
          <RealTimeRouteMap 
            booking={booking} 
            currentStatus={currentStatus} 
            suggestedRoute={selectedRoute} 
          />

          {/* AI Fuel-Efficient Route Suggestion & Distance-Based ETA Engine */}
          <FuelEfficientRouteSuggester
            booking={booking}
            selectedRouteId={selectedRoute?.id || booking.selectedRouteId || 'eco-green-bypass'}
            onSelectRoute={(route) => {
              setSelectedRoute(route);
              triggerEtaUpdateNotification(route.etaMins, route.name);
              if (booking && onUpdateBooking) {
                onUpdateBooking({
                  ...booking,
                  selectedRouteId: route.id,
                  etaMins: route.etaMins
                });
              }
            }}
          />
        </div>

        {/* Right Col: Driver Profile Card, Fare Summary & GST Invoice CTA */}
        <div className="space-y-6">
          {/* Driver Card with Photo, Rating & Contact */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                Assigned Pilot & Truck
              </span>
              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Verified Driver
              </span>
            </div>

            <div className="flex items-center gap-3.5">
              <img
                src={booking.driverDetails?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={booking.driverDetails?.name}
                className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-500 shadow-sm"
              />
              <div>
                <h4 className="text-base font-bold text-slate-900">{booking.driverDetails?.name}</h4>
                <div className="flex items-center gap-2 mt-0.5">
                  <span className="text-xs font-bold text-amber-600">★ {booking.driverDetails?.rating}</span>
                  <span className="text-xs text-slate-400">({booking.driverDetails?.completedTrips} trips)</span>
                </div>
                <div className="mt-1 text-xs font-mono font-bold bg-slate-100 text-slate-800 px-2 py-0.5 rounded inline-block border border-slate-200">
                  {booking.driverDetails?.vehicleNumber}
                </div>
              </div>
            </div>

            <div className="p-2.5 bg-slate-50 rounded-xl text-xs text-slate-600 space-y-1">
              <p>Vehicle: <strong>{booking.driverDetails?.vehicleModel}</strong></p>
              <p>Commercial Driver License: <strong>MH02 2017009412 (Verified)</strong></p>
            </div>

            {/* Customer Rating Status on Driver Card */}
            {driverReview ? (
              <div className="p-3 bg-amber-50/80 rounded-xl border border-amber-200 text-xs space-y-1">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-800 flex items-center gap-1">
                    <Award className="w-3.5 h-3.5 text-amber-600" />
                    <span>Your Review</span>
                  </span>
                  <div className="flex items-center gap-1 text-amber-700 font-bold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-500" />
                    <span>{driverReview.rating}.0 / 5.0</span>
                  </div>
                </div>
                <p className="text-[11px] text-slate-600 italic line-clamp-2">
                  "{driverReview.feedback}"
                </p>
                {driverReview.tipAmount && driverReview.tipAmount > 0 && (
                  <p className="text-[10px] font-bold text-emerald-700 pt-0.5">
                    ✓ ₹{driverReview.tipAmount} Appreciation Tip Paid
                  </p>
                )}
              </div>
            ) : currentStatus === 'delivered' ? (
              <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200 text-[11px] text-amber-800 flex items-center gap-2">
                <Star className="w-4 h-4 text-amber-500 fill-amber-400 flex-shrink-0" />
                <span>Delivery complete! Submit your star-rating and feedback.</span>
              </div>
            ) : null}

            <div className="grid grid-cols-2 gap-2">
              <a
                href={`tel:${booking.driverDetails?.phone}`}
                className="py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 shadow-sm"
              >
                <PhoneCall className="w-3.5 h-3.5" /> Call Driver
              </a>
              <a
                href="tel:18002098899"
                className="py-2.5 px-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-400" /> Support Desk
              </a>
            </div>
          </div>

          {/* Costing Breakdown Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs space-y-3 text-xs">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider pb-2 border-b border-slate-100">
              Booking Costing Summary
            </h4>
            <div className="space-y-1.5 text-slate-600">
              <div className="flex justify-between">
                <span>Base Fare:</span>
                <span>₹{booking.baseFare}</span>
              </div>
              <div className="flex justify-between">
                <span>Distance Fare (~{booking.distanceKm} km):</span>
                <span>₹{booking.distanceFare}</span>
              </div>
              {booking.driverHelperNeeded && (
                <div className="flex justify-between">
                  <span>Driver Helper Assistance:</span>
                  <span>₹{booking.helperFee}</span>
                </div>
              )}
              {booking.transitInsurance && (
                <div className="flex justify-between">
                  <span>Transit Insurance Protection:</span>
                  <span>₹{booking.insuranceFee}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>GTA GST (5% SAC 9965):</span>
                <span>₹{booking.gstAmount}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-950">
                <span>Total Fare:</span>
                <span className="text-amber-700">₹{booking.totalEstimatedFare}</span>
              </div>
              <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                <span>Payment Mode:</span>
                <span className="font-semibold uppercase text-slate-700">
                  {booking.paymentMethod === 'online_upi' ? 'Online UPI (Paid)' : 'Pay Driver (Cash / UPI)'}
                </span>
              </div>
            </div>

            {/* Toll Notice Callout */}
            <div className="p-2.5 bg-amber-50 rounded-lg text-[11px] text-amber-900 border border-amber-200">
              <p className="font-bold">Tolls & State Taxes Extra:</p>
              <p>Actual toll receipts (approx ₹{booking.estimatedTolls}) to be settled at plaza or with driver.</p>
            </div>

            {/* GST Tax Invoice Button */}
            <button
              onClick={() => setShowGstInvoiceModal(true)}
              className="w-full py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition flex items-center justify-center gap-1.5 border border-slate-300"
            >
              <Download className="w-3.5 h-3.5 text-slate-600" />
              Download GST Tax Invoice
            </button>
          </div>

          {/* Cancellation Notice */}
          <div className="bg-slate-50 rounded-2xl border border-slate-200 p-4 text-xs text-slate-600 space-y-2">
            <p className="font-bold text-slate-800 flex items-center gap-1.5">
              <Info className="w-3.5 h-3.5 text-slate-500" /> Cancellation Policy:
            </p>
            <p className="text-[11px] leading-relaxed">
              {booking.cancellationPolicy}
            </p>
            {currentStatus === 'driver_assigned' && (
              <button
                onClick={onCancelBooking}
                className="w-full py-2 text-xs text-red-600 font-bold border border-red-200 hover:bg-red-50 rounded-xl transition"
              >
                Cancel Consignment
              </button>
            )}
          </div>
        </div>
      </div>

      {/* GST TAX INVOICE PREVIEW MODAL */}
      {showGstInvoiceModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden animate-in fade-in">
            {/* Modal Header */}
            <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
              <div>
                <h3 className="font-display font-bold text-lg">Tax Invoice / Lorry Receipt (LR)</h3>
                <p className="text-xs text-slate-400">Goods Transport Agency (GTA) • SAC 996511</p>
              </div>
              <button
                onClick={() => setShowGstInvoiceModal(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg"
              >
                ✕
              </button>
            </div>

            {/* Printable Invoice Body */}
            <div className="p-6 space-y-4 text-xs text-slate-800 max-h-[75vh] overflow-y-auto">
              <div className="flex justify-between items-start pb-4 border-b border-slate-200">
                <div>
                  <h4 className="text-lg font-black text-slate-900 font-display">TRUCKSETU LOGISTICS INDIA LTD</h4>
                  <p className="text-slate-500 text-[11px]">CIN: U63090DL2024PTC192812</p>
                  <p className="text-slate-500 text-[11px]">GSTIN: 07AABCT9918Q1Z4 (Delhi HQ)</p>
                  <p className="text-slate-500 text-[11px]">Toll-Free Control Room: 1800 209 8899</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold uppercase tracking-wider bg-amber-100 text-amber-800 px-2 py-0.5 rounded">
                    ORIGINAL FOR RECIPIENT
                  </span>
                  <p className="font-mono font-bold mt-1 text-slate-900">INV-{booking.bookingNumber}</p>
                  <p className="text-slate-500 text-[11px]">Date: {booking.createdAt}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-200">
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">CONSIGNOR (SENDER)</p>
                  <p className="font-bold text-slate-900">{booking.customerName}</p>
                  <p className="text-slate-600">{booking.pickupLocation}</p>
                  <p className="text-slate-600">Phone: {booking.customerPhone}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase font-bold text-slate-500">CONSIGNEE (RECEIVER)</p>
                  <p className="font-bold text-slate-900">{booking.receiverName || 'Consignee on Site'}</p>
                  <p className="text-slate-600">{booking.dropLocation}</p>
                  <p className="text-slate-600">Phone: {booking.receiverPhone || booking.customerPhone}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2 p-3 bg-slate-50 rounded-xl text-[11px]">
                <div>
                  <span className="text-slate-500">Vehicle No:</span>
                  <p className="font-bold font-mono">{booking.driverDetails?.vehicleNumber}</p>
                </div>
                <div>
                  <span className="text-slate-500">Category:</span>
                  <p className="font-bold">{booking.vehicleCategoryName}</p>
                </div>
                <div>
                  <span className="text-slate-500">Distance:</span>
                  <p className="font-bold">~{booking.distanceKm} km</p>
                </div>
              </div>

              <table className="w-full border-collapse text-left text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-700 font-bold border-y border-slate-200">
                    <th className="py-2 px-3">Description of Freight Service</th>
                    <th className="py-2 px-2">SAC</th>
                    <th className="py-2 px-2 text-right">Taxable (₹)</th>
                    <th className="py-2 px-2 text-right">GST Rate</th>
                    <th className="py-2 px-3 text-right">Total (₹)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="py-2 px-3">
                      Freight Transport Charges ({booking.goodsType})
                      {booking.driverHelperNeeded && ' + Loading Helper Service'}
                      {booking.transitInsurance && ' + Transit Risk Coverage'}
                    </td>
                    <td className="py-2 px-2 font-mono">996511</td>
                    <td className="py-2 px-2 text-right">{(booking.totalEstimatedFare - booking.gstAmount).toFixed(2)}</td>
                    <td className="py-2 px-2 text-right">5.0% (GTA)</td>
                    <td className="py-2 px-3 text-right font-bold">{booking.totalEstimatedFare.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex justify-between items-end pt-2 border-t border-slate-200">
                <div className="text-[10px] text-slate-500 max-w-xs space-y-0.5">
                  <p>• Reverse Charge Mechanism (RCM): Not Applicable.</p>
                  <p>• Goods Transport Agency covered under Notification 11/2017-Central Tax (Rate).</p>
                  <p>• Computer generated electronic tax invoice. No signature required.</p>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-xs text-slate-600">Taxable Value: ₹{(booking.totalEstimatedFare - booking.gstAmount).toFixed(2)}</p>
                  <p className="text-xs text-slate-600">GST (5%): ₹{booking.gstAmount.toFixed(2)}</p>
                  <p className="text-sm font-black text-slate-950">Invoice Total: ₹{booking.totalEstimatedFare.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 p-4 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowGstInvoiceModal(false)}
                className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl"
              >
                Close
              </button>
              <button
                onClick={() => {
                  alert('GST Tax Invoice downloaded successfully in PDF format (Demo).');
                  setShowGstInvoiceModal(false);
                }}
                className="px-5 py-2 text-xs font-bold bg-slate-900 text-white hover:bg-slate-800 rounded-xl flex items-center gap-1.5 shadow"
              >
                <Printer className="w-3.5 h-3.5" />
                Download PDF
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
