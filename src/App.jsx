import React, { useEffect, useMemo, useState } from 'react';
import HeroCover from './components/HeroCover';
import FlashcardDeck from './components/FlashcardDeck';
import QuizMode from './components/QuizMode';
import Uploader from './components/Uploader';

function useKanjiData() {
  const KEY = 'kirakira_kanji';
  const [data, setData] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : { items: [], chapters: 13 };
    } catch {
      return { items: [], chapters: 13 };
    }
  });

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(data));
  }, [data]);

  return [data, setData];
}

export default function App() {
  const [data, setData] = useKanjiData();
  const items = useMemo(() => data.items || [], [data]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-pink-50">
      <HeroCover />

      <div className="max-w-6xl mx-auto px-6">
        <div className="mt-6 grid md:grid-cols-3 gap-3">
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow">
            <div className="text-sm text-sky-800"><span className="font-semibold">Chapters:</span> 13</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow">
            <div className="text-sm text-sky-800"><span className="font-semibold">Total Kanji:</span> {items.length}</div>
          </div>
          <div className="p-4 rounded-2xl bg-white/80 backdrop-blur border border-white/60 shadow">
            <div className="text-sm text-sky-800">Upload or quiz any time. Progress saves automatically.</div>
          </div>
        </div>
      </div>

      <FlashcardDeck items={items} />
      <QuizMode items={items} />
      <Uploader onData={setData} />

      <footer className="text-center text-xs text-sky-700/70 py-10">Made with love • KiraKira Kanji</footer>
    </div>
  );
}
