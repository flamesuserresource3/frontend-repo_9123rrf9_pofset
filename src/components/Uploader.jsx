import React, { useMemo, useState } from 'react';
import { UploadCloud, CheckCircle2 } from 'lucide-react';

function parseLine(line) {
  // Accept formats like: 1. 魚（さかな）＝ Fish  OR  魚（さかな）＝ Fish
  // Returns { kanji, hira, meaning, number } or null
  if (!line) return null;
  const trimmed = line.trim();
  if (!trimmed) return null;

  // Extract optional leading number and dot
  let number = null;
  let rest = trimmed;
  const numMatch = trimmed.match(/^\s*(\d+)\s*[\.|\)|-]?\s*(.*)$/);
  if (numMatch) {
    const possibleRest = numMatch[2];
    const possibleNum = parseInt(numMatch[1], 10);
    // Only treat as a number if there's a kanji-like char later
    if (/[\u4E00-\u9FFF]/.test(possibleRest)) {
      number = possibleNum;
      rest = possibleRest.trim();
    }
  }

  // Expect pattern: KANJI（hira）＝ meaning
  const m = rest.match(/^(.*?)（(.*?)）\s*＝\s*(.*)$/);
  if (!m) return null;
  const kanji = m[1].trim();
  const hira = m[2].trim();
  const meaning = m[3].trim();
  return { kanji, hira, meaning, number };
}

export default function Uploader({ onData }) {
  const [text, setText] = useState('');
  const [preview, setPreview] = useState([]);
  const [saved, setSaved] = useState(false);

  const parsed = useMemo(() => {
    const lines = text.split(/\r?\n/);
    const items = [];
    for (const line of lines) {
      const item = parseLine(line);
      if (item) items.push(item);
    }
    return items;
  }, [text]);

  const handleSave = () => {
    if (!parsed.length) return;
    // Auto assign chapters by groups of ~50
    const withCh = parsed.map((it, idx) => ({
      ...it,
      chapter: Math.floor(idx / 50) + 1,
      id: `${it.kanji}-${idx}-${Date.now()}`,
    }));
    const data = {
      createdAt: Date.now(),
      chapters: 13,
      items: withCh,
    };
    localStorage.setItem('kirakira_kanji', JSON.stringify(data));
    setPreview(withCh.slice(0, 10));
    setSaved(true);
    onData?.(data);
  };

  return (
    <section className="max-w-6xl mx-auto px-6 py-8">
      <div className="bg-white/80 backdrop-blur rounded-3xl border border-white/60 shadow-xl p-6">
        <div className="flex items-start justify-between gap-4 flex-col md:flex-row">
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-sky-900 mb-2">Upload Kanji Data</h2>
            <p className="text-sky-700/80 mb-4">Paste lines like: 魚（さかな）＝ Fish. Numbers like "1." will be removed but shown on the card.</p>
          </div>
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-600 text-white shadow hover:bg-sky-700 active:scale-95 transition"
          >
            <UploadCloud size={18} /> Save & Apply
          </button>
        </div>
        <textarea
          value={text}
          onChange={(e) => { setText(e.target.value); setSaved(false);} }
          placeholder="1. 魚（さかな）＝ Fish\n2. 山（やま）＝ Mountain\n..."
          rows={8}
          className="w-full mt-4 rounded-2xl border border-sky-200 p-4 font-mono text-sm focus:outline-none focus:ring-2 focus:ring-pink-300"
        />
        <div className="mt-4 text-sm text-sky-700/80">Parsed: {parsed.length} items {saved && (<span className="inline-flex items-center gap-1 text-green-600"><CheckCircle2 size={16}/> Saved</span>)}</div>
        {preview.length > 0 && (
          <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-3">
            {preview.map((it) => (
              <div key={it.id} className="rounded-2xl border border-sky-100 bg-white p-3 shadow">
                <div className="text-xs text-sky-500">#{it.number ?? '-'}</div>
                <div className="text-2xl">{it.kanji}</div>
                <div className="text-sm text-sky-700/80">{it.hira}</div>
                <div className="text-xs text-sky-700/60">{it.meaning}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
