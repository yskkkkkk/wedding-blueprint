import { useState } from 'react';
import { useRsvp } from '@/hooks/useRsvp';
import classes from './RsvpForm.module.css';

interface RsvpFormProps {
  invitationSlug: string;
}

export default function RsvpForm({ invitationSlug }: RsvpFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { submitRsvp, loading, error, success } = useRsvp(invitationSlug);

  const [formData, setFormData] = useState({
    name: '',
    contact: '',
    attending: true,
    companion_count: 0,
    meal_preference: true,
    message: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.contact) return;
    
    await submitRsvp(formData);
  };

  if (success) {
    return (
      <div className={classes.rsvpContainer}>
        <div className={classes.successBox}>
          <h3>참석 의사가 전달되었습니다.</h3>
          <p>소중한 발걸음 감사드립니다!</p>
        </div>
      </div>
    );
  }

  return (
    <div className={classes.rsvpContainer}>
      {!isOpen ? (
        <button className={classes.openBtn} onClick={() => setIsOpen(true)}>
          참석 의사 전달하기
        </button>
      ) : (
        <form className={classes.formBox} onSubmit={handleSubmit}>
          <div className={classes.header}>
            <h3>참석 의사 전달</h3>
            <button type="button" className={classes.closeBtn} onClick={() => setIsOpen(false)}>✕</button>
          </div>
          
          <div className={classes.inputGroup}>
            <label>참석 여부</label>
            <div className={classes.radioGroup}>
              <label>
                <input type="radio" name="attending" checked={formData.attending === true} onChange={() => setFormData({...formData, attending: true})} /> 참석
              </label>
              <label>
                <input type="radio" name="attending" checked={formData.attending === false} onChange={() => setFormData({...formData, attending: false})} /> 불참
              </label>
            </div>
          </div>

          <div className={classes.inputGroup}>
            <label>성함 *</label>
            <input type="text" required placeholder="이름을 입력해주세요" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} />
          </div>

          <div className={classes.inputGroup}>
            <label>연락처 *</label>
            <input type="tel" required placeholder="010-0000-0000" value={formData.contact} onChange={e => setFormData({...formData, contact: e.target.value})} />
          </div>

          {formData.attending && (
            <>
              <div className={classes.inputGroup}>
                <label>동반 인원 (본인 제외)</label>
                <select value={formData.companion_count} onChange={e => setFormData({...formData, companion_count: Number(e.target.value)})}>
                  <option value={0}>없음 (0명)</option>
                  <option value={1}>1명</option>
                  <option value={2}>2명</option>
                  <option value={3}>3명</option>
                  <option value={4}>4명 이상</option>
                </select>
              </div>

              <div className={classes.inputGroup}>
                <label>식사 여부</label>
                <div className={classes.radioGroup}>
                  <label>
                    <input type="radio" name="meal" checked={formData.meal_preference === true} onChange={() => setFormData({...formData, meal_preference: true})} /> 식사 함
                  </label>
                  <label>
                    <input type="radio" name="meal" checked={formData.meal_preference === false} onChange={() => setFormData({...formData, meal_preference: false})} /> 안 함
                  </label>
                </div>
              </div>
            </>
          )}

          <div className={classes.inputGroup}>
            <label>신랑 신부에게 전할 말 (선택)</label>
            <textarea rows={3} placeholder="축하 메시지를 남겨주세요" value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
          </div>

          {error && <p className={classes.errorText}>{error}</p>}

          <button type="submit" className={classes.submitBtn} disabled={loading}>
            {loading ? '전달 중...' : '전송하기'}
          </button>
        </form>
      )}
    </div>
  );
}
