'use client';

import { useEffect, useState } from 'react';
import Acorn from './Acorn';

const MESSAGES = [
  '강의노트를 읽는 중',
  '핵심 개념을 추출하는 중',
  '문제를 다듬는 중',
];

export default function StepLoading() {
  const [idx, setIdx] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setIdx((i) => (i + 1) % MESSAGES.length), 1500);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="border-2 border-ink bg-white py-20 flex flex-col items-center">
      <Acorn size={42} spinning />
      <p key={idx} className="mt-6 text-sm font-medium animate-fade-in">
        {MESSAGES[idx]}…
      </p>
      <div className="mt-3 font-mono text-xs text-neutral-500">
        GEMINI · PROCESSING
      </div>
    </div>
  );
}
