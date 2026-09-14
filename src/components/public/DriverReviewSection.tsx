import React, { useState } from 'react';
import { Booking, DriverReview } from '../../types';
import { 
  Star, 
  CheckCircle2, 
  MessageSquare, 
  Sparkles, 
  ThumbsUp, 
  Heart, 
  Edit3, 
  ShieldCheck, 
  Truck,
  RotateCcw,
  IndianRupee,
  Award,
  AlertCircle
} from 'lucide-react';

interface DriverReviewSectionProps {
  booking: Booking;
  onSubmitReview: (review: DriverReview) => void;
  existingReview?: DriverReview;
}

const POSITIVE_TAGS = [
  'Punctual & On-Time ⏱',
  'Careful Cargo Handling 📦',
  'Polite & Professional 🤝',
  'Clean & Sturdy Truck 🚚',
  'Helpful with Unloading 💪',
  'Smooth Route Navigation 🗺'
];

const CRITICAL_TAGS = [
  'Delayed Arrival ⏳',
  'Careless Cargo Handling ⚠️',
  'Demanded Extra Cash 💵',
  'Unresponsive to Calls 📵',
  'Rude Demeanor 🛑',
  'Vehicle Space Issue 🔧'
];

const SAMPLE_FEEDBACKS = [
  'Driver arrived right on time and handled all carton boxes with great care. Very polite behavior!',
  'Smooth transit without any jerks or damages to goods. Highly recommended driver partner.',
  'Excellent communication throughout the journey. Kept us informed about the arrival time.'
];

