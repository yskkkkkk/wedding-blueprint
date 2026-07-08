import { useParams } from 'react-router-dom';

export default function InvitationPage() {
  const { invitationSlug } = useParams<{ invitationSlug: string }>();

  return (
    <div>
      <h1>청첩장 데모</h1>
      <p>현재 접속한 청첩장 ID: {invitationSlug}</p>
    </div>
  );
}
