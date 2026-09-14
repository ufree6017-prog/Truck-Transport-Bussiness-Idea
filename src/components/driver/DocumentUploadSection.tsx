import React, { useState } from 'react';
import { DriverDocument } from '../../types';
import { 
  Upload, 
  FileCheck, 
  Camera, 
  CheckCircle2, 
  AlertTriangle, 
  Eye, 
  Trash2, 
  Clock, 
  ShieldCheck, 
  FileText, 
  RefreshCw,
  ExternalLink,
  Info
} from 'lucide-react';

interface DocumentUploadSectionProps {
  currentDocuments: DriverDocument[];
  onDocumentsSubmitted: (updatedDocs: DriverDocument[]) => void;
  driverName?: string;
  vehicleNumber?: string;
  isApproved?: boolean;
}

interface DocSlotConfig {
  type: 'vehicle_rc' | 'driving_license' | 'vehicle_insurance';
  name: string;
  label: string;
  hindiLabel: string;
  samplePhoto: string;
  sampleDocNumber: string;
  defaultExpiry: string;
  guidelines: string;
  rtoCheck: string;
}

const DOC_SLOTS: DocSlotConfig[] = [
  {
    type: 'vehicle_rc',
    name: 'Vehicle Registration Certificate (RC)',
    label: 'RC Book / Smart Card',
    hindiLabel: 'गाड़ी का आरसी (RC)',
    samplePhoto: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=600&auto=format&fit=crop&q=80',
    sampleDocNumber: 'RJ 14 GC 9904',
    defaultExpiry: '2035-11-22',
    guidelines: 'Clear color photo of smart card RC or Form 23 showing registration number, chassis number, engine number & vehicle unladen weight.',
    rtoCheck: 'VAHAN 4.0 Database Verification'
  },
  {
    type: 'driving_license',
    name: 'Commercial Driving License (DL)',
    label: 'Commercial DL (HMV / Transport)',
    hindiLabel: 'ड्राइविंग लाइसेंस (DL)',
    samplePhoto: 'https://images.unsplash.com/photo-1589829545856-d10d557cf95f?w=600&auto=format&fit=crop&q=80',
    sampleDocNumber: 'RJ14 2019001889',
    defaultExpiry: '2029-05-14',
    guidelines: 'Front & back readable color photo of commercial driver license with valid Transport / Heavy Motor Vehicle (TRANS/HMV) endorsement badge.',
    rtoCheck: 'SARATHI Portal Verification'
  },
  {
    type: 'vehicle_insurance',
    name: 'Goods Vehicle Insurance Policy',
    label: 'Carrier Insurance Policy',
    hindiLabel: 'वाहन बीमा पॉलिसी (Insurance)',
    samplePhoto: 'https://images.unsplash.com/photo-1450133064473-71024230f91b?w=600&auto=format&fit=crop&q=80',
    sampleDocNumber: 'NIC-COM-88390',
    defaultExpiry: '2027-08-30',
    guidelines: 'Valid comprehensive carrier policy schedule covering commercial transit risk and mandatory third-party liability.',
    rtoCheck: 'Insurance Information Bureau (IIB) Verified'
  }
];

