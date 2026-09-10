import { createContext } from 'react';
import type { EasterEggMode } from '@/components/EasterEgg';

// FadeIn처럼 청첩장 전역에 쓰이는 컴포넌트가, 매번 props로 내려받지 않고도
// 현재 이스터에그 모드(개발자/디자이너/일반)를 알 수 있게 하기 위한 컨텍스트.
export const EasterEggModeContext = createContext<EasterEggMode>('normal');
