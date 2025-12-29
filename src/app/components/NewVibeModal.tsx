import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import svgPaths from "../../imports/svg-q657kdxk1w";
import { toast } from 'sonner';

interface NewVibeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: { category: string; sentiment: 'good' | 'neutral' | 'bad'; content: string }) => Promise<void>;
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

function CaretDown() {
  return (
    <div className="relative shrink-0 size-[20px]" data-name="CaretDown">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 20 20">
        <g id="CaretDown">
          <path d={svgPaths.p23208180} fill="var(--fill-0, #6F6F6F)" id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function Heart({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="Heart">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="Heart">
          <path d={svgPaths.pb222800} fill={isActive ? "#34c759" : "var(--fill-0, #343330)"} id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HeartHalf({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="HeartHalf">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="HeartHalf">
          <path d={svgPaths.p118e7b80} fill={isActive ? "#FFD700" : "var(--fill-0, #343330)"} id="Vector" />
        </g>
      </svg>
    </div>
  );
}

function HeartBreak({ isActive }: { isActive: boolean }) {
  return (
    <div className="relative shrink-0 size-[24px]" data-name="HeartBreak">
      <svg className="block size-full" fill="none" preserveAspectRatio="none" viewBox="0 0 24 24">
        <g id="HeartBreak">
          <path d={svgPaths.p8f59680} fill={isActive ? "#FF3B30" : "var(--fill-0, #343330)"} id="Vector" />
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

export function NewVibeModal({ isOpen, onClose, onSubmit }: NewVibeModalProps) {
  const [category, setCategory] = useState<string>("");
  const [sentiment, setSentiment] = useState<'good' | 'neutral' | 'bad' | null>('good');
  const [content, setContent] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const categories = ["Interview", "Onboarding", "Daily Work", "Exit Process", "Culture", "Management"];

  const handleSubmit = async () => {
    if (!category || !sentiment || !content) {
      toast.error("Please fill in all fields");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        category,
        sentiment: sentiment as 'good' | 'neutral' | 'bad',
        content
      });
      // Reset form
      setCategory("");
      setSentiment(null);
      setContent("");
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
                    <p className="font-['Geist_Mono',monospace] font-bold leading-[1.1] relative shrink-0QX text-[#b2b2b2] text-[20px] text-nowrap">new vibe</p>
                  </div>
                </div>
              </div>

              {/* Content Body */}
              <div className="basis-0 grow min-h-px min-w-px relative shrink-0 w-full overflow-y-auto">
                <div aria-hidden="true" className="absolute border-[0px_0px_1px] border-[rgba(0,0,0,0.2)] border-dashed inset-0 pointer-events-none" />
                <div className="size-full">
                  <div className="content-stretch flex flex-col items-start justify-between px-[20px] py-[24px] relative size-full min-h-full">
                    
                    <div className="content-stretch flex flex-col gap-[32px] items-start relative shrink-0 w-full">
                      
                      {/* Category Selection */}
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full z-20">
                        <p className="font-['Geist_Mono',monospace] font-medium leading-[1.1] relative shrink-0 text-[#222] text-[14px] text-nowrap tracking-[0.28px] uppercase">at what stage did you experience this?</p>
                        
                        <div className="relative w-full">
                          <div 
                            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                            className="relative rounded-[8px] shrink-0 w-full cursor-pointer hover:bg-gray-50 transition-colors"
                          >
                            <div aria-hidden="true" className="absolute border-[#8c8c8c] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="content-stretch flex gap-[8px] items-center justify-center p-[16px] relative w-full">
                                <p className={`basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[16px] ${category ? 'text-black' : 'text-[#6f6f6f]'}`}>
                                  {category || "select category"}
                                </p>
                                <CaretDown />
                              </div>
                            </div>
                          </div>

                          {isDropdownOpen && (
                            <div className="absolute top-full left-0 w-full mt-2 bg-white border border-gray-200 rounded-[8px] shadow-lg max-h-[200px] overflow-y-auto z-50">
                              {categories.map((cat) => (
                                <div 
                                  key={cat}
                                  onClick={() => {
                                    setCategory(cat);
                                    setIsDropdownOpen(false);
                                  }}
                                  className="px-[16px] py-[12px] hover:bg-gray-100 cursor-pointer font-['Geist_Mono',monospace] text-[16px] text-black"
                                >
                                  {cat}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Sentiment Selection */}
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full">
                        <p className="font-['Geist_Mono',monospace] font-medium leading-[1.1] relative shrink-0 text-[#222] text-[14px] text-nowrap tracking-[0.28px] uppercase">vibe check!!!!!</p>
                        <div className="content-stretch flex gap-[12px] items-start relative shrink-0 w-full">
                          
                          {/* Good Vibe */}
                          <div 
                            onClick={() => setSentiment('good')}
                            className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 cursor-pointer transition-all ${sentiment === 'good' ? 'bg-green-50' : 'hover:bg-gray-50'}`}
                          >
                            <div aria-hidden="true" className={`absolute ${sentiment === 'good' ? 'border-[#34c759] border-2 border-solid' : 'border-[#8c8c8c] border-[0.5px] border-dashed'} inset-0 pointer-events-none rounded-[8px] transition-all`} />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="content-stretch flex gap-[8px] items-center justify-center p-[16px] relative w-full">
                                <p className={`basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[16px] transition-colors ${sentiment === 'good' ? 'text-black' : 'text-[#6f6f6f]'}`}>good vibe</p>
                                <Heart isActive={sentiment === 'good'} />
                              </div>
                            </div>
                          </div>

                          {/* Mid Vibe */}
                          <div 
                            onClick={() => setSentiment('neutral')}
                            className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 cursor-pointer transition-all ${sentiment === 'neutral' ? 'bg-yellow-50' : 'hover:bg-gray-50'}`}
                          >
                            <div aria-hidden="true" className={`absolute ${sentiment === 'neutral' ? 'border-[#FFD700] border-2 border-solid' : 'border-[#8c8c8c] border-[0.5px] border-dashed'} inset-0 pointer-events-none rounded-[8px] transition-all`} />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="content-stretch flex gap-[8px] items-center justify-center p-[16px] relative w-full">
                                <p className={`basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[16px] transition-colors ${sentiment === 'neutral' ? 'text-black' : 'text-[#6f6f6f]'}`}>mid vibe</p>
                                <HeartHalf isActive={sentiment === 'neutral'} />
                              </div>
                            </div>
                          </div>

                          {/* Bad Vibe */}
                          <div 
                            onClick={() => setSentiment('bad')}
                            className={`basis-0 grow min-h-px min-w-px relative rounded-[8px] shrink-0 cursor-pointer transition-all ${sentiment === 'bad' ? 'bg-red-50' : 'hover:bg-gray-50'}`}
                          >
                            <div aria-hidden="true" className={`absolute ${sentiment === 'bad' ? 'border-[#FF3B30] border-2 border-solid' : 'border-[#8c8c8c] border-[0.5px] border-dashed'} inset-0 pointer-events-none rounded-[8px] transition-all`} />
                            <div className="flex flex-row items-center justify-center size-full">
                              <div className="content-stretch flex gap-[8px] items-center justify-center p-[16px] relative w-full">
                                <p className={`basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[16px] transition-colors ${sentiment === 'bad' ? 'text-black' : 'text-[#6f6f6f]'}`}>bad vibe</p>
                                <HeartBreak isActive={sentiment === 'bad'} />
                              </div>
                            </div>
                          </div>

                        </div>
                      </div>

                      {/* Content Textarea */}
                      <div className="content-stretch flex flex-col gap-[12px] items-start relative shrink-0 w-full grow">
                        <p className="font-['Geist_Mono',monospace] font-medium leading-[1.1] relative shrink-0 text-[#222] text-[14px] text-nowrap tracking-[0.28px] uppercase">describe how was the vibe?</p>
                        <div className="h-[279px] relative rounded-[8px] shrink-0 w-full grow">
                          <div aria-hidden="true" className="absolute border-[#8c8c8c] border-[0.5px] border-dashed inset-0 pointer-events-none rounded-[8px]" />
                          <div className="size-full">
                            <div className="content-stretch flex items-start p-[16px] relative size-full">
                              <textarea 
                                value={content}
                                onChange={(e) => setContent(e.target.value)}
                                placeholder="start ranting here..."
                                className="basis-0 font-['Geist_Mono',monospace] font-normal grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[#222] text-[16px] outline-none resize-none h-full bg-transparent placeholder-[#6f6f6f]"
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
                      <div aria-hidden="true" className="absolute border-2 border-[rgba(255,255,255,0.2)] border-solid inset-0 pointer-events-none rounded-[8px]" />
                      <div className="flex flex-row items-center size-full">
                        <div className="content-stretch flex items-center justify-between px-[24px] py-[20px] relative w-full">
                          <p className="basis-0 font-['Geist_Mono',monospace] font-black grow leading-[1.1] min-h-px min-w-px relative shrink-0 text-[20px] text-white tracking-[0.6px]">
                            {isSubmitting ? "POSTING..." : "DONE! ADD TO VIBES"}
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
