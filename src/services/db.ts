import { PostgrestClient } from '@supabase/postgrest-js';

// 하객 화면은 DB 조회/등록만 필요하고 로그인(auth)·스토리지·실시간 기능을 쓰지 않는다.
// createClient()를 쓰면 이 기능들이 전부 초기 번들에 포함되므로, 데이터 접근 전용
// 클라이언트를 따로 둔다. (postgrest-js가 공식 문서에서 안내하는 standalone 사용법)
//
// 로그인이 필요한 어드민 화면은 '@/services/supabase'의 전체 클라이언트를 사용한다.
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase 환경 변수가 누락되었습니다. .env 파일을 확인해주세요.');
}

const url = supabaseUrl || 'https://placeholder.supabase.co';
const key = supabaseAnonKey || 'placeholder-key';

export const db = new PostgrestClient(`${url}/rest/v1`, {
  headers: {
    apikey: key,
    Authorization: `Bearer ${key}`,
  },
  schema: 'public',
});
