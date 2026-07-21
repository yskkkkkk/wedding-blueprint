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

  // Calculate D-Day
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const targetDate = new Date(dateObj);
  targetDate.setHours(0, 0, 0, 0);
  const diffTime = targetDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

  let dDayText = '';
  if (diffDays > 0) {
    dDayText = `${data.groom.name} ♥ ${data.bride.name}의 결혼식이 ${diffDays}일 남았습니다.`;
  } else if (diffDays === 0) {
    dDayText = `오늘, ${data.groom.name} ♥ ${data.bride.name} 결혼합니다.`;
  } else {
    dDayText = `${data.groom.name} ♥ ${data.bride.name} 부부가 된 지 ${Math.abs(diffDays)}일 째입니다.`;
  }

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

        <FadeIn delay={0.9}>
          <div className={classes.dDayContainer}>
            <p className={classes.dDayText}>{dDayText}</p>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
