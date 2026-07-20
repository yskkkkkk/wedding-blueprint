import { useState } from 'react';
import { supabase } from '@/services/supabase';

export interface RsvpData {
  invitation_slug: string;
  name: string;
  contact: string;
  attending: boolean;
  companion_count: number;
  meal_preference: boolean;
  message?: string;
}

export function useRsvp(invitationSlug: string) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const submitRsvp = async (data: Omit<RsvpData, 'invitation_slug'>) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      const { error: insertError } = await supabase
        .from('rsvp')
        .insert([{ ...data, invitation_slug: invitationSlug }]);

      if (insertError) throw insertError;
      setSuccess(true);
    } catch (err: any) {
      console.error('Error submitting RSVP:', err);
      setError('참석 의사 전달 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return { submitRsvp, loading, error, success };
}
