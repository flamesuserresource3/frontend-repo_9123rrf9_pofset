import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle, Sparkles } from 'lucide-react';

const initialBank = [
  { id: 1, chapter: 1, number: 1, kanji: '日', hiragana: 'ひ', meaning: 'sun; day' },
  { id: 2, chapter: 1, number: 2, kanji: '月', hiragana: 'つき', meaning: 'moon; month' },
  { id: 3, chapter: 1, number: 3, kanji: '山', hiragana: 'やま', meaning: 'mountain' },
  { id: 4, chapter: 1, number: 4, kanji: '川', hiragana: 'かわ', meaning: 'river' },
];

const modes = [
  { key: 'k2m', label: 'Kanji → Meaning' },
  { key: 'm2k', label: 'Meaning → Kanji' },
  { key: 'k2h', label: 'Kanji → Hiragana' },
  { key: 'k2hm', label: 'Kanji → Hiragana + Meaning' },
];

const QuizMode = () => {
  const [selectedChapters, setSelectedChapters] = useState([1]);
  const [mode, setMode] = useState('k2m');
  const [count, setCount] = useState(10);
  const [stage, setStage] = useState('config');
  const [index, setIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [answer, setAnswer] = useState('');
  const [history, setHistory] = useState([]);

  const pool = useMemo(() => initialBank.filter(i => selectedChapters.includes(i.chapter)), [selectedChapters]);
  const questions = useMemo(() => {
    const arr = [...pool];
    // Simple shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr.slice(0, Math.min(count, arr.length));
  }, [pool, count, mode]);

  const current = questions[index];

  const getPrompt = (q) => {
    switch (mode) {
      case 'k2m': return q.kanji;
      case 'm2k': return q.meaning;
      case 'k2h': return q.kanji;
      case 'k2hm': return q.kanji;
      default: return q.kanji;
    }
  };
  const getCorrect = (q) => {
    switch (mode) {
      case 'k2m': return q.meaning;
      case 'm2k': return q.kanji;
      case 'k2h': return q.hiragana;
      case 'k2hm': return `${q.hiragana} • ${q.meaning}`;
      default: return q.meaning;
    }
  };

  const submit = () => {
    if (!current) return;
    const correct = getCorrect(current).toLowerCase().replace(/\s+/g,'').trim();
    const given = answer.toLowerCase().replace(/\s+/g,'').trim();
    const isRight = correct === given;
    setScore((s) => s + (isRight ? 1 : 0));
    setHistory((h) => [...h, { q: current, isRight, correct: getCorrect(current), given: answer }]);
    setAnswer('');
    if (index + 1 < questions.length) setIndex(index + 1); else setStage('result');
  };

  return (
    <section id="quiz" className="py-12 md:py-16 bg-gradient-to-b from-white to-pink-50/60">
      <div className="max-w-5xl mx-auto px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-bold text-sky-900">Quiz Mode</h2>
          <div className="inline-flex items-center gap-2 text-pink-600">
            <Sparkles className="w-5 h-5"/>
            <span className="text-sm">Answer to earn cheers!</span>
          </div>
        </div>

        {stage === 'config' && (
          <div className="grid gap-6 md:grid-cols-3">
            <div className="p-4 bg-white/80 rounded-2xl shadow border">
              <h3 className="font-semibold text-sky-900 mb-2">Mode</h3>
              <div className="grid gap-2">
                {modes.map(m => (
                  <label key={m.key} className={`px-3 py-2 rounded-lg cursor-pointer border ${mode===m.key?'bg-pink-100 border-pink-300':'bg-white hover:bg-sky-50'}`}>
                    <input className="mr-2" type="radio" name="mode" value={m.key} checked={mode===m.key} onChange={()=>setMode(m.key)} />
                    {m.label}
                  </label>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl shadow border">
              <h3 className="font-semibold text-sky-900 mb-2">Chapters</h3>
              <div className="flex flex-wrap gap-2">
                {[1,2,3,4,5].map(ch => (
                  <button key={ch} onClick={() => setSelectedChapters((arr)=> arr.includes(ch) ? arr.filter(x=>x!==ch) : [...arr, ch])}
                          className={`px-3 py-1.5 rounded-full text-sm border ${selectedChapters.includes(ch) ? 'bg-sky-100 border-sky-300 text-sky-800' : 'bg-white hover:bg-sky-50'}`}>
                    Ch {ch}
                  </button>
                ))}
              </div>
            </div>

            <div className="p-4 bg-white/80 rounded-2xl shadow border">
              <h3 className="font-semibold text-sky-900 mb-2">Number of Questions</h3>
              <input type="range" min={5} max={20} value={count} onChange={(e)=>setCount(Number(e.target.value))} className="w-full" />
              <div className="mt-2 text-sm text-sky-700">{count} questions</div>
              <button onClick={()=>setStage('quiz')} className="mt-4 w-full bg-pink-500 hover:bg-pink-600 text-white font-semibold py-2 rounded-xl shadow">Start Quiz</button>
            </div>
          </div>
        )}

        {stage === 'quiz' && current && (
          <div className="p-6 bg-white/90 rounded-2xl shadow border">
            <div className="text-sm text-pink-600 mb-2">Question {index+1} / {questions.length}</div>
            <div className="text-3xl md:text-5xl text-sky-900 font-extrabold mb-4">{getPrompt(current)}</div>
            <input
              value={answer}
              onChange={(e)=>setAnswer(e.target.value)}
              placeholder="Type your answer"
              className="w-full px-4 py-3 rounded-xl border focus:ring-2 focus:ring-pink-300"
            />
            <div className="mt-4 flex gap-2">
              <button onClick={submit} className="bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-xl shadow">Submit</button>
              <button onClick={()=>{setStage('config'); setIndex(0); setScore(0); setHistory([]);}} className="bg-white hover:bg-sky-50 px-4 py-2 rounded-xl border">Quit</button>
            </div>
          </div>
        )}

        {stage === 'result' && (
          <div className="p-6 bg-gradient-to-br from-white to-pink-50 rounded-2xl shadow border text-center">
            <div className="text-4xl md:text-5xl font-extrabold text-sky-900">Score: {score} / {questions.length}</div>
            <div className="mt-2 text-pink-600">Kira-chan: Great job! ぱちぱち〜 ✨</div>
            <div className="mt-6 grid gap-3 text-left">
              {history.map((h, i) => (
                <div key={i} className={`p-3 rounded-xl border flex items-center gap-3 ${h.isRight ? 'bg-sky-50 border-sky-200' : 'bg-pink-50 border-pink-200'}`}>
                  {h.isRight ? <CheckCircle2 className="w-5 h-5 text-sky-600"/> : <XCircle className="w-5 h-5 text-pink-600"/>}
                  <div className="flex-1">
                    <div className="text-sky-900 font-semibold">{h.q.kanji} — {h.q.meaning}</div>
                    {!h.isRight && (
                      <div className="text-sm text-sky-700">Your answer: <span className="font-medium">{h.given || '—'}</span> • Correct: <span className="font-medium">{h.correct}</span></div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <button onClick={()=>{setStage('config'); setIndex(0); setScore(0); setHistory([]);}} className="mt-6 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-5 py-2.5 rounded-xl shadow">Try Again</button>
          </div>
        )}
      </div>
    </section>
  );
};

export default QuizMode;