export const DriverReviewSection: React.FC<DriverReviewSectionProps> = ({
  booking,
  onSubmitReview,
  existingReview
}) => {
  const driver = booking.driverDetails;

  // Local form state
  const [rating, setRating] = useState<number>(existingReview?.rating || 5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [feedback, setFeedback] = useState<string>(existingReview?.feedback || '');
  const [selectedTags, setSelectedTags] = useState<string[]>(existingReview?.tags || ['Punctual & On-Time ⏱', 'Careful Cargo Handling 📦']);
  const [selectedTip, setSelectedTip] = useState<number>(existingReview?.tipAmount || 0);
  const [customTip, setCustomTip] = useState<string>('');
  const [isEditing, setIsEditing] = useState<boolean>(!existingReview);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [submitNotice, setSubmitNotice] = useState<boolean>(false);

  // Active rating for display & emotion guidance
  const activeRating = hoverRating || rating;

  const getRatingLabel = (stars: number) => {
    switch (stars) {
      case 5:
        return { text: 'Outstanding Service!', color: 'text-amber-600', bg: 'bg-amber-50 border-amber-200' };
      case 4:
        return { text: 'Very Good Experience', color: 'text-emerald-700', bg: 'bg-emerald-50 border-emerald-200' };
      case 3:
        return { text: 'Average / Met Expectations', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' };
      case 2:
        return { text: 'Below Expectations', color: 'text-orange-700', bg: 'bg-orange-50 border-orange-200' };
      case 1:
        return { text: 'Poor Experience / Issues Faced', color: 'text-red-700', bg: 'bg-red-50 border-red-200' };
      default:
        return { text: 'Select Your Rating', color: 'text-slate-600', bg: 'bg-slate-50 border-slate-200' };
    }
  };

  const currentLabel = getRatingLabel(activeRating);
  const availableTags = activeRating >= 4 ? POSITIVE_TAGS : CRITICAL_TAGS;

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]
    );
  };

  const handleTipSelect = (amt: number) => {
    setSelectedTip(amt);
    setCustomTip('');
  };

  const handleCustomTipChange = (val: string) => {
    const numeric = parseInt(val, 10);
    setCustomTip(val);
    if (!isNaN(numeric) && numeric >= 0) {
      setSelectedTip(numeric);
    } else {
      setSelectedTip(0);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    setTimeout(() => {
      const finalTip = selectedTip > 0 ? selectedTip : 0;
      const reviewData: DriverReview = {
        rating,
        feedback: feedback.trim() || (rating >= 4 ? 'Great service and on-time delivery.' : 'Cargo delivered with some issues.'),
        tags: selectedTags,
        tipAmount: finalTip > 0 ? finalTip : undefined,
        reviewedAt: new Date().toLocaleDateString('en-IN', {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        }),
        customerName: booking.customerName
      };

      onSubmitReview(reviewData);
      setIsSubmitting(false);
      setIsEditing(false);
      setSubmitNotice(true);
      setTimeout(() => setSubmitNotice(false), 5000);
    }, 600);
  };

  // If already submitted and not currently editing, show the submitted review card
  if (existingReview && !isEditing) {
    return (
      <div className="bg-white rounded-3xl border-2 border-emerald-300 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <Award className="w-6 h-6 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs uppercase font-black tracking-wider text-emerald-800 bg-emerald-100 px-2.5 py-0.5 rounded-full">
                  Customer Review Recorded
                </span>
                <span className="text-xs text-slate-400 font-medium">
                  {existingReview.reviewedAt}
                </span>
              </div>
              <h3 className="text-lg font-bold font-display text-slate-900 mt-0.5">
                Feedback for {driver?.name || 'Driver Partner'}
              </h3>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsEditing(true)}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold rounded-xl text-xs transition flex items-center gap-1.5 self-start sm:self-auto border border-slate-200"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Review</span>
          </button>
        </div>

        {submitNotice && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-2xl text-xs text-emerald-900 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Thank you! Your rating and feedback have been shared with {driver?.name} and recorded on their pilot profile.</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Rating & Driver Card */}
          <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center gap-3">
              <img
                src={driver?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={driver?.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-300"
              />
              <div>
                <p className="font-bold text-slate-900 text-sm">{driver?.name}</p>
                <p className="text-xs text-slate-500 font-mono">{driver?.vehicleNumber}</p>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <div className="flex items-center gap-1.5">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star
                    key={star}
                    className={`w-5 h-5 ${
                      star <= existingReview.rating
                        ? 'fill-amber-400 text-amber-500'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                ))}
                <span className="ml-2 font-bold text-slate-900 text-sm">
                  {existingReview.rating}.0 / 5.0
                </span>
              </div>
              <p className="text-xs font-semibold text-amber-700 mt-1">
                {getRatingLabel(existingReview.rating).text}
              </p>
            </div>

            {existingReview.tipAmount && existingReview.tipAmount > 0 && (
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
                <span className="text-slate-600 flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> Appreciation Tip:
                </span>
                <span className="font-bold text-emerald-700">₹{existingReview.tipAmount} (Paid)</span>
              </div>
            )}
          </div>

          {/* Feedback & Tag Highlights */}
          <div className="md:col-span-2 p-5 bg-slate-50 rounded-2xl border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
                Customer Comments
              </span>
              <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" /> Verified Delivery
              </span>
            </div>

            <blockquote className="text-sm font-medium text-slate-800 italic bg-white p-4 rounded-xl border border-slate-200 leading-relaxed">
              "{existingReview.feedback}"
            </blockquote>

            {existingReview.tags && existingReview.tags.length > 0 && (
              <div className="pt-1">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Highlighted Positives
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {existingReview.tags.map((tag) => (
                    <span
                      key={tag}
                      className="px-2.5 py-1 bg-white border border-emerald-200 text-emerald-800 rounded-lg text-xs font-medium shadow-2xs"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Interactive Form Mode
  return (
    <div className="bg-white rounded-3xl border-2 border-amber-300 p-6 sm:p-8 shadow-md space-y-6">
      
      {/* Header with Celebration Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-100">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-black tracking-widest bg-emerald-100 text-emerald-800 px-3 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
              Delivery Completed & Consignment Unloaded
            </span>
            <span className="text-xs text-slate-500 hidden sm:inline">
              Trip #{booking.bookingNumber}
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900">
            How was your delivery experience with {driver?.name || 'your driver'}?
          </h3>
          <p className="text-xs sm:text-sm text-slate-600">
            Your star-rating and feedback help reward top transport pilots and maintain quality freight standards across TruckSetu.
          </p>
        </div>

        {/* Driver mini badge */}
        <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-2xl self-start sm:self-auto flex-shrink-0">
          <img
            src={driver?.photo || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={driver?.name}
            className="w-12 h-12 rounded-xl object-cover border-2 border-amber-400"
          />
          <div>
            <p className="font-bold text-xs text-slate-900 leading-tight">{driver?.name}</p>
            <p className="text-[11px] text-slate-500 font-mono">{driver?.vehicleNumber}</p>
            <p className="text-[10px] text-amber-600 font-semibold mt-0.5">
              Current Rating: ★ {driver?.rating || 4.8}
            </p>
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        
        {/* 1. Interactive Star Rating */}
        <div className="p-6 bg-slate-50 rounded-2xl border border-slate-200 text-center space-y-3">
          <p className="text-xs uppercase tracking-wider font-bold text-slate-500">
            Tap Stars to Rate
          </p>

          <div className="flex items-center justify-center gap-2 sm:gap-3 py-1">
            {[1, 2, 3, 4, 5].map((star) => {
              const isFilled = star <= (hoverRating || rating);
              return (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  className="p-1 sm:p-2 rounded-2xl hover:scale-115 active:scale-95 transition transform focus:outline-none"
                  aria-label={`Rate ${star} star`}
                >
                  <Star
                    className={`w-9 h-9 sm:w-11 sm:h-11 transition ${
                      isFilled
                        ? 'fill-amber-400 text-amber-500 drop-shadow-sm'
                        : 'fill-slate-200 text-slate-300'
                    }`}
                  />
                </button>
              );
            })}
          </div>

          <div className="inline-block">
            <span className={`text-xs sm:text-sm font-bold px-3.5 py-1 rounded-full border ${currentLabel.bg} ${currentLabel.color} transition`}>
              {rating} / 5 Stars — {currentLabel.text}
            </span>
          </div>
        </div>

        {/* 2. Feedback Quick Tags */}
        <div className="space-y-2.5">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
              What went well or needs improvement? (Select tags)
            </label>
            <span className="text-[11px] text-slate-400">
              {selectedTags.length} selected
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {availableTags.map((tag) => {
              const active = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition border ${
                    active
                      ? 'bg-amber-500 text-slate-950 border-amber-500 shadow-2xs scale-102'
                      : 'bg-white text-slate-700 border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* 3. Written Review / Comments */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Detailed Written Feedback</span>
            </label>
            <span className="text-[11px] text-slate-400">
              {feedback.length} / 500 chars
            </span>
          </div>

          <textarea
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            maxLength={500}
            rows={3}
            placeholder={`Tell us about ${driver?.name || 'the driver'}'s punctuality, vehicle condition, route assistance, and cargo handling...`}
            className="w-full p-3.5 text-xs sm:text-sm bg-white border border-slate-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-amber-500 text-slate-800 leading-relaxed shadow-2xs"
          />

          {/* Quick autofill sample phrases */}
          <div className="flex items-center gap-2 flex-wrap pt-1">
            <span className="text-[11px] text-slate-400 font-medium">Quick suggestions:</span>
            {SAMPLE_FEEDBACKS.map((sample, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setFeedback(sample)}
                className="text-[11px] text-slate-600 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition truncate max-w-[240px]"
                title={sample}
              >
                "{sample.slice(0, 30)}..."
              </button>
            ))}
          </div>
        </div>

        {/* 4. Optional Driver Appreciation Tip */}
        <div className="p-4 sm:p-5 bg-amber-50/60 rounded-2xl border border-amber-200/80 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <div className="flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span className="text-xs font-bold text-slate-900">
                Driver Appreciation Tip (Optional)
              </span>
            </div>
            <span className="text-[11px] text-amber-800 font-medium">
              100% of tip goes directly to {driver?.name}'s digital wallet
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {[0, 50, 100, 200].map((amt) => (
              <button
                key={amt}
                type="button"
                onClick={() => handleTipSelect(amt)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition border ${
                  selectedTip === amt && customTip === ''
                    ? 'bg-amber-500 text-slate-950 border-amber-600 shadow-2xs'
                    : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                }`}
              >
                {amt === 0 ? 'No Tip' : `₹${amt}`}
              </button>
            ))}

            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded-xl px-2.5 py-1 text-xs">
              <span className="text-slate-400 font-bold">₹</span>
              <input
                type="number"
                value={customTip}
                onChange={(e) => handleCustomTipChange(e.target.value)}
                placeholder="Custom"
                className="w-16 focus:outline-none text-xs font-bold text-slate-800"
              />
            </div>
          </div>
        </div>

        {/* 5. Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
          <div className="text-[11px] text-slate-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 flex-shrink-0" />
            <span>Review will be linked with Verified Booking #{booking.bookingNumber}</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            {existingReview && (
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-xl text-xs transition"
              >
                Cancel
              </button>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 sm:flex-none px-7 py-3 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs sm:text-sm transition shadow-sm flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isSubmitting ? (
                <span>Submitting Feedback...</span>
              ) : (
                <>
                  <Sparkles className="w-4 h-4 text-slate-950" />
                  <span>Submit Star Rating & Feedback</span>
                </>
              )}
            </button>
          </div>
        </div>

      </form>
    </div>
  );
};
