import { Fragment } from 'react';
import FadeIn from '@/components/shared/FadeIn';
import type { InvitationData, Person } from '@/types';
import classes from './Greeting.module.css';

interface GreetingProps {
  data: InvitationData;
}

export default function Greeting({ data }: GreetingProps) {
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
      </FadeIn>
    </section>
  );
}
