import React, { useEffect, useState } from 'react';
import { 
  Clock, 
  MapPin, 
  CheckCircle2, 
  Zap, 
  X, 
  TrendingDown, 
  Bell, 
  BellOff, 
  Volume2, 
  VolumeX,
  Truck,
  Leaf,
  Navigation
} from 'lucide-react';

export type NotificationType = 'eta_update' | 'waypoint_reached' | 'toll_cleared' | 'status_change' | 'eco_alert';

export interface TrackingNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  etaMins?: number;
  waypointName?: string;
  meta?: {
    distanceKm?: number;
    speedKmH?: number;
    tollName?: string;
    tollAmount?: number;
    routeName?: string;
    deltaMins?: number;
  };
}

interface TrackingNotificationToastProps {
  notifications: TrackingNotification[];
  onDismiss: (id: string) => void;
  onClearAll?: () => void;
  soundEnabled?: boolean;
  onToggleSound?: () => void;
}

export const TrackingNotificationToast: React.FC<TrackingNotificationToastProps> = ({
  notifications,
  onDismiss,
  onClearAll,
  soundEnabled = true,
  onToggleSound
}) => {
  const [showHistory, setShowHistory] = useState(false);

  // Play a soft synthetic audio chime when a notification arrives
  useEffect(() => {
    if (!soundEnabled || notifications.length === 0) return;

    try {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioContextClass) {
        const ctx = new AudioContextClass();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        const latest = notifications[0];
        if (latest?.type === 'eta_update') {
          // Double soft chime (587Hz to 880Hz)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
          osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.15); // A5
          gain.gain.setValueAtTime(0.05, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        } else {
          // Single crisp notification ping (523Hz to 659Hz)
          osc.type = 'sine';
          osc.frequency.setValueAtTime(523.25, ctx.currentTime); // C5
          osc.frequency.exponentialRampToValueAtTime(659.25, ctx.currentTime + 0.12); // E5
          gain.gain.setValueAtTime(0.06, ctx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        }

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + 0.4);
      }
    } catch {
      // AudioContext muted or unsupported in background tab - safely ignore
    }
  }, [notifications, soundEnabled]);

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2.5 max-w-sm sm:max-w-md w-full pointer-events-none px-3 sm:px-0">
      
      {/* Notifications Controls Bar (if multiple notifications exist) */}
      <div className="flex items-center justify-between pointer-events-auto bg-slate-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-800 text-xs text-slate-300 shadow-md">
        <div className="flex items-center gap-1.5 font-semibold text-[11px]">
          <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
          <span>Live Tracking Alerts ({notifications.length})</span>
        </div>

        <div className="flex items-center gap-2">
          {onToggleSound && (
            <button
              onClick={onToggleSound}
              className="p-1 hover:text-white transition rounded text-slate-400 hover:bg-slate-800"
              title={soundEnabled ? 'Mute Alert Chimes' : 'Enable Alert Chimes'}
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5 text-slate-500" />}
            </button>
          )}

          {onClearAll && notifications.length > 1 && (
            <button
              onClick={onClearAll}
              className="text-[10px] text-slate-400 hover:text-white transition font-medium hover:underline"
            >
              Clear All
            </button>
          )}
        </div>
      </div>

      {/* Stack of Active Toasts */}
      <div className="flex flex-col gap-2.5">
        {notifications.slice(0, 3).map((notif) => (
          <SingleToastItem
            key={notif.id}
            notification={notif}
            onDismiss={() => onDismiss(notif.id)}
          />
        ))}
      </div>
    </div>
  );
};

interface SingleToastItemProps {
  notification: TrackingNotification;
  onDismiss: () => void;
}

