import React, { useEffect, useState } from 'react';
import HeroCover from './components/HeroCover';
import FlashcardDeck from './components/FlashcardDeck';
import QuizMode from './components/QuizMode';
import Uploader from './components/Uploader';

function App() {
  const [data, setData] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('kirakira_kanji');
    if (saved) {
      try { setData(JSON.parse(saved)); } catch {}
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-sky-50 via-white to-pink-50 text-sky-900">
      <HeroCover />
      <main className="space-y-8 md:space-y-12">
        <FlashcardDeck />
        <QuizMode />
        <Uploader onData={setData} />
      </main>
      <footer className="py-10 text-center text-sm text-sky-700">
        Made with pastel vibes • KiraKira Kanji ✨
      </footer>
    </div>
  );
}

export default App;
