import { useState, useEffect } from 'react';
import { supabase } from '@/services/supabase';
import type { InvitationData } from '@/types';

export function useInvitationData(slug: string | undefined) {
  const [data, setData] = useState<InvitationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!slug) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const { data: dbData, error: fetchError } = await supabase
          .from('invitations')
          .select('*')
          .eq('slug', slug)
          .single();

        if (fetchError) throw fetchError;

        if (dbData) {
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
          };
          setData(mappedData);
        }
      } catch (err) {
        console.error('Failed to fetch invitation data:', err);
        setError(err as Error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  return { data, loading, error };
}
