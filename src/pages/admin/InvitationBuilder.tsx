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
  
  const [parents, setParents] = useState({
    groomFather: '', groomMother: '', brideFather: '', brideMother: ''
  });

  const [weddingHall, setWeddingHall] = useState('');
  const [address, setAddress] = useState('');
  const [coverImage, setCoverImage] = useState('');
  
  const [greeting, setGreeting] = useState({ title: '', content: '' });
  
  const [groomAccount, setGroomAccount] = useState({
    bankName: '', accountNumber: '', holder: '', tossLink: '', kakaopayLink: ''
  });
  
  const [brideAccount, setBrideAccount] = useState({
    bankName: '', accountNumber: '', holder: '', tossLink: '', kakaopayLink: ''
  });

  const [galleryUrls, setGalleryUrls] = useState('');

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
      setError('필수 항목(* 표시)을 모두 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Data shaping for DB
      const galleryArray = galleryUrls.split(',')
        .map(url => url.trim())
        .filter(url => url.length > 0);

      const newInvitation = {
        slug,
        wedding_date: new Date(weddingDate).toISOString(),
        groom: { 
          name: groomName, 
          relation: groomRelation,
          bank: groomAccount.bankName ? {
            name: groomAccount.bankName,
            accountNumber: groomAccount.accountNumber,
            holder: groomAccount.holder
          } : undefined,
          tossLink: groomAccount.tossLink || undefined,
          kakaopayLink: groomAccount.kakaopayLink || undefined,
        },
        bride: { 
          name: brideName, 
          relation: brideRelation,
          bank: brideAccount.bankName ? {
            name: brideAccount.bankName,
            accountNumber: brideAccount.accountNumber,
            holder: brideAccount.holder
          } : undefined,
          tossLink: brideAccount.tossLink || undefined,
          kakaopayLink: brideAccount.kakaopayLink || undefined,
        },
        groom_parents: { 
          father: { name: parents.groomFather || '' }, 
          mother: { name: parents.groomMother || '' } 
        },
        bride_parents: { 
          father: { name: parents.brideFather || '' }, 
          mother: { name: parents.brideMother || '' } 
        },
        location: { 
          name: weddingHall, 
          address: address, 
          latitude: 37.512, 
          longitude: 127.034 
        },
        greeting: { 
          title: greeting.title || '초대합니다', 
          content: greeting.content || '두 사람이 만나 하나가 되는 날...' 
        },
        cover_image: coverImage,
        gallery_images: galleryArray
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
                placeholder="예: minsu-wedding" 
                value={slug}
                onChange={e => setSlug(e.target.value.toLowerCase())}
                required
              />
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
            <h3 className={classes.sectionTitle}>2. 신랑 / 신부 및 혼주 정보</h3>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>신랑 이름 *</label>
                <input type="text" className={classes.input} value={groomName} onChange={e => setGroomName(e.target.value)} required />
              </div>
              <div className={classes.inputGroup}>
                <label>관계</label>
                <input type="text" className={classes.input} placeholder="예: 장남" value={groomRelation} onChange={e => setGroomRelation(e.target.value)} />
              </div>
            </div>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>신랑 아버지</label>
                <input type="text" className={classes.input} value={parents.groomFather} onChange={e => setParents({...parents, groomFather: e.target.value})} />
              </div>
              <div className={classes.inputGroup}>
                <label>신랑 어머니</label>
                <input type="text" className={classes.input} value={parents.groomMother} onChange={e => setParents({...parents, groomMother: e.target.value})} />
              </div>
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>신부 이름 *</label>
                <input type="text" className={classes.input} value={brideName} onChange={e => setBrideName(e.target.value)} required />
              </div>
              <div className={classes.inputGroup}>
                <label>관계</label>
                <input type="text" className={classes.input} placeholder="예: 차녀" value={brideRelation} onChange={e => setBrideRelation(e.target.value)} />
              </div>
            </div>
            <div className={classes.formRow}>
              <div className={classes.inputGroup}>
                <label>신부 아버지</label>
                <input type="text" className={classes.input} value={parents.brideFather} onChange={e => setParents({...parents, brideFather: e.target.value})} />
              </div>
              <div className={classes.inputGroup}>
                <label>신부 어머니</label>
                <input type="text" className={classes.input} value={parents.brideMother} onChange={e => setParents({...parents, brideMother: e.target.value})} />
              </div>
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>3. 인사말 (Greeting)</h3>
            <div className={classes.inputGroup}>
              <label>제목</label>
              <input type="text" className={classes.input} placeholder="초대합니다" value={greeting.title} onChange={e => setGreeting({...greeting, title: e.target.value})} />
            </div>
            <div className={classes.inputGroup}>
              <label>내용</label>
              <textarea className={classes.input} style={{ minHeight: '100px' }} placeholder="인사말을 적어주세요." value={greeting.content} onChange={e => setGreeting({...greeting, content: e.target.value})} />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>4. 마음 전하실 곳 (선택)</h3>
            <details style={{ marginBottom: '1rem' }}>
              <summary style={{ cursor: 'pointer', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                신랑측 계좌번호 입력하기
              </summary>
              <div style={{ padding: '1rem', border: '1px solid #eee', marginTop: '0.5rem' }}>
                <div className={classes.inputGroup}>
                  <label>은행명</label>
                  <input type="text" className={classes.input} value={groomAccount.bankName} onChange={e => setGroomAccount({...groomAccount, bankName: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>계좌번호</label>
                  <input type="text" className={classes.input} value={groomAccount.accountNumber} onChange={e => setGroomAccount({...groomAccount, accountNumber: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>예금주</label>
                  <input type="text" className={classes.input} value={groomAccount.holder} onChange={e => setGroomAccount({...groomAccount, holder: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>토스 송금 링크 (선택)</label>
                  <input type="url" className={classes.input} value={groomAccount.tossLink} onChange={e => setGroomAccount({...groomAccount, tossLink: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>카카오페이 송금 링크 (선택)</label>
                  <input type="url" className={classes.input} value={groomAccount.kakaopayLink} onChange={e => setGroomAccount({...groomAccount, kakaopayLink: e.target.value})} />
                </div>
              </div>
            </details>

            <details>
              <summary style={{ cursor: 'pointer', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                신부측 계좌번호 입력하기
              </summary>
              <div style={{ padding: '1rem', border: '1px solid #eee', marginTop: '0.5rem' }}>
                <div className={classes.inputGroup}>
                  <label>은행명</label>
                  <input type="text" className={classes.input} value={brideAccount.bankName} onChange={e => setBrideAccount({...brideAccount, bankName: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>계좌번호</label>
                  <input type="text" className={classes.input} value={brideAccount.accountNumber} onChange={e => setBrideAccount({...brideAccount, accountNumber: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>예금주</label>
                  <input type="text" className={classes.input} value={brideAccount.holder} onChange={e => setBrideAccount({...brideAccount, holder: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>토스 송금 링크 (선택)</label>
                  <input type="url" className={classes.input} value={brideAccount.tossLink} onChange={e => setBrideAccount({...brideAccount, tossLink: e.target.value})} />
                </div>
                <div className={classes.inputGroup}>
                  <label>카카오페이 송금 링크 (선택)</label>
                  <input type="url" className={classes.input} value={brideAccount.kakaopayLink} onChange={e => setBrideAccount({...brideAccount, kakaopayLink: e.target.value})} />
                </div>
              </div>
            </details>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>5. 예식장 정보</h3>
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
            <h3 className={classes.sectionTitle}>6. 사진 및 갤러리</h3>
            <div className={classes.inputGroup}>
              <label>커버 이미지 URL *</label>
              <input type="url" className={classes.input} placeholder="https://images.unsplash.com/..." value={coverImage} onChange={e => setCoverImage(e.target.value)} required />
            </div>
            <div className={classes.inputGroup}>
              <label>갤러리 이미지 (URL을 쉼표로 구분하여 입력)</label>
              <textarea className={classes.input} style={{ minHeight: '80px' }} placeholder="https://image1.jpg, https://image2.jpg" value={galleryUrls} onChange={e => setGalleryUrls(e.target.value)} />
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
