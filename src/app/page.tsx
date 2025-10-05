'use client';
import { Button } from '@/components/ui/button';
import { ArrowDown } from 'lucide-react';
import { useLanguage } from '@/context/language-context';

export default function Home() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground">
      <main className="flex-1">
        <section id="hero" className="relative h-[calc(100vh-4rem)] flex items-center justify-center text-center overflow-hidden bg-gray-900">
          <div className="relative z-20 p-4 max-w-4xl">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter text-white mb-4">{t('home.hero.title')}</h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8">
              {t('home.hero.subtitle')}
            </p>
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              {t('home.hero.cta')}
              <ArrowDown className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </section>
      </main>
    </div>
  );
}
