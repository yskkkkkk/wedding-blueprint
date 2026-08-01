import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { InvitationData } from '@/types';

// 조회 실패의 원인을 구분한다.
// - notFound: 해당 slug의 청첩장이 실제로 존재하지 않음 (주소 오타/삭제)
// - temporary: 네트워크 장애, DB 일시정지 등 재시도로 해결될 수 있는 상태
export type InvitationErrorKind = 'notFound' | 'temporary';

// PostgREST가 조회 결과 0건일 때 반환하는 코드
const NO_ROWS_CODE = 'PGRST116';

export function useInvitationData(slug: string | undefined) {
  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorKind, setErrorKind] = useState<InvitationErrorKind | null>(null);
  const [retryCount, setRetryCount] = useState(0);

  const retry = useCallback(() => setRetryCount(count => count + 1), []);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      setErrorKind(null);

      if (!slug) {
        setErrorKind('notFound');
        setLoading(false);
        return;
      }

      try {
        const { data: dbData, error: fetchError } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) {
          // 결과가 없는 것은 '장애'가 아니라 '없는 청첩장'이므로 분리해서 처리한다.
          if (fetchError.code === NO_ROWS_CODE) {
            setErrorKind('notFound');
            return;
          }
          throw fetchError;
        }

        if (!dbData) {
          setErrorKind('notFound');
          return;
        }

        // DB의 snake_case 컬럼들을 프론트엔드의 camelCase 인터페이스에 맞게 매핑
        const mappedData: InvitationData = {
          id: dbData.id,
          slug: dbData.slug,
          groom: dbData.groom,
          bride: dbData.bride,
          groomParents: dbData.groom_parents,
          brideParents: dbData.bride_parents,
          weddingDate: dbData.wedding_date,
          location: dbData.location,
          greeting: dbData.greeting,
          coverImage: dbData.cover_image,
          galleryImages: dbData.gallery_images,
          themeFont: dbData.theme_font,
        };
        setData(mappedData);
      } catch (err) {
        // 원인을 특정할 수 없는 실패는 재시도 가능한 일시적 장애로 간주한다.
        console.error('Failed to fetch invitation data:', err);
        setErrorKind('temporary');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug, retryCount]);

  return { data, loading, errorKind, retry };
}
