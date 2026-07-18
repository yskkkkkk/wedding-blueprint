import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/services/supabase';
import type { GuestbookEntry } from '@/types';

export function useGuestbook(invitationSlug: string) {
  const [entries, setEntries] = useState<GuestbookEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchEntries = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error: fetchError } = await supabase
        .from('guestbook')
        .select('id, invitation_slug, name, content, created_at')
        .eq('invitation_slug', invitationSlug)
        .order('created_at', { ascending: false });

      if (fetchError) throw fetchError;
      setEntries(data as GuestbookEntry[]);
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  }, [invitationSlug]);

  useEffect(() => {
    if (invitationSlug) {
      fetchEntries();
    }
  }, [invitationSlug, fetchEntries]);

  const addEntry = async (entry: Omit<GuestbookEntry, 'id' | 'created_at'>) => {
    try {
      const { error: insertError } = await supabase
        .from('guestbook')
        .insert([entry]);
      
      if (insertError) throw insertError;
      
      // Refresh list after successful insert
      await fetchEntries();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  };

  const deleteEntry = async (id: string, passwordInput: string) => {
    try {
      // Supabase RLS is currently "true", so anyone can delete. 
      // But we must check the password first.
      const { data, error: fetchError } = await supabase
        .from('guestbook')
        .select('password')
        .eq('id', id)
        .single();
      
      if (fetchError) throw fetchError;
      
      if (data.password !== passwordInput) {
        throw new Error('비밀번호가 일치하지 않습니다.');
      }

      const { error: deleteError } = await supabase
        .from('guestbook')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      
      await fetchEntries();
      return { success: true };
    } catch (err) {
      return { success: false, error: err as Error };
    }
  };

  return { entries, loading, error, addEntry, deleteEntry, fetchEntries };
}
