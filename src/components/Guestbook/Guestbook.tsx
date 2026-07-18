import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/shared/FadeIn';
import { useGuestbook } from '@/hooks/useGuestbook';
import type { InvitationData } from '@/types';
import classes from './Guestbook.module.css';

interface GuestbookProps {
  data: InvitationData;
}

export default function Guestbook({ data }: GuestbookProps) {
  // Using data.slug as the key for guestbook
  const { entries, loading, error, addEntry, deleteEntry } = useGuestbook(data.slug);

  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState<string | null>(null);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !password || !content) {
      alert('모든 항목을 입력해주세요.');
      return;
    }
    
    setIsSubmitting(true);
    const result = await addEntry({
      invitation_slug: data.slug,
      name,
      password,
      content
    });

    if (result.success) {
      setName('');
      setPassword('');
      setContent('');
    } else {
      alert('방명록 작성에 실패했습니다. 다시 시도해주세요.');
    }
    setIsSubmitting(false);
  };

  const handleDelete = async () => {
    if (!deleteModalOpen || !deletePassword) return;
    
    const result = await deleteEntry(deleteModalOpen, deletePassword);
    if (result.success) {
      setDeleteModalOpen(null);
      setDeletePassword('');
      setDeleteError('');
    } else {
      setDeleteError(result.error?.message || '비밀번호가 틀렸거나 삭제에 실패했습니다.');
    }
  };

  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.header}>
          <h2 className={classes.title}>GUESTBOOK</h2>
          <p className={classes.subtitle}>방명록</p>
        </div>
      </FadeIn>

      <FadeIn yOffset={20} duration={0.8} delay={0.2}>
        <div className={classes.container}>
          
          <form className={classes.form} onSubmit={handleSubmit}>
            <div className={classes.formRow}>
              <input 
                type="text" 
                placeholder="이름" 
                className={classes.input} 
                value={name}
                onChange={e => setName(e.target.value)}
                maxLength={20}
              />
              <input 
                type="password" 
                placeholder="비밀번호" 
                className={classes.input} 
                value={password}
                onChange={e => setPassword(e.target.value)}
                maxLength={20}
              />
            </div>
            <textarea 
              placeholder="축하의 메시지를 남겨주세요." 
              className={classes.textarea}
              value={content}
              onChange={e => setContent(e.target.value)}
              maxLength={300}
            />
            <button type="submit" className={classes.submitBtn} disabled={isSubmitting}>
              {isSubmitting ? '등록 중...' : '등록하기'}
            </button>
          </form>

          <div className={classes.list}>
            {loading && <p className={classes.statusText}>방명록을 불러오는 중입니다...</p>}
            {error && <p className={classes.statusText}>방명록을 불러오지 못했습니다.</p>}
            {!loading && entries.length === 0 && (
              <p className={classes.statusText}>가장 먼저 축하 메시지를 남겨보세요!</p>
            )}

            <AnimatePresence>
              {entries.map(entry => (
                <motion.div 
                  key={entry.id}
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className={classes.entryCard}
                >
                  <div className={classes.entryHeader}>
                    <span className={classes.entryName}>{entry.name}</span>
                    <div className={classes.entryRight}>
                      <span className={classes.entryDate}>
                        {new Date(entry.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' })}
                      </span>
                      <button 
                        className={classes.deleteIconBtn}
                        onClick={() => setDeleteModalOpen(entry.id)}
                        aria-label="삭제"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                  <p className={classes.entryContent}>{entry.content}</p>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </FadeIn>

      {/* Delete Modal */}
      <AnimatePresence>
        {deleteModalOpen && (
          <div className={classes.modalOverlay}>
            <motion.div 
              className={classes.modal}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className={classes.modalTitle}>비밀번호 확인</h3>
              <p className={classes.modalDesc}>방명록 작성 시 입력한 비밀번호를 입력해주세요.</p>
              <input 
                type="password" 
                className={classes.modalInput}
                value={deletePassword}
                onChange={e => setDeletePassword(e.target.value)}
              />
              {deleteError && <p className={classes.modalError}>{deleteError}</p>}
              <div className={classes.modalActions}>
                <button 
                  className={classes.cancelBtn} 
                  onClick={() => {
                    setDeleteModalOpen(null);
                    setDeletePassword('');
                    setDeleteError('');
                  }}
                >
                  취소
                </button>
                <button className={classes.confirmDeleteBtn} onClick={handleDelete}>
                  삭제
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
}
