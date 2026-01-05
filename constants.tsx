
import React from 'react';
import { 
  BookOpen, 
  Atom, 
  FlaskConical, 
  Dna, 
  BrainCircuit, 
  Languages, 
  Scale, 
  Globe, 
  ScrollText,
  Calculator
} from 'lucide-react';
import { Subject } from './types.ts';

export const SUBJECT_METADATA: Record<Subject, { color: string; icon: React.ReactNode }> = {
  [Subject.MATH]: { color: 'bg-blue-500', icon: <Calculator className="w-6 h-6" /> },
  [Subject.PHYSICS]: { color: 'bg-purple-500', icon: <Atom className="w-6 h-6" /> },
  [Subject.CHEMISTRY]: { color: 'bg-emerald-500', icon: <FlaskConical className="w-6 h-6" /> },
  [Subject.BIOLOGY]: { color: 'bg-green-500', icon: <Dna className="w-6 h-6" /> },
  [Subject.APTITUDE]: { color: 'bg-amber-500', icon: <BrainCircuit className="w-6 h-6" /> },
  [Subject.ENGLISH]: { color: 'bg-indigo-500', icon: <Languages className="w-6 h-6" /> },
  [Subject.CIVICS]: { color: 'bg-red-500', icon: <Scale className="w-6 h-6" /> },
  [Subject.GEOGRAPHY]: { color: 'bg-cyan-500', icon: <Globe className="w-6 h-6" /> },
  [Subject.HISTORY]: { color: 'bg-orange-500', icon: <ScrollText className="w-6 h-6" /> },
};

export const SUBJECT_LIST = Object.values(Subject);
