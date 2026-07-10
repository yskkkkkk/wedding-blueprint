# CHANGELOG (작업 이력)

- **2026-07-10**, Gemini
  - **작업 요약**: 갤러리 및 나머지 모든 주요 섹션 UI 스켈레톤 생성 및 라우팅 연동 (WB-004)
  - **변경 사항**:
    - `src/components/Greeting`: 모시는 글 UI 스켈레톤 추가.
    - `src/components/Gallery`: 이미지 갤러리 UI 스켈레톤 추가.
    - `src/components/Location`: 오시는 길 UI 스켈레톤 추가.
    - `src/components/Account`: 마음 전하실 곳 UI 스켈레톤 추가.
    - `src/components/Guestbook`: 방명록 UI 스켈레톤 추가.
    - `src/pages/InvitationPage.tsx`: 생성된 모든 컴포넌트를 import하여 페이지 레이아웃에 순서대로 렌더링하도록 수정.
    - `BACKLOG.md`: 인수인계 내용 및 대기열 최신화.
  - **비고**: 페이지 전체의 스크롤 흐름과 여백을 확인하기 위해 빈 껍데기(UI 스켈레톤) 형태로 빠르게 배치함.


  - **작업 요약**: 메인 커버(Cover) UI 컴포넌트 개발 및 모션 적용 (WB-003)
  - **변경 사항**:
    - `src/types/index.ts`: `InvitationData` 및 하위 인터페이스 정의.
    - `src/components/shared/FadeIn.tsx`: `framer-motion`을 활용한 공통 스크롤 등장 모션 컴포넌트 추가.
    - `src/components/Cover/Cover.tsx`, `Cover.module.css`: 커버 영역 UI 및 스타일링 추가.
    - `src/pages/InvitationPage.tsx`: 더미 데이터를 활용해 Cover 컴포넌트가 렌더링되도록 업데이트.
    - `BACKLOG.md`: 인수인계 섹션 최신화 및 WB-003 상태를 `완료`로 변경.
  - **비고**: DB가 붙기 전이므로 더미 데이터(`mockData`)를 사용하여 렌더링을 확인하도록 셋업함. 이후 Supabase 연동 시 해당 부분 교체 필요.
