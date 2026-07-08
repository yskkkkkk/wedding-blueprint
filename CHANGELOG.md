# Changelog

모든 AI 에이전트는 작업 종료 전 이 문서에 작업 내역을 상세히 기록해야 합니다.

## [Unreleased]
### Added
- `vite.config.ts` 및 `tsconfig.app.json`에 절대 경로 별칭(`@/*`) 설정 추가
- `src/components/Layout.tsx` 생성하여 라우팅 하위 컴포넌트들을 모바일 컨테이너로 감싸도록 구성
- `react-router-dom` 및 `framer-motion` 라이브러리 추가
- `src/components`, `src/hooks`, `src/pages`, `src/services`, `src/types` 디렉터리 스캐폴딩
- `src/pages/InvitationPage.tsx` 기본 페이지 추가
- `src/index.css`에 디자인 가이드(우아하고 따뜻한 톤앤매너)에 맞춘 글로벌 CSS Variables 설정

### Changed
- `src/App.tsx` 파일 내용을 `react-router-dom`의 동적 라우팅 설정으로 교체 (Vite 보일러플레이트 코드 제거)

### Removed
- `src/App.css` (불필요한 기본 스타일 제거)
