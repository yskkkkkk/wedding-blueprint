import { useEffect } from 'react';
import type { InvitationData, Person } from '@/types';
import classes from './ContactModal.module.css';

interface ContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: InvitationData;
}

export default function ContactModal({ isOpen, onClose, data }: ContactModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const renderPersonRow = (person: Person | undefined, role: string) => {
    if (!person || !person.name || person.name === '미입력') return null;

    const phone = person.phone?.trim();

    return (
      <div className={classes.personRow}>
        <div className={classes.personInfo}>
          <span className={classes.personRole}>{role}</span>
          <span className={classes.personName}>{person.name}</span>
        </div>
        {phone ? (
          <div className={classes.actionGroup}>
            <a
              href={`tel:${phone}`}
              className={classes.actionBtn}
              title={`${person.name}님에게 전화걸기`}
              aria-label={`${person.name}님에게 전화걸기`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
              </svg>
            </a>
            <a
              href={`sms:${phone}`}
              className={classes.actionBtn}
              title={`${person.name}님에게 문자보내기`}
              aria-label={`${person.name}님에게 문자보내기`}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              </svg>
            </a>
          </div>
        ) : (
          <span className={classes.noPhoneText}>연락처 미등록</span>
        )}
      </div>
    );
  };

  return (
    <div className={classes.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={classes.modal} onClick={(e) => e.stopPropagation()}>
        <div className={classes.header}>
          <div className={classes.headerText}>
            <h3 className={classes.title}>축하 연락처</h3>
            <p className={classes.subtitle}>전화 또는 문자로 축하의 마음을 전해보세요</p>
          </div>
          <button
            type="button"
            className={classes.closeButton}
            onClick={onClose}
            aria-label="닫기"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div className={classes.content}>
          {/* 신랑측 */}
          <section className={classes.sideSection}>
            <h4 className={classes.sideTitle}>신랑측</h4>
            <div className={classes.personList}>
              {renderPersonRow(data.groom, '신랑')}
              {renderPersonRow(data.groomParents?.father, '아버지')}
              {renderPersonRow(data.groomParents?.mother, '어머니')}
            </div>
          </section>

          {/* 신부측 */}
          <section className={classes.sideSection}>
            <h4 className={classes.sideTitle}>신부측</h4>
            <div className={classes.personList}>
              {renderPersonRow(data.bride, '신부')}
              {renderPersonRow(data.brideParents?.father, '아버지')}
              {renderPersonRow(data.brideParents?.mother, '어머니')}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
