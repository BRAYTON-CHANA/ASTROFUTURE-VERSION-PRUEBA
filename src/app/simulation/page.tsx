'use client';

import { useLanguage } from '@/context/language-context';

export default function SimulationPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">{t('simulation.page.title')}</h1>
      <div className="text-center py-20 bg-background/50 rounded-lg border border-dashed border-border">
        <h3 className="text-xl font-semibold text-muted-foreground">{t('simulation.page.subtitle')}</h3>
        <p className="text-muted-foreground mt-2">{t('simulation.page.description')}</p>
      </div>
    </div>
  );
}