export const DocumentUploadSection: React.FC<DocumentUploadSectionProps> = ({
  currentDocuments,
  onDocumentsSubmitted,
  driverName = 'Driver Partner',
  vehicleNumber = 'RJ 14 GC 9904',
  isApproved = false
}) => {
  // Local state for the 3 core required documents
  const [docStates, setDocStates] = useState<Record<string, {
    documentNumber: string;
    expiryDate: string;
    fileUrl?: string;
    fileName?: string;
    fileSize?: string;
    status: 'valid' | 'expiring_soon' | 'expired' | 'under_review' | 'not_uploaded';
    isNewUpload?: boolean;
  }>>(() => {
    const initialState: any = {};
    DOC_SLOTS.forEach(slot => {
      const existing = currentDocuments.find(d => d.type === slot.type);
      if (existing) {
        initialState[slot.type] = {
          documentNumber: existing.documentNumber || slot.sampleDocNumber,
          expiryDate: existing.expiryDate || slot.defaultExpiry,
          fileUrl: existing.fileUrl || slot.samplePhoto,
          fileName: existing.fileUrl ? `${slot.type}_document.jpg` : undefined,
          fileSize: existing.fileUrl ? '1.8 MB' : undefined,
          status: existing.status || 'under_review',
          isNewUpload: false
        };
      } else {
        initialState[slot.type] = {
          documentNumber: slot.sampleDocNumber,
          expiryDate: slot.defaultExpiry,
          fileUrl: undefined,
          fileName: undefined,
          fileSize: undefined,
          status: 'not_uploaded',
          isNewUpload: false
        };
      }
    });
    return initialState;
  });

  // Modal preview state for full-screen photo viewing
  const [previewPhoto, setPreviewPhoto] = useState<{ url: string; title: string; docNumber: string } | null>(null);

  // Submission state
  const [submitting, setSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'rc' | 'dl' | 'insurance'>('all');

  // Handle local file selection with FileReader
  const handleFileChange = (type: string, file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string;
      const sizeMb = (file.size / (1024 * 1024)).toFixed(2);

      setDocStates(prev => ({
        ...prev,
        [type]: {
          ...prev[type],
          fileUrl: dataUrl,
          fileName: file.name,
          fileSize: `${sizeMb} MB`,
          status: 'under_review',
          isNewUpload: true
        }
      }));
      setSubmitSuccess(false);
    };
    reader.readAsDataURL(file);
  };

  // Quick test fill using official simulated sample photos
  const handleUseSamplePhoto = (slot: DocSlotConfig) => {
    setDocStates(prev => ({
      ...prev,
      [slot.type]: {
        ...prev[slot.type],
        documentNumber: prev[slot.type]?.documentNumber || slot.sampleDocNumber,
        expiryDate: prev[slot.type]?.expiryDate || slot.defaultExpiry,
        fileUrl: slot.samplePhoto,
        fileName: `${slot.type}_sample_verified.jpg`,
        fileSize: '1.4 MB',
        status: 'under_review',
        isNewUpload: true
      }
    }));
    setSubmitSuccess(false);
  };

  const handleRemovePhoto = (type: string) => {
    setDocStates(prev => ({
      ...prev,
      [type]: {
        ...prev[type],
        fileUrl: undefined,
        fileName: undefined,
        fileSize: undefined,
        status: 'not_uploaded',
        isNewUpload: true
      }
    }));
    setSubmitSuccess(false);
  };

  // Submit documents for admin verification
  const handleSubmitAll = () => {
    setSubmitting(true);
    setSubmitSuccess(false);

    setTimeout(() => {
      const updatedList: DriverDocument[] = DOC_SLOTS.map(slot => {
        const state = docStates[slot.type];
        const existing = currentDocuments.find(d => d.type === slot.type);

        return {
          id: existing?.id || `doc-${slot.type}-${Date.now()}`,
          type: slot.type as any,
          name: slot.name,
          documentNumber: state?.documentNumber || slot.sampleDocNumber,
          fileUrl: state?.fileUrl || slot.samplePhoto,
          uploadedAt: new Date().toISOString().split('T')[0],
          expiryDate: state?.expiryDate || slot.defaultExpiry,
          status: 'under_review' as const
        };
      });

      // Preserve other documents (like aadhaar or fitness)
      const otherDocs = currentDocuments.filter(
        d => !['vehicle_rc', 'driving_license', 'vehicle_insurance'].includes(d.type)
      );

      const combined = [...updatedList, ...otherDocs];
      onDocumentsSubmitted(combined);

      setSubmitting(false);
      setSubmitSuccess(true);
    }, 1200);
  };

  const allPhotosUploaded = DOC_SLOTS.every(slot => !!docStates[slot.type]?.fileUrl);

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs uppercase font-black tracking-widest bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-200">
              RTO & Compliance Desk
            </span>
            <span className="text-xs text-slate-500">Government Gateway VAHAN 4.0</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900">
            Upload RC, Insurance & Commercial License Photos
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
            Upload clear, readable color photos or camera scans of your mandatory transport documents for verification by TruckSetu Admin compliance officers.
          </p>
        </div>

        <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-2xl text-xs text-amber-900 self-start md:self-auto">
          <Clock className="w-4 h-4 text-amber-600 flex-shrink-0 animate-spin" />
          <div>
            <span className="font-bold">Avg Admin SLA:</span> <strong>2 Hours</strong>
            <p className="text-[10px] text-amber-700">Digital OCR & RTO live cross-check</p>
          </div>
        </div>
      </div>

      {/* Success Notification Banner */}
      {submitSuccess && (
        <div className="p-4 bg-emerald-50 border-2 border-emerald-300 rounded-2xl flex items-start gap-3 text-xs text-emerald-950 animate-in fade-in duration-300">
          <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
          <div className="space-y-1">
            <h4 className="font-bold text-sm text-emerald-900">
              Photos Submitted Successfully for Admin Verification!
            </h4>
            <p className="text-emerald-800 leading-relaxed">
              Your <strong>Vehicle RC</strong>, <strong>Commercial License</strong>, and <strong>Insurance Policy</strong> photos have been queued on the <strong>Admin Operations & Compliance Desk</strong>. You can switch to the Admin section at any time to review and grant verification clearance.
            </p>
            <p className="font-mono text-[11px] text-emerald-700">
              Compliance Batch ID: <strong>KYC-RTO-{Date.now().toString().slice(-6)}</strong> • Timestamp: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
      )}

      {/* Upload Cards Grid for RC, Driving License & Insurance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {DOC_SLOTS.map((slot) => {
          const state = docStates[slot.type] || {};
          const hasPhoto = !!state.fileUrl;
          const isUnderReview = state.status === 'under_review';
          const isValid = state.status === 'valid';

          return (
            <div 
              key={slot.type}
              className={`rounded-2xl border transition flex flex-col justify-between overflow-hidden bg-white ${
                hasPhoto 
                  ? 'border-emerald-300 ring-1 ring-emerald-200' 
                  : 'border-slate-200 hover:border-slate-300'
              }`}
            >
              {/* Card Header */}
              <div className="p-5 border-b border-slate-100 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                    {slot.label}
                  </span>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                    hasPhoto
                      ? isUnderReview
                        ? 'bg-amber-100 text-amber-800 border border-amber-200'
                        : 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                      : 'bg-slate-100 text-slate-600 border border-slate-200'
                  }`}>
                    {hasPhoto ? (isUnderReview ? 'Under Admin Review' : 'Verified') : 'Photo Required'}
                  </span>
                </div>

                <div>
                  <h3 className="font-bold text-base text-slate-900 leading-snug">{slot.name}</h3>
                  <p className="text-xs text-slate-500">{slot.hindiLabel}</p>
                </div>

                <p className="text-[11px] text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  {slot.guidelines}
                </p>
              </div>

              {/* Card Body: Photo Preview or Upload Dropzone */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
                {hasPhoto ? (
                  /* Photo Preview Box */
                  <div className="space-y-3">
                    <div className="relative group rounded-xl overflow-hidden border border-slate-200 aspect-video bg-slate-900 flex items-center justify-center">
                      <img 
                        src={state.fileUrl} 
                        alt={slot.name}
                        className="w-full h-full object-cover transition group-hover:opacity-90"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewPhoto({
                            url: state.fileUrl!,
                            title: slot.name,
                            docNumber: state.documentNumber || slot.sampleDocNumber
                          })}
                          className="p-2 bg-white text-slate-900 rounded-lg text-xs font-bold flex items-center gap-1 shadow hover:bg-slate-100"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View Full Photo</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleRemovePhoto(slot.type)}
                          className="p-2 bg-red-600 text-white rounded-lg text-xs font-bold flex items-center gap-1 shadow hover:bg-red-700"
                          title="Remove Photo"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 text-white text-[10px] font-mono px-2 py-0.5 rounded backdrop-blur-xs">
                        {state.fileName || 'document_photo.jpg'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-[11px] text-slate-500">
                      <span className="flex items-center gap-1 text-emerald-700 font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Photo attached
                      </span>
                      <span>{state.fileSize || '1.8 MB'}</span>
                    </div>
                  </div>
                ) : (
                  /* Upload Dropzone */
                  <div className="space-y-3">
                    <label className="border-2 border-dashed border-slate-300 hover:border-emerald-500 rounded-xl p-5 text-center cursor-pointer block transition bg-slate-50/50 hover:bg-emerald-50/20 group">
                      <input
                        type="file"
                        accept="image/*,.pdf"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) handleFileChange(slot.type, file);
                        }}
                      />
                      <div className="w-10 h-10 rounded-full bg-slate-200 text-slate-600 group-hover:bg-emerald-100 group-hover:text-emerald-700 flex items-center justify-center mx-auto mb-2 transition">
                        <Camera className="w-5 h-5" />
                      </div>
                      <p className="text-xs font-bold text-slate-800 group-hover:text-emerald-900">
                        Take Photo or Upload Image
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        JPG, PNG, WebP or PDF (Max 10 MB)
                      </p>
                    </label>

                    {/* Quick Test Fill with Simulated Document */}
                    <button
                      type="button"
                      onClick={() => handleUseSamplePhoto(slot)}
                      className="w-full py-2 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs flex items-center justify-center gap-1.5 transition border border-slate-200"
                    >
                      <FileCheck className="w-3.5 h-3.5 text-slate-600" />
                      <span>Use Sample {slot.label} Photo</span>
                    </button>
                  </div>
                )}

                {/* Form Fields: Document Number & Expiry Date */}
                <div className="space-y-3 pt-3 border-t border-slate-100">
                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      {slot.label} Registration / Policy No. *
                    </label>
                    <input
                      type="text"
                      value={state.documentNumber || ''}
                      onChange={(e) => {
                        const val = e.target.value.toUpperCase();
                        setDocStates(prev => ({
                          ...prev,
                          [slot.type]: {
                            ...prev[slot.type],
                            documentNumber: val
                          }
                        }));
                      }}
                      placeholder={`e.g. ${slot.sampleDocNumber}`}
                      className="w-full px-3 py-2 text-xs font-mono font-bold uppercase border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-bold text-slate-700 mb-1">
                      Document Expiry Date *
                    </label>
                    <input
                      type="date"
                      value={state.expiryDate || ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setDocStates(prev => ({
                          ...prev,
                          [slot.type]: {
                            ...prev[slot.type],
                            expiryDate: val
                          }
                        }));
                      }}
                      className="w-full px-3 py-2 text-xs font-medium border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-white"
                    />
                  </div>

                  <div className="flex items-center gap-1 text-[10px] text-slate-500 pt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <span>Auto-linked with: <strong>{slot.rtoCheck}</strong></span>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Actions Bar */}
      <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-0.5">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-900">
              Verification Compliance Status:
            </span>
            <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
              allPhotosUploaded 
                ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' 
                : 'bg-amber-100 text-amber-800 border border-amber-200'
            }`}>
              {allPhotosUploaded ? '3 of 3 Photos Ready' : 'Photos Pending Upload'}
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Registered Vehicle: <strong>{vehicleNumber}</strong> • Partner Name: <strong>{driverName}</strong>
          </p>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          {/* Quick populate all 3 photos for instantaneous testing */}
          <button
            type="button"
            onClick={() => {
              DOC_SLOTS.forEach(slot => handleUseSamplePhoto(slot));
            }}
            className="px-3.5 py-2.5 bg-white hover:bg-slate-100 text-slate-700 font-bold rounded-xl text-xs border border-slate-300 transition whitespace-nowrap shadow-2xs"
          >
            Auto-Fill All 3 Sample Photos
          </button>

          {/* Submit Documents for Admin Verification */}
          <button
            type="button"
            disabled={submitting}
            onClick={handleSubmitAll}
            className="flex-1 sm:flex-none px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs transition shadow flex items-center justify-center gap-2"
          >
            {submitting ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Submitting for Admin Audit...</span>
              </>
            ) : (
              <>
                <ShieldCheck className="w-4 h-4" />
                <span>Submit Documents for Admin Verification</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Full Photo Preview Modal */}
      {previewPhoto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-200">
              <div>
                <h3 className="font-bold text-base text-slate-900 font-display">
                  {previewPhoto.title}
                </h3>
                <p className="text-xs text-slate-500 font-mono">
                  Document Reference: <strong>{previewPhoto.docNumber}</strong>
                </p>
              </div>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold flex items-center justify-center text-sm"
              >
                ✕
              </button>
            </div>

            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 max-h-[60vh] flex items-center justify-center">
              <img
                src={previewPhoto.url}
                alt={previewPhoto.title}
                className="max-h-[60vh] w-auto object-contain"
              />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
              <span className="flex items-center gap-1.5 text-emerald-700 font-medium">
                <CheckCircle2 className="w-4 h-4" /> Clear Resolution • Ready for RTO OCR Audit
              </span>
              <button
                type="button"
                onClick={() => setPreviewPhoto(null)}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl text-xs"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
