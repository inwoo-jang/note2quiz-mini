'use client';

import { useState } from 'react';
import type { QuizType, QuizCount } from '@/lib/types';

interface Props {
  quizType: QuizType;
  onConfirm: (count: QuizCount) => void;
  onClose: () => void;
}

export default function CountModal({ quizType, onConfirm, onClose }: Props) {
  const [count, setCount] = useState<QuizCount>(5);
  const label = quizType === 'multiple_choice' ? '객관식' : 'OX 퀴즈';

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
      onClick={onClose}
    >
      <div
        className="bg-white border-2 border-ink w-full max-w-sm"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="border-b-2 border-ink px-5 py-3 flex justify-between items-center bg-ink text-paper">
          <span className="font-mono text-xs">SELECT COUNT</span>
          <button onClick={onClose} className="font-mono text-sm hover:opacity-60">
            ✕
          </button>
        </header>

        <div className="p-5">
          <p className="font-mono text-xs text-neutral-500 mb-1">선택한 유형</p>
          <p className="font-medium text-lg mb-5">{label}</p>

          <p className="text-sm font-medium mb-3">몇 문제로 풀까요?</p>
          <div className="grid grid-cols-3 gap-2 mb-6">
            {([5, 10, 20] as QuizCount[]).map((n) => (
              <button
                key={n}
                onClick={() => setCount(n)}
                className={`border-2 py-5 transition ${
                  count === n
                    ? 'border-ink bg-ink text-paper'
                    : 'border-neutral-300 bg-white hover:border-ink'
                }`}
              >
                <span className="text-2xl font-medium">{n}</span>
                <span className="block font-mono text-xs mt-1 opacity-70">문제</span>
              </button>
            ))}
          </div>

          <button
            onClick={() => onConfirm(count)}
            className="w-full py-3 border-2 border-ink bg-ink text-paper font-medium hover:bg-neutral-800"
          >
            시작하기 →
          </button>
        </div>
      </div>
    </div>
  );
}
