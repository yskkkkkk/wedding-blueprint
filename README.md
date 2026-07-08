# Wedding Blueprint (청첩장 플랫폼)

## 1. 한 줄 정의 (Project Charter)
**무엇을, 누구를 위해, 왜:**
단일 템플릿이 아닌, **DB(Supabase) 연동을 통해 여러 커플의 청첩장을 고유 URL(예: `/:invitationSlug`)로 동시 서비스**할 수 있는 다중 사용자 지원 한국형 모바일 청첩장 플랫폼입니다. 기획자와 QA가 AI 어시스턴트들과 협업하여 다수의 청첩장을 쉽고 빠르게 찍어내고 관리하기 위해 구축합니다.

## 2. 기술 스택
*   **프론트엔드 (확정)**: React, TypeScript, Vite
*   **라우팅 (확정)**: React Router DOM (동적 URL 파라미터 매핑)
*   **백엔드/DB (확정)**: Supabase (PostgreSQL 기반 RDB)
*   **스타일링 (확정)**: Vanilla CSS (CSS Variables) + Framer Motion (스크롤 애니메이션)
*   **배포 (확정)**: Vercel (프론트엔드 호스팅)

## 3. AI 협업 프로토콜 (AI Protocol)
본 프로젝트는 인간(기획/QA)과 AI가 주도적으로 코드를 작성하는 '바이브 코딩(Vibe Coding)' 방식으로 진행됩니다.

*   **주력 AI 에이전트**: Agy, Claude (보조: Jules, Codex)
*   **작업 완료 의무 기록**: 모든 에이전트는 세션 작업이 끝난 후 반드시 루트 디렉토리의 `CHANGELOG.md` (작업 이력 문서)에 변경 사항을 상세히 기록해야 합니다. 다음 에이전트가 이를 읽고 컨텍스트를 파악합니다.
*   **커밋 메시지 컨벤션**: 보편적인 Conventional Commits 규칙을 따릅니다.
    *   `feat`: 새로운 기능 추가
    *   `fix`: 버그 수정
    *   `docs`: 문서 수정 (README, AGENTS 등)
    *   `style`: 코드 포맷팅, 세미콜론 누락, 코드 변경이 없는 경우
    *   `refactor`: 코드 리팩토링
    *   `chore`: 빌드 업무 수정, 패키지 매니저 수정 등

## 4. 프로젝트 구조 요약
프로젝트의 폴더 구조는 아래와 같으며, 구조 변경 시 이 섹션을 즉각 갱신해야 합니다.
```text
/
├── docs/                 # 기획/아키텍처 문서 (AGENTS, ARCHITECTURE, DATABASE_SCHEMA 등)
├── src/
│   ├── assets/           # 정적 에셋 (이미지, 아이콘 등)
│   ├── components/       # 청첩장 UI 컴포넌트 (Cover, Gallery, Guestbook 등)
│   ├── hooks/            # React Custom Hooks
│   ├── pages/            # 라우팅 페이지 (예: InvitationPage.tsx)
│   ├── services/         # 외부 API 연동 (Supabase 클라이언트 등)
│   ├── types/            # TypeScript 인터페이스 정의
│   ├── index.css         # 글로벌 스타일 및 CSS 변수
│   ├── main.tsx          # 앱 엔트리 포인트
│   └── App.tsx           # 라우팅 최상단 컴포넌트
└── README.md             # 프로젝트 헌장 (현재 문서)
```

## 5. 로컬 실행/설치 방법
```bash
# 1. 의존성 설치
npm install

# 2. 환경 변수 세팅 (Supabase URL, Key 등)
cp .env.example .env

# 3. 로컬 개발 서버 실행
npm run dev
```
