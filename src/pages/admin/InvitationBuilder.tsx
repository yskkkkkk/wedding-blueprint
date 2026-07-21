import { useState, useEffect } from 'react';
import { useNavigate, Link, useSearchParams } from 'react-router-dom';
import { supabase } from '@/services/supabase';
import { FormInput } from '@/components/admin';
import classes from './Admin.module.css';

export default function InvitationBuilder() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editSlug = searchParams.get('edit');
  const [authChecked, setAuthChecked] = useState(false);

  // Single Form State
  const [formData, setFormData] = useState({
    slug: '',
    weddingDate: '',
    groomName: '',
    groomRelation: '',
    brideName: '',
    brideRelation: '',
    groomFather: '',
    groomMother: '',
    brideFather: '',
    brideMother: '',
    weddingHall: '',
    address: '',
    coverImage: '',
    greetingTitle: '',
    greetingContent: '',
    galleryUrls: '',
    groomBankName: '',
    groomAccountNumber: '',
    groomHolder: '',
    groomTossLink: '',
    groomKakaopayLink: '',
    brideBankName: '',
    brideAccountNumber: '',
    brideHolder: '',
    brideTossLink: '',
    brideKakaopayLink: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Handle generic input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    // Handle the slug lowercasing specifically if needed, but we can just do it universally or conditionally
    setFormData(prev => ({ 
      ...prev, 
      [name]: name === 'slug' ? value.toLowerCase() : value 
    }));
  };

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

  useEffect(() => {
    async function fetchEditData() {
      if (!editSlug) return;
      
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('slug', editSlug)
        .single();
        
      if (data) {
        // Format datetime for datetime-local input (YYYY-MM-DDThh:mm)
        const dateObj = new Date(data.wedding_date);
        const tzOffset = dateObj.getTimezoneOffset() * 60000;
        const localISOTime = (new Date(dateObj.getTime() - tzOffset)).toISOString().slice(0, 16);
        
        setFormData({
          slug: data.slug || '',
          weddingDate: localISOTime,
          groomName: data.groom?.name || '',
          groomRelation: data.groom?.relation || '',
          brideName: data.bride?.name || '',
          brideRelation: data.bride?.relation || '',
          groomFather: data.groom_parents?.father?.name || '',
          groomMother: data.groom_parents?.mother?.name || '',
          brideFather: data.bride_parents?.father?.name || '',
          brideMother: data.bride_parents?.mother?.name || '',
          weddingHall: data.location?.name || '',
          address: data.location?.address || '',
          coverImage: data.cover_image || '',
          greetingTitle: data.greeting?.title || '',
          greetingContent: data.greeting?.content || '',
          galleryUrls: data.gallery_images ? data.gallery_images.join(', ') : '',
          groomBankName: data.groom?.bank?.name || '',
          groomAccountNumber: data.groom?.bank?.accountNumber || '',
          groomHolder: data.groom?.bank?.holder || '',
          groomTossLink: data.groom?.tossLink || '',
          groomKakaopayLink: data.groom?.kakaopayLink || '',
          brideBankName: data.bride?.bank?.name || '',
          brideAccountNumber: data.bride?.bank?.accountNumber || '',
          brideHolder: data.bride?.bank?.holder || '',
          brideTossLink: data.bride?.tossLink || '',
          brideKakaopayLink: data.bride?.kakaopayLink || '',
        });
      } else if (error) {
        console.error('Error fetching edit data:', error);
      }
    }
    fetchEditData();
  }, [editSlug]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const {
      slug, weddingDate, groomName, brideName, weddingHall, address, coverImage,
      groomRelation, brideRelation, groomFather, groomMother, brideFather, brideMother,
      greetingTitle, greetingContent, galleryUrls,
      groomBankName, groomAccountNumber, groomHolder, groomTossLink, groomKakaopayLink,
      brideBankName, brideAccountNumber, brideHolder, brideTossLink, brideKakaopayLink
    } = formData;

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
      const galleryArray = galleryUrls.split(',').map(url => url.trim()).filter(url => url.length > 0);

      const newInvitation = {
        slug,
        wedding_date: new Date(weddingDate).toISOString(),
        groom: { 
          name: groomName, 
          relation: groomRelation,
          bank: groomBankName ? { name: groomBankName, accountNumber: groomAccountNumber, holder: groomHolder } : undefined,
          tossLink: groomTossLink || undefined,
          kakaopayLink: groomKakaopayLink || undefined,
        },
        bride: { 
          name: brideName, 
          relation: brideRelation,
          bank: brideBankName ? { name: brideBankName, accountNumber: brideAccountNumber, holder: brideHolder } : undefined,
          tossLink: brideTossLink || undefined,
          kakaopayLink: brideKakaopayLink || undefined,
        },
        groom_parents: { father: { name: groomFather }, mother: { name: groomMother } },
        bride_parents: { father: { name: brideFather }, mother: { name: brideMother } },
        location: { name: weddingHall, address: address, latitude: 37.512, longitude: 127.034 },
        greeting: { title: greetingTitle || '초대합니다', content: greetingContent || '두 사람이 만나 하나가 되는 날...' },
        cover_image: coverImage,
        gallery_images: galleryArray
      };

      if (editSlug) {
        const { error: updateError } = await supabase.from('invitations').update(newInvitation).eq('slug', editSlug);
        if (updateError) throw updateError;
        alert('성공적으로 청첩장이 수정되었습니다!');
      } else {
        const { error: insertError } = await supabase.from('invitations').insert([newInvitation]);
        if (insertError) {
          if (insertError.code === '23505') throw new Error('이미 사용 중인 주소(Slug)입니다. 다른 주소를 입력해주세요.');
          throw insertError;
        }
        alert('성공적으로 청첩장이 생성되었습니다!');
      }

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
          <h2>{editSlug ? '청첩장 수정하기' : '새 청첩장 만들기'}</h2>
        </div>
      </header>
      
      <main className={classes.dashboardMain}>
        <form className={classes.builderForm} onSubmit={handleSubmit}>
          
          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>1. 기본 정보</h3>
            <FormInput label="고유 주소 (Slug) *" name="slug" placeholder="예: minsu-wedding" value={formData.slug} onChange={handleChange} required disabled={!!editSlug} style={{ backgroundColor: editSlug ? '#f0f0f0' : 'white' }} />
            <FormInput label="예식 일시 *" name="weddingDate" type="datetime-local" value={formData.weddingDate} onChange={handleChange} required />
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>2. 신랑 / 신부 및 혼주 정보</h3>
            <div className={classes.formRow}>
              <FormInput label="신랑 이름 *" name="groomName" value={formData.groomName} onChange={handleChange} required />
              <FormInput label="관계" name="groomRelation" placeholder="예: 장남" value={formData.groomRelation} onChange={handleChange} />
            </div>
            <div className={classes.formRow}>
              <FormInput label="신랑 아버지" name="groomFather" value={formData.groomFather} onChange={handleChange} />
              <FormInput label="신랑 어머니" name="groomMother" value={formData.groomMother} onChange={handleChange} />
            </div>
            <hr style={{ margin: '1rem 0', border: 'none', borderTop: '1px dashed #ccc' }} />
            <div className={classes.formRow}>
              <FormInput label="신부 이름 *" name="brideName" value={formData.brideName} onChange={handleChange} required />
              <FormInput label="관계" name="brideRelation" placeholder="예: 차녀" value={formData.brideRelation} onChange={handleChange} />
            </div>
            <div className={classes.formRow}>
              <FormInput label="신부 아버지" name="brideFather" value={formData.brideFather} onChange={handleChange} />
              <FormInput label="신부 어머니" name="brideMother" value={formData.brideMother} onChange={handleChange} />
            </div>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>3. 인사말 (Greeting)</h3>
            <FormInput label="제목" name="greetingTitle" placeholder="초대합니다" value={formData.greetingTitle} onChange={handleChange} />
            <FormInput isTextarea label="내용" name="greetingContent" placeholder="인사말을 적어주세요." value={formData.greetingContent} onChange={handleChange} />
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>4. 마음 전하실 곳 (선택)</h3>
            <details style={{ marginBottom: '1rem' }}>
              <summary style={{ cursor: 'pointer', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                신랑측 계좌번호 입력하기
              </summary>
              <div style={{ padding: '1rem', border: '1px solid #eee', marginTop: '0.5rem' }}>
                <FormInput label="은행명" name="groomBankName" value={formData.groomBankName} onChange={handleChange} />
                <FormInput label="계좌번호" name="groomAccountNumber" value={formData.groomAccountNumber} onChange={handleChange} />
                <FormInput label="예금주" name="groomHolder" value={formData.groomHolder} onChange={handleChange} />
                <FormInput label="토스 송금 링크 (선택)" name="groomTossLink" type="url" value={formData.groomTossLink} onChange={handleChange} />
                <FormInput label="카카오페이 송금 링크 (선택)" name="groomKakaopayLink" type="url" value={formData.groomKakaopayLink} onChange={handleChange} />
              </div>
            </details>

            <details>
              <summary style={{ cursor: 'pointer', padding: '0.5rem', backgroundColor: '#f5f5f5', borderRadius: '4px' }}>
                신부측 계좌번호 입력하기
              </summary>
              <div style={{ padding: '1rem', border: '1px solid #eee', marginTop: '0.5rem' }}>
                <FormInput label="은행명" name="brideBankName" value={formData.brideBankName} onChange={handleChange} />
                <FormInput label="계좌번호" name="brideAccountNumber" value={formData.brideAccountNumber} onChange={handleChange} />
                <FormInput label="예금주" name="brideHolder" value={formData.brideHolder} onChange={handleChange} />
                <FormInput label="토스 송금 링크 (선택)" name="brideTossLink" type="url" value={formData.brideTossLink} onChange={handleChange} />
                <FormInput label="카카오페이 송금 링크 (선택)" name="brideKakaopayLink" type="url" value={formData.brideKakaopayLink} onChange={handleChange} />
              </div>
            </details>
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>5. 예식장 정보</h3>
            <FormInput label="웨딩홀 이름 *" name="weddingHall" placeholder="예: 더그레이스켈리 강남 1층 아모르홀" value={formData.weddingHall} onChange={handleChange} required />
            <FormInput label="상세 주소 *" name="address" placeholder="서울 강남구 언주로 123" value={formData.address} onChange={handleChange} required />
          </section>

          <section className={classes.builderSection}>
            <h3 className={classes.sectionTitle}>6. 사진 및 갤러리</h3>
            <FormInput label="커버 이미지 URL *" name="coverImage" type="url" placeholder="https://images.unsplash.com/..." value={formData.coverImage} onChange={handleChange} required />
            <FormInput isTextarea label="갤러리 이미지 (URL을 쉼표로 구분하여 입력)" name="galleryUrls" placeholder="https://image1.jpg, https://image2.jpg" value={formData.galleryUrls} onChange={handleChange} />
          </section>

          {error && <p className={classes.error} style={{ textAlign: 'center' }}>{error}</p>}

          <div className={classes.builderActions}>
            <button type="submit" className={classes.submitBtn} style={{ width: '100%', padding: '1rem', fontSize: '1.1rem' }} disabled={isSubmitting}>
              {isSubmitting ? '저장 중...' : (editSlug ? '청첩장 수정하기' : '청첩장 생성하기')}
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
