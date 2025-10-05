'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ShieldAlert, Skull } from 'lucide-react';
import { useLanguage } from '@/context/language-context';
import Image from 'next/image';
import naveImg from '../../../assets/nave.png';

interface QuizMinigameProps {
  results: boolean[];
}

export function QuizMinigame({ results }: QuizMinigameProps) {
    const { t } = useLanguage();
    const correctAnswers = results.filter(Boolean).length;
    const totalQuestions = results.length;

    // Using the exact CSS animation logic you provided.
    const animationStyle = `
        @keyframes myAnimation {
            0%   { background-color: brown; top: 0px; }
            50%  { background-color: brown; top: 200px; }
            100% { background-color: brown; top: 0px; }
        }
    `;

    let resultState: 'perfect' | 'good' | 'bad' | 'lost' = 'lost';
    let message = '';
    let Icon = Skull;

    if (totalQuestions > 0) {
        if (correctAnswers === totalQuestions) {
            resultState = 'perfect';
            message = t('minigame.perfect');
            Icon = ShieldCheck;
        } else if (correctAnswers >= totalQuestions / 2) {
            resultState = 'good';
            message = t('minigame.good');
            Icon = ShieldAlert;
        } else if (correctAnswers > 0) {
            resultState = 'bad';
            message = t('minigame.bad');
            Icon = ShieldAlert;
        } else {
            resultState = 'lost';
            message = t('minigame.lost');
            Icon = Skull;
        }
    } else {
        message = t('minigame.no_results') || 'Play the quiz to see your result.';
        resultState = 'bad';
        Icon = ShieldAlert;
    }

    const iconColor = {
        perfect: 'text-green-500',
        good: 'text-yellow-500',
        bad: 'text-orange-500',
        lost: 'text-destructive',
    }[resultState];

    return (
        <div className="mt-8 p-6 rounded-lg bg-card/50 border border-border flex flex-col items-center gap-4">
            <style>{animationStyle}</style>

            <h3 className="text-2xl font-bold tracking-tight">{t('minigame.title')}</h3>
            <div className="relative w-full h-64 overflow-hidden flex items-center justify-center bg-[#21094E] rounded-lg border-2 border-border">
                {/* Background elements */}
                <div className="absolute top-0 left-0 w-full h-full opacity-50">
                    <div className="stars w-full h-full"></div>
                    <div className="stars-2 w-full h-full"></div>
                </div>
                <div className="absolute bottom-0 left-0 w-full h-8 bg-cyan-600/50 backdrop-blur-sm" />

                {/* Static Rocket */}
                <div className="absolute bottom-4 z-10">
                    <Image src={naveImg} alt="Pixel Rocket" width={64} height={80} />
                </div>

                {/* Meteors using your exact CSS animation spec */}
                {results.map((_, index) => (
                    <div
                        key={index}
                        style={{
                            position: 'absolute',
                            // This outer div handles the horizontal positioning
                            left: `${20 + index * 25}%`,
                        }}
                    >
                        <div 
                            style={{
                                width: '50px', // Adjusted size for visibility
                                height: '50px',
                                backgroundColor: 'brown',
                                position: 'relative', // As in your example, for the animation to work
                                animationName: 'myAnimation',
                                animationDuration: '4s',
                                animationDirection: 'reverse',
                                animationDelay: `${index * 1}s`,
                                animationFillMode: 'forwards',
                                animationIterationCount: 1, // Run the animation only once
                            }}
                        />
                    </div>
                ))}
            </div>

            {/* Result display */}
            <AnimatePresence>
                {totalQuestions > 0 && (
                    <motion.div
                        className="flex items-center gap-3 text-center"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1, duration: 0.5 }}
                    >
                        <Icon className={`w-8 h-8 ${iconColor}`} />
                        <p className={`text-xl font-semibold ${iconColor}`}>{message}</p>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}
