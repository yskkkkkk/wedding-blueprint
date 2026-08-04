import { useEffect } from 'react';

// index.html에서 구글 폰트 9종을 한꺼번에 불러오고 있었다. 스타일시트는 렌더를
// 차단하는데, 청첩장 하나가 실제로 쓰는 폰트는 1종이다. 게다가 InvitationPage가
// --font-family-serif 를 themeFont(없으면 Pretendard)로 항상 덮어쓰기 때문에
// 기본 상태에서는 9종 중 어느 것도 화면에 쓰이지 않았다.
//
// 그래서 정적 로드를 없애고, 청첩장 데이터가 도착한 뒤 선택된 폰트만 주입한다.
// 기본값인 Pretendard는 별도 CDN에서 이미 불러오므로 여기서 처리하지 않는다.

/** 빌더의 폰트 선택 목록과 대응하는 구글 폰트 지정자. */
const GOOGLE_FONT_SPECS: Record<string, string> = {
  'Noto Sans KR': 'Noto+Sans+KR:wght@300;400;500;700',
  'Noto Serif KR': 'Noto+Serif+KR:wght@300;400;500;700',
  'Gowun Dodum': 'Gowun+Dodum',
  'Nanum Myeongjo': 'Nanum+Myeongjo:wght@400;700',
  'Nanum Gothic': 'Nanum+Gothic:wght@400;700',
  'Nanum Pen Script': 'Nanum+Pen+Script',
  Jua: 'Jua',
  'Do Hyeon': 'Do+Hyeon',
};

const LINK_MARKER = 'data-theme-font';

/**
 * 선택된 테마 폰트의 스타일시트를 한 번만 주입한다.
 * 목록에 없는 값(기본 Pretendard 등)이면 아무 것도 하지 않는다.
 */
export function useThemeFont(themeFont: string | undefined) {
  useEffect(() => {
    if (!themeFont) return;

    const spec = GOOGLE_FONT_SPECS[themeFont];
    if (!spec) return;

    const href = `https://fonts.googleapis.com/css2?family=${spec}&display=swap`;
    if (document.querySelector(`link[${LINK_MARKER}="${themeFont}"]`)) return;

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = href;
    link.setAttribute(LINK_MARKER, themeFont);
    document.head.appendChild(link);
  }, [themeFont]);
}
