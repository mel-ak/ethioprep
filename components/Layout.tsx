
import React from 'react';
import { BookOpen, Trophy, FileText, LayoutDashboard, Brain } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Layout: React.FC<LayoutProps> = ({ children, activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard size={20} /> },
    { id: 'practice', label: 'Practice Quiz', icon: <Brain size={20} /> },
    { id: 'worksheets', label: 'Worksheets', icon: <FileText size={20} /> },
    { id: 'solver', label: 'AI Solver', icon: <BookOpen size={20} /> },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-white border-b px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <h1 className="text-xl font-bold text-blue-600 flex items-center gap-2">
          <Trophy className="text-amber-500" /> EthioPrep
        </h1>
      </div>

      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r h-screen sticky top-0">
        <div className="p-6 border-b">
          <h1 className="text-2xl font-bold text-blue-600 flex items-center gap-2">
            <Trophy className="text-amber-500" /> EthioPrep
          </h1>
          <p className="text-xs text-gray-500 mt-1 uppercase tracking-wider font-semibold">Entrance Exam Prep</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                activeTab === item.id 
                  ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' 
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {item.icon}
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="bg-blue-50 rounded-xl p-4 text-sm text-blue-700">
            <p className="font-semibold mb-1">Success Mindset</p>
            <p className="text-xs opacity-80 italic">"The beautiful thing about learning is that no one can take it away from you."</p>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <div className="max-w-5xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>

      {/* Mobile Bottom Navigation */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t flex justify-around p-2 z-50">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex flex-col items-center gap-1 p-2 rounded-lg ${
              activeTab === item.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {item.icon}
            <span className="text-[10px] font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
    </div>
  );
};

export default Layout;
