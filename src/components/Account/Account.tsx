import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import FadeIn from '@/components/shared/FadeIn';
import type { InvitationData, Person } from '@/types';
import classes from './Account.module.css';

interface AccountProps {
  data: InvitationData;
}

export default function Account({ data }: AccountProps) {
  const [openSection, setOpenSection] = useState<'groom' | 'bride' | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const toggleSection = (section: 'groom' | 'bride') => {
    setOpenSection((prev) => (prev === section ? null : section));
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setToastMessage('계좌번호가 복사되었습니다.');
      setTimeout(() => setToastMessage(null), 2500);
    } catch (err) {
      console.error('Failed to copy', err);
      setToastMessage('복사에 실패했습니다.');
      setTimeout(() => setToastMessage(null), 2500);
    }
  };

  const renderPersonAccount = (person: Person, role: string) => {
    if (!person.bank) return null;

    return (
      <div key={role} className={classes.accountRow}>
        <div className={classes.accountInfo}>
          <div className={classes.accountRole}>
            <span>{role}</span>
            <span className={classes.accountName}>{person.name}</span>
          </div>
          <div className={classes.accountDetails}>
            {person.bank.name} {person.bank.accountNumber}
          </div>
        </div>
        
        <div className={classes.actionButtons}>
          {person.tossLink && (
            <a href={person.tossLink} target="_blank" rel="noreferrer" className={classes.payBtn}>
              토스
            </a>
          )}
          {person.kakaopayLink && (
            <a href={person.kakaopayLink} target="_blank" rel="noreferrer" className={classes.payBtn}>
              카카오페이
            </a>
          )}
          <button
            type="button"
            className={classes.copyBtn}
            onClick={() => handleCopy(person.bank!.accountNumber)}
          >
            복사
          </button>
        </div>
      </div>
    );
  };

  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.header}>
          <h2 className={classes.title}>ACCOUNT</h2>
          <p className={classes.subtitle}>마음 전하실 곳</p>
        </div>
      </FadeIn>

      <FadeIn yOffset={20} duration={0.8} delay={0.2}>
        <div className={classes.container}>
          {/* Groom Section */}
          <div className={classes.accordion}>
            <button
              className={classes.accordionHeader}
              onClick={() => toggleSection('groom')}
              aria-expanded={openSection === 'groom'}
            >
              신랑측 계좌번호
              <span className={`${classes.arrow} ${openSection === 'groom' ? classes.open : ''}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {openSection === 'groom' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className={classes.accordionContent}
                >
                  <div className={classes.accountList}>
                    {renderPersonAccount(data.groomParents.father, '아버지')}
                    {renderPersonAccount(data.groomParents.mother, '어머니')}
                    {renderPersonAccount(data.groom, '신랑')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Bride Section */}
          <div className={classes.accordion}>
            <button
              className={classes.accordionHeader}
              onClick={() => toggleSection('bride')}
              aria-expanded={openSection === 'bride'}
            >
              신부측 계좌번호
              <span className={`${classes.arrow} ${openSection === 'bride' ? classes.open : ''}`}>
                ▼
              </span>
            </button>
            <AnimatePresence>
              {openSection === 'bride' && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className={classes.accordionContent}
                >
                  <div className={classes.accountList}>
                    {renderPersonAccount(data.brideParents.father, '아버지')}
                    {renderPersonAccount(data.brideParents.mother, '어머니')}
                    {renderPersonAccount(data.bride, '신부')}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </FadeIn>

      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className={classes.toast}
          >
            {toastMessage}
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
