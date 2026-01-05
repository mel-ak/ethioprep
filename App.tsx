
import React, { useState } from 'react';
import Layout from './components/Layout';
import Quiz from './components/Quiz';
import WorksheetSection from './components/WorksheetSection';
import AISolver from './components/AISolver';
import { Subject } from './types';
import { SUBJECT_METADATA, SUBJECT_LIST } from './constants';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell
} from 'recharts';
import { ArrowUpRight, TrendingUp, Clock, Target, ArrowRight } from 'lucide-react';

const mockChartData = [
  { name: 'Week 1', score: 65 },
  { name: 'Week 2', score: 72 },
  { name: 'Week 3', score: 68 },
  { name: 'Week 4', score: 85 },
];

const mockSubjectPerformance = [
  { subject: 'Math', score: 85, color: '#3b82f6' },
  { subject: 'Physics', score: 70, color: '#a855f7' },
  { subject: 'English', score: 92, color: '#6366f1' },
  { subject: 'Aptitude', score: 78, color: '#f59e0b' },
];

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [activeQuizSubject, setActiveQuizSubject] = useState<Subject | null>(null);

  const handleStartQuiz = (subject: Subject) => {
    setActiveTab('practice');
    setActiveQuizSubject(subject);
  };

  const Dashboard = () => (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Hello, Future Scholar! 👋</h2>
          <p className="text-gray-500 mt-1">Track your progress and get ready for the 2024/2025 Entrance Exams.</p>
        </div>
        <div className="flex items-center gap-3 bg-white px-4 py-2 rounded-full border shadow-sm">
          <Clock className="text-blue-500 w-5 h-5" />
          <span className="text-sm font-semibold text-gray-600">32 Days Until Exams</span>
        </div>
      </header>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {[
          { label: 'Overall Average', value: '78%', icon: <Target className="text-blue-600" />, trend: '+5%' },
          { label: 'Quizzes Taken', value: '24', icon: <TrendingUp className="text-emerald-600" />, trend: '+3' },
          { label: 'Study Streak', value: '12 Days', icon: <ArrowUpRight className="text-orange-600" />, trend: 'Best!' },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-2xl border shadow-sm flex items-start justify-between">
            <div>
              <p className="text-sm font-medium text-gray-500 mb-1">{stat.label}</p>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
            </div>
            <div className="flex flex-col items-end gap-1">
              <div className="p-2 rounded-lg bg-gray-50">{stat.icon}</div>
              <span className="text-xs font-bold text-emerald-600">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            Performance Trend
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={mockChartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Line type="monotone" dataKey="score" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4, fill: '#3b82f6' }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border shadow-sm">
          <h3 className="text-lg font-bold text-gray-800 mb-6">Subject Breakdown</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={mockSubjectPerformance} layout="vertical">
                <XAxis type="number" hide />
                <YAxis dataKey="subject" type="category" stroke="#94a3b8" fontSize={12} tickLine={false} axisLine={false} width={80} />
                <Tooltip cursor={{ fill: '#f8fafc' }} contentStyle={{ borderRadius: '12px' }} />
                <Bar dataKey="score" radius={[0, 4, 4, 0]} barSize={20}>
                  {mockSubjectPerformance.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Subjects Grid */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-gray-800">Available Subjects</h3>
          <button onClick={() => setActiveTab('practice')} className="text-sm font-semibold text-blue-600 hover:underline">View All</button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {SUBJECT_LIST.slice(0, 5).map(subject => (
            <button
              key={subject}
              onClick={() => handleStartQuiz(subject)}
              className="bg-white p-6 rounded-2xl border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all text-center group"
            >
              <div className={`mx-auto w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 ${SUBJECT_METADATA[subject].color}`}>
                {SUBJECT_METADATA[subject].icon}
              </div>
              <h4 className="font-bold text-gray-800 mb-1">{subject}</h4>
              <p className="text-xs text-gray-400">200+ Practice Q's</p>
            </button>
          ))}
        </div>
      </section>
    </div>
  );

  const PracticeArea = () => {
    if (activeQuizSubject) {
      return <Quiz subject={activeQuizSubject} onClose={() => setActiveQuizSubject(null)} />;
    }

    return (
      <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div>
          <h2 className="text-3xl font-black text-gray-900">Practice Hub</h2>
          <p className="text-gray-500 mt-1">Choose a subject to start a tailored entrance exam quiz.</p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {SUBJECT_LIST.map(subject => (
            <div key={subject} className="bg-white p-6 rounded-2xl border shadow-sm group hover:shadow-lg transition-all border-b-4" style={{ borderColor: SUBJECT_METADATA[subject].color.replace('bg-', '') }}>
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-6 ${SUBJECT_METADATA[subject].color}`}>
                {SUBJECT_METADATA[subject].icon}
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">{subject}</h3>
              <p className="text-sm text-gray-500 mb-6">Master core concepts, past paper analysis, and advanced problem solving for {subject}.</p>
              <button
                onClick={() => handleStartQuiz(subject)}
                className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-bold border-2 border-gray-100 hover:border-blue-600 hover:text-blue-600 group-hover:bg-blue-50 transition-all"
              >
                Start Quiz <ArrowRight size={18} />
              </button>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard': return <Dashboard />;
      case 'practice': return <PracticeArea />;
      case 'worksheets': return <WorksheetSection />;
      case 'solver': return <AISolver />;
      default: return <Dashboard />;
    }
  };

  return (
    <Layout activeTab={activeTab} setActiveTab={setActiveTab}>
      {renderContent()}
    </Layout>
  );
};

export default App;
