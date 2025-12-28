import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-q657kdxk1w";
import { Organization } from '../data';

interface NewOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
  organizations: Organization[];
}

// Icons
function ReceiptX({ onClick }: { onClick: () => void }) {
  return (
    <div 
      className="relative shrink-0 size-[32px] cursor-pointer hover:opacity-70 transition-opacity" 
      data-name="ReceiptX"
      onClick={onClick}
    >
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="ReceiptX">
          <g id="Vector"></g>
          <path d={svgPaths.p207fe380} id="Vector_2" stroke="var(--muted-foreground-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M19 12L13 18" id="Vector_3" stroke="var(--muted-foreground-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 12L19 18" id="Vector_4" stroke="var(--muted-foreground-tertiary)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

export function NewOrgModal({ isOpen, onClose, onSubmit, organizations }: NewOrgModalProps) {
  const [orgName, setOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasError, setHasError] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      // Use requestAnimationFrame to ensure DOM is ready, then focus
      requestAnimationFrame(() => {
        setTimeout(() => {
          inputRef.current?.focus();
        }, 0);
      });
    }
  }, [isOpen]);

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setOrgName("");
      setHasError(false);
    }
  }, [isOpen]);

  const checkDuplicate = (name: string): boolean => {
    const normalizedName = name.toLowerCase().trim();
    return organizations.some(org => org.name.toLowerCase() === normalizedName);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setOrgName(value);
    // Clear error state when user types or backspaces
    if (hasError) {
      setHasError(false);
    }
  };

  const handleSubmit = async () => {
    const trimmedName = orgName.trim();
    
    if (!trimmedName) {
      return;
    }

    // Check for duplicates before submitting
    if (checkDuplicate(trimmedName)) {
      setHasError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(trimmedName);
      setOrgName("");
      setHasError(false);
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !isSubmitting) {
      handleSubmit();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.2 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-white z-[9998]"
          />
          
          {/* Modal */}
          <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 pointer-events-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white shadow-[-24px_24px_4px_0px_rgba(0,0,0,0.35)] w-full max-w-[800px] pointer-events-auto"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="relative shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-dashed inset-0 pointer-events-none" />
                <div className="flex items-center justify-between px-[20px] py-[21px]">
                  <ReceiptX onClick={onClose} />
                  <p className="font-['Geist_Mono',monospace] font-bold leading-[1.1] text-[20px] text-nowrap" style={{ color: 'var(--muted-foreground-tertiary)' }}>
                    add new org
                  </p>
                </div>
              </div>

              {/* Content */}
              <div className="flex flex-col items-start px-0 py-[8px]">
                {/* Input Area with left border accent */}
                <div className="w-full px-[20px] py-[16px] border-l-[6px] border-foreground border-solid">
                  <input
                    ref={inputRef}
                    type="text"
                    value={orgName}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                    placeholder={hasError ? "" : "every org needs a name; start typing here"}
                    className="w-full font-['Geist_Mono',monospace] font-semibold leading-[1.1] text-[18px] bg-transparent outline-none border-0"
                    style={{
                      color: hasError || orgName ? 'var(--foreground)' : 'var(--muted-foreground-secondary)',
                      caretColor: 'black'
                    }}
                    disabled={isSubmitting}
                    autoFocus
                  />
                </div>

                {/* Instruction/Error Message */}
                <div className="w-full px-[20px] py-[16px]">
                  {hasError ? (
                    // Error message
                    <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[14px]" style={{ color: 'var(--warning)' }}>
                      this org already exists. a quick search should help you find it.
                    </p>
                  ) : isSubmitting ? (
                    // Loading state
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-muted-foreground-secondary border-t-transparent"></div>
                      <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[14px]" style={{ color: 'var(--muted-foreground-secondary)' }}>
                        loading, loading, loading...
                      </p>
                    </div>
                  ) : (
                    // Instruction text (always show)
                    <p className="font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[14px]" style={{ color: 'var(--muted-foreground-secondary)' }}>
                      hit ⏎ enter/return when it feels right
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          </div>
        </>
      )}
    </AnimatePresence>
  );
}
