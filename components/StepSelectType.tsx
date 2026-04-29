'use client';

import type { QuizType, InputType } from '@/lib/types';

interface Props {
  source: { inputType: InputType; file?: File; text?: string };
  onSelect: (type: QuizType) => void;
  onBack: () => void;
}

export default function StepSelectType({ source, onSelect, onBack }: Props) {
  const sourceLabel =
    source.inputType === 'pdf' ? source.file?.name : source.text!.slice(0, 40) + '…';

  return (
    <div>
      <button
        onClick={onBack}
        className="font-mono text-xs text-neutral-500 mb-4 hover:text-ink"
      >
        ← 뒤로
      </button>

      <div className="border-2 border-ink bg-white p-3 mb-6 flex items-center gap-3">
        <span className="font-mono text-xs px-2 py-1 bg-ink text-paper">
          {source.inputType.toUpperCase()}
        </span>
        <span className="text-sm truncate flex-1">{sourceLabel}</span>
      </div>

      <h2 className="font-medium text-lg text-ink mb-1">어떤 유형으로 풀까요?</h2>
      <p className="text-sm text-neutral-500 mb-5">
        유형을 선택하면 문제 수를 고를 수 있어요
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <button
          onClick={() => onSelect('multiple_choice')}
          className="border-2 border-ink bg-white py-12 px-6 hover:bg-ink hover:text-paper group transition flex flex-col items-center justify-center"
        >
          <p className="font-medium text-3xl mb-2">객관식</p>
          <p className="font-mono text-xs text-neutral-500 group-hover:text-neutral-300">
            Multiple Choice
          </p>
        </button>

        <button
          onClick={() => onSelect('ox')}
          className="border-2 border-ink bg-white py-12 px-6 hover:bg-ink hover:text-paper group transition flex flex-col items-center justify-center"
        >
          <p className="font-medium text-3xl mb-2">OX 퀴즈</p>
          <p className="font-mono text-xs text-neutral-500 group-hover:text-neutral-300">
            True or False
          </p>
        </button>
      </div>
    </div>
  );
}
