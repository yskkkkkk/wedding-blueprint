import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './supabaseEnv';

// 로그인(auth)이 필요한 어드민 화면 전용 클라이언트.
// 이 모듈은 auth/스토리지/실시간 기능을 모두 포함하므로 약 180kB 규모다.
// 하객 화면(지연 로딩되지 않는 초기 번들)에서 import하면 그만큼 초기 로딩이
// 무거워지므로, 데이터 조회만 필요하면 '@/services/db'의 db를 사용할 것.
export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
