import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, Volume2, ChevronLeft, ChevronRight, Edit3 } from 'lucide-react';

const sampleKanji = [
  { id: 1, chapter: 1, number: 1, kanji: '日', hiragana: 'ひ', meaning: 'sun; day' },
  { id: 2, chapter: 1, number: 2, kanji: '月', hiragana: 'つき', meaning: 'moon; month' },
  { id: 3, chapter: 1, number: 3, kanji: '山', hiragana: 'やま', meaning: 'mountain' },
  { id: 4, chapter: 1, number: 4, kanji: '川', hiragana: 'かわ', meaning: 'river' },
];

function useSpeech() {
  const synth = typeof window !== 'undefined' ? window.speechSynthesis : null;
  const speak = (text) => {
    if (!synth) return;
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = 'ja-JP';
    utter.rate = 1;
    synth.cancel();
    synth.speak(utter);
  };
  return { speak };
}

const Flashcard = ({ card, flipped, onFlip, onEditImage }) => {
  return (
    <div className="relative w-full max-w-sm mx-auto aspect-[3/4] cursor-pointer [perspective:1000px]" onClick={onFlip}>
      <div className={`relative w-full h-full transition-transform duration-700 [transform-style:preserve-3d] ${flipped ? '[transform:rotateY(180deg)]' : ''}`}>
        <div className="absolute inset-0 bg-white rounded-2xl shadow-2xl border border-pink-100 flex flex-col items-center justify-center" style={{ backfaceVisibility: 'hidden' }}>
          <div className="absolute top-3 left-3 text-xs text-pink-600 bg-pink-50 rounded-md px-2 py-1 shadow">Ch {card.chapter} • {card.number}</div>
          <div className="text-7xl md:text-8xl text-sky-900 drop-shadow-sm">{card.kanji}</div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-br from-pink-50 to-sky-50 rounded-2xl shadow-2xl border border-sky-100 [transform:rotateY(180deg)] p-4 flex flex-col" style={{ backfaceVisibility: 'hidden' }}>
          <div className="flex-1 flex flex-col items-center justify-center">
            <div className="text-3xl md:text-4xl text-sky-900 font-semibold">{card.hiragana}</div>
            <div className="mt-2 text-sky-700">{card.meaning}</div>
            {card.image && (
              <img src={card.image} alt="hint" className="mt-3 w-32 h-32 object-cover rounded-xl shadow" />
            )}
          </div>
          <div className="flex items-center justify-between gap-3">
            <button onClick={(e)=>{e.stopPropagation(); onEditImage(card);}} className="inline-flex items-center gap-2 text-sm bg-white/80 hover:bg-white px-3 py-2 rounded-lg border border-white shadow">
              <Edit3 className="w-4 h-4 text-pink-500"/> Edit
            </button>
            <div className="text-xs text-sky-600">Tap to flip</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FlashcardDeck = () => {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [speed, setSpeed] = useState(2.5); // seconds per card
  const [auto, setAuto] = useState(false);
  const [cards, setCards] = useState(sampleKanji);
  const timerRef = useRef(null);
  const fileRef = useRef(null);
  const { speak } = useSpeech();

  const current = cards[index];

  useEffect(() => {
    if (flipped && current?.hiragana) {
      speak(current.hiragana);
    }
  }, [flipped, index]);

  useEffect(() => {
    if (!auto) return;
    timerRef.current = setInterval(() => {
      setFlipped((f) => !f);
      setTimeout(() => {
        if (flipped) {
          setIndex((i) => (i + 1) % cards.length);
        }
      }, (speed * 1000) / 2);
    }, speed * 1000);
    return () => clearInterval(timerRef.current);
  }, [auto, speed, flipped, cards.length]);

  const go = (dir) => {
    setFlipped(false);
    setIndex((i) => {
      if (dir === 'prev') return (i - 1 + cards.length) % cards.length;
      return (i + 1) % cards.length;
    });
  };

  const onEditImage = () => {
    if (!fileRef.current) return;
    fileRef.current.click();
  };

  const onFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setCards((prev) => prev.map((c, i) => i === index ? { ...c, image: reader.result } : c));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section id="flashcards" className="relative py-10 md:py-14">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-900">Flashcard Mode</h2>
          <div className="flex items-center gap-2">
            <button onClick={() => setAuto((a)=>!a)} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-white shadow transition ${auto ? 'bg-pink-600' : 'bg-pink-500 hover:bg-pink-600'}`}>
              {auto ? <Pause className="w-4 h-4"/> : <Play className="w-4 h-4"/>}
              Auto Play
            </button>
            <div className="flex items-center gap-2 bg-white/80 px-3 py-2 rounded-lg border border-white shadow">
              <Volume2 className="w-4 h-4 text-sky-600"/>
              <input aria-label="Speed" type="range" min="1" max="5" step="0.5" value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} />
              <span className="text-xs text-sky-700">{speed}s</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-[auto_1fr_auto] items-center">
          <button onClick={()=>go('prev')} className="justify-self-center md:justify-self-start inline-flex items-center gap-2 bg-white/90 hover:bg-white px-3 py-2 rounded-xl shadow border"><ChevronLeft className="w-5 h-5 text-sky-700"/></button>
          {current && (
            <Flashcard
              card={current}
              flipped={flipped}
              onFlip={() => setFlipped((f)=>!f)}
              onEditImage={onEditImage}
            />
          )}
          <button onClick={()=>go('next')} className="justify-self-center md:justify-self-end inline-flex items-center gap-2 bg-white/90 hover:bg-white px-3 py-2 rounded-xl shadow border"><ChevronRight className="w-5 h-5 text-sky-700"/></button>
        </div>

        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onFileChange} />

        <p className="mt-4 text-center text-sm text-sky-700">Tap the card to flip • Add your own image on the back</p>
      </div>
    </section>
  );
};

export default FlashcardDeck;
