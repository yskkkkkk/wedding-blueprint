import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import classes from './Admin.module.css';

export default function InvitationBuilder() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

  // Form State
  const [slug, setSlug] = useState('');
  const [weddingDate, setWeddingDate] = useState('');
  const [groomName, setGroomName] = useState('');
  const [groomRelation, setGroomRelation] = useState('');
  const [brideName, setBrideName] = useState('');
  const [brideRelation, setBrideRelation] = useState('');
  const [weddingHall, setWeddingHall] = useState('');
  const [address, setAddress] = useState('');
  const [coverImage, setCoverImage] = useState('');

  // Submit State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        navigate('/admin');
      } else {
        setAuthChecked(true);
      }
    }
    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validation
    const slugRegex = /^[a-z0-9-]+$/;
    if (!slugRegex.test(slug)) {
      setError('고유 주소(Slug)는 영문 소문자, 숫자, 하이픈(-)만 사용할 수 있습니다.');
      return;
    }

    if (!slug || !weddingDate || !groomName || !brideName || !weddingHall || !address || !coverImage) {
      setError('모든 필수 항목을 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Data shaping for DB
      const newInvitation = {
        slug,
        wedding_date: new Date(weddingDate).toISOString(),
        groom: { name: groomName, relation: groomRelation },
        bride: { name: brideName, relation: brideRelation },
        groom_parents: { father: { name: '미입력' }, mother: { name: '미입력' } }, // MVP Placeholder
        bride_parents: { father: { name: '미입력' }, mother: { name: '미입력' } }, // MVP Placeholder
        location: { name: weddingHall, address: address, latitude: 37.512, longitude: 127.034 }, // MVP LatLng
        greeting: { title: '초대합니다', content: '두 사람이 만나...' },
        cover_image: coverImage,
        gallery_images: [] // MVP Placeholder
      };

      const { error: insertError } = await supabase
        .from('invitations')
        .insert([newInvitation]);

      if (insertError) {
        if (insertError.code === '23505') { // Unique violation
          throw new Error('이미 사용 중인 주소(Slug)입니다. 다른 주소를 입력해주세요.');
        }
        throw insertError;
      }

      alert('성공적으로 청첩장이 생성되었습니다!');
      navigate('/admin/dashboard');
    } catch (err: any) {
      setError(err.message || '청첩장 생성 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!authChecked) {
    return <div className={classes.adminContainer}>Loading...</div>;
  }

  return (
    <div className={classes.dashboardContainer}>
      <header className={classes.dashboardHeader}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Link to="/admin/dashboard" className={classes.backBtn}>← 뒤로가기</Link>
          <h2>새 청첩장 만들기</h2>
        </div>
      </header>
      
      <main className={classes.dashboardMain}>
        <form className={classes.builderForm} onSubmit={handleSubmit}>
          
          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>1. 기본 정보</h3>
            <div className={classes.inputGroup}>
              <label>고유 주소 (Slug) *</label>
              <input 
                type="text" 
                className={classes.input} 
                placeholder="예: minsu-wedding (영문, 숫자, 하이픈만 가능)" 
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase())}
                required
              />
              <small>완성될 주소: wedvitaion.vercel.app/<strong>{slug || '입력값'}</strong></small>
            </div>
            <div className={classes.inputGroup}>
              <label>예식 일시 *</label>
              <input 
                type="datetime-local" 
                className={classes.input} 
                value={weddingDate}
                onChange={e => setWeddingDate(e.target.value)}
                required
              />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>2. 신랑 정보</h3>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>이름 *</label>
                <input type="text" className={classes.input} placeholder="김신랑" value={groomName} onChange={e => setGroomName(e.target.value)} required />
              </div>
              <div className={classes.inputGroup}>
                <label>관계</label>
                <input type="text" className={classes.input} placeholder="예: 장남" value={groomRelation} onChange={e => setGroomRelation(e.target.value)} />
              </div>
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>3. 신부 정보</h3>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>이름 *</label>
                <input type="text" className={classes.input} placeholder="이신부" value={brideName} onChange={e => setBrideName(e.target.value)} required />
              </div>
              <div className={classes.inputGroup}>
                <label>관계</label>
                <input type="text" className={classes.input} placeholder="예: 차녀" value={brideRelation} onChange={e => setBrideRelation(e.target.value)} />
              </div>
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>4. 예식장 정보</h3>
            <div className={classes.inputGroup}>
              <label>웨딩홀 이름 *</label>
              <input type="text" className={classes.input} placeholder="예: 더그레이스켈리 강남 1층 아모르홀" value={weddingHall} onChange={e => setWeddingHall(e.target.value)} required />
            </div>
            <div className={classes.inputGroup}>
              <label>상세 주소 *</label>
              <input type="text" className={classes.input} placeholder="서울 강남구 언주로 123" value={address} onChange={e => setAddress(e.target.value)} required />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>5. 메인 사진</h3>
            <div className={classes.inputGroup}>
              <label>커버 이미지 URL (임시) *</label>
              <input type="url" className={classes.input} placeholder="https://images.unsplash.com/..." value={coverImage} onChange={e => setCoverImage(e.target.value)} required />
            </div>
          </section>

          {error && <p className={classes.error} style={{ textAlign: 'center' }}>{error}</p>}

          <div className={classes.builderActions}>
            <button type="submit" className={classes.submitBtn} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
              {isSubmitting ? '생성 중...' : '청첩장 생성하기'}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
