import { useKakaoShare } from '@/hooks/useKakaoShare';
import type { InvitationData } from '@/types';
import classes from './ShareSection.module.css';

interface ShareSectionProps {
  data: InvitationData;
}

export default function ShareSection({ data }: ShareSectionProps) {
  const { shareInvitation } = useKakaoShare();

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(`https://wedvitaion.vercel.app/${data.slug}`);
      alert('청첩장 주소가 복사되었습니다.');
    } catch (err) {
      console.error('Failed to copy link:', err);
    }
  };

  return (
    <section className={classes.shareSection}>
      <h3 className={classes.title}>청첩장 공유하기</h3>
      <div className={classes.btnGroup}>
        <button 
          className={`${classes.shareBtn} ${classes.kakaoBtn}`} 
          onClick={() => shareInvitation(data)}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M12 3c-5.523 0-10 3.5-10 7.818 0 2.766 1.83 5.176 4.606 6.554-.158.55-1.004 3.498-1.042 3.652-.047.19.062.186.13.141.088-.058 3.541-2.316 4.908-3.216.78.106 1.58.16 2.4.16 5.522 0 10-3.498 10-7.818S17.523 3 12 3z"/>
          </svg>
          카카오톡으로 공유하기
        </button>
        <button 
          className={`${classes.shareBtn} ${classes.linkBtn}`} 
          onClick={handleCopyLink}
        >
          <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
            <path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/>
          </svg>
          링크 복사하기
        </button>
      </div>
    </section>
  );
}
