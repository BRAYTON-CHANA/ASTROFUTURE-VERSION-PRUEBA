'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/context/language-context';
import { ORBIT_PRESETS } from '@/lib/orbital-data-presets';
import { OrbitCard } from '@/components/orbits/orbit-card';

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
            <Link href="/explorer">
                <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
                  {t('home.hero.cta')}
                </Button>
            </Link>
          </div>
        </section>

        <section id="space-debris" className="py-12 md:py-20">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">{t('home.spaceDebris.title')}</h2>
            <div className="space-y-16">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-white">Placeholder for Asteroid</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">{t('home.spaceDebris.asteroid.title')}</h3>
                  <p className="text-gray-400">{t('home.spaceDebris.asteroid.text')}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center md:order-last">
                  <p className="text-white">Placeholder for Meteoroid</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">{t('home.spaceDebris.meteoroid.title')}</h3>
                  <p className="text-gray-400">{t('home.spaceDebris.meteoroid.text')}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center">
                  <p className="text-white">Placeholder for Meteor</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">{t('home.spaceDebris.meteor.title')}</h3>
                  <p className="text-gray-400">{t('home.spaceDebris.meteor.text')}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="w-full h-64 bg-gray-700 rounded-lg flex items-center justify-center md:order-last">
                  <p className="text-white">Placeholder for Meteorite</p>
                </div>
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold mb-4">{t('home.spaceDebris.meteorite.title')}</h3>
                  <p className="text-gray-400">{t('home.spaceDebris.meteorite.text')}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="orbit-types" className="py-12 md:py-20 bg-gray-900">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">{t('home.orbitTypes.title')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                <OrbitCard orbitalData={ORBIT_PRESETS.Amor} name="Amor Example" />
                <h3 className="text-2xl font-bold mb-3 mt-6">{t('home.orbitTypes.amor.title')}</h3>
                <p className="text-gray-400">{t('home.orbitTypes.amor.text')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                <OrbitCard orbitalData={ORBIT_PRESETS.Apollo} name="Apollo Example" />
                <h3 className="text-2xl font-bold mb-3 mt-6">{t('home.orbitTypes.apollo.title')}</h3>
                <p className="text-gray-400">{t('home.orbitTypes.apollo.text')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                <OrbitCard orbitalData={ORBIT_PRESETS.Aten} name="Aten Example" />
                <h3 className="text-2xl font-bold mb-3 mt-6">{t('home.orbitTypes.aten.title')}</h3>
                <p className="text-gray-400">{t('home.orbitTypes.aten.text')}</p>
              </div>
              <div className="flex flex-col items-center text-center p-6 bg-gray-800 rounded-lg">
                <OrbitCard orbitalData={ORBIT_PRESETS.Atira} name="Atira Example" />
                <h3 className="text-2xl font-bold mb-3 mt-6">{t('home.orbitTypes.atira.title')}</h3>
                <p className="text-gray-400">{t('home.orbitTypes.atira.text')}</p>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
