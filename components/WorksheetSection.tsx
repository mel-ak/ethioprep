
import React, { useState } from 'react';
import { Subject } from '../types';
import { SUBJECT_LIST } from '../constants';
import { generateWorksheet } from '../services/geminiService';
import { FileText, Loader2, Download, Search } from 'lucide-react';

const WorksheetSection: React.FC = () => {
  const [subject, setSubject] = useState<Subject>(Subject.MATH);
  const [topic, setTopic] = useState('');
  const [generating, setGenerating] = useState(false);
  const [worksheetContent, setWorksheetContent] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!topic.trim()) return;
    setGenerating(true);
    try {
      const content = await generateWorksheet(subject, topic);
      setWorksheetContent(content);
    } catch (err) {
      console.error(err);
    } finally {
      setGenerating(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Generate Practice Worksheet</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500">Select Subject</label>
            <select 
              value={subject}
              onChange={(e) => setSubject(e.target.value as Subject)}
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            >
              {SUBJECT_LIST.map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-500">Specific Topic</label>
            <input 
              type="text"
              placeholder="e.g. Calculus: Limits and Continuity"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              className="w-full p-3 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>
        <button 
          onClick={handleGenerate}
          disabled={generating || !topic}
          className="mt-6 w-full bg-blue-600 text-white font-bold py-3 rounded-xl shadow-lg shadow-blue-100 hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {generating ? <><Loader2 className="animate-spin" /> Generating...</> : <><Search size={20} /> Create Worksheet</>}
        </button>
      </div>

      {worksheetContent && (
        <div className="bg-white p-6 rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-6 pb-4 border-b">
            <div className="flex items-center gap-3">
              <div className="bg-blue-600 p-2 rounded-lg text-white">
                <FileText size={24} />
              </div>
              <div>
                <h3 className="font-bold text-xl">{topic}</h3>
                <p className="text-sm text-gray-500">{subject} Practice Worksheet</p>
              </div>
            </div>
            <button 
              onClick={() => window.print()}
              className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 rounded-lg font-semibold"
            >
              <Download size={20} /> Print / Save
            </button>
          </div>
          <div className="prose max-w-none prose-blue">
             {/* Using a simple formatter for Markdown-like text since we don't have a library in this specific environment's constraints, but standard practice would use react-markdown */}
             <div className="whitespace-pre-wrap text-gray-700 font-serif leading-relaxed">
               {worksheetContent}
             </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorksheetSection;
