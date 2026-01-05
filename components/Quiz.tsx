
import React, { useState, useEffect } from 'react';
import { Subject, Question } from '../types';
import { generateQuestions } from '../services/geminiService';
import { ChevronRight, ChevronLeft, Loader2, CheckCircle, XCircle, AlertCircle, RefreshCw, Trophy } from 'lucide-react';

interface QuizProps {
  subject: Subject;
  onClose: () => void;
}

const Quiz: React.FC<QuizProps> = ({ subject, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<number[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadQuestions = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await generateQuestions(subject, 5);
      if (data.length === 0) throw new Error("No questions generated");
      setQuestions(data);
      setSelectedAnswers(new Array(data.length).fill(-1));
    } catch (err) {
      setError("Failed to load questions. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadQuestions();
  }, [subject]);

  const handleSelect = (optionIndex: number) => {
    if (showResults) return;
    const updated = [...selectedAnswers];
    updated[currentIndex] = optionIndex;
    setSelectedAnswers(updated);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (currentIndex > 0) setCurrentIndex(prev => prev - 1);
  };

  const calculateScore = () => {
    return selectedAnswers.reduce((score, ans, idx) => {
      return ans === questions[idx].correctAnswerIndex ? score + 1 : score;
    }, 0);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 bg-white rounded-2xl border shadow-sm">
        <Loader2 className="w-12 h-12 text-blue-600 animate-spin mb-4" />
        <p className="text-gray-600 font-medium">Generating your entrance exam quiz...</p>
        <p className="text-sm text-gray-400 mt-2">Personalizing questions for {subject}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20 bg-white rounded-2xl border shadow-sm">
        <AlertCircle className="w-16 h-16 text-red-400 mx-auto mb-4" />
        <h3 className="text-xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h3>
        <p className="text-gray-600 mb-6">{error}</p>
        <div className="flex justify-center gap-4">
          <button onClick={onClose} className="px-6 py-2 border rounded-xl hover:bg-gray-50">Back</button>
          <button onClick={loadQuestions} className="px-6 py-2 bg-blue-600 text-white rounded-xl flex items-center gap-2">
            <RefreshCw size={18} /> Retry
          </button>
        </div>
      </div>
    );
  }

  if (showResults) {
    const score = calculateScore();
    const percentage = (score / questions.length) * 100;
    
    return (
      <div className="bg-white rounded-2xl border shadow-sm overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="bg-blue-600 p-8 text-white text-center">
          <Trophy className="w-16 h-16 mx-auto mb-4 text-amber-300" />
          <h2 className="text-3xl font-bold mb-2">Quiz Complete!</h2>
          <p className="text-blue-100">You scored {score} out of {questions.length}</p>
          <div className="mt-6 inline-block bg-white/20 backdrop-blur-sm px-8 py-3 rounded-full text-2xl font-bold">
            {percentage}%
          </div>
        </div>

        <div className="p-6 space-y-6">
          <h3 className="text-xl font-bold text-gray-800 border-b pb-4">Detailed Review</h3>
          {questions.map((q, idx) => (
            <div key={q.id} className="p-4 rounded-xl border bg-gray-50">
              <div className="flex items-start gap-3 mb-3">
                {selectedAnswers[idx] === q.correctAnswerIndex ? (
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1 shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-500 mt-1 shrink-0" />
                )}
                <div>
                  <p className="font-semibold text-gray-800">Q{idx + 1}: {q.questionText}</p>
                  <p className="text-sm mt-2">
                    <span className="text-gray-500">Your Answer:</span>{' '}
                    <span className={selectedAnswers[idx] === q.correctAnswerIndex ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
                      {q.options[selectedAnswers[idx]] || 'None'}
                    </span>
                  </p>
                  {selectedAnswers[idx] !== q.correctAnswerIndex && (
                    <p className="text-sm mt-1">
                      <span className="text-gray-500">Correct Answer:</span>{' '}
                      <span className="text-green-600 font-medium">{q.options[q.correctAnswerIndex]}</span>
                    </p>
                  )}
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg text-sm text-blue-800 border border-blue-100">
                    <p className="font-bold mb-1">Explanation:</p>
                    {q.explanation}
                  </div>
                </div>
              </div>
            </div>
          ))}

          <div className="flex justify-center pt-4">
            <button 
              onClick={onClose}
              className="px-10 py-3 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 shadow-lg shadow-blue-200"
            >
              Done Reviewing
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="bg-white rounded-2xl border shadow-sm flex flex-col min-h-[500px]">
      <div className="p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
            {subject}
          </span>
          <span className="text-gray-400 text-sm">Question {currentIndex + 1} of {questions.length}</span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600">Cancel</button>
      </div>

      <div className="flex-1 p-6 md:p-10">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-8 leading-relaxed">
          {currentQuestion.questionText}
        </h2>

        <div className="grid gap-4">
          {currentQuestion.options.map((option, idx) => (
            <button
              key={idx}
              onClick={() => handleSelect(idx)}
              className={`text-left p-5 rounded-xl border-2 transition-all flex items-center justify-between group ${
                selectedAnswers[currentIndex] === idx
                  ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-md'
                  : 'border-gray-100 hover:border-blue-200 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-4">
                <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border ${
                  selectedAnswers[currentIndex] === idx ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-500'
                }`}>
                  {String.fromCharCode(65 + idx)}
                </span>
                <span className="font-medium text-lg">{option}</span>
              </div>
              {selectedAnswers[currentIndex] === idx && <CheckCircle size={20} className="text-blue-600" />}
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 border-t bg-gray-50 rounded-b-2xl flex items-center justify-between sticky bottom-0">
        <button
          onClick={handleBack}
          disabled={currentIndex === 0}
          className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold disabled:opacity-30 text-gray-600"
        >
          <ChevronLeft size={20} /> Back
        </button>
        
        <button
          onClick={handleNext}
          disabled={selectedAnswers[currentIndex] === -1}
          className="flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 disabled:opacity-50 transition-all hover:bg-blue-700 active:scale-95"
        >
          {currentIndex === questions.length - 1 ? 'Finish Quiz' : 'Next Question'}
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Quiz;
