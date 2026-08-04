// db.ts(하객용 데이터 클라이언트)와 supabase.ts(어드민용 전체 클라이언트)가
// 같은 환경 변수 읽기와 경고 문구를 각각 중복 구현하고 있었다. 한곳으로 모은다.

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  console.warn('⚠️ Supabase 환경 변수가 누락되었습니다. .env 파일을 확인해주세요.');
}

/**
 * 환경 변수가 없어도 클라이언트 생성 자체는 실패하지 않도록 placeholder를 쓴다.
 * 실제 요청은 실패하지만, 앱이 흰 화면으로 죽는 대신 에러 처리 경로를 타게 된다.
 */
export const SUPABASE_URL = url || 'https://placeholder.supabase.co';
export const SUPABASE_ANON_KEY = anonKey || 'placeholder-key';
