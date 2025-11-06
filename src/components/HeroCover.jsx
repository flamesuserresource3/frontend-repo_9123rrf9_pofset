import React from 'react';
import Spline from '@splinetool/react-spline';
import { Rocket, Star } from 'lucide-react';

const HeroCover = () => {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-b-3xl shadow-xl">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/atN3lqky4IzF-KEP/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/10 via-pink-100/30 to-white/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-sky-200/30 via-transparent to-transparent" />

      <div className="relative z-10 h-full flex flex-col items-center justify-center text-center px-6">
        <div className="inline-flex items-center gap-2 bg-white/70 backdrop-blur rounded-full px-4 py-2 shadow-lg border border-white/60">
          <Star className="w-4 h-4 text-pink-500" />
          <span className="text-xs font-medium text-pink-600">Study • Play • Glow</span>
        </div>

        <h1 className="mt-4 text-3xl md:text-5xl font-extrabold tracking-tight text-sky-900 drop-shadow-sm">
          KiraKira Kanji — Learn with Anime Magic
        </h1>
        <p className="mt-3 md:mt-4 max-w-2xl text-sky-800/90 text-sm md:text-base">
          Flip cozy flashcards, take playful quizzes, and let our chibi mascot cheer you on. 613 Kanji across 13 colorful chapters.
        </p>

        <div className="mt-5 flex items-center gap-3">
          <a href="#flashcards" className="inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow-lg shadow-pink-400/40 transition-colors">
            <Rocket className="w-4 h-4" /> Start Flashcards
          </a>
          <a href="#quiz" className="inline-flex items-center gap-2 bg-white/80 hover:bg-white text-sky-700 font-semibold px-5 py-2.5 rounded-xl shadow-lg border border-white/70 transition">
            Take a Quiz
          </a>
        </div>
      </div>

      <div className="absolute bottom-4 right-4 md:right-8 md:bottom-6 z-10">
        <div className="relative">
          <div className="bg-white/90 backdrop-blur rounded-2xl p-3 shadow-lg border border-white/70 max-w-[220px]">
            <p className="text-sm text-sky-800">
              こんにちは! I'm Kira-chan! Flip a card and I’ll read it for you ✨
            </p>
          </div>
          <div className="mt-2 w-16 h-16 rounded-full bg-gradient-to-br from-pink-300 to-sky-300 border-2 border-white shadow-lg flex items-center justify-center text-2xl">
            🐣
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroCover;
