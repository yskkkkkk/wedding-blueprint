import FadeIn from '@/components/shared/FadeIn';
import { InvitationData } from '@/types';
import classes from './Gallery.module.css';

interface GalleryProps {
  data: InvitationData;
}

export default function Gallery({ data }: GalleryProps) {
  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.container}>
          <h2 className={classes.title}>Gallery 영역</h2>
          <p className={classes.placeholder}>이 영역은 차후 상세하게 구현될 예정입니다.</p>
        </div>
      </FadeIn>
    </section>
  );
}
