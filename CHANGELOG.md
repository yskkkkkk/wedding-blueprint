# CHANGELOG (작업 이력)

- **2026-07-17**, Gemini
  - **작업 요약**: 코드 안정성(Lint) 및 접근성(A11y) 개선 작업
  - **변경 사항**:
    - `src/pages/InvitationPage.tsx`, `Guestbook.tsx`, `Greeting.tsx`: 미사용 변수(unused-vars) 경고 해결을 위한 언더스코어(`_`) 접두사 추가. Oxlint 경고 0건 달성.
    - `src/components/Account/Account.tsx`: 시각장애인용 스크린 리더 접근성을 위한 `aria-expanded` 속성 아코디언 버튼에 추가.
  - **비고**: 오류사항 개선 및 문서 현행화 완료.

- **2026-07-15**, Gemini
  - **작업 요약**: 마음 전하실 곳(Account) 계좌번호 아코디언 및 송금 딥링크 구현 (WB-007)
  - **변경 사항**:
    - `src/pages/InvitationPage.tsx`: `mockData` 내 신랑/신부/혼주 별 `bank` 및 간편 송금 링크 데이터 추가.
    - `src/components/Account/Account.tsx`: `framer-motion`을 활용한 신랑측/신부측 아코디언 컴포넌트 내부 구현. Clipboard API를 활용한 계좌번호 복사 및 토스트(Toast) 알림 기능 연동. 토스/카카오페이 송금 딥링크 버튼 연동.
    - `src/components/Account/Account.module.css`: 아코디언 열림/닫힘 UI 및 토스트 팝업, 딥링크 버튼 최적화 스타일링.
  - **비고**: 별도의 서드파티 라이브러리 추가 없이 Framer Motion을 적극 활용하여 모바일 최적화 UX 구현.


  - **작업 요약**: 오시는 길(Location) 섹션 카카오맵 원시 API 및 내비게이션 딥링크 연동 (WB-006)
  - **변경 사항**:
    - `index.html`: 카카오맵 JavaScript SDK 로드용 동적 스크립트 태그 추가 (`%VITE_KAKAO_MAP_KEY%` 활용).
    - `.env.example`: 개발자 안내용 `VITE_KAKAO_MAP_KEY` 필드 추가.
    - `src/components/Location/Location.tsx`: `window.kakao.maps` API를 직접 호출하여 맵 렌더링 및 마커 추가 로직 구현. 카카오내비, 티맵, 네이버지도 앱 호출용 딥링크 버튼 추가.
    - `src/components/Location/Location.module.css`: 지도 컨테이너 및 버튼 스타일링.
    - `BACKLOG.md`: 작업 대기열 최신화.
  - **비고**: 라이브러리를 추가하지 않고 가벼운 원시 API 방식으로 구현 완료.


  - **작업 요약**: 갤러리(Gallery) 상세 모달 및 Stagger 모션 구현 (WB-005)
  - **변경 사항**:
    - `src/components/Gallery/Gallery.tsx`: CSS Grid 기반의 썸네일 구조 추가. `framer-motion`을 사용하여 이미지가 순차적으로 나타나는 Stagger 애니메이션 적용. 클릭 시 전체화면으로 볼 수 있는 Image Modal 기능(`AnimatePresence` 활용) 구현.
    - `src/components/Gallery/Gallery.module.css`: Grid 레이아웃 및 모달 오버레이 관련 스타일 적용.
    - `src/pages/InvitationPage.tsx`: 더미 데이터(`mockData`)에 갤러리 테스트용 이미지 URL(Unsplash) 6장 추가.
    - `BACKLOG.md`: 인수인계 내용 및 대기열 최신화.
  - **비고**: UI와 상호작용(클릭 줌) 기능 완료.


  - **작업 요약**: 메인 커버(Cover) UI 컴포넌트 개발 및 모션 적용 (WB-003)
  - **변경 사항**:
    - `src/types/index.ts`: `InvitationData` 및 하위 인터페이스 정의.
    - `src/components/shared/FadeIn.tsx`: `framer-motion`을 활용한 공통 스크롤 등장 모션 컴포넌트 추가.
    - `src/components/Cover/Cover.tsx`, `Cover.module.css`: 커버 영역 UI 및 스타일링 추가.
    - `src/pages/InvitationPage.tsx`: 더미 데이터를 활용해 Cover 컴포넌트가 렌더링되도록 업데이트.
    - `BACKLOG.md`: 인수인계 섹션 최신화 및 WB-003 상태를 `완료`로 변경.
  - **비고**: DB가 붙기 전이므로 더미 데이터(`mockData`)를 사용하여 렌더링을 확인하도록 셋업함. 이후 Supabase 연동 시 해당 부분 교체 필요.
