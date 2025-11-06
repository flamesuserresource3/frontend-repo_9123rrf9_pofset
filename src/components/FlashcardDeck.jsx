import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Play, Pause, ChevronLeft, ChevronRight, Edit3, UploadCloud } from 'lucide-react';

function speak(text) {
  if (!('speechSynthesis' in window)) return;
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ja-JP';
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utter);
}

function useImages() {
  const KEY = 'kirakira_images';
  const [images, setImages] = useState(() => {
    try {
      const raw = localStorage.getItem(KEY);
      return raw ? JSON.parse(raw) : {};
    } catch {
      return {};
    }
  });
  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(images));
  }, [images]);
  return [images, setImages];
}

export default function FlashcardDeck({ items = [] }) {
  const [images, setImages] = useImages();
  const [chapter, setChapter] = useState(1);
  const filtered = useMemo(() => items.filter(i => i.chapter === chapter), [items, chapter]);

  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [auto, setAuto] = useState(false);
  const [speed, setSpeed] = useState(1500); // ms per flip
  const timerRef = useRef(null);

  useEffect(() => { setIdx(0); setFlipped(false); }, [chapter, items]);

  useEffect(() => {
    if (flipped && filtered[idx]) {
      speak(filtered[idx].hira);
    }
  }, [flipped, idx, filtered]);

  useEffect(() => {
    if (!auto) { if (timerRef.current) clearInterval(timerRef.current); return; }
    if (!filtered.length) return;
    timerRef.current = setInterval(() => {
      setFlipped(f => !f);
      setIdx(i => {
        const next = (i + (flipped ? 1 : 0)) % filtered.length;
        return next;
      });
    }, speed);
    return () => clearInterval(timerRef.current);
  }, [auto, speed, filtered.length, flipped]);

  const current = filtered[idx];

  const onUploadImage = (file) => {
    if (!current) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImages(prev => ({ ...prev, [current.id || `${current.kanji}-${idx}`]: reader.result }));
    };
    reader.readAsDataURL(file);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="flex items-center justify-between gap-3 mb-4">
        <h2 className="text-2xl font-bold text-sky-900">Flashcard Mode</h2>
        <div className="flex items-center gap-2">
          <label className="text-sm text-sky-700/80">Chapter</label>
          <select value={chapter} onChange={(e)=>setChapter(Number(e.target.value))} className="rounded-xl border border-sky-200 px-3 py-2 bg-white">
            {Array.from({length:13}, (_,i)=>i+1).map(n=> (
              <option key={n} value={n}>Chapter {n}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr,280px] gap-6">
        <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-xl p-6 flex flex-col items-center">
          <div className="w-full flex items-center justify-between mb-4">
            <button onClick={()=>{setIdx(i=> (i-1+filtered.length)%filtered.length); setFlipped(false);}} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100"><ChevronLeft/></button>
            <div className="text-sky-700/80 text-sm">{filtered.length ? idx+1 : 0} / {filtered.length}</div>
            <button onClick={()=>{setIdx(i=> (i+1)%filtered.length); setFlipped(false);}} className="p-2 rounded-xl bg-sky-50 hover:bg-sky-100 border border-sky-100"><ChevronRight/></button>
          </div>

          <div className="relative w-full max-w-md aspect-[3/4] perspective">
            <div
              className={`relative w-full h-full transition-transform duration-500 [transform-style:preserve-3d] ${flipped ? 'rotate-y-180' : ''}`}
              onClick={() => setFlipped(f=>!f)}
            >
              {/* Front */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-sky-50 border border-sky-100 shadow-lg flex items-center justify-center [backface-visibility:hidden]">
                {current ? (
                  <div className="text-center">
                    <div className="absolute top-3 left-3 text-xs text-sky-500">#{current.number ?? ''}</div>
                    <div className="text-7xl md:text-8xl text-sky-900 drop-shadow-sm">{current.kanji}</div>
                  </div>
                ) : (
                  <div className="text-sky-600">No cards in this chapter yet.</div>
                )}
              </div>

              {/* Back */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white to-pink-50 border border-pink-100 shadow-lg rotate-y-180 [backface-visibility:hidden]">
                {current && (
                  <div className="w-full h-full p-5 flex flex-col">
                    <div className="flex items-start justify-between">
                      <div className="text-xs text-pink-500">#{current.number ?? ''}</div>
                      <label className="inline-flex items-center gap-2 text-xs text-sky-700/80 cursor-pointer">
                        <Edit3 size={14} /> Edit Image
                        <input type="file" accept="image/*" className="hidden" onChange={(e)=>{ const f=e.target.files?.[0]; if (f) onUploadImage(f); e.target.value=''; }} />
                      </label>
                    </div>
                    <div className="mt-4 text-3xl text-sky-900">{current.hira}</div>
                    <div className="text-sky-700/80">{current.meaning}</div>
                    {images[current.id || `${current.kanji}-${idx}`] && (
                      <img alt="illustration" src={images[current.id || `${current.kanji}-${idx}`]} className="mt-4 w-full h-40 object-cover rounded-xl border" />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3">
            <button onClick={()=>setAuto(a=>!a)} className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border shadow ${auto ? 'bg-sky-600 text-white border-sky-600' : 'bg-white border-sky-200 text-sky-800'}`}>
              {auto ? <Pause size={16}/> : <Play size={16}/>} Auto Play
            </button>
            <div className="flex items-center gap-2 text-sm text-sky-700/80">
              <span>Speed</span>
              <input type="range" min={800} max={4000} step={100} value={speed} onChange={(e)=>setSpeed(Number(e.target.value))} />
            </div>
          </div>
        </div>

        <aside className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-xl p-5">
          <h3 className="font-semibold text-sky-900 mb-2">Cards in Chapter {chapter}</h3>
          <div className="max-h-[420px] overflow-auto pr-2 space-y-2">
            {filtered.map((c, i) => (
              <button key={c.id || `${c.kanji}-${i}`} onClick={()=>{setIdx(i); setFlipped(false);}} className={`w-full text-left p-3 rounded-xl border transition ${i===idx ? 'bg-sky-50 border-sky-200' : 'bg-white border-sky-100 hover:bg-sky-50'}`}>
                <div className="text-xs text-sky-500">#{c.number ?? ''}</div>
                <div className="flex items-center justify-between"><div className="text-lg text-sky-900">{c.kanji}</div><div className="text-sm text-sky-700/70">{c.hira}</div></div>
              </button>
            ))}
            {!filtered.length && (
              <div className="text-sky-600 text-sm">Upload data to populate this chapter.</div>
            )}
          </div>
        </aside>
      </div>
    </section>
  );
}