const SingleToastItem: React.FC<SingleToastItemProps> = ({
  notification,
  onDismiss
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const [progress, setProgress] = useState(100);

  // Auto-dismiss countdown (5.5 seconds)
  useEffect(() => {
    if (isPaused) return;

    const duration = 5500;
    const intervalTime = 50;
    const step = (intervalTime / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev <= step) {
          clearInterval(timer);
          onDismiss();
          return 0;
        }
        return prev - step;
      });
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPaused, onDismiss]);

  const getStyle = () => {
    switch (notification.type) {
      case 'eta_update':
        return {
          icon: <Clock className="w-5 h-5 text-amber-500" />,
          badgeBg: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
          badgeLabel: 'ETA UPDATED',
          borderColor: 'border-amber-500/40',
          progressBarColor: 'bg-amber-500'
        };
      case 'waypoint_reached':
        return {
          icon: <MapPin className="w-5 h-5 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-300',
          badgeLabel: 'WAYPOINT REACHED',
          borderColor: 'border-emerald-500/40',
          progressBarColor: 'bg-emerald-500'
        };
      case 'toll_cleared':
        return {
          icon: <Zap className="w-5 h-5 text-indigo-400" />,
          badgeBg: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300',
          badgeLabel: 'FASTAG TOLL CLEARED',
          borderColor: 'border-indigo-500/40',
          progressBarColor: 'bg-indigo-500'
        };
      case 'eco_alert':
        return {
          icon: <Leaf className="w-5 h-5 text-emerald-400" />,
          badgeBg: 'bg-emerald-500/20 border-emerald-400/30 text-emerald-300',
          badgeLabel: 'ECO-ROUTE APPLIED',
          borderColor: 'border-emerald-500/40',
          progressBarColor: 'bg-emerald-400'
        };
      default:
        return {
          icon: <Truck className="w-5 h-5 text-blue-400" />,
          badgeBg: 'bg-blue-500/15 border-blue-500/30 text-blue-300',
          badgeLabel: 'TRIP STATUS',
          borderColor: 'border-blue-500/40',
          progressBarColor: 'bg-blue-500'
        };
    }
  };

  const style = getStyle();

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className={`pointer-events-auto bg-slate-950/95 backdrop-blur-md rounded-2xl border ${style.borderColor} p-4 text-white shadow-2xl transition-all duration-300 transform translate-y-0 opacity-100 animate-in fade-in slide-in-from-top-4 relative overflow-hidden`}
    >
      {/* Top Countdown Progress Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-slate-800">
        <div
          className={`h-full transition-all duration-75 ${style.progressBarColor}`}
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex items-start gap-3 pt-1">
        {/* Type Icon Container */}
        <div className="p-2 rounded-xl bg-slate-900 border border-slate-800 flex-shrink-0 mt-0.5">
          {style.icon}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-2">
            <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${style.badgeBg} uppercase tracking-wider`}>
              {style.badgeLabel}
            </span>
            <span className="text-[10px] text-slate-400 font-mono">
              {notification.timestamp}
            </span>
          </div>

          <h4 className="text-sm font-bold text-white leading-snug">
            {notification.title}
          </h4>

          <p className="text-xs text-slate-300 leading-relaxed">
            {notification.message}
          </p>

          {/* Optional Meta Highlights (e.g. ETA badge, Waypoint pill, toll badge) */}
          {notification.etaMins !== undefined && (
            <div className="pt-1 flex items-center gap-2 flex-wrap text-xs">
              <span className="inline-flex items-center gap-1 font-mono font-bold text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                <Clock className="w-3 h-3" /> New ETA: {notification.etaMins} mins
              </span>
              {notification.meta?.deltaMins !== undefined && (
                <span className="inline-flex items-center gap-0.5 font-semibold text-[11px] text-emerald-400">
                  <TrendingDown className="w-3 h-3" />
                  {notification.meta.deltaMins < 0 ? `${Math.abs(notification.meta.deltaMins)} mins faster` : `${notification.meta.deltaMins} mins adjusted`}
                </span>
              )}
            </div>
          )}

          {notification.waypointName && (
            <div className="pt-1 flex items-center gap-1.5 text-xs text-emerald-300 font-medium">
              <Navigation className="w-3 h-3 text-emerald-400" />
              <span>Location: {notification.waypointName}</span>
            </div>
          )}

          {notification.meta?.tollName && (
            <div className="pt-1 flex items-center gap-2 text-xs">
              <span className="text-slate-400">{notification.meta.tollName}</span>
              {notification.meta.tollAmount && (
                <span className="text-emerald-400 font-bold font-mono">
                  ₹{notification.meta.tollAmount} Auto-Cleared
                </span>
              )}
            </div>
          )}
        </div>

        {/* Dismiss Close Button */}
        <button
          onClick={onDismiss}
          className="p-1 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition flex-shrink-0"
          aria-label="Dismiss Notification"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
