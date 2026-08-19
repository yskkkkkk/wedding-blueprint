import { Fragment, useState } from 'react';
import FadeIn from '@/components/shared/FadeIn';
import type { InvitationData, Person } from '@/types';
import { ContactModal } from '@/components/ContactModal';
import classes from './Greeting.module.css';

interface GreetingProps {
  data: InvitationData;
}

export default function Greeting({ data }: GreetingProps) {
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);

  const renderContent = (content: string) => {
    return content.split('\n').map((line, index) => (
      <Fragment key={index}>
        {line}
        <br />
      </Fragment>
    ));
  };

  const renderParents = (
    father: Person,
    mother: Person,
    person: Person
  ) => {
    const hasFather = father && father.name && father.name !== '미입력';
    const hasMother = mother && mother.name && mother.name !== '미입력';
    const relation = person.relation || '';

    if (!hasFather && !hasMother) {
      return (
        <div className={classes.familyRow}>
          <span className={classes.name}>{person.name}</span>
        </div>
      );
    }

    return (
      <div className={classes.familyRow}>
        <div className={classes.parentsWrapper}>
          {hasFather && <span className={classes.parentName}>{father.name}</span>}
          {hasFather && hasMother && <span className={classes.dot}>·</span>}
          {hasMother && <span className={classes.parentName}>{mother.name}</span>}
        </div>
        <div className={classes.relationWrapper}>
          <span className={classes.relationText}>의</span>
          <span className={classes.relationTitle}>{relation}</span>
          <span className={classes.name}>{person.name}</span>
        </div>
      </div>
    );
  };

  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <h2 className={classes.title}>{data.greeting.title}</h2>
      </FadeIn>

      <FadeIn yOffset={20} duration={0.8} delay={0.2}>
        <p className={classes.content}>
          {renderContent(data.greeting.content)}
        </p>
      </FadeIn>

      <FadeIn yOffset={20} duration={0.8} delay={0.4}>
        <div className={classes.familyContainer}>
          {renderParents(data.groomParents.father, data.groomParents.mother, data.groom)}
          {renderParents(data.brideParents.father, data.brideParents.mother, data.bride)}
        </div>

        <div className={classes.contactButtonWrapper}>
          <button
            type="button"
            className={classes.contactButton}
            onClick={() => setIsContactModalOpen(true)}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
            <span>축하 연락처 보기</span>
          </button>
        </div>
      </FadeIn>

      <ContactModal
        isOpen={isContactModalOpen}
        onClose={() => setIsContactModalOpen(false)}
        data={data}
      />
    </section>
  );
}

