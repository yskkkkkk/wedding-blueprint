import { PostgrestClient } from '@supabase/postgrest-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseEnv';

// 하객 화면은 DB 조회/등록만 필요하고 로그인(auth)·스토리지·실시간 기능을 쓰지 않는다.
// createClient()를 쓰면 이 기능들이 전부 초기 번들에 포함되므로, 데이터 접근 전용
// 클라이언트를 따로 둔다. (postgrest-js가 공식 문서에서 안내하는 standalone 사용법)
//
// 로그인이 필요한 어드민 화면은 '@/services/supabase'의 전체 클라이언트를 사용한다.

// 혼잡한 예식장 네트워크에서는 요청이 성공도 실패도 하지 않은 채 멈춰 있을 수 있다.
// 그 경우 useInvitationData의 await가 끝나지 않아 finally의 setLoading(false)가
// 실행되지 않고, 하객에게는 스켈레톤만 계속 돌아간다. 이미 만들어 둔 재시도 버튼은
// 에러 경로에만 있으므로 도달조차 못 한다.
//
// 직접 fetch를 감싸 AbortSignal.timeout()을 쓰면 안 된다. 그 경우 던져지는 것은
// TimeoutError인데 postgrest-js는 AbortError만 '중단'으로 인정하고(PostgrestBuilder
// 내 재시도 분기) 나머지는 재시도 대상으로 보기 때문에, 타임아웃마다 재시도가 붙어
// 대기 시간이 오히려 몇 배로 늘어난다. 라이브러리 내장 옵션은 AbortController를
// 사용하므로 재시도 없이 곧바로 에러 경로로 떨어진다.
// 너무 짧으면 느리지만 정상 동작 중인 연결까지 끊어 멀쩡한 청첩장을 에러로 만든다.
// 무한 대기를 막는 것이 목적이므로 넉넉하게 잡는다.
const REQUEST_TIMEOUT_MS = 10_000;

export const db = new PostgrestClient(`${SUPABASE_URL}/rest/v1`, {
  headers: {
    apikey: SUPABASE_ANON_KEY,
    Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
  },
  schema: 'public',
  timeout: REQUEST_TIMEOUT_MS,
});
