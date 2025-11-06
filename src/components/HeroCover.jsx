import React from 'react';
import Spline from '@splinetool/react-spline';
import { Sparkles, Star } from 'lucide-react';

export default function HeroCover() {
  return (
    <section className="relative w-full h-[60vh] md:h-[70vh] overflow-hidden rounded-b-3xl shadow-xl">
      <div className="absolute inset-0">
        <Spline
          scene="https://prod.spline.design/6YV3n3VWeNseyX2a/scene.splinecode"
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/60 via-white/30 to-white/80" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(255,182,193,0.25),_transparent_60%)]" />

      <div className="relative z-10 max-w-6xl mx-auto px-6 h-full flex flex-col items-start justify-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-pink-100 text-pink-700 text-xs font-medium shadow">
          <Sparkles size={16} />
          <span>Anime-style Kanji Trainer</span>
        </div>
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold tracking-tight text-sky-900">
          KiraKira Kanji
        </h1>
        <p className="mt-3 text-sky-700/80 max-w-2xl">
          Learn 613 Kanji across 13 cozy chapters with flashcards, quizzes, and your own uploads.
        </p>

        <div className="mt-6 inline-flex items-center gap-3 px-4 py-2 rounded-2xl bg-white/80 backdrop-blur shadow-lg border border-white/60">
          <Star className="text-yellow-500" size={18} />
          <span className="text-sm text-sky-800">Flip cards to hear hiragana pronounced automatically.</span>
        </div>
      </div>
    </section>
  );
}
