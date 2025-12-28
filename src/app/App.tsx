import { useState, useEffect } from 'react';
import { Sidebar } from './components/Sidebar';
import { CompanyView } from './components/CompanyView';
import { NewVibeModal } from './components/NewVibeModal';
import { NewOrgModal } from './components/NewOrgModal';
import { Organization, Review, organizations as fallbackOrganizations } from './data';
import { projectId, publicAnonKey } from '../../utils/supabase/info';
import { toast } from 'sonner';
import { Toaster } from 'sonner';
import '../styles/fonts.css';

const API_BASE_URL = `https://${projectId}.supabase.co/functions/v1/make-server-6feba4f2`;

export default function App() {
  const [organizations, setOrganizations] = useState<Organization[]>(fallbackOrganizations);
  const [selectedOrgId, setSelectedOrgId] = useState<string>(fallbackOrganizations[0].id);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isVibeModalOpen, setIsVibeModalOpen] = useState(false);
  const [isOrgModalOpen, setIsOrgModalOpen] = useState(false);
  const [isOrgsLoading, setIsOrgsLoading] = useState(true);

  const selectedOrg = organizations.find(o => o.id === selectedOrgId) || organizations[0];

  // Fetch organizations on mount
  useEffect(() => {
    fetchOrganizations();
  }, []);

  // Fetch reviews when selected org changes (only after orgs are loaded)
  useEffect(() => {
    if (selectedOrgId && !isOrgsLoading) {
      fetchReviews(selectedOrgId);
    }
  }, [selectedOrgId, isOrgsLoading]);

  const fetchOrganizations = async () => {
    setIsOrgsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        headers: {
          'Authorization': `Bearer ${publicAnonKey}`
        }
      });
      if (!response.ok) {
        throw new Error(`Failed to fetch organizations: ${response.status}`);
      }
      const data = await response.json();
      
      if (data && data.length > 0) {
        setOrganizations(data);
        // Select first org if current selection doesn't exist in fetched orgs
        if (!data.find((o: Organization) => o.id === selectedOrgId)) {
          setSelectedOrgId(data[0].id);
        }
      } else {
        // No orgs in DB, use fallback
        console.log('No orgs in DB, using fallback');
      }
    } catch (error) {
      console.error('Error fetching organizations:', error);
      // Keep using fallback orgs
    } finally {
      setIsOrgsLoading(false);
    }
  };

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
      
      setReviews(data);
    } catch (error) {
      console.error('Error fetching reviews:', error);
      toast.error('Failed to load vibes');
      setReviews([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenVibeModal = () => {
    setIsVibeModalOpen(true);
  };

  const handleOpenOrgModal = () => {
    setIsOrgModalOpen(true);
  };

  const handleAddOrg = async (name: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/orgs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ name }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to create org: ${response.status} ${errorText}`);
      }
      
      const newOrg = await response.json();
      
      // Add to state and select it
      setOrganizations(prev => [...prev, newOrg].sort((a, b) => a.name.localeCompare(b.name)));
      setSelectedOrgId(newOrg.id);
      toast.success(`Added "${newOrg.name}" successfully!`);
    } catch (error) {
      console.error('Error creating org:', error);
      toast.error('Failed to add organization');
      throw error;
    }
  };

  const handleVote = async (reviewId: string, voteType: 'up' | 'down') => {
    // Optimistic update
    setReviews(prev => prev.map(review => {
      if (review.id === reviewId) {
        return {
          ...review,
          upvotes: voteType === 'up' ? (review.upvotes || 0) + 1 : review.upvotes || 0,
          downvotes: voteType === 'down' ? (review.downvotes || 0) + 1 : review.downvotes || 0,
        };
      }
      return review;
    }));

    try {
      const response = await fetch(`${API_BASE_URL}/reviews/${selectedOrgId}/${reviewId}/vote`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${publicAnonKey}`
        },
        body: JSON.stringify({ voteType }),
      });

      if (!response.ok) {
        throw new Error('Failed to vote');
      }
    } catch (error) {
      console.error('Error voting:', error);
      // Rollback optimistic update on error
      setReviews(prev => prev.map(review => {
        if (review.id === reviewId) {
          return {
            ...review,
            upvotes: voteType === 'up' ? (review.upvotes || 1) - 1 : review.upvotes || 0,
            downvotes: voteType === 'down' ? (review.downvotes || 1) - 1 : review.downvotes || 0,
          };
        }
        return review;
      }));
      toast.error('Failed to record vote');
    }
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
      
      setReviews(prev => [savedReview, ...prev]);
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
      <div className="flex flex-1 min-h-0 pt-[73px]">
        {/* Sidebar */}
        <Sidebar 
          organizations={organizations} 
          selectedOrgId={selectedOrgId} 
          onSelectOrg={setSelectedOrgId}
          onAddOrg={handleOpenOrgModal}
        />

        {/* View */}
        <main className="flex-1 min-w-0 min-h-0 relative bg-[rgba(255,255,255,0.01)] backdrop-blur-[7.5px]">
          {isLoading ? (
             <div className="flex items-center justify-center h-full">
               <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
             </div>
          ) : (
            <CompanyView 
              organization={selectedOrg} 
              reviews={reviews} 
              onAddVibe={handleOpenVibeModal}
              onVote={handleVote}
            />
          )}
        </main>
      </div>

      <NewVibeModal 
        isOpen={isVibeModalOpen} 
        onClose={() => setIsVibeModalOpen(false)} 
        onSubmit={handleSubmitVibe} 
      />

      <NewOrgModal
        isOpen={isOrgModalOpen}
        onClose={() => setIsOrgModalOpen(false)}
        onSubmit={handleAddOrg}
        organizations={organizations}
      />
    </div>
  );
}
