import fs from 'fs';
import path from 'path';

const components = ['Greeting', 'Gallery', 'Location', 'Account', 'Guestbook'];
const basePath = path.join(process.cwd(), 'src', 'components');

components.forEach(name => {
  const dirPath = path.join(basePath, name);
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }

  const tsxContent = `import FadeIn from '@/components/shared/FadeIn';
import { InvitationData } from '@/types';
import classes from './${name}.module.css';

interface ${name}Props {
  data?: InvitationData;
}

export default function ${name}({ data }: ${name}Props) {
  return (
    <section className={classes.section}>
      <FadeIn yOffset={20} duration={0.8}>
        <div className={classes.container}>
          <h2 className={classes.title}>${name} 영역</h2>
          <p className={classes.placeholder}>이 영역은 차후 상세하게 구현될 예정입니다.</p>
        </div>
      </FadeIn>
    </section>
  );
}
`;

  const cssContent = `.section {
  width: 100%;
  padding: 4rem 2rem;
  background-color: var(--color-background, #fdfcfb);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.container {
  width: 100%;
  max-width: 400px;
  text-align: center;
  padding: 2rem;
  border: 1px dashed var(--color-primary, #d4a373);
  border-radius: 8px;
}

.title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text-primary, #333);
  margin-bottom: 1rem;
}

.placeholder {
  font-size: 0.95rem;
  color: var(--color-text-secondary, #666);
}
`;

  const indexContent = `export { default as ${name} } from './${name}';\n`;

  fs.writeFileSync(path.join(dirPath, `${name}.tsx`), tsxContent);
  fs.writeFileSync(path.join(dirPath, `${name}.module.css`), cssContent);
  fs.writeFileSync(path.join(dirPath, 'index.ts'), indexContent);
  console.log(`Scaffolded ${name}`);
});
