import { useParams } from 'react-router-dom';
import { Cover } from '@/components/Cover';
import { Greeting } from '@/components/Greeting';
import { Gallery } from '@/components/Gallery';
import { Location } from '@/components/Location';
import { Account } from '@/components/Account';
import { Guestbook } from '@/components/Guestbook';
import { RsvpForm } from '@/components/RsvpForm';
import { useInvitationData } from '@/hooks/useInvitationData';
import classes from './InvitationPage.module.css';

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();
  const { data, loading, error } = useInvitationData(invitationSlug);
  
  if (loading) {
    return (
      <div className={classes.fullScreenCenter}>
        <div className={classes.spinner}></div>
        <p>청첩장을 불러오는 중입니다...</p>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className={classes.fullScreenCenter}>
        <h2>존재하지 않는 청첩장입니다.</h2>
        <p>URL 주소를 다시 한 번 확인해 주세요.</p>
      </div>
    );
  }

  return (
    <div>
      <Cover data={data} />
      <Greeting data={data} />
      <Gallery data={data} />
      <Location data={data} />
      <Account data={data} />
      <RsvpForm invitationSlug={data.slug} />
      <Guestbook data={data} />
    </div>
  );
}
