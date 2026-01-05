
import React, { useState } from 'react';
import { solveProblem } from '../services/geminiService';
import { Brain, Send, Loader2, Sparkles, MessageCircle } from 'lucide-react';

const AISolver: React.FC = () => {
  const [problem, setProblem] = useState('');
  const [solving, setSolving] = useState(false);
  const [solution, setSolution] = useState<string | null>(null);

  const handleSolve = async () => {
    if (!problem.trim()) return;
    setSolving(true);
    try {
      const result = await solveProblem(problem);
      setSolution(result);
    } catch (err) {
      console.error(err);
    } finally {
      setSolving(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-2xl border shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="bg-purple-100 text-purple-600 p-2 rounded-lg">
            <Sparkles size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">AI Problem Solver</h2>
            <p className="text-sm text-gray-500">Paste any entrance exam problem for a detailed explanation.</p>
          </div>
        </div>

        <div className="relative">
          <textarea
            value={problem}
            onChange={(e) => setProblem(e.target.value)}
            placeholder="e.g. A particle moves along a straight line with an acceleration of a = (4t - 3) m/s^2..."
            className="w-full h-40 p-4 rounded-xl border focus:ring-2 focus:ring-purple-500 outline-none text-gray-700 font-mono resize-none"
          />
          <div className="absolute bottom-4 right-4 text-xs text-gray-400">
            Markdown and LaTeX formulas supported
          </div>
        </div>

        <button 
          onClick={handleSolve}
          disabled={solving || !problem}
          className="mt-6 w-full bg-purple-600 text-white font-bold py-4 rounded-xl shadow-lg shadow-purple-100 hover:bg-purple-700 disabled:opacity-50 flex items-center justify-center gap-2 transition-all"
        >
          {solving ? <><Loader2 className="animate-spin" /> Solving Problem...</> : <><Brain size={20} /> Solve Now</>}
        </button>
      </div>

      {solution && (
        <div className="bg-white p-8 rounded-2xl border-l-8 border-l-purple-600 shadow-xl animate-in fade-in slide-in-from-left-4 duration-500">
          <div className="flex items-center gap-2 text-purple-700 font-bold mb-6 border-b pb-4">
            <MessageCircle size={24} />
            Expert Step-by-Step Solution
          </div>
          <div className="prose max-w-none">
            <div className="whitespace-pre-wrap text-gray-800 leading-relaxed space-y-4">
              {solution}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AISolver;
