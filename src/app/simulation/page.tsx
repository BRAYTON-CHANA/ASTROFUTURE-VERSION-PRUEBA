'use client';

import { useLanguage } from '@/context/language-context';

export default function SimulationPage() {
  const { t } = useLanguage();

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tighter mb-8">{t('simulation.page.title')}</h1>
      <div className="w-full h-[80vh]">
        <iframe
          src="https://i-asimualcion.vercel.app/"
          className="w-full h-full"
          title="Google"
        ></iframe>
      </div>
    </div>
  );
}

