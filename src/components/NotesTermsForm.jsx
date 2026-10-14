import React, { useRef } from 'react';
import { Upload, Trash2 } from 'lucide-react';

export const NotesTermsForm = ({ notesTerms, onChange }) => {
  const sigInputRef = useRef(null);

  const handleSignatureUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === 'string') {
        onChange({ ...notesTerms, signatureImage: event.target.result });
      }
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveSignature = () => {
    onChange({ ...notesTerms, signatureImage: '' });
    if (sigInputRef.current) {
      sigInputRef.current.value = '';
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-stone-200/80 shadow-[0_2px_10px_-2px_rgba(28,25,23,0.03)] p-6 transition-all hover:border-stone-300/80">
      <div className="flex items-center justify-between mb-5 pb-3.5 border-b border-stone-100">
        <div className="flex items-baseline gap-2">
          <span className="font-serif-display text-amber-800/70 font-medium text-sm">08</span>
          <h2 className="text-sm font-semibold tracking-tight text-stone-900">Notes, Clauses & Sign-off</h2>
          <span className="text-stone-400 text-xs hidden sm:inline">· Studio notes, policies & authorized signature</span>
        </div>
      </div>

      <div className="space-y-4">
        {/* Notes */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-stone-600">
              Personal Client Note
            </label>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...notesTerms,
                  notes: 'Thank you for your business! We appreciate the opportunity to work together.',
                })
              }
              className="text-[11px] text-amber-900/80 hover:text-amber-950 font-medium hover:underline"
            >
              Insert Courtesy Note
            </button>
          </div>
          <textarea
            rows={2}
            value={notesTerms.notes}
            onChange={(e) => onChange({ ...notesTerms, notes: e.target.value })}
            placeholder="e.g. Thank you for choosing our studio. Gallery previews are accessible via your private client link."
            className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 resize-none"
          />
        </div>

        {/* Terms & Conditions */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="block text-xs font-medium text-stone-600">
              Contract Terms & Conditions
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...notesTerms,
                    terms:
                      '1. Payment is due within 15 calendar days of issue.\n2. Overdue balances accrue a 1.5% monthly late assessment.',
                  })
                }
                className="text-[11px] text-amber-900/80 hover:text-amber-950 font-medium hover:underline"
              >
                Standard Net-15
              </button>
              <button
                type="button"
                onClick={() =>
                  onChange({
                    ...notesTerms,
                    terms:
                      '1. Final deliverables will be released upon 100% settlement of invoice balance.\n2. In case of schedule revisions, notify the studio at least 7 days in advance.',
                  })
                }
                className="text-[11px] text-amber-900/80 hover:text-amber-950 font-medium hover:underline"
              >
                Studio Terms
              </button>
            </div>
          </div>
          <textarea
            rows={3}
            value={notesTerms.terms}
            onChange={(e) => onChange({ ...notesTerms, terms: e.target.value })}
            placeholder="Payment due dates, cancellation clause or copyright license terms..."
            className="w-full px-3.5 py-2 text-sm bg-[#FBFBF9] border border-stone-200 rounded-xl focus:bg-white focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden transition-all text-stone-900 resize-none"
          />
        </div>

        {/* Signature Block Toggle */}
        <div className="pt-2 border-t border-stone-100">
          <div className="flex items-center justify-between mb-3">
            <label className="flex items-center gap-2 cursor-pointer text-xs font-semibold text-stone-800">
              <input
                type="checkbox"
                checked={notesTerms.signatureEnabled}
                onChange={(e) => onChange({ ...notesTerms, signatureEnabled: e.target.checked })}
                className="rounded-md border-stone-300 text-stone-900 focus:ring-stone-800 w-4 h-4"
              />
              <span>Include Authorized Signature Block</span>
            </label>
          </div>

          {notesTerms.signatureEnabled && (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 p-3.5 bg-[#FAF9F7] rounded-xl border border-stone-200/80">
              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Signatory Full Name
                </label>
                <input
                  type="text"
                  value={notesTerms.signatureName}
                  onChange={(e) => onChange({ ...notesTerms, signatureName: e.target.value })}
                  placeholder="e.g. Karthik Ramanathan"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Title / Designation
                </label>
                <input
                  type="text"
                  value={notesTerms.signatureRole}
                  onChange={(e) => onChange({ ...notesTerms, signatureRole: e.target.value })}
                  placeholder="e.g. Studio Director"
                  className="w-full px-2.5 py-1.5 text-xs sm:text-sm bg-white border border-stone-200 rounded-lg focus:border-stone-800 focus:ring-1 focus:ring-stone-800/10 focus:outline-hidden text-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-500 mb-1">
                  Signature Image (Optional)
                </label>
                {notesTerms.signatureImage ? (
                  <div className="flex items-center gap-2 p-1 bg-white border border-stone-200 rounded-lg">
                    <img
                      src={notesTerms.signatureImage}
                      alt="Signature"
                      className="h-7 max-w-[100px] object-contain"
                    />
                    <button
                      type="button"
                      onClick={handleRemoveSignature}
                      className="text-stone-400 hover:text-rose-600 p-1 ml-auto"
                      title="Remove signature image"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <div>
                    <button
                      type="button"
                      onClick={() => sigInputRef.current?.click()}
                      className="w-full flex items-center justify-center gap-1 px-2.5 py-1.5 border border-dashed border-stone-300 hover:border-stone-500 rounded-lg text-xs font-medium text-stone-600 hover:text-stone-900 bg-white"
                    >
                      <Upload className="w-3 h-3 text-stone-400" />
                      <span>Upload E-Sign</span>
                    </button>
                    <input
                      ref={sigInputRef}
                      type="file"
                      accept="image/png, image/jpeg, image/svg+xml"
                      onChange={handleSignatureUpload}
                      className="hidden"
                    />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
