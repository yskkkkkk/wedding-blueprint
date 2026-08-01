import type { ReactNode } from 'react';
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

interface ErrorViewProps {
  icon: ReactNode;
  title: string;
  description: ReactNode;
  action?: ReactNode;
}

function ErrorView({ icon, title, description, action }: ErrorViewProps) {
  return (
    <div className={classes.errorContainer}>
      <div className={classes.errorIcon}>{icon}</div>
      <h2 className={classes.errorTitle}>{title}</h2>
      <p className={classes.errorDesc}>{description}</p>
      {action}
    </div>
  );
}

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();
  const { data, loading, errorKind, retry } = useInvitationData(invitationSlug);

  if (loading) {
    return <Skeleton />;
  }

  if (!data) {
    // 일시적 장애일 때 주소가 틀렸다고 안내하면 하객이 정상 링크를 포기하게 되므로 문구를 분리한다.
    if (errorKind === 'temporary') {
      return (
        <ErrorView
          icon={
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
            </svg>
          }
          title="청첩장을 불러오지 못했습니다"
          description={
            <>
              일시적으로 연결이 원활하지 않습니다.<br />
              잠시 후 다시 시도해 주세요.
            </>
          }
          action={
            <button type="button" className={classes.retryButton} onClick={retry}>
              다시 시도하기
            </button>
          }
        />
      );
    }

    return (
      <ErrorView
        icon={
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
          </svg>
        }
        title="청첩장을 찾을 수 없습니다"
        description={
          <>
            입력하신 주소가 올바르지 않거나<br />
            삭제된 청첩장일 수 있습니다.
          </>
        }
      />
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
