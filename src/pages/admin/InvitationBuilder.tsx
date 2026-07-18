import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import classes from './Admin.module.css';

export default function InvitationBuilder() {
  const navigate = useNavigate();
  const [authChecked, setAuthChecked] = useState(false);

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
        <form className={classes.builderForm}>
          
          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>1. 기본 정보</h3>
            <div className={classes.inputGroup}>
              <label>고유 주소 (Slug)</label>
              <input type="text" className={classes.input} placeholder="예: minsu-wedding (영문, 숫자, 하이픈만 가능)" />
              <small>완성될 주소: wedvitaion.vercel.app/<strong>입력값</strong></small>
            </div>
            <div className={classes.inputGroup}>
              <label>예식 일시</label>
              <input type="datetime-local" className={classes.input} />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>2. 신랑 정보</h3>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>이름</label>
                <input type="text" className={classes.input} placeholder="김신랑" />
              </div>
              <div className={classes.inputGroup}>
                <label>관계 (예: 장남)</label>
                <input type="text" className={classes.input} placeholder="장남" />
              </div>
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>3. 신부 정보</h3>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>이름</label>
                <input type="text" className={classes.input} placeholder="이신부" />
              </div>
              <div className={classes.inputGroup}>
                <label>관계 (예: 장녀)</label>
                <input type="text" className={classes.input} placeholder="차녀" />
              </div>
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>4. 예식장 정보</h3>
            <div className={classes.inputGroup}>
              <label>웨딩홀 이름</label>
              <input type="text" className={classes.input} placeholder="더그레이스켈리 강남 1층 아모르홀" />
            </div>
            <div className={classes.inputGroup}>
              <label>상세 주소</label>
              <input type="text" className={classes.input} placeholder="서울 강남구 언주로 123" />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>5. 메인 사진</h3>
            <div className={classes.inputGroup}>
              <label>커버 이미지 URL (임시)</label>
              <input type="text" className={classes.input} placeholder="https://images.unsplash.com/..." />
            </div>
          </section>

          <div className={classes.builderActions}>
            <button type="submit" className={classes.submitBtn} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }}>
              청첩장 생성하기
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
