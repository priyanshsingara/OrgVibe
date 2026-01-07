import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-q657kdxk1w";
import { toast } from 'sonner';
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
          <path d={svgPaths.p207fe380} id="Vector_2" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M19 12L13 18" id="Vector_3" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
          <path d="M13 12L19 18" id="Vector_4" stroke="var(--stroke-0, #B2B2B2)" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" />
        </g>
      </svg>
    </div>
  );
}

function CheckFat() {
  return (
    <div className="relative shrink-0 size-[32px]" data-name="CheckFat">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 32 32">
        <g id="CheckFat">
          <path d={svgPaths.pdb3400} fill="var(--fill-0, white)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

export function NewOrgModal({ isOpen, onClose, onSubmit, organizations }: NewOrgModalProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!name || !name.trim()) {
      toast.error("Please enter an organization name");
      return;
    }

    // Check for duplicates (case-insensitive)
    const normalizedName = name.trim().toLowerCase();
    const isDuplicate = organizations.some(org => org.name.toLowerCase() === normalizedName);
    
    if (isDuplicate) {
      toast.error("This organization already exists");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(name.trim());
      // Reset form
      setName("");
      onClose();
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
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
            className="fixed right-0 top-0 h-full w-full max-w-[600px] z-[9999] shadow-[-24px_0px_4px_0px_rgba(0,0,0,0.35)]"
          >
            <div className="bg-white content-stretch flex flex-col items-start relative size-full h-full">
              
              {/* Header */}
              <div className="relative shrink-0 w-full">
                <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-dashed inset-0 pointer-events-none" />
                <div className="flex flex-row items-center size-full">
                  <div className="content-stretch flex items-center justify-between relative w-full p-[20px]">
                    <ReceiptX onClick={onClose} />
                    <p className="font-['Geist_Mono',monospace] font-bold leading-[1.1] relative shrink-0 text-[#b2b2b2] text-[20px] text-nowrap uppercase tracking-wider">new organization</p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full overflow-y-auto">
                <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-dashed inset-0 pointer-events-none" />
                <div className="size-full">
                  <div className="content-stretch flex flex-col items-start justify-between px-[20px] py-[24px] relative size-full min-h-full">
                    
                    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
                      
                      {/* Organization Name Input */}
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                        <p className="font-['Geist_Mono',monospace] font-medium leading-[1.1] relative shrink-0 text-[#222] text-[14px] text-nowrap tracking-[0.28px] uppercase">organization name</p>
                        <div className="relative rounded-[8px] shrink-0 w-full">
                          <div aria-hidden="true" className="absolute border-[#8c8c8c] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                          <div className="flex flex-row items-center justify-center size-full">
                            <div className="content-stretch flex items-start p-[16px] relative w-full">
                              <input 
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter' && !isSubmitting) {
                                    handleSubmit();
                                  }
                                }}
                                placeholder="enter organization name..."
                                className="basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[#222] text-[16px] outline-none bg-transparent placeholder-[#6f6f6f] w-full"
                                autoFocus
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Submit Button */}
                    <div 
                      onClick={isSubmitting ? undefined : handleSubmit}
                      className={`bg-black relative rounded-[8px] shrink-0 w-full mt-8 cursor-pointer hover:bg-gray-900 transition-colors ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.35)]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-between px-[24px] py-[20px] relative w-full">
                          <p className="basis-0 font-['Geist_Mono',monospace] font-black grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[20px] text-white tracking-[0.6px]">
                            {isSubmitting ? "ADDING..." : "DONE! ADD ORGANIZATION"}
                          </p>
                          {!isSubmitting && <CheckFat />}
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
