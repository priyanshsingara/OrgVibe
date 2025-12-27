export interface Organization {
  id: string;
  name: string;
}

export interface Review {
  id: string;
  orgId: string;
  title: string;
  content: string[]; // Array of paragraphs/lines
  author: string;
  timestamp: string;
  sentiment: 'good' | 'bad' | 'neutral';
  upvotes: number;
  downvotes: number;
}

// Fallback organizations - used until backend is populated
// After deploying the edge function, run the migration to populate DB
export const organizations: Organization[] = [
  { id: '1', name: 'toddle' },
  { id: '2', name: 'tata consultancy services' },
  { id: '3', name: 'hdfc bank' },
  { id: '4', name: 'infosys' },
  { id: '5', name: 'hindustan unilever' },
  { id: '6', name: 'icici bank' },
  { id: '7', name: 'bharti airtel' },
  { id: '8', name: 'kotak mahindra bank' },
  { id: '9', name: 'state bank of india' },
  { id: '10', name: 'maruti suzuki' },
  { id: '11', name: 'larsen & toubro' },
  { id: '12', name: 'nestle india' },
  { id: '13', name: 'tata steel' },
  { id: '14', name: 'sun pharmaceuticals' },
  { id: '15', name: 'tata motors' },
  { id: '16', name: 'asian paints' },
  { id: '17', name: 'ultratech cement' },
  { id: '18', name: 'zamp' },
  { id: '19', name: 'apple inc.' },
  { id: '20', name: 'microsoft corporation' },
  { id: '21', name: 'alphabet inc.' },
  { id: '22', name: 'amazon.com inc.' },
  { id: '23', name: 'nvidia corporation' },
  { id: '24', name: 'tesla inc.' },
  { id: '25', name: 'meta platforms inc.' },
  { id: '26', name: 'berkshire hathaway inc.' },
  { id: '27', name: 'reliance industries' },
];

// Reviews are stored in the backend
export const reviews: Review[] = [];
