import React, { useRef, useState } from 'react';
import { UploadCloud, Save } from 'lucide-react';

function parseKanjiText(text) {
  const lines = text.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const items = [];
  let order = 1;
  for (const raw of lines) {
    // Remove leading numbering like "1. ", keep it as number
    const m = raw.match(/^\s*(\d+)\.?\s*(.*)$/);
    let number = null;
    let rest = raw;
    if (m) {
      number = parseInt(m[1], 10);
      rest = m[2];
    }
    // Pattern: 魚（さかな）＝ Fish
    const m2 = rest.match(/^(.+?)（(.+?)）\s*[=＝]\s*(.+)$/);
    if (m2) {
      const kanji = m2[1].trim();
      const hira = m2[2].trim();
      const meaning = m2[3].trim();
      items.push({ id: order, chapter: Math.ceil(order / 50), number: number ?? order, kanji, hiragana: hira, meaning });
      order++;
    }
  }
  return items;
}

const Uploader = ({ onData }) => {
  const [text, setText] = useState('1. 魚（さかな）＝ Fish\n2. 月（つき）＝ Moon\n3. 山（やま）＝ Mountain');
  const [parsed, setParsed] = useState([]);

  const handleParse = () => {
    const items = parseKanjiText(text);
    setParsed(items);
    if (onData) onData(items);
    localStorage.setItem('kirakira_kanji', JSON.stringify(items));
  };

  return (
    <section className="py-12" id="upload">
      <div className="max-w-5xl mx-auto px-6">
        <h2 className="text-2xl md:text-3xl font-bold text-sky-900 mb-4">Upload Kanji Data</h2>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white/90 rounded-2xl border shadow p-4">
            <textarea
              value={text}
              onChange={(e)=>setText(e.target.value)}
              className="w-full h-48 md:h-64 p-3 rounded-xl border focus:ring-2 focus:ring-pink-300"
              placeholder="魚（さかな）＝ Fish"
            />
            <button onClick={handleParse} className="mt-3 inline-flex items-center gap-2 bg-pink-500 hover:bg-pink-600 text-white font-semibold px-4 py-2 rounded-xl shadow">
              <UploadCloud className="w-4 h-4"/> Parse & Save
            </button>
            <p className="mt-2 text-sm text-sky-700">Data is split into chapters of 50 in upload order and saved for future sessions.</p>
          </div>
          <div className="bg-gradient-to-br from-sky-50 to-pink-50 rounded-2xl border p-4">
            <h3 className="font-semibold text-sky-900 mb-2">Preview</h3>
            <div className="grid gap-2 max-h-64 overflow-auto pr-2">
              {parsed.map((i)=> (
                <div key={i.id} className="flex items-center justify-between bg-white rounded-xl border p-2">
                  <div>
                    <div className="text-xs text-pink-600">Ch {i.chapter} • {i.number}</div>
                    <div className="text-sky-900 font-semibold">{i.kanji}（{i.hiragana}）— {i.meaning}</div>
                  </div>
                  <div className="text-xl">✨</div>
                </div>
              ))}
              {!parsed.length && <div className="text-sky-700 text-sm">Your parsed items will appear here.</div>}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Uploader;
