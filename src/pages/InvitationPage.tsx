import { useParams } from 'react-router-dom';
import { Cover } from '@/components/Cover';
import { InvitationData } from '@/types';

// Mock data for development
const mockData: InvitationData = {
  id: '1',
  slug: 'demo-wedding',
  groom: { name: '김신랑', relation: '아들' },
  bride: { name: '이신부', relation: '딸' },
  groomParents: { father: { name: '김아버지', relation: '아버지' }, mother: { name: '박어머니', relation: '어머니' } },
  brideParents: { father: { name: '이아버지', relation: '아버지' }, mother: { name: '최어머니', relation: '어머니' } },
  weddingDate: '2026-10-25T12:30:00',
  location: {
    name: '더그레이스켈리 강남 1층 아모르홀',
    address: '서울 강남구 언주로 123',
    latitude: 37.512,
    longitude: 127.034,
  },
  greeting: { title: '초대합니다', content: '두 사람이 만나 하나가...' },
  coverImage: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=1000&auto=format&fit=crop',
  galleryImages: [
    'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1583939008298-6cc5ba550d51?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1543857778-c4a1a3e0b2eb?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1606800052052-a08af7148866?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?q=80&w=800&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1600096194534-95cf5ece04cf?q=80&w=800&auto=format&fit=crop',
  ],
};

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();

  // In the future, fetch data from Supabase using invitationSlug
  // const { data, loading, error } = useInvitationData(invitationSlug);
  
  return (
    <div>
      <Cover data={mockData} />
      {/* 
      TODO: Add other components here 
      <Greeting data={mockData} />
      <Gallery images={mockData.galleryImages} />
      ...
      */}
    </div>
  );
}
