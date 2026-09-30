'use client';

import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';

interface FunnelContextType {
  answers: Record<string, string | string[]>;
  setSingleAnswer: (id: string, value: string) => void;
  toggleMultiAnswer: (id: string, value: string, checked: boolean) => void;
  name: string;
  setName: (name: string) => void;
  email: string;
  setEmail: (email: string) => void;
  marketing: boolean | null;
  setMarketing: (marketing: boolean | null) => void;
  wheel: 'idle' | 'spinning' | 'won';
  setWheel: (wheel: 'idle' | 'spinning' | 'won') => void;
  offerSeconds: number;
  setOfferSeconds: React.Dispatch<React.SetStateAction<number>>;
  score: number;
  displayName: string;
  resultGoal: string;
  priorities: string;
}

const FunnelContext = createContext<FunnelContextType | null>(null);

export function FunnelProvider({ children }: { children: React.ReactNode }) {
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [marketing, setMarketing] = useState<boolean | null>(null);
  const [wheel, setWheel] = useState<'idle' | 'spinning' | 'won'>('idle');
  const [offerSeconds, setOfferSeconds] = useState(900);
  const [hydrated, setHydrated] = useState(false);

  // Restore from sessionStorage on initial client mount
  useEffect(() => {
    try {
      const savedAnswers = sessionStorage.getItem('destrava-answers');
      if (savedAnswers) setAnswers(JSON.parse(savedAnswers));
      const savedName = sessionStorage.getItem('destrava-name');
      if (savedName) setName(savedName);
      const savedEmail = sessionStorage.getItem('destrava-email');
      if (savedEmail) setEmail(savedEmail);
      const savedWheel = sessionStorage.getItem('destrava-wheel');
      if (savedWheel === 'won' || savedWheel === 'spinning' || savedWheel === 'idle') {
        setWheel(savedWheel);
      }
    } catch {}
    setHydrated(true);
  }, []);

  // Sync to sessionStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      sessionStorage.setItem('destrava-answers', JSON.stringify(answers));
      sessionStorage.setItem('destrava-name', name);
      sessionStorage.setItem('destrava-email', email);
      sessionStorage.setItem('destrava-wheel', wheel);
    } catch {}
  }, [answers, name, email, wheel, hydrated]);

  const setSingleAnswer = (id: string, value: string) => {
    setAnswers(prev => ({ ...prev, [id]: value }));
  };

  const toggleMultiAnswer = (id: string, value: string, checked: boolean) => {
    setAnswers(prev => {
      const list = Array.isArray(prev[id]) ? (prev[id] as string[]) : [];
      const exclusive = value.startsWith('Nenhum');
      return {
        ...prev,
        [id]: checked
          ? exclusive
            ? [value]
            : [...list.filter(x => !x.startsWith('Nenhum')), value]
          : list.filter(x => x !== value),
      };
    });
  };

  const score = useMemo(() => {
    const negative = [
      'Frequentemente',
      'Sim',
      'Quase todos os dias',
      'Baixa durante quase todo o dia',
      'Há mais de 1 ano',
    ];
    let n = 0;
    Object.values(answers).forEach(v => {
      if (Array.isArray(v)) n += Math.min(v.length, 4);
      else if (negative.some(x => v.includes(x))) n += 2;
      else n += 1;
    });
    return Math.min(88, 45 + n);
  }, [answers]);

  const displayName = useMemo(() => {
    const trimmed = name.trim();
    return trimmed
      ? trimmed.charAt(0).toUpperCase() + trimmed.slice(1).toLowerCase()
      : 'Você';
  }, [name]);

  const resultGoal = useMemo(() => {
    return typeof answers.goal === 'string'
      ? answers.goal
      : 'sentir seu corpo mais leve';
  }, [answers.goal]);

  const priorities = useMemo(() => {
    return Array.isArray(answers.priorities)
      ? answers.priorities.slice(0, 2).join(' e ').toLowerCase()
      : 'ter mais disposição';
  }, [answers.priorities]);

  return (
    <FunnelContext.Provider
      value={{
        answers,
        setSingleAnswer,
        toggleMultiAnswer,
        name,
        setName,
        email,
        setEmail,
        marketing,
        setMarketing,
        wheel,
        setWheel,
        offerSeconds,
        setOfferSeconds,
        score,
        displayName,
        resultGoal,
        priorities,
      }}
    >
      {children}
    </FunnelContext.Provider>
  );
}

export function useFunnel() {
  const context = useContext(FunnelContext);
  if (!context) {
    throw new Error('useFunnel must be used within a FunnelProvider');
  }
  return context;
}
