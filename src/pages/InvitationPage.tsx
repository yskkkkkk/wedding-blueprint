import { useParams } from 'react-router-dom';
import { Cover } from '@/components/Cover';
import { Greeting } from '@/components/Greeting';
import Calendar from '@/components/Calendar';
import { Gallery } from '@/components/Gallery';
import { Location } from '@/components/Location';
import { Account } from '@/components/Account';
import { Guestbook } from '@/components/Guestbook';
import { RsvpForm } from '@/components/RsvpForm';
import { ShareSection } from '@/components/ShareSection';
import { useInvitationData } from '@/hooks/useInvitationData';
import { Skeleton } from '@/components/shared/Skeleton';
import classes from './InvitationPage.module.css';

import { FloatingTopButton } from '@/components/FloatingTopButton';

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();
  const { data, loading, error } = useInvitationData(invitationSlug);
  
  if (loading) {
    return <Skeleton />;
  }

  if (error || !data) {
    return (
      <div className={classes.fullScreenCenter}>
        <h2>존재하지 않는 청첩장입니다.</h2>
        <p>URL 주소를 다시 한 번 확인해 주세요.</p>
      </div>
    );
  }

  const fontStyle = {
    '--font-family-primary': data.themeFont || 'Noto Sans KR',
    '--font-family-serif': data.themeFont || 'Noto Sans KR',
    fontFamily: data.themeFont || 'Noto Sans KR'
  } as React.CSSProperties;

  return (
    <div style={fontStyle}>
      <Cover data={data} />
      <Greeting data={data} />
      <Calendar weddingDate={data.weddingDate} />
      <Gallery data={data} />
      <Location data={data} />
      <Account data={data} />
      <RsvpForm invitationSlug={data.slug} />
      <ShareSection data={data} />
      <Guestbook data={data} />
      
      {/* Floating Action Button */}
      <FloatingTopButton />
    </div>
  );
}
