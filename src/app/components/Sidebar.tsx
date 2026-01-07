import { PlusSquare, Search, ArrowRight } from 'lucide-react';
import { Organization } from '../data';
import { cn } from '../../lib/utils';

interface SidebarProps {
  organizations: Organization[];
  selectedOrgId: string;
  onSelectOrg: (id: string) => void;
}

export function Sidebar({ organizations, selectedOrgId, onSelectOrg }: SidebarProps) {
  return (
    <div className="flex flex-col w-[300px] h-full bg-[#0a0b36] border-r border-[rgba(255,255,255,0.2)] border-dashed">
      {/* Actions */}
      <div className="flex flex-col w-full shrink-0">
        {/* Add New Org */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.2)] border-dashed">
          <div className="flex items-center justify-between p-3 cursor-pointer hover:bg-white/10 transition-colors">
            <p className="font-['Audiowide',sans-serif] text-[16px] text-white whitespace-nowrap">add new org</p>
            <PlusSquare className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Search */}
        <div className="w-full bg-[rgba(255,255,255,0.05)] border-b border-[rgba(255,255,255,0.2)] border-dashed">
          <div className="flex items-center justify-between p-3">
            <p className="font-['Audiowide',sans-serif] text-[16px] text-white whitespace-nowrap">search</p>
            <Search className="w-5 h-5 text-white" />
          </div>
        </div>
      </div>

      {/* List */}
      <div className="flex-1 w-full overflow-y-auto">
        <div className="flex flex-col w-full pb-4">
          {organizations.map((org) => {
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
                    {isSelected && <span className="text-white shrink-0">➺</span>}
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
