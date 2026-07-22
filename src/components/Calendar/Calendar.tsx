import FadeIn from '@/components/shared/FadeIn';
import classes from './Calendar.module.css';

interface CalendarProps {
  weddingDate: string;
}

export default function Calendar({ weddingDate }: CalendarProps) {
  const dateObj = new Date(weddingDate);
  const year = dateObj.getFullYear();
  const month = dateObj.getMonth();
  const date = dateObj.getDate();

  // Get the first day of the month (0 = Sunday, 1 = Monday, ...)
  const firstDayOfMonth = new Date(year, month, 1).getDay();
  // Get the total days in the month
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

  // Calculate grid cells
  const blanks = Array.from({ length: firstDayOfMonth }, (_, i) => i);
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const formattedMonth = dateObj.toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: 'long',
  });

  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.calendarContainer}>
          <div className={classes.header}>
            <h3 className={classes.monthTitle}>{formattedMonth}</h3>
          </div>
          
          <div className={classes.grid}>
            {daysOfWeek.map(day => (
              <div key={day} className={classes.dayHeader}>
                {day}
              </div>
            ))}
            
            {blanks.map(blank => (
              <div key={`blank-${blank}`} className={classes.cell}></div>
            ))}
            
            {days.map(d => {
              const isWeddingDay = d === date;
              return (
                <div key={d} className={`${classes.cell} ${isWeddingDay ? classes.weddingDayCell : ''}`}>
                  {isWeddingDay ? (
                    <div className={classes.highlightWrapper}>
                      <span className={classes.heartIcon}>♥</span>
                      <span className={classes.dayText}>{d}</span>
                    </div>
                  ) : (
                    <span className={classes.dayText}>{d}</span>
                  )}
                </div>
              );
            })}
          </div>
          
          <div className={classes.footer}>
            <p>
              {dateObj.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
              {' '}
              {daysOfWeek[dateObj.getDay()]}요일
            </p>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
