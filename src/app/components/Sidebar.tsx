import { useState, useRef, useEffect } from 'react';
import { PlusSquare, Search, X } from 'lucide-react';
import { Organization } from '../data';
import { cn } from '../../lib/utils';
import { motion, AnimatePresence } from 'motion/react';

interface SidebarProps {
  organizations: Organization[];
  selectedOrgId: string;
  onSelectOrg: (id: string) => void;
  onAddOrg: () => void;
}

export function Sidebar({ organizations, selectedOrgId, onSelectOrg, onAddOrg }: SidebarProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when entering search mode
  useEffect(() => {
    if (isSearchMode && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isSearchMode]);

  // Filter organizations based on search query (strict - only matches names that start with query)
  const filteredOrganizations = searchQuery
    ? organizations.filter(org =>
        org.name.toLowerCase().startsWith(searchQuery.toLowerCase())
      )
    : organizations;

  const handleSearchClick = () => {
    setIsSearchMode(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchClear = () => {
    setSearchQuery('');
    setIsSearchMode(false);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      handleSearchClear();
    }
  };
  return (
    <div className="flex flex-col w-[300px] shrink-0 h-full bg-[rgba(255,255,255,0.05)] border-r border-[rgba(255,255,255,0.2)] border-dashed">
      {/* Actions */}
      <div className="flex flex-col w-full shrink-0">
        {/* Add New Org */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.2)] border-dashed">
          <button 
            onClick={onAddOrg}
            className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors w-full"
            aria-label="Add new organization"
          >
            <p className="font-['Audiowide',sans-serif] text-[16px] text-white whitespace-nowrap">add new org</p>
            <PlusSquare className="w-5 h-5 text-white" />
          </button>
        </div>

        {/* Search */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.2)] border-dashed">
          {!isSearchMode ? (
            <div 
              onClick={handleSearchClick}
              className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors"
            >
              <p className="font-['Audiowide',sans-serif] text-[16px] text-white whitespace-nowrap">search</p>
              <Search className="w-5 h-5 text-white" />
            </div>
          ) : (
            <div className="flex items-center justify-between p-3">
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                onKeyDown={handleSearchKeyDown}
                placeholder="what you searchin' for?"
                className="flex-1 bg-transparent border-none outline-none font-['Audiowide',sans-serif] text-[16px] text-white placeholder:text-[rgba(255,255,255,0.2)]"
              />
              <button
                onClick={handleSearchClear}
                className="cursor-pointer hover:opacity-70 transition-opacity"
                aria-label="Clear search"
              >
                <X className="w-5 h-5 text-white" />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* List */}
      <div className="flex-1 w-full overflow-y-scroll">
        <div className="flex flex-col w-full pb-4">
          {filteredOrganizations.map((org) => {
            const isSelected = org.id === selectedOrgId;
            return (
              <div
                key={org.id}
                onClick={() => onSelectOrg(org.id)}
                className={cn(
                  "w-full border-b border-[rgba(255,255,255,0.2)] border-dashed cursor-pointer transition-colors hover:bg-white/5 group",
                  isSelected ? "bg-[rgba(255,255,255,0.23)]" : ""
                )}
              >
                <div className="flex items-center justify-between px-3 py-2 min-h-[40px]">
                  <div className="flex items-center gap-2 min-w-0 flex-1">
                    <AnimatePresence>
                      {isSelected && (
                        <motion.span 
                          initial={{ opacity: 0, x: -8, scale: 0.8 }}
                          animate={{ opacity: 1, x: 0, scale: 1 }}
                          exit={{ opacity: 0, x: -8, scale: 0.8 }}
                          transition={{ duration: 0.2, ease: "easeOut" }}
                          className="text-white shrink-0"
                        >
                          ➺
                        </motion.span>
                      )}
                    </AnimatePresence>
                    <p className={cn(
                      "font-['Geist_Mono',monospace] text-[14px] truncate transition-all duration-300 ease-out group-hover:translate-x-[6px]",
                      isSelected ? "font-bold text-white uppercase" : "font-light text-[rgba(255,255,255,0.7)]"
                    )}>
                      {org.name}
                    </p>
                  </div>
                  

                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
