import React, { useState } from 'react';
import { 
  X, 
  MapPin, 
  Check, 
  Truck, 
  Shield, 
  UserCheck, 
  Clock, 
  Info, 
  CreditCard, 
  Banknote, 
  ArrowRight, 
  ChevronRight,
  Sparkles,
  AlertTriangle
} from 'lucide-react';
import { VehicleCategory, Booking, PaymentMethod } from '../../types';
import { mockVehicleCategories, mockIndianCities, mockCityHubs } from '../../data/mockData';

interface BookingFlowModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPickup?: string;
  initialDrop?: string;
  initialCity?: string;
  initialTripType?: 'intracity' | 'intercity';
  onBookingConfirmed: (newBooking: Booking) => void;
  onSwitchToBulkEnquiry: () => void;
}

export const BookingFlowModal: React.FC<BookingFlowModalProps> = ({
  isOpen,
  onClose,
  initialPickup = '',
  initialDrop = '',
  initialCity = 'Delhi NCR',
  initialTripType = 'intracity',
  onBookingConfirmed,
  onSwitchToBulkEnquiry
}) => {
  // Step 1: Location & Goods, Step 2: Vehicle Choice, Step 3: Fare & Addons Checkout, Step 4: Confirmed
  const [step, setStep] = useState<1 | 2 | 3>(1);

  // Form State
  const [tripType, setTripType] = useState<'intracity' | 'intercity'>(initialTripType);
  const [city, setCity] = useState(initialCity);
  const [pickupAddress, setPickupAddress] = useState(
    initialPickup || (mockCityHubs[initialCity]?.[0] || 'Okhla Industrial Area Phase 2, New Delhi')
  );
  const [dropAddress, setDropAddress] = useState(
    initialDrop || (mockCityHubs[initialCity]?.[1] || 'Gurugram Udyog Vihar Phase 4, Haryana')
  );
  const [goodsType, setGoodsType] = useState('Home Shifting / Furniture');
  const [receiverName, setReceiverName] = useState('Rajeev Ranjan');
  const [receiverPhone, setReceiverPhone] = useState('+91 98112 34567');

  // Filter categories strictly: retail instant booking only shows Three-Wheeler through 14/17/19ft Eicher
  const retailVehicles = mockVehicleCategories.filter(v => v.categoryType === 'intracity');
  const [selectedVehicle, setSelectedVehicle] = useState<VehicleCategory>(retailVehicles[1] || retailVehicles[0]);

  // Checkout Add-ons
  const [driverHelperNeeded, setDriverHelperNeeded] = useState(false);
  const helperFee = 350; // flat standard helper fee

  const [transitInsurance, setTransitInsurance] = useState(false);
  const [declaredGoodsValue, setDeclaredGoodsValue] = useState<number>(50000);
  const insuranceFee = transitInsurance ? Math.max(100, Math.round(declaredGoodsValue * 0.0025)) : 0; // 0.25% or min ₹100

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('online_upi');

  // Simulated Distance calculation
  const mockDistanceKm = tripType === 'intracity' ? 24 : 180;
  const baseFare = selectedVehicle.baseFare;
  const extraKm = Math.max(0, mockDistanceKm - selectedVehicle.baseKmIncluded);
  const distanceFare = extraKm * selectedVehicle.perKmRate;
  const subTotal = baseFare + distanceFare + (driverHelperNeeded ? helperFee : 0) + insuranceFee;
  const estimatedTolls = tripType === 'intracity' ? 120 : 650; // Clearly disclosed as EXTRA
  const gstAmount = Math.round(subTotal * 0.05); // 5% GTA GST
  const totalEstimatedFare = subTotal + gstAmount;

  if (!isOpen) return null;

  const handleConfirm = () => {
    // Generate fresh 4-digit pickup OTP
    const generatedOtp = String(Math.floor(1000 + Math.random() * 9000));
    const newBooking: Booking = {
      id: `bk-${Date.now().toString().slice(-4)}`,
      bookingNumber: `TS-2026-${Math.floor(1000 + Math.random() * 9000)}`,
      customerId: 'cust-201',
      customerName: 'Priya Sharma',
      customerPhone: '+91 98210 44556',
      pickupLocation: pickupAddress,
      dropLocation: dropAddress,
      pickupCity: city,
      dropCity: city,
      distanceKm: mockDistanceKm,
      vehicleCategoryId: selectedVehicle.id,
      vehicleCategoryName: `${selectedVehicle.name} (${selectedVehicle.capacityDisplay})`,
      goodsType,
      driverHelperNeeded,
      helperFee: driverHelperNeeded ? helperFee : 0,
      transitInsurance,
      declaredGoodsValue: transitInsurance ? declaredGoodsValue : 0,
      insuranceFee,
      baseFare,
      distanceFare,
      estimatedTolls,
      gstAmount,
      totalEstimatedFare,
      paymentMethod,
      paymentStatus: paymentMethod === 'online_upi' ? 'completed' : 'cash_on_delivery',
      status: 'driver_assigned',
      pickupOtp: generatedOtp,
      etaMins: selectedVehicle.estimatedEtaMins,
      driverDetails: {
        id: 'drv-101',
        name: 'Ramesh Kumar',
        phone: '+91 98204 11234',
        photo: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
        vehicleNumber: 'MH 02 CW 4821',
        vehicleModel: `${selectedVehicle.name} (White)`,
        rating: 4.88,
        completedTrips: 1420
      },
      receiverName,
      receiverPhone,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      cancellationPolicy: 'Free cancellation within 5 minutes of driver assignment. ₹100 fee applies after 5 minutes.'
    };

    onBookingConfirmed(newBooking);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div 
        id="booking-modal-container"
        className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden border border-slate-200 my-6 animate-in fade-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]"
      >
        {/* Modal Header */}
        <div className="bg-slate-900 text-white p-5 sm:p-6 flex items-center justify-between relative flex-shrink-0">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] uppercase font-bold tracking-widest bg-amber-500 text-slate-950 px-2 py-0.5 rounded">
                Instant Booking Flow
              </span>
              <span className="text-xs text-slate-400">Step {step} of 3</span>
            </div>
            <h2 className="text-xl font-bold font-display text-white">
              {step === 1 && 'Pickup & Destination Details'}
              {step === 2 && 'Select Mini-Truck Category'}
              {step === 3 && 'Fare Estimate & Checkout'}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1.5 rounded-lg hover:bg-slate-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Step Indicators */}
        <div className="bg-slate-100 px-6 py-2.5 border-b border-slate-200 flex items-center justify-between text-xs font-semibold text-slate-600 flex-shrink-0">
          <div className={`flex items-center gap-1.5 ${step >= 1 ? 'text-amber-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 1 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>1</span>
            <span>Route & Goods</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className={`flex items-center gap-1.5 ${step >= 2 ? 'text-amber-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 2 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>2</span>
            <span>Choose Vehicle</span>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
          <div className={`flex items-center gap-1.5 ${step >= 3 ? 'text-amber-700 font-bold' : ''}`}>
            <span className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] ${step >= 3 ? 'bg-amber-600 text-white' : 'bg-slate-300'}`}>3</span>
            <span>Confirm & Pay</span>
          </div>
        </div>

        {/* Modal Content Scrollable Area */}
        <div className="p-6 overflow-y-auto space-y-5 flex-1">
          {/* STEP 1: ROUTE & GOODS DETAILS */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between bg-slate-50 p-2 rounded-xl border border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-700">Service Scope:</span>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-amber-100 text-amber-900 rounded-md">
                    Intracity Instant Logistics
                  </span>
                </div>
                <div className="text-[11px] text-slate-500">
                  City: <strong className="text-slate-800">{city}</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Pickup Location in {city} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-emerald-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={pickupAddress}
                    onChange={(e) => setPickupAddress(e.target.value)}
                    placeholder="Enter flat/door no, building, street, landmark"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                {/* Hub suggestions */}
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">Quick hubs:</span>
                  {(mockCityHubs[city] || mockCityHubs['Mumbai']).slice(0, 3).map((hub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setPickupAddress(hub)}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded transition border border-slate-200"
                    >
                      {hub.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                  Drop-off Location in {city} *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-red-600 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={dropAddress}
                    onChange={(e) => setDropAddress(e.target.value)}
                    placeholder="Enter recipient warehouse, flat, shop, landmark"
                    className="w-full pl-9 pr-3 py-2.5 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
                <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                  <span className="text-[11px] text-slate-500">Quick hubs:</span>
                  {(mockCityHubs[city] || mockCityHubs['Mumbai']).slice(2, 5).map((hub, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => setDropAddress(hub)}
                      className="text-[11px] px-2 py-0.5 bg-slate-100 hover:bg-amber-50 hover:text-amber-800 text-slate-700 rounded transition border border-slate-200"
                    >
                      {hub.split('(')[0].trim()}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Goods Category *
                  </label>
                  <select
                    value={goodsType}
                    onChange={(e) => setGoodsType(e.target.value)}
                    className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-xl bg-white focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  >
                    <option value="Home Shifting / Furniture">Home Shifting / Furniture</option>
                    <option value="Industrial Hardware & Tools">Industrial Hardware & Tools</option>
                    <option value="Electrical Appliances & Electronics">Electrical Appliances & Electronics</option>
                    <option value="Packaging & Carton Boxes">Packaging & Carton Boxes</option>
                    <option value="Textile, Apparel & Fabric Rolls">Textile, Apparel & Fabric Rolls</option>
                    <option value="Plywood, Timber & Construction Materials">Plywood, Timber & Construction</option>
                    <option value="Commercial Kitchen & Restaurant Supplies">Commercial Kitchen Supplies</option>
                    <option value="Other Commercial Cargo">Other Commercial Cargo</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                    Receiver Contact Person
                  </label>
                  <input
                    type="text"
                    value={receiverName}
                    onChange={(e) => setReceiverName(e.target.value)}
                    placeholder="Recipient name"
                    className="w-full py-2.5 px-3 text-sm border border-slate-300 rounded-xl focus:ring-2 focus:ring-amber-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-700 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Need heavy containers (20/32ft) or 40ft Trailers for Intercity?</span>{' '}
                  Commercial containers & multi-axle trailers are routed through our dedicated B2B Bulk desk.{' '}
                  <button
                    type="button"
                    onClick={() => {
                      onClose();
                      onSwitchToBulkEnquiry();
                    }}
                    className="font-bold underline text-amber-800 hover:text-amber-950"
                  >
                    Switch to Business / Bulk Enquiry →
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: VEHICLE CATEGORY SELECTION */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Available Intracity Fleet for Your Route (~{mockDistanceKm} km)
                </p>
                <span className="text-[11px] text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  ✓ Verified Drivers Near Pickup
                </span>
              </div>

              <div className="space-y-2.5">
                {retailVehicles.map((vehicle) => {
                  const isSelected = selectedVehicle.id === vehicle.id;
                  const estimatedFareForCard = vehicle.baseFare + Math.max(0, mockDistanceKm - vehicle.baseKmIncluded) * vehicle.perKmRate;

                  return (
                    <div
                      key={vehicle.id}
                      onClick={() => setSelectedVehicle(vehicle)}
                      className={`p-3.5 rounded-xl border-2 transition cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                        isSelected 
                          ? 'border-amber-500 bg-amber-50/50 shadow-xs ring-1 ring-amber-500/30' 
                          : 'border-slate-200 hover:border-slate-300 bg-white'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${
                          isSelected ? 'bg-amber-500 text-slate-950 font-bold' : 'bg-slate-100 text-slate-700'
                        }`}>
                          <Truck className="w-6 h-6" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <h3 className="text-sm font-bold text-slate-900">{vehicle.name}</h3>
                            <span className="text-xs text-slate-500 font-medium">({vehicle.hindiName})</span>
                            {vehicle.badge && (
                              <span className="text-[10px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.5 rounded">
                                {vehicle.badge}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3 text-xs text-slate-600 mt-1 flex-wrap">
                            <span className="font-semibold text-slate-800">Payload: {vehicle.capacityDisplay}</span>
                            <span>•</span>
                            <span>Deck: {vehicle.dimensions}</span>
                            <span>•</span>
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Clock className="w-3 h-3" /> Arriving in ~{vehicle.estimatedEtaMins} mins
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="text-right sm:border-l sm:border-slate-200 sm:pl-4 flex-shrink-0 flex sm:flex-col items-center sm:items-end justify-between">
                        <div className="text-left sm:text-right">
                          <p className="text-xs text-slate-500">Est. Base + Km</p>
                          <p className="text-base font-black text-slate-900">₹{estimatedFareForCard}</p>
                        </div>
                        <div className="sm:mt-1">
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${
                            isSelected ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {isSelected ? 'Selected' : 'Select'}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-slate-700">
                  <Clock className="w-4 h-4 text-amber-600" />
                  <span>
                    Selected <strong>{selectedVehicle.name}</strong> • Driver ETA nearby: <strong>~{selectedVehicle.estimatedEtaMins} minutes</strong>
                  </span>
                </div>
                <span className="text-slate-400 text-[11px] hidden sm:inline">Pan-India Tracking Ready</span>
              </div>
            </div>
          )}

          {/* STEP 3: FARE BREAKDOWN & CHECKOUT ADDONS */}
          {step === 3 && (
            <div className="space-y-5">
              {/* ETA Display Before Confirmation */}
              <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold">
                    <Clock className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-emerald-950">
                      Estimated Driver Arrival Time (Pre-Booking ETA):
                    </p>
                    <p className="text-sm font-extrabold text-emerald-800">
                      ~{selectedVehicle.estimatedEtaMins} minutes to pickup at {pickupAddress.split(',')[0]}
                    </p>
                  </div>
                </div>
                <span className="text-[11px] bg-emerald-100 text-emerald-800 font-bold px-2 py-1 rounded">
                  Nearby Fleet Ready
                </span>
              </div>

              {/* Addons Section */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-3.5">
                <p className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  Trip Add-Ons & Assistance
                </p>

                {/* Driver Helper Toggle */}
                <div className="flex items-start justify-between gap-3 p-3 bg-white border border-slate-200 rounded-lg">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-slate-700" />
                      <label htmlFor="helper-toggle" className="text-xs font-bold text-slate-900 cursor-pointer">
                        Driver Helper Needed (Loading & Unloading)
                      </label>
                      <span className="text-xs font-bold text-amber-700">+₹{helperFee} flat</span>
                    </div>
                    <p className="text-[11px] text-slate-500">
                      Driver will personally assist with ground-floor loading and unloading of cargo.
                    </p>
                  </div>
                  <input
                    id="helper-toggle"
                    type="checkbox"
                    checked={driverHelperNeeded}
                    onChange={(e) => setDriverHelperNeeded(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer mt-1"
                  />
                </div>

                {/* Transit Insurance Toggle with Goods Value */}
                <div className="p-3 bg-white border border-slate-200 rounded-lg space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-slate-700" />
                        <label htmlFor="insurance-toggle" className="text-xs font-bold text-slate-900 cursor-pointer">
                          Add Transit Insurance Protection
                        </label>
                        <span className="text-xs font-bold text-amber-700">
                          {transitInsurance ? `+₹${insuranceFee}` : '(0.25% of goods value)'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500">
                        Covers accidental transit damage & total loss up to declared commercial value.
                      </p>
                    </div>
                    <input
                      id="insurance-toggle"
                      type="checkbox"
                      checked={transitInsurance}
                      onChange={(e) => setTransitInsurance(e.target.checked)}
                      className="w-5 h-5 text-amber-600 rounded focus:ring-amber-500 cursor-pointer mt-1"
                    />
                  </div>

                  {transitInsurance && (
                    <div className="pt-2 border-t border-slate-100 flex items-center gap-3">
                      <label className="text-xs text-slate-700 font-semibold">Declared Goods Value (₹):</label>
                      <input
                        type="number"
                        min="5000"
                        step="5000"
                        value={declaredGoodsValue}
                        onChange={(e) => setDeclaredGoodsValue(Number(e.target.value) || 0)}
                        className="w-36 py-1 px-2.5 text-xs border border-slate-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-amber-500"
                      />
                      <span className="text-[11px] text-slate-500">
                        Premium: <strong>₹{insuranceFee}</strong>
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Explicit Tolls Disclosure (Prompt Mandate) */}
              <div className="p-3.5 bg-amber-50 border-l-4 border-amber-500 rounded-r-xl text-xs space-y-1">
                <div className="flex items-center gap-2 font-bold text-amber-950">
                  <AlertTriangle className="w-4 h-4 text-amber-600" />
                  <span>MANDATORY DISCLOSURE: Tolls & State Taxes Extra</span>
                </div>
                <p className="text-amber-900 text-[11px] leading-relaxed">
                  Fastag toll plaza charges (est. ~₹{estimatedTolls} along this route) and inter-state permit/entry taxes
                  are <strong>never silently bundled</strong> into the trip estimate. Tolls will be paid directly at plaza
                  or settled with driver on actual receipts.
                </p>
              </div>

              {/* Complete Cost Breakdown */}
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-2 text-xs">
                <p className="font-bold text-slate-900 uppercase tracking-wider pb-1 border-b border-slate-200">
                  Fare Breakdown ({selectedVehicle.name})
                </p>
                <div className="flex justify-between text-slate-600">
                  <span>Base Fare (First {selectedVehicle.baseKmIncluded} km):</span>
                  <span>₹{baseFare}</span>
                </div>
                <div className="flex justify-between text-slate-600">
                  <span>Distance Fare ({extraKm} km @ ₹{selectedVehicle.perKmRate}/km):</span>
                  <span>₹{distanceFare}</span>
                </div>
                {driverHelperNeeded && (
                  <div className="flex justify-between text-slate-600">
                    <span>Driver Helper Assistance Fee:</span>
                    <span>₹{helperFee}</span>
                  </div>
                )}
                {transitInsurance && (
                  <div className="flex justify-between text-slate-600">
                    <span>Transit Insurance Policy (0.25% on ₹{declaredGoodsValue.toLocaleString()}):</span>
                    <span>₹{insuranceFee}</span>
                  </div>
                )}
                <div className="flex justify-between text-slate-600">
                  <span>GTA GST (5% with Input Tax Credit):</span>
                  <span>₹{gstAmount}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between items-center text-sm font-extrabold text-slate-950">
                  <span>Total Estimated Fare:</span>
                  <span className="text-lg text-amber-700">₹{totalEstimatedFare}</span>
                </div>
              </div>

              {/* Payment Method Toggle */}
              <div className="space-y-2">
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Payment Method
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <div
                    onClick={() => setPaymentMethod('online_upi')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                      paymentMethod === 'online_upi'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 text-amber-600" />
                    <div>
                      <p className="text-xs">Pay Online (UPI / Card)</p>
                      <p className="text-[10px] text-slate-500 font-normal">GPay, PhonePe, Cards</p>
                    </div>
                  </div>

                  <div
                    onClick={() => setPaymentMethod('pay_driver_cash')}
                    className={`p-3 rounded-xl border cursor-pointer transition flex items-center gap-3 ${
                      paymentMethod === 'pay_driver_cash'
                        ? 'border-amber-500 bg-amber-50/50 text-amber-950 font-bold ring-1 ring-amber-500'
                        : 'border-slate-200 bg-white text-slate-700'
                    }`}
                  >
                    <Banknote className="w-4 h-4 text-emerald-600" />
                    <div>
                      <p className="text-xs">Pay Driver Directly</p>
                      <p className="text-[10px] text-slate-500 font-normal">Cash or UPI on delivery</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Clear Cancellation Policy Statement */}
              <div className="p-3 bg-slate-100 rounded-xl text-[11px] text-slate-600 space-y-1">
                <p className="font-semibold text-slate-800">Cancellation Policy Notice:</p>
                <p>
                  • <strong>Free cancellation</strong> within 5 minutes of driver assignment.
                </p>
                <p>
                  • A standard fee of <strong>₹100</strong> applies if cancelled after 5 minutes once the driver has mobilized toward pickup.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer Controls */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-200 flex items-center justify-between flex-shrink-0">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev - 1) as 1 | 2 | 3)}
              className="px-4 py-2 text-xs font-bold text-slate-700 hover:bg-slate-200 rounded-xl transition"
            >
              Back
            </button>
          ) : (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-200 rounded-xl transition"
            >
              Cancel
            </button>
          )}

          {step < 3 ? (
            <button
              type="button"
              onClick={() => setStep((prev) => (prev + 1) as 1 | 2 | 3)}
              className="px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold transition flex items-center gap-1.5 shadow"
            >
              <span>{step === 1 ? 'Select Vehicle' : 'View Fare & Checkout'}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          ) : (
            <button
              type="button"
              onClick={handleConfirm}
              className="px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-700 hover:to-amber-600 text-slate-950 font-black rounded-xl text-xs transition flex items-center gap-1.5 shadow-md shadow-amber-500/20"
            >
              <span>Confirm & Book Mini-Truck</span>
              <Check className="w-4 h-4 text-slate-950" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
