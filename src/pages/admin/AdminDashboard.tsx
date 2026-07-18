import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import classes from './Admin.module.css';
import type { InvitationData } from '@/types';

export default function AdminDashboard() {
  const [invitations, setInvitations] = useState<InvitationData[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function checkAuthAndFetch() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
        return;
      }

      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching invitations:', error);
      } else if (data) {
        // Map to our camelCase type
        const mapped = data.map(dbData => ({
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
        }));
        setInvitations(mapped);
      }
      setLoading(false);
    }

    checkAuthAndFetch();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admin');
  };

  if (loading) {
    return <div className={classes.adminContainer}>Loading...</div>;
  }

  return (
    <div className={classes.dashboardContainer}>
      <header className={classes.dashboardHeader}>
        <h2>청첩장 대시보드</h2>
        <button onClick={handleLogout} className={classes.logoutBtn}>로그아웃</button>
      </header>
      
      <main className={classes.dashboardMain}>
        <div className={classes.actionRow}>
          <button className={classes.createBtn} onClick={() => navigate('/admin/builder')}>+ 새 청첩장 만들기</button>
        </div>

        <div className={classes.cardGrid}>
          {invitations.length === 0 ? (
            <p className={classes.emptyState}>생성된 청첩장이 없습니다.</p>
          ) : (
            invitations.map(inv => (
              <div key={inv.id} className={classes.invitationCard}>
                <img src={inv.coverImage} alt="cover" className={classes.cardImage} />
                <div className={classes.cardContent}>
                  <h3>{inv.groom.name} ♥ {inv.bride.name}</h3>
                  <p>주소: /{inv.slug}</p>
                  <p>예식일: {new Date(inv.weddingDate).toLocaleDateString('ko-KR')}</p>
                  <div className={classes.cardActions}>
                    <button className={classes.editBtn}>수정</button>
                    <a href={`/${inv.slug}`} target="_blank" rel="noreferrer" className={classes.viewBtn}>보기</a>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
