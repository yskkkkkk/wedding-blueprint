import { useEffect, useRef } from 'react';
import classes from './EasterEgg.module.css';

export type EasterEggMode = 'normal' | 'developer' | 'designer';

interface EasterEggProps {
  mode: EasterEggMode;
  onModeChange: (mode: EasterEggMode) => void;
}

// 좁은 화면에서 줄바꿈이 생기면 고정 높이 배너와 어긋나므로 한 줄씩 짧게 끊어둔다.
const BOOT_LINES = [
  'C:\\WEDDING> LOAD INVITATION.EXE',
  'INITIALIZING LOVE.SYS....... [ OK ]',
  'MOUNTING HEART.DRV.......... [ OK ]',
  '\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593\u2593 100%',
  'PRESS ANY KEY TO CONTINUE',
];

const MARQUEE_TEXT =
  '\u2728 WELCOME TO OUR WEDDING WEBSITE \u2728 BEST VIEWED IN NETSCAPE NAVIGATOR AT 800x600 \ud83c\udf08 YOU ARE VISITOR #001337 \ud83c\udf08 CLICK HERE TO RSVP \ud83d\udc8c ';

const SPARKLES = ['\u2728', '\ud83d\udc96', '\ud83c\udf1f', '\ud83c\udf80'];

/**
 * 심심할 때를 위한 숨겨진 화면 두 가지.
 * 실제 청첩장 정보는 그대로 두고 시각적 스킨만 통째로 바꾼다.
 * (부모의 --color-*, --font-family-* 변수를 덮어써서 대부분의 하위
 * 컴포넌트가 자동으로 리스킨되는 방식 — src/styles/prankModes.css 참고)
 */
export function EasterEgg({ mode, onModeChange }: EasterEggProps) {
  const sparkleLayerRef = useRef<HTMLDivElement>(null);

  // 디자이너 버전에서만 커서를 따라다니는 반짝이 파티클을 생성한다.
  useEffect(() => {
    if (mode !== 'designer') return;

    let lastSpawn = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastSpawn < 60) return; // 과도한 생성 방지
      lastSpawn = now;

      const layer = sparkleLayerRef.current;
      if (!layer) return;

      const el = document.createElement('span');
      el.className = classes.sparkle;
      el.textContent = SPARKLES[Math.floor(Math.random() * SPARKLES.length)];
      el.style.left = `${e.clientX}px`;
      el.style.top = `${e.clientY}px`;
      layer.appendChild(el);
      setTimeout(() => el.remove(), 800);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mode]);

  if (mode === 'developer') {
    return (
      <>
        <div className={classes.bootBanner} role="status" aria-label="개발자 버전 부트 화면">
          {BOOT_LINES.join('\n')}
          <span className={classes.bootCursor}>&nbsp;</span>
        </div>
        <BackButton onClick={() => onModeChange('normal')} />
      </>
    );
  }

  if (mode === 'designer') {
    return (
      <>
        <div className={classes.marqueeBanner} role="status" aria-label="디자이너 버전 안내 배너">
          <div className={classes.marqueeTrack}>
            <span className={classes.marqueeItem}>{MARQUEE_TEXT}</span>
            <span className={classes.marqueeItem}>{MARQUEE_TEXT}</span>
          </div>
        </div>
        <div className={classes.sparkleLayer} ref={sparkleLayerRef} aria-hidden="true" />
        <BackButton onClick={() => onModeChange('normal')} />
      </>
    );
  }

  return (
    <div className={classes.triggerSection}>
      <p className={classes.triggerHint}>심심하신 분들을 위한 숨겨진 버전</p>
      <div className={classes.triggerRow}>
        <button type="button" className={classes.triggerButton} onClick={() => onModeChange('developer')}>
          개발자 버전 청첩장 보기
        </button>
        <button type="button" className={classes.triggerButton} onClick={() => onModeChange('designer')}>
          디자이너 버전 청첩장 보기
        </button>
      </div>
    </div>
  );
}

function BackButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" className={classes.backButton} onClick={onClick}>
      {'↩'} 원래대로
    </button>
  );
}

export default EasterEgg;
