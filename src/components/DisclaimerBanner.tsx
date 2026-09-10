import React, { useState } from 'react';
import { AlertCircle, ChevronDown, ChevronUp, ShieldCheck } from 'lucide-react';

interface Props {
  compact?: boolean;
}

export const DisclaimerBanner: React.FC<Props> = ({ compact = false }) => {
  const [expanded, setExpanded] = useState(false);

  if (compact) {
    return (
      <div 
        id="disclaimer-banner-compact" 
        className="bg-[#F3F4EF] border border-[#E2E6D8] rounded-xl px-4 py-2.5 text-xs text-[#2D332B] flex items-center justify-between"
      >
        <div className="flex items-center gap-2">
          <AlertCircle className="w-3.5 h-3.5 text-[#4B6344] shrink-0" />
          <span>
            <strong className="text-[#4B6344]">Clinical Disclaimer:</strong> AI-assisted screening for decision support only. Always verify critical cases with a registered veterinarian.
          </span>
        </div>
      </div>
    );
  }

  return (
    <div 
      id="disclaimer-banner-card"
      className="bg-[#F3F4EF] border border-[#E2E6D8] rounded-2xl p-4 my-4 shadow-xs"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-[#EEF0E7] rounded-xl text-[#4B6344] shrink-0 mt-0.5 border border-[#E2E6D8]">
            <AlertCircle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#4B6344] bg-[#E2E6D8] px-2 py-0.5 rounded">
                Ethical &amp; Clinical Protocol
              </span>
              <span className="text-xs text-[#2D332B]/60">Decision-Support Notice</span>
            </div>
            <p className="mt-1 text-sm font-semibold text-[#2D332B] leading-snug">
              This system provides AI-assisted screening and informational support. It does not replace professional veterinary diagnosis.
            </p>
            {expanded && (
              <div className="mt-3 text-xs text-[#2D332B]/80 space-y-1.5 border-t border-[#E2E6D8] pt-2.5">
                <p>
                  • <strong>No Direct Prescriptions:</strong> Automated predictions (Cattle/Buffalo identification and dermatological screening) are statistical probability outputs derived from convolutional neural network features.
                </p>
                <p>
                  • <strong>Field Safety:</strong> Never administer regulated veterinary injectables or antibiotics based solely on automated screening.
                </p>
                <p>
                  • <strong>Emergency Escalation:</strong> If an animal presents acute pyrexia (&gt;103.5°F), refusal to nurse, or rapid blister necrosis, access our <strong>Find Veterinarian</strong> module for immediate clinical contact.
                </p>
              </div>
            )}
          </div>
        </div>

        <button
          id="btn-toggle-disclaimer-details"
          onClick={() => setExpanded(!expanded)}
          className="text-xs font-semibold text-[#4B6344] hover:text-[#3D5237] flex items-center gap-1 shrink-0 py-1 px-2.5 hover:bg-[#EEF0E7] rounded-lg transition-colors border border-transparent hover:border-[#E2E6D8]"
        >
          {expanded ? (
            <>
              <span>Less</span>
              <ChevronUp className="w-3.5 h-3.5" />
            </>
          ) : (
            <>
              <span>Guidance</span>
              <ChevronDown className="w-3.5 h-3.5" />
            </>
          )}
        </button>
      </div>
    </div>
  );
};
