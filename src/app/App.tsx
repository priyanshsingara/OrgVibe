import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CompanyView } from './components/CompanyView';
import { NewVibeModal } from './components/NewVibeModal';
import { organizations, Review } from './data';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { formatDistanceToNow } from 'date-fns';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import '../styles/fonts.css';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6feba4f2`;

export default function App() {
  const [selectedOrgId, setSelectedOrgId] = useState<string>(organizations[8].id); // Default to SBI
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  useEffect(() => {
    fetchReviews(selectedOrgId);
  }, [selectedOrgId]);

  const fetchReviews = async (orgId: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${orgId}`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to fetch reviews: ${response.status} ${response.statusText} - ${errorText}`);
      }
      const data = await response.json();
      
      const formattedReviews = data.map((r: any) => ({
        ...r,
        timestamp: formatDistanceToNow(new Date(r.timestamp), { addSuffix: true })
      }));
      
      setReviews(formattedReviews);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load vibes');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  const handleSubmitVibe = async (data: { category: string; sentiment: 'good' | 'neutral' | 'bad'; content: string }) => {
    const newReviewPayload = {
      orgId: selectedOrgId,
      title: data.category, // Using category as title for now based on UI flow
      content: data.content.split('\n'), // Split textarea content into paragraphs
      author: 'anonymous',
      sentiment: data.sentiment
    };

    try {
      const response = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify(newReviewPayload),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to post review: ${response.status} ${errorText}`);
      }
      
      const savedReview = await response.json();
      
      const displayReview = {
        ...savedReview,
        timestamp: formatDistanceToNow(new Date(savedReview.timestamp), { addSuffix: true })
      };

      setReviews(prev => [displayReview, ...prev]);
      toast.success('Vibe posted successfully!');
    } catch (error) {
      console.error('Error posting review:', error);
      toast.error('Failed to post vibe');
      throw error; // Re-throw to let modal know it failed if needed
    }
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-gradient-to-b from-[#0a0b36] to-[#003e9e] flex flex-col text-white">
      <Toaster position="top-center" />
      
      {/* Header */}
      <div className="absolute top-0 left-0 w-full h-[73px] p-[16px] z-20 flex items-center justify-center pointer-events-none">
        <div className="absolute inset-0 border-b border-[rgba(255,255,255,0.2)] border-dashed pointer-events-none" />
        <p className="font-['Audiowide',sans-serif] text-[32px] text-[rgba(255,255,255,0.3)] tracking-[-0.64px] absolute left-[16px]">org.vibe</p>
      </div>

      {/* Main Content Area */}
      <div className="flex flex-1 h-full pt-[73px]">
        {/* Sidebar */}
        <Sidebar 
          organizations={organizations} 
          selectedOrgId={selectedOrgId} 
          onSelectOrg={setSelectedOrgId} 
        />

        {/* View */}
        <main className="flex-1 h-full relative bg-[rgba(255,255,255,0.01)] backdrop-blur-[7.5px]">
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
             </div>
          ) : (
            <CompanyView 
              organization={selectedOrg} 
              reviews={reviews} 
              onAddVibe={handleOpenModal}
            />
          )}
        </main>
      </div>

      <NewVibeModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSubmit={handleSubmitVibe} 
      />
    </div>
  );
}
