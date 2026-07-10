import { useParams } from 'react-router-dom';
import { Cover } from '@/components/Cover';
import { Greeting } from '@/components/Greeting';
import { Gallery } from '@/components/Gallery';
import { Location } from '@/components/Location';
import { Account } from '@/components/Account';
import { Guestbook } from '@/components/Guestbook';
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
  galleryImages: [],
};

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();

  // In the future, fetch data from Supabase using invitationSlug
  // const { data, loading, error } = useInvitationData(invitationSlug);
  
  return (
    <div>
      <Cover data={mockData} />
      <Greeting data={mockData} />
      <Gallery data={mockData} />
      <Location data={mockData} />
      <Account data={mockData} />
      <Guestbook data={mockData} />
    </div>
  );
}
