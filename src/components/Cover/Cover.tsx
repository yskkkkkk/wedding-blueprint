import FadeIn from '@/components/shared/FadeIn';
import type { InvitationData } from '@/types';
import classes from './Cover.module.css';

interface CoverProps {
  data: InvitationData;
}

export default function Cover({ data }: CoverProps) {
  // Format the date for the cover (e.g., "2026. 10. 25. SAT PM 12:30")
  const dateObj = new Date(data.weddingDate);
  const formattedDate = dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
  const days = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'];
  const dayName = days[dateObj.getDay()];
  const timeString = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <section className={classes.coverSection}>
      <FadeIn yOffset={20} duration={1}>
        <div className={classes.imageContainer}>
          <img src={data.coverImage} alt="Wedding Cover" className={classes.mainImage} />
        </div>
      </FadeIn>
      
      <div className={classes.textContainer}>
        <FadeIn delay={0.3}>
          <h1 className={classes.title}>
            <span>{data.groom.name}</span>
            <span className={classes.divider}>&</span>
            <span>{data.bride.name}</span>
          </h1>
        </FadeIn>
        
        <FadeIn delay={0.6}>
          <div className={classes.dateLocation}>
            <p className={classes.date}>
              {formattedDate} {dayName} {timeString}
            </p>
            <p className={classes.location}>{data.location.name}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
