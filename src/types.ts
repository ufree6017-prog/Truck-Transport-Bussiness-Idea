export type UserRole = 'customer' | 'driver' | 'admin';

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: UserRole;
  avatar?: string;
  city?: string;
  companyName?: string;
  gstin?: string;
}

export type DriverVerificationStatus = 'pending' | 'approved' | 'rejected';

export interface DriverDocument {
  id: string;
  type: 'driving_license' | 'vehicle_rc' | 'vehicle_insurance' | 'aadhaar_card' | 'fitness_certificate';
  name: string;
  documentNumber: string;
  fileUrl?: string;
  uploadedAt: string;
  expiryDate: string;
  status: 'valid' | 'expiring_soon' | 'expired' | 'under_review';
  isExpiringSoon?: boolean;
}

export interface DriverProfile extends UserProfile {
  verificationStatus: DriverVerificationStatus;
  vehicleCategory: string;
  vehicleNumber: string;
  vehicleModel: string;
  walletBalance: number;
  minimumBalanceRequired: number;
  rating: number;
  tripsCount: number;
  homeCity: string;
  currentCity: string;
  isOnline: boolean;
  documents: DriverDocument[];
}

export type VehicleCategoryType = 'intracity' | 'intercity';

export interface VehicleCategory {
  id: string;
  name: string;
  hindiName: string;
  capacityKg: number;
  capacityDisplay: string;
  dimensions: string;
  categoryType: VehicleCategoryType;
  baseFare: number;
  baseKmIncluded: number;
  perKmRate: number;
  estimatedEtaMins: number;
  suitableFor: string[];
  description: string;
  badge?: string;
  iconType: 'tempo' | 'ace' | 'pickup' | 'tata407' | 'eicher' | 'container' | 'trailer';
}

export type BookingStatus = 
  | 'driver_assigned' 
  | 'en_route' 
  | 'arrived' 
  | 'in_transit' 
  | 'delivered' 
  | 'cancelled';

export type PaymentMethod = 'online_upi' | 'pay_driver_cash';
export type PaymentStatus = 'pending' | 'completed' | 'cash_on_delivery';

export interface Booking {
  id: string;
  bookingNumber: string;
  customerId: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  pickupCity: string;
  dropCity: string;
  distanceKm: number;
  vehicleCategoryId: string;
  vehicleCategoryName: string;
  goodsType: string;
  driverHelperNeeded: boolean;
  helperFee: number;
  transitInsurance: boolean;
  declaredGoodsValue: number;
  insuranceFee: number;
  baseFare: number;
  distanceFare: number;
  estimatedTolls: number; // Disclosed separately, not included in base
  gstAmount: number;
  totalEstimatedFare: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: BookingStatus;
  pickupOtp: string;
  etaMins: number;
  driverDetails?: {
    id: string;
    name: string;
    phone: string;
    photo: string;
    vehicleNumber: string;
    vehicleModel: string;
    rating: number;
    completedTrips: number;
  };
  eWayBillNumber?: string;
  podUrl?: string;
  podUploadedAt?: string;
  receiverName?: string;
  receiverPhone?: string;
  createdAt: string;
  deliveredAt?: string;
  cancellationPolicy: string;
  review?: DriverReview;
  selectedRouteId?: string;
}

export interface SuggestedRoute {
  id: string;
  name: string;
  badge: string;
  isRecommended: boolean;
  distanceKm: number;
  etaMins: number;
  averageSpeedKmH: number;
  fuelConsumptionLitres: number;
  fuelCostRupees: number;
  co2EmissionsKg: number;
  tollCount: number;
  tollCostRupees: number;
  ecoScore: 'A+' | 'A' | 'B' | 'C';
  savingsPercent?: number;
  fuelSavedLitres?: number;
  rupeesSaved?: number;
  highlights: string[];
  trafficCondition: 'smooth' | 'moderate' | 'heavy';
}

export interface DriverReview {
  rating: number; // 1 to 5 stars
  feedback: string;
  tags: string[];
  tipAmount?: number;
  reviewedAt: string;
  customerName?: string;
}

export interface ReturnTripLoad {
  id: string;
  loadNumber: string;
  originCity: string;
  destinationCity: string;
  pickupDate: string;
  vehicleRequired: string;
  cargoType: string;
  weightTons: number;
  standardRate: number;
  discountedBackhaulRate: number;
  discountPercent: number;
  status: 'available' | 'claimed' | 'completed';
  postedBy: string;
  notes: string;
}

export interface BulkEnquiry {
  id: string;
  enquiryNumber: string;
  companyName: string;
  gstin: string;
  contactPerson: string;
  phone: string;
  email: string;
  originCity: string;
  destinationCity: string;
  frequency: 'one_time' | 'daily' | 'weekly' | 'monthly_contract';
  vehicleTypeRequired: string;
  cargoWeightTons: number;
  cargoDescription: string;
  eWayBillAvailable: boolean;
  status: 'new' | 'contacted' | 'quote_sent' | 'contract_awarded';
  createdAt: string;
}

export type WalletTransactionType = 
  | 'commission_deduction' 
  | 'wallet_recharge' 
  | 'trip_payout' 
  | 'incentive_bonus';

export interface WalletTransaction {
  id: string;
  driverId: string;
  type: WalletTransactionType;
  amount: number;
  balanceAfter: number;
  bookingId?: string;
  description: string;
  timestamp: string;
  isCredit: boolean;
}

export interface GSTInvoiceRecord {
  id: string;
  invoiceNumber: string;
  bookingId: string;
  bookingNumber: string;
  consignorName: string;
  consignorGstin?: string;
  consigneeName: string;
  consigneeGstin?: string;
  sacCode: string; // 996511 - Goods Transport Agency services
  originCity: string;
  destinationCity: string;
  taxableValue: number;
  cgst: number;
  sgst: number;
  igst: number;
  totalInvoiceAmount: number;
  invoiceDate: string;
  podStatus: 'uploaded' | 'verified' | 'pending';
  paymentStatus: 'paid' | 'pending';
}

export interface DemoCredential {
  role: 'customer' | 'driver' | 'admin';
  roleLabel: string;
  name: string;
  username: string;
  mobileNo: string;
  password: string;
  designation: string;
  statusBadge?: string;
  driverType?: 'approved' | 'pending';
}

