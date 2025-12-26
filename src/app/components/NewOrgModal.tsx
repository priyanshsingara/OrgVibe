import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-q657kdxk1w";
import { toast } from 'sonner';

interface NewOrgModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => Promise<void>;
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
          <path d={svgPaths.p207fe380} id="Vector_2" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M19 12L13 18" id="Vector_3" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 12L19 18" id="Vector_4" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function BuildingOffice() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="BuildingOffice">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <path 
          d="M4 28H28M6 28V6C6 5.46957 6.21071 4.96086 6.58579 4.58579C6.96086 4.21071 7.46957 4 8 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V28M20 12H24C24.5304 12 25.0391 12.2107 25.4142 12.5858C25.7893 12.9609 26 13.4696 26 14V28M10 10H14M10 16H14M10 22H14" 
          stroke="white" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth="2" 
        />
      </svg>
    </div>
  );
}

export function NewOrgModal({ isOpen, onClose, onSubmit }: NewOrgModalProps) {
  const [orgName, setOrgName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!orgName.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(orgName.trim());
      setOrgName("");
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
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 30, stiffness: 300 }}
            className="fixed right-0 top-0 h-full w-full max-w-[500px] z-[9999] shadow-[-24px_0px_4px_0px_rgba(0,0,0,0.35)]"
          >
            <div className="bg-gradient-to-b from-[#0a0b36] to-[#003e9e] content-stretch flex flex-col items-start relative size-full h-full">
              
              {/* Header */}
              <div className="relative shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(255,255,255,0.2)] border-dashed inset-0 pointer-events-none" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center justify-between relative w-full p-[20px]">
                    <div 
                      onClick={onClose}
                      className="relative shrink-0 size-[32px] cursor-pointer hover:opacity-70 transition-opacity"
                    >
                      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
                        <path d="M19 12L13 18M13 12L19 18M5 8V5.2C5 4.0799 5 3.51984 5.21799 3.09202C5.40973 2.71569 5.71569 2.40973 6.09202 2.21799C6.51984 2 7.0799 2 8.2 2H11M5 24V26.8C5 27.9201 5 28.4802 5.21799 28.908C5.40973 29.2843 5.71569 29.5903 6.09202 29.782C6.51984 30 7.0799 30 8.2 30H11M27 8V5.2C27 4.0799 27 3.51984 26.782 3.09202C26.5903 2.71569 26.2843 2.40973 25.908 2.21799C25.4802 2 24.9201 2 23.8 2H21M27 24V26.8C27 27.9201 27 28.4802 26.782 28.908C26.5903 29.2843 26.2843 29.5903 25.908 29.782C25.4802 30 24.9201 30 23.8 30H21" 
                          stroke="rgba(255,255,255,0.6)" 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="2" 
                        />
                      </svg>
                    </div>
                    <p className="font-['Audiowide',sans-serif] leading-[1.1] relative shrink-0 text-[rgba(255,255,255,0.6)] text-[20px] text-nowrap">new org</p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full overflow-y-auto">
                <div className="size-full">
                  <div className="content-stretch flex flex-col items-start justify-between px-[20px] py-[24px] relative size-full min-h-full">
                    
                    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
                      
                      {/* Org Name Input */}
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                        <p className="font-['Geist_Mono',monospace] font-medium leading-[1.1] relative shrink-0 text-white text-[14px] text-nowrap tracking-[0.28px] uppercase">organization name</p>
                        
                        <div className="relative w-full">
                          <div className="relative rounded-[8px] shrink-0 w-full">
                            <div aria-hidden="true" className="absolute border-[rgba(255,255,255,0.4)] border-[1px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                            <div className="flex flex-row items-center size-full">
                              <div className="content-stretch flex gap-[8px] items-center p-[16px] relative w-full">
                                <input
                                  type="text"
                                  value={orgName}
                                  onChange={(e) => setOrgName(e.target.value)}
                                  onKeyDown={handleKeyDown}
                                  placeholder="enter organization name..."
                                  autoFocus
                                  className="flex-1 font-['Geist_Mono',monospace] font-normal leading-[1.1] text-[16px] text-white bg-transparent outline-none placeholder-[rgba(255,255,255,0.4)]"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Hint */}
                      <div className="content-stretch flex flex-col gap-[8px] items-start relative shrink-0 w-full">
                        <p className="font-['Geist_Mono',monospace] font-light leading-[1.4] relative text-[rgba(255,255,255,0.5)] text-[13px]">
                          tip: add any organization you'd like to track vibes for. once added, you and others can start sharing experiences!
                        </p>
                      </div>

                    </div>

                    {/* Submit Button */}
                    <div 
                      onClick={isSubmitting ? undefined : handleSubmit}
                      className={`bg-white relative rounded-[8px] shrink-0 w-full mt-8 cursor-pointer hover:bg-gray-100 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div aria-hidden="true" className="absolute border-2 border-[rgba(0,0,0,0.1)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.35)]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-between px-[24px] py-[20px] relative w-full">
                          <p className="basis-0 font-['Geist_Mono',monospace] font-black grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[18px] text-[#0a0b36] tracking-[0.6px] uppercase">
                            {isSubmitting ? "adding..." : "add organization"}
                          </p>
                          {!isSubmitting && <BuildingOffice />}
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>

            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

