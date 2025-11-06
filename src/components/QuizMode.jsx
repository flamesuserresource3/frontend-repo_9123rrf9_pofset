import React, { useMemo, useState } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';

const MODES = [
  { key: 'k2m', label: 'Kanji → Meaning', prompt: (i)=>i.kanji, answer: (i)=>i.meaning },
  { key: 'm2k', label: 'Meaning → Kanji', prompt: (i)=>i.meaning, answer: (i)=>i.kanji },
  { key: 'k2h', label: 'Kanji → Hiragana', prompt: (i)=>i.kanji, answer: (i)=>i.hira },
  { key: 'k2hm', label: 'Kanji → Hiragana + Meaning', prompt: (i)=>i.kanji, answer: (i)=>`${i.hira} — ${i.meaning}` },
];

function randPick(arr, n) {
  const copy = [...arr];
  const out = [];
  while (copy.length && out.length < n) {
    const idx = Math.floor(Math.random()*copy.length);
    out.push(copy.splice(idx,1)[0]);
  }
  return out;
}

export default function QuizMode({ items = [] }) {
  const [stage, setStage] = useState('config');
  const [mode, setMode] = useState('k2m');
  const [count, setCount] = useState(10);
  const [chapters, setChapters] = useState([1]);
  const [answers, setAnswers] = useState([]);

  const pool = useMemo(() => items.filter(i => chapters.includes(i.chapter)), [items, chapters]);

  const startQuiz = () => {
    const selected = randPick(pool, Math.min(count, pool.length));
    setAnswers(selected.map(it => ({ it, value: '', correct: null })));
    setStage('quiz');
  };

  const setChapterChecked = (ch, checked) => {
    setChapters(prev => checked ? Array.from(new Set([...prev, ch])) : prev.filter(x=>x!==ch));
  };

  const submit = () => {
    const modeDef = MODES.find(m=>m.key===mode);
    const checked = answers.map(a => {
      const expected = modeDef.answer(a.it).trim();
      const ok = a.value.trim() === expected;
      return { ...a, correct: ok, expected };
    });
    setAnswers(checked);
    setStage('result');
  };

  const correctCount = answers.filter(a=>a.correct).length;

  return (
    <section className="max-w-6xl mx-auto px-6 py-10">
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <h2 className="text-2xl font-bold text-sky-900">Quiz Mode</h2>
        </div>

        {stage === 'config' && (
          <div className="mt-6 grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-sky-800 mb-2">Quiz Type</label>
              <select value={mode} onChange={(e)=>setMode(e.target.value)} className="w-full rounded-xl border border-sky-200 px-3 py-2 bg-white">
                {MODES.map(m=>(<option key={m.key} value={m.key}>{m.label}</option>))}
              </select>

              <label className="block text-sm font-medium text-sky-800 mt-4 mb-2">Number of Questions</label>
              <input type="range" min={10} max={100} step={5} value={count} onChange={(e)=>setCount(Number(e.target.value))} className="w-full" />
              <div className="text-sm text-sky-700/80">{count} questions</div>
            </div>

            <div>
              <label className="block text-sm font-medium text-sky-800 mb-2">Chapters</label>
              <div className="grid grid-cols-3 gap-2">
                {Array.from({length:13}, (_,i)=>i+1).map(ch => (
                  <label key={ch} className="inline-flex items-center gap-2 p-2 rounded-xl border border-sky-200 bg-white cursor-pointer">
                    <input type="checkbox" checked={chapters.includes(ch)} onChange={(e)=>setChapterChecked(ch, e.target.checked)} />
                    <span>Ch {ch}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {stage === 'config' && (
          <div className="mt-6">
            <button onClick={startQuiz} disabled={!pool.length} className="px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700 disabled:opacity-50">Start Quiz</button>
            {!pool.length && <div className="text-sm text-sky-700/70 mt-2">No questions in the selected chapters. Upload data first.</div>}
          </div>
        )}

        {stage === 'quiz' && (
          <div className="mt-6 space-y-6">
            {answers.map((a, i) => (
              <div key={i} className="p-4 rounded-2xl border border-sky-100 bg-white">
                <div className="text-xs text-sky-500 mb-1">Q{i+1}</div>
                <div className="text-2xl text-sky-900 mb-2">{MODES.find(m=>m.key===mode)?.prompt(a.it)}</div>
                <input value={a.value} onChange={(e)=>{
                  const v=e.target.value; setAnswers(prev=> prev.map((x,j)=> j===i? {...x, value:v}:x));
                }} className="w-full rounded-xl border border-sky-200 px-3 py-2" placeholder="Type your answer" />
              </div>
            ))}

            <button onClick={submit} className="px-4 py-2 rounded-xl bg-pink-600 text-white shadow hover:bg-pink-700">Submit</button>
          </div>
        )}

        {stage === 'result' && (
          <div className="mt-6">
            <div className="text-xl font-semibold text-sky-900">Your Score: {correctCount} / {answers.length}</div>
            <div className="grid md:grid-cols-2 gap-3 mt-4">
              {answers.map((a,i)=> (
                <div key={i} className={`p-4 rounded-2xl border ${a.correct ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                  <div className="flex items-center gap-2 mb-2">
                    {a.correct ? <CheckCircle2 className="text-green-600"/> : <XCircle className="text-red-600"/>}
                    <div className="font-medium text-sky-900">{MODES.find(m=>m.key===mode)?.prompt(a.it)}</div>
                  </div>
                  {!a.correct && (
                    <div className="text-sm text-sky-800">
                      Your answer: <span className="font-medium">{a.value || '—'}</span>
                      <br/>
                      Correct: <span className="font-medium">{a.expected}</span>
                    </div>
                  )}
                  {a.correct && <div className="text-sm text-sky-700/80">Correct!</div>}
                </div>
              ))}
            </div>
            <div className="mt-4 flex items-center gap-2">
              <button onClick={()=>setStage('config')} className="px-4 py-2 rounded-xl bg-white border border-sky-200 shadow">New Quiz</button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
