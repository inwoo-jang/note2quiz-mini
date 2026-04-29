'use client';

import { useState } from 'react';
import type { Quiz, MultipleChoiceQuiz, OXQuiz } from '@/lib/types';

interface CardProps<T> {
  quiz: T;
  index: number;
  total: number;
}

export function MCCard({ quiz, index, total }: CardProps<MultipleChoiceQuiz>) {
  const [selected, setSelected] = useState<number | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <article
      className="border-2 border-ink bg-white opacity-0"
      style={{ animation: `slideIn 0.4s ease-out ${index * 60}ms forwards` }}
    >
      <header className="border-b-2 border-ink px-5 py-2 flex justify-between items-center bg-ink text-paper">
        <span className="font-mono text-xs">Q{index + 1} · 객관식</span>
        <span className="font-mono text-xs">{index + 1} / {total}</span>
      </header>
      <div className="p-5">
        <h3 className="font-medium text-base leading-snug mb-4">{quiz.question}</h3>
        <div className="space-y-2">
          {quiz.options.map((opt, i) => {
            const isCorrect = i === quiz.answer_index;
            const isSelected = selected === i;
            const showResult = revealed;
            return (
              <button
                key={i}
                onClick={() => {
                  if (revealed) return;
                  setSelected(i);
                  setRevealed(true);
                }}
                className={`w-full border-2 px-4 py-3 text-left text-sm transition flex items-start gap-3 ${
                  showResult && isCorrect
                    ? 'border-ink bg-ink text-paper'
                    : showResult && isSelected && !isCorrect
                    ? 'border-accent bg-accentSoft'
                    : 'border-neutral-300 bg-white hover:border-ink'
                }`}
              >
                <span className="font-mono text-xs">{String.fromCharCode(65 + i)}</span>
                <span className="flex-1">{opt}</span>
                {showResult && isCorrect && <span className="font-mono text-xs">✓</span>}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="mt-4 border-t-2 border-dashed border-neutral-300 pt-4 text-sm leading-relaxed animate-fade-in">
            <span className="font-mono text-xs text-accent mr-2">▸ 해설</span>
            {quiz.explanation}
          </div>
        )}
      </div>
    </article>
  );
}

export function OXCard({ quiz, index, total }: CardProps<OXQuiz>) {
  const [selected, setSelected] = useState<'O' | 'X' | null>(null);
  const [revealed, setRevealed] = useState(false);

  return (
    <article
      className="border-2 border-ink bg-white opacity-0"
      style={{ animation: `slideIn 0.4s ease-out ${index * 60}ms forwards` }}
    >
      <header className="border-b-2 border-ink px-5 py-2 flex justify-between items-center bg-ink text-paper">
        <span className="font-mono text-xs">Q{index + 1} · O/X</span>
        <span className="font-mono text-xs">{index + 1} / {total}</span>
      </header>
      <div className="p-5">
        <h3 className="font-medium text-base leading-snug mb-5">{quiz.statement}</h3>
        <div className="grid grid-cols-2 gap-2">
          {(['O', 'X'] as const).map((c) => {
            const isCorrect = c === quiz.answer;
            const isSelected = selected === c;
            const showResult = revealed;
            return (
              <button
                key={c}
                onClick={() => {
                  if (revealed) return;
                  setSelected(c);
                  setRevealed(true);
                }}
                className={`border-2 py-5 text-2xl font-mono transition ${
                  showResult && isCorrect
                    ? 'border-ink bg-ink text-paper'
                    : showResult && isSelected && !isCorrect
                    ? 'border-accent bg-accentSoft'
                    : 'border-neutral-300 bg-white hover:border-ink'
                }`}
              >
                {c}
              </button>
            );
          })}
        </div>
        {revealed && (
          <div className="mt-4 border-t-2 border-dashed border-neutral-300 pt-4 text-sm leading-relaxed animate-fade-in">
            <span className="font-mono text-xs text-accent mr-2">▸ 해설</span>
            {quiz.explanation}
          </div>
        )}
      </div>
    </article>
  );
}

interface QuizListProps {
  quizzes: Quiz[];
  onReset: () => void;
  quizType: 'multiple_choice' | 'ox';
  count: number;
}

export function QuizList({ quizzes, onReset, quizType, count }: QuizListProps) {
  return (
    <>
      <div className="flex justify-between items-center mb-5">
        <div>
          <p className="font-mono text-xs text-neutral-500 mb-1">
            QUIZ READY · {quizzes.length} ITEMS
          </p>
          <p className="text-sm font-medium">
            {quizType === 'multiple_choice' ? '객관식' : 'OX'} {count}문제를 풀어보세요
          </p>
        </div>
        <button
          onClick={onReset}
          className="font-mono text-xs border-2 border-ink px-3 py-2 hover:bg-ink hover:text-paper"
        >
          새 자료 ↻
        </button>
      </div>

      <div className="space-y-3">
        {quizzes.map((q, i) =>
          q.type === 'multiple_choice' ? (
            <MCCard key={i} quiz={q} index={i} total={quizzes.length} />
          ) : (
            <OXCard key={i} quiz={q} index={i} total={quizzes.length} />
          )
        )}
      </div>
    </>
  );
}
