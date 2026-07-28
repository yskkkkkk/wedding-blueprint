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
      <div className={classes.errorContainer}>
        <div className={classes.errorIcon}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        </div>
        <h2 className={classes.errorTitle}>청첩장을 찾을 수 없습니다</h2>
        <p className={classes.errorDesc}>
          입력하신 주소가 올바르지 않거나<br/>
          삭제된 청첩장일 수 있습니다.
        </p>
      </div>
    );
  }

  const fontStyle = {
    '--font-family-primary': data.themeFont || "'Pretendard Variable', Pretendard, sans-serif",
    '--font-family-serif': data.themeFont || "'Pretendard Variable', Pretendard, sans-serif",
    fontFamily: data.themeFont || "'Pretendard Variable', Pretendard, sans-serif"
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
