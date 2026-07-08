import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { useDirection } from '../hooks/useDirection';

export default function NotFound() {
  const { t } = useTranslation();
  const { isRTL } = useDirection();

  return (
    <section
      style={{
        fontFamily: 'cairo',
      }}
      className="flex min-h-screen items-center justify-center bg-background"
    >
      <div className="text-center">
        <p className="mb-4 font-mono text-2xl uppercase tracking-widest text-accent">
          404
        </p>
        <h1 className="mb-4 text-6xl font-bold lg:text-8xl">
          {t('errors.not_found.title')}
        </h1>
        <p className="mb-10 text-base text-muted-foreground">
          {t('errors.not_found.description')}
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-medium text-primary-foreground transition hover:opacity-80"
        >
          {t('errors.not_found.back_home')}
          <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
        </Link>
      </div>
    </section>
  );
}
