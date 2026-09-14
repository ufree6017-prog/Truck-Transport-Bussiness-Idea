import React, { useState, useEffect } from 'react';
import { Booking, BookingStatus, SuggestedRoute } from '../../types';
import { 
  Truck, 
  MapPin, 
  Navigation, 
  Compass, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Layers, 
  Radio, 
  ShieldCheck, 
  Clock, 
  Maximize2,
  Minimize2,
  Zap,
  CheckCircle2,
  Leaf
} from 'lucide-react';

interface RealTimeRouteMapProps {
  booking: Booking;
  currentStatus: BookingStatus;
  suggestedRoute?: SuggestedRoute;
  className?: string;
}

type MapTheme = 'dark' | 'light' | 'satellite';

export const RealTimeRouteMap: React.FC<RealTimeRouteMapProps> = ({
  booking,
  currentStatus,
  suggestedRoute,
  className = ''
}) => {
  const [theme, setTheme] = useState<MapTheme>('dark');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [activeTelemetryTab, setActiveTelemetryTab] = useState<'route' | 'telematics'>('route');
  const [lastPingTime, setLastPingTime] = useState<string>('Just now');
  const [simulatedSpeed, setSimulatedSpeed] = useState<number>(54);

  // Live telemetry pulse
  useEffect(() => {
    const interval = setInterval(() => {
      setLastPingTime('Just now');
      // subtle speed variation between 48 and 62 km/h when in transit
      if (currentStatus === 'in_transit') {
        setSimulatedSpeed(Math.floor(50 + Math.random() * 12));
      } else if (currentStatus === 'delivered') {
        setSimulatedSpeed(0);
      } else {
        setSimulatedSpeed(Math.floor(25 + Math.random() * 15));
      }
    }, 4000);
    return () => clearInterval(interval);
  }, [currentStatus]);

  // Route progression percentage (0 to 1) based on current trip status
  const getProgressRatio = (status: BookingStatus): number => {
    switch (status) {
      case 'driver_assigned':
        return 0.12;
      case 'en_route':
        return 0.32;
      case 'arrived':
        return 0.48;
      case 'in_transit':
        return 0.74;
      case 'delivered':
        return 1.0;
      default:
        return 0.65;
    }
  };

  const progressRatio = getProgressRatio(currentStatus);

  // Bezier curve coordinate calculation along the route path
  // Route defined as cubic bezier:
  // P0 = (120, 320), P1 = (280, 360), P2 = (220, 160), P3 = (420, 180)
  // Second segment: P3 = (420, 180), P4 = (540, 195), P5 = (590, 95), P6 = (690, 110)
  const getPositionOnRoute = (t: number) => {
    // For t between 0 and 1, sample a smooth path across the two segments
    let x: number, y: number, angle: number;

    if (t <= 0.5) {
      // Segment 1 (t scaled to 0..1)
      const u = t * 2;
      const p0 = { x: 120, y: 320 };
      const p1 = { x: 260, y: 360 };
      const p2 = { x: 230, y: 170 };
      const p3 = { x: 420, y: 180 };

      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;

      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;

      x = ax * Math.pow(u, 3) + bx * Math.pow(u, 2) + cx * u + p0.x;
      y = ay * Math.pow(u, 3) + by * Math.pow(u, 2) + cy * u + p0.y;

      // Derivative for heading angle
      const dx = 3 * ax * Math.pow(u, 2) + 2 * bx * u + cx;
      const dy = 3 * ay * Math.pow(u, 2) + 2 * by * u + cy;
      angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    } else {
      // Segment 2 (t scaled to 0..1)
      const u = (t - 0.5) * 2;
      const p0 = { x: 420, y: 180 };
      const p1 = { x: 530, y: 190 };
      const p2 = { x: 590, y: 90 };
      const p3 = { x: 690, y: 110 };

      const cx = 3 * (p1.x - p0.x);
      const bx = 3 * (p2.x - p1.x) - cx;
      const ax = p3.x - p0.x - cx - bx;

      const cy = 3 * (p1.y - p0.y);
      const by = 3 * (p2.y - p1.y) - cy;
      const ay = p3.y - p0.y - cy - by;

      x = ax * Math.pow(u, 3) + bx * Math.pow(u, 2) + cx * u + p0.x;
      y = ay * Math.pow(u, 3) + by * Math.pow(u, 2) + cy * u + p0.y;

      const dx = 3 * ax * Math.pow(u, 2) + 2 * bx * u + cx;
      const dy = 3 * ay * Math.pow(u, 2) + 2 * by * u + cy;
      angle = (Math.atan2(dy, dx) * 180) / Math.PI;
    }

    return { x, y, angle };
  };

  const truckPos = getPositionOnRoute(progressRatio);

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.25, 2.0));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.25, 0.75));
  const handleResetZoom = () => setZoomLevel(1);

  // Distance calculations
  const totalKm = suggestedRoute?.distanceKm || booking.distanceKm || 38;
  const coveredKm = Math.round(totalKm * progressRatio);
  const remainingKm = Math.max(Number((totalKm - coveredKm).toFixed(1)), 0);

  // Theme palettes
  const themeStyles = {
    dark: {
      containerBg: 'bg-slate-950',
      canvasBg: '#0b0f19',
      gridColor: '#1e293b',
      waterColor: '#0f172a',
      waterStroke: '#1e293b',
      secondaryRoad: '#1e293b',
      arterialRoad: '#334155',
      highwayBase: '#020617',
      landCover: '#0d1322',
      textColor: 'text-white',
      subtextColor: 'text-slate-400'
    },
    light: {
      containerBg: 'bg-slate-100',
      canvasBg: '#f8fafc',
      gridColor: '#e2e8f0',
      waterColor: '#e0f2fe',
      waterStroke: '#bae6fd',
      secondaryRoad: '#f1f5f9',
      arterialRoad: '#cbd5e1',
      highwayBase: '#e2e8f0',
      landCover: '#ffffff',
      textColor: 'text-slate-900',
      subtextColor: 'text-slate-600'
    },
    satellite: {
      containerBg: 'bg-stone-950',
      canvasBg: '#141712',
      gridColor: '#272e23',
      waterColor: '#0a1d28',
      waterStroke: '#133e54',
      secondaryRoad: '#2c3328',
      arterialRoad: '#465240',
      highwayBase: '#1a1f18',
      landCover: '#1c221a',
      textColor: 'text-stone-100',
      subtextColor: 'text-stone-400'
    }
  };

  const curTheme = themeStyles[theme];

  return (
    <div className={`rounded-3xl overflow-hidden border border-slate-200 shadow-sm transition-all duration-300 ${curTheme.containerBg} ${isFullscreen ? 'fixed inset-4 z-50 shadow-2xl' : 'relative'} ${className}`}>
      
      {/* Top Map Header & Controls Overlay */}
      <div className="p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 border-b border-white/10 relative z-20 backdrop-blur-md bg-slate-950/75">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-sm">
            <Compass className="w-5 h-5 animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold font-display text-white">
                Live GPS Transit Telematics
              </h3>
              <span className="flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                ACTIVE SATELLITE FIX
              </span>
            </div>
            <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1.5 flex-wrap">
              <span>Corridor: <strong className="text-white">{suggestedRoute ? suggestedRoute.name : `${booking.pickupCity} → ${booking.dropLocation?.split(',')[0] || 'Destination Hub'}`}</strong></span>
              {suggestedRoute?.isRecommended && (
                <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/20 px-1.5 py-0.2 rounded border border-emerald-500/30 flex items-center gap-0.5">
                  <Leaf className="w-2.5 h-2.5" /> Eco-Optimized (~{suggestedRoute.fuelSavedLitres || 2.4}L Saved)
                </span>
              )}
              <span>• Ping: {lastPingTime}</span>
            </p>
          </div>
        </div>

        {/* Action Controls: Theme Switcher, Zoom, Reset, Fullscreen */}
        <div className="flex items-center gap-1.5 flex-wrap">
          {/* Map theme switcher */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-xs">
            <button
              onClick={() => setTheme('dark')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${theme === 'dark' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              title="Dark Navigation Theme"
            >
              Dark
            </button>
            <button
              onClick={() => setTheme('light')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${theme === 'light' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              title="Light Street Map"
            >
              Light
            </button>
            <button
              onClick={() => setTheme('satellite')}
              className={`px-2.5 py-1 rounded-lg font-semibold transition ${theme === 'satellite' ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'}`}
              title="Satellite Terrain"
            >
              Satellite
            </button>
          </div>

          <div className="h-4 w-px bg-slate-700 hidden sm:block"></div>

          {/* Zoom & Recenter controls */}
          <div className="flex items-center bg-slate-800/80 p-0.5 rounded-xl border border-slate-700 text-slate-300">
            <button
              onClick={handleZoomIn}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition"
              title="Zoom In"
              aria-label="Zoom In"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleZoomOut}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition"
              title="Zoom Out"
              aria-label="Zoom Out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleResetZoom}
              className="p-1.5 hover:bg-slate-700 rounded-lg transition"
              title="Reset View"
              aria-label="Reset View"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2 bg-slate-800/80 hover:bg-slate-700 text-slate-300 hover:text-white rounded-xl border border-slate-700 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Expand Fullscreen Map'}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {/* Main SVG Map Canvas */}
      <div className="relative w-full h-[360px] sm:h-[440px] overflow-hidden select-none">
        
        {/* SVG Cartographic Drawing */}
        <div 
          className="w-full h-full transition-transform duration-300 ease-out origin-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          <svg
            viewBox="0 0 800 450"
            className="w-full h-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              {/* Animated Dash offset for traffic flow */}
              <style>{`
                @keyframes dash-flow {
                  from { stroke-dashoffset: 60; }
                  to { stroke-dashoffset: 0; }
                }
                @keyframes pulse-ring {
                  0% { r: 10px; opacity: 0.8; }
                  100% { r: 24px; opacity: 0; }
                }
                @keyframes truck-glow {
                  0%, 100% { filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.9)); }
                  50% { filter: drop-shadow(0 0 16px rgba(245, 158, 11, 1)); }
                }
                .flow-animation {
                  stroke-dasharray: 10, 8;
                  animation: dash-flow 1.8s linear infinite;
                }
                .pulse-beacon {
                  animation: pulse-ring 2s cubic-bezier(0.2, 0.8, 0.2, 1) infinite;
                }
              `}</style>

              {/* Linear Gradients for Route & Traffic Conditions */}
              <linearGradient id="routeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="45%" stopColor="#f59e0b" />
                <stop offset="75%" stopColor="#10b981" />
                <stop offset="100%" stopColor="#ef4444" />
              </linearGradient>

              <linearGradient id="passedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#059669" />
                <stop offset="100%" stopColor="#10b981" />
              </linearGradient>

              {/* Glow filter for active GPS route */}
              <filter id="routeGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
              </filter>

              {/* Grid Background Pattern */}
              <pattern id="cityGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M 40 0 L 0 0 0 40" fill="none" stroke={curTheme.gridColor} strokeWidth="1" strokeOpacity="0.5" />
                <circle cx="20" cy="20" r="1" fill={curTheme.gridColor} fillOpacity="0.4" />
              </pattern>

              {/* Diagonal texture for terrain */}
              <pattern id="terrainHatch" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 0 20 L 20 0 M 0 0 L 20 20" fill="none" stroke={curTheme.gridColor} strokeWidth="0.5" strokeOpacity="0.2" />
              </pattern>
            </defs>

            {/* Base Canvas Rect */}
            <rect width="800" height="450" fill={curTheme.canvasBg} />
            
            {/* Background Cartographic City Grid & Blocks */}
            <rect width="800" height="450" fill="url(#cityGrid)" />
            <rect width="800" height="450" fill="url(#terrainHatch)" opacity="0.3" />

            {/* Simulated Geographic River / Coastal Water Body */}
            <path
              d="M -20 80 Q 150 140 280 110 T 520 210 T 820 190 L 820 470 L -20 470 Z"
              fill={curTheme.waterColor}
              stroke={curTheme.waterStroke}
              strokeWidth="2"
              opacity="0.6"
            />
            {/* River label */}
            <text x="360" y="160" fill={curTheme.subtextColor} fontSize="9" letterSpacing="3" opacity="0.4" transform="rotate(12 360 160)">
              REGIONAL LOGISTICS BASIN
            </text>

            {/* Arterial Road Network & Interchanges */}
            <g stroke={curTheme.arterialRoad} strokeWidth="3" opacity="0.5" strokeLinecap="round">
              <path d="M 0 240 L 800 240" strokeDasharray="6,6" />
              <path d="M 280 0 L 280 450" strokeDasharray="6,6" />
              <path d="M 560 0 L 560 450" strokeDasharray="6,6" />
              <path d="M 40 40 L 760 410" strokeWidth="2" />
              <path d="M 60 410 L 740 40" strokeWidth="1.5" strokeDasharray="4,4" />
            </g>

            {/* Secondary Local Roads */}
            <g stroke={curTheme.secondaryRoad} strokeWidth="1.5" opacity="0.7">
              <path d="M 50 120 L 250 120 L 350 40" />
              <path d="M 120 300 L 120 420" />
              <path d="M 450 300 L 650 300 L 750 380" />
              <path d="M 680 80 L 680 260" />
              <path d="M 300 380 L 500 380" />
            </g>

            {/* Toll Plaza Marker & Waypoints along route */}
            {/* Toll Plaza 1 (Fastag Gate) at (420, 180) */}
            <g transform="translate(420, 180)">
              <rect x="-14" y="-12" width="28" height="24" rx="6" fill="#1e293b" stroke="#f59e0b" strokeWidth="1.5" />
              <text x="0" y="2" textAnchor="middle" fill="#f59e0b" fontSize="8" fontWeight="bold">FASTAG</text>
              <text x="0" y="10" textAnchor="middle" fill="#94a3b8" fontSize="6">TOLL PLAZA</text>
            </g>

            {/* Waypoint 2: City Bypass Interchange at (250, 290) */}
            <g transform="translate(250, 290)">
              <circle cx="0" cy="0" r="4" fill="#38bdf8" />
              <circle cx="0" cy="0" r="8" fill="none" stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" />
              <text x="12" y="3" fill={curTheme.subtextColor} fontSize="8" fontWeight="600">Interchange NH-48</text>
            </g>

            {/* ========================================================================= */}
            {/* MAIN TRANSIT HIGHWAY ROUTE (Curved Spline)                                */}
            {/* Cubic Bezier: M 120 320 C 260 360, 230 170, 420 180 S 590 90, 690 110 */}
            {/* ========================================================================= */}

            {/* 1. Highway Base Asphalt Corridor */}
            <path
              d="M 120 320 C 260 360, 230 170, 420 180 C 530 190, 590 90, 690 110"
              fill="none"
              stroke={curTheme.highwayBase}
              strokeWidth="16"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 2. Route Outer Glow / Road Boundary */}
            <path
              d="M 120 320 C 260 360, 230 170, 420 180 C 530 190, 590 90, 690 110"
              fill="none"
              stroke="rgba(245, 158, 11, 0.25)"
              strokeWidth="10"
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#routeGlow)"
            />

            {/* 3. Primary Traffic Segment Colored Path */}
            <path
              d="M 120 320 C 260 360, 230 170, 420 180 C 530 190, 590 90, 690 110"
              fill="none"
              stroke="url(#routeGradient)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* 4. Animated Dash Traffic Flow Indicator */}
            <path
              d="M 120 320 C 260 360, 230 170, 420 180 C 530 190, 590 90, 690 110"
              fill="none"
              stroke="#ffffff"
              strokeWidth="2.5"
              strokeLinecap="round"
              className="flow-animation"
              opacity="0.8"
            />

            {/* ========================================================================= */}
            {/* ORIGIN / PICKUP POINT MARKER (120, 320)                                   */}
            {/* ========================================================================= */}
            <g transform="translate(120, 320)">
              {/* Radar pulse ring */}
              <circle cx="0" cy="0" r="12" fill="none" stroke="#10b981" strokeWidth="2" className="pulse-beacon" />
              <circle cx="0" cy="0" r="16" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3" />
              
              {/* Pin Base Circle */}
              <circle cx="0" cy="0" r="9" fill="#10b981" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" />

              {/* Label Tag Box */}
              <g transform="translate(0, -28)">
                <rect x="-65" y="-12" width="130" height="22" rx="6" fill="#064e3b" stroke="#10b981" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#ecfdf5" fontSize="9" fontWeight="bold">
                  PICKUP: {booking.pickupCity || 'Origin Hub'}
                </text>
              </g>
            </g>

            {/* ========================================================================= */}
            {/* DESTINATION / DROP POINT MARKER (690, 110)                                */}
            {/* ========================================================================= */}
            <g transform="translate(690, 110)">
              {/* Target rings */}
              <circle cx="0" cy="0" r="14" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.6" />
              
              {/* Pin Base */}
              <circle cx="0" cy="0" r="9" fill="#ef4444" stroke="#ffffff" strokeWidth="2.5" />
              <circle cx="0" cy="0" r="3.5" fill="#ffffff" />

              {/* Destination Tag */}
              <g transform="translate(0, -28)">
                <rect x="-65" y="-12" width="130" height="22" rx="6" fill="#7f1d1d" stroke="#ef4444" strokeWidth="1.5" />
                <text x="0" y="3" textAnchor="middle" fill="#fef2f2" fontSize="9" fontWeight="bold">
                  DROP-OFF: {booking.dropLocation?.split(',')[0] || 'Destination'}
                </text>
              </g>
            </g>

            {/* ========================================================================= */}
            {/* DYNAMIC REAL-TIME TRUCK POSITION MARKER                                   */}
            {/* Positioned at (truckPos.x, truckPos.y) with rotation                       */}
            {/* ========================================================================= */}
            <g transform={`translate(${truckPos.x}, ${truckPos.y})`}>
              {/* Active GPS halo ring */}
              <circle cx="0" cy="0" r="16" fill="rgba(245, 158, 11, 0.25)" className="pulse-beacon" />
              <circle cx="0" cy="0" r="10" fill="#f59e0b" stroke="#ffffff" strokeWidth="2.5" style={{ filter: 'drop-shadow(0 0 6px #f59e0b)' }} />

              {/* Truck Icon rotating in direction of travel */}
              <g transform={`rotate(${truckPos.angle})`}>
                {/* Heading Arrow Beam */}
                <polygon points="12,0 20,-4 20,4" fill="#f59e0b" opacity="0.9" />
              </g>

              {/* Truck Center Dot */}
              <circle cx="0" cy="0" r="4" fill="#0f172a" />

              {/* Real-Time Telematics Floating Badge */}
              <g transform="translate(0, -32)">
                <rect x="-55" y="-14" width="110" height="26" rx="8" fill="#0f172a" stroke="#f59e0b" strokeWidth="1.5" />
                <text x="0" y="-1" textAnchor="middle" fill="#fef08a" fontSize="9" fontWeight="bold">
                  {booking.driverDetails?.vehicleNumber || 'TRUCK #MH02'}
                </text>
                <text x="0" y="8" textAnchor="middle" fill="#cbd5e1" fontSize="7.5">
                  {currentStatus === 'delivered' ? 'Completed • Unloaded' : `${simulatedSpeed} km/h • Live GPS`}
                </text>
              </g>
            </g>

            {/* Compass Rose Indicator (Top Right Corner) */}
            <g transform="translate(745, 45)" opacity="0.75">
              <circle cx="0" cy="0" r="16" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <polygon points="0,-12 4,0 -4,0" fill="#ef4444" />
              <polygon points="0,12 4,0 -4,0" fill="#94a3b8" />
              <text x="0" y="-14" textAnchor="middle" fill="#ef4444" fontSize="7" fontWeight="black">N</text>
            </g>

            {/* Distance Scale Bar (Bottom Left) */}
            <g transform="translate(40, 415)" opacity="0.85">
              <rect x="0" y="-12" width="90" height="18" rx="4" fill="#0f172a" stroke="#334155" strokeWidth="1" />
              <line x1="10" y1="0" x2="80" y2="0" stroke="#f59e0b" strokeWidth="2" />
              <line x1="10" y1="-3" x2="10" y2="3" stroke="#f59e0b" strokeWidth="2" />
              <line x1="80" y1="-3" x2="80" y2="3" stroke="#f59e0b" strokeWidth="2" />
              <text x="45" y="-3" textAnchor="middle" fill="#f1f5f9" fontSize="7.5" fontWeight="bold">
                10 KM SCALE
              </text>
            </g>
          </svg>
        </div>

        {/* Live HUD Telematics Floating Overlay (Bottom Left) */}
        <div className="absolute bottom-3 left-3 right-3 sm:right-auto sm:max-w-md bg-slate-900/90 backdrop-blur-md rounded-2xl p-3.5 border border-slate-700/80 shadow-lg text-white z-20">
          <div className="flex items-center justify-between gap-3 pb-2 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></div>
              <span className="text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                Route Telematics & Checkpoints
              </span>
            </div>
            <span className="text-[10px] font-mono text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
              {suggestedRoute ? suggestedRoute.name : 'Corridor NH-48 Express'}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 pt-2 text-center">
            {/* Speed & Momentum */}
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Cruising Speed</span>
              <span className="text-sm font-bold font-mono text-amber-400">
                {currentStatus === 'delivered' ? '0 km/h' : `${simulatedSpeed} km/h`}
              </span>
            </div>

            {/* Distance Covered */}
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Distance Done</span>
              <span className="text-sm font-bold font-mono text-emerald-400">
                {coveredKm} / {totalKm} km
              </span>
            </div>

            {/* Remaining Time */}
            <div className="bg-slate-800/60 p-2 rounded-xl border border-slate-700/60">
              <span className="text-[10px] text-slate-400 block">Est. Remaining</span>
              <span className="text-sm font-bold font-mono text-white">
                {currentStatus === 'delivered' ? 'Arrived' : `~${Math.max(Math.round((remainingKm / (simulatedSpeed || 45)) * 60), 5)} mins`}
              </span>
            </div>
          </div>
        </div>

        {/* Live Route Traffic Condition Indicator (Top Left inside map) */}
        <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-md rounded-xl px-3 py-1.5 border border-slate-700/80 text-[11px] text-white flex items-center gap-2 z-20">
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            <span className="text-[10px] text-slate-300">Smooth (78%)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            <span className="text-[10px] text-slate-300">Toll Gate (14%)</span>
          </div>
          <span className="text-slate-600">|</span>
          <div className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-500"></span>
            <span className="text-[10px] text-slate-300">Drop Point (8%)</span>
          </div>
        </div>

      </div>

      {/* Route Checkpoint Progress Bar & Location Summary Footer */}
      <div className="p-4 bg-slate-900 border-t border-slate-800 text-white space-y-3">
        {/* Origin to Destination Bar */}
        <div className="flex items-center justify-between text-xs gap-3">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-6 h-6 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px] border border-emerald-500/30">
              A
            </div>
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-emerald-400">Pickup Origin</p>
              <p className="font-semibold text-xs truncate max-w-[180px] sm:max-w-xs">{booking.pickupLocation}</p>
            </div>
          </div>

          <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[11px] font-mono text-amber-400 border border-slate-700 flex-shrink-0">
            <Truck className="w-3.5 h-3.5" />
            <span>{Math.round(progressRatio * 100)}% Journey Completed</span>
          </div>

          <div className="flex items-center gap-2 text-right min-w-0">
            <div className="min-w-0">
              <p className="text-[10px] uppercase font-bold text-red-400">Drop Destination</p>
              <p className="font-semibold text-xs truncate max-w-[180px] sm:max-w-xs">{booking.dropLocation}</p>
            </div>
            <div className="w-6 h-6 rounded-lg bg-red-500/20 text-red-400 flex items-center justify-center flex-shrink-0 font-bold text-[10px] border border-red-500/30">
              B
            </div>
          </div>
        </div>

        {/* Milestone Indicator Segments */}
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden relative">
          <div 
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-emerald-400 rounded-full transition-all duration-700 ease-out"
            style={{ width: `${Math.round(progressRatio * 100)}%` }}
          />
        </div>

        <div className="flex items-center justify-between text-[10px] text-slate-400 pt-0.5">
          <span className="flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-400" /> Dispatch Hub Departure
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <Zap className="w-3 h-3" /> Fastag Electronic Toll Clearance
          </span>
          <span className="flex items-center gap-1">
            <MapPin className="w-3 h-3 text-red-400" /> Consignee Unloading Bay
          </span>
        </div>
      </div>

    </div>
  );
};
