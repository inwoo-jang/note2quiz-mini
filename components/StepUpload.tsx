'use client';

import { useRef, useState } from 'react';
import type { InputType } from '@/lib/types';

const SAMPLE_TEXT = `광합성은 식물이 빛에너지를 화학에너지로 전환하는 과정이다. 엽록체 내부의 틸라코이드 막에서 빛을 흡수하는 명반응이 일어나 ATP와 NADPH를 생성하며, 스트로마에서는 이를 이용해 이산화탄소를 포도당으로 환원하는 암반응(캘빈 회로)이 진행된다. 광합성의 전체 화학식은 6CO₂ + 6H₂O → C₆H₁₂O₆ + 6O₂이다. 호흡은 광합성과 반대 방향의 반응으로, 산소를 소비하고 포도당을 분해해 ATP를 얻으며 이산화탄소와 물을 부산물로 배출한다.`;

interface Props {
  onSubmit: (data: { inputType: InputType; file?: File; text?: string }) => void;
}

export default function StepUpload({ onSubmit }: Props) {
  const [tab, setTab] = useState<InputType>('pdf');
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  const canSubmit = tab === 'pdf' ? !!file : text.trim().length >= 30;

  const handleSubmit = () => {
    if (!canSubmit) return;
    if (tab === 'pdf' && file) onSubmit({ inputType: 'pdf', file });
    else if (tab === 'text') onSubmit({ inputType: 'text', text });
  };

  return (
    <div>
      {/* 탭 */}
      <div className="grid grid-cols-2 border-2 border-ink">
        {([
          { key: 'pdf', label: 'PDF 업로드' },
          { key: 'text', label: '텍스트 붙여넣기' },
        ] as const).map((t, i) => (
          <button
            key={t.key}
            onClick={() => setTab(t.key)}
            className={`py-3 text-sm font-medium tracking-wide transition ${
              tab === t.key
                ? 'bg-ink text-paper'
                : 'bg-white text-ink hover:bg-neutral-100'
            } ${i === 0 ? 'border-r-2 border-ink' : ''}`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* PDF 모드 */}
      {tab === 'pdf' && (
        <div
          onClick={() => fileRef.current?.click()}
          className="border-2 border-t-0 border-ink bg-white p-12 text-center cursor-pointer hover:bg-neutral-50 transition"
        >
          <input
            ref={fileRef}
            type="file"
            accept="application/pdf"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (f) setFile(f);
            }}
          />
          <div className="font-mono text-xs text-neutral-500 mb-3">
            [ PDF FILE ]
          </div>
          <p className="text-base font-medium text-ink mb-2">
            {file?.name ?? 'PDF 파일을 선택하세요'}
          </p>
          <p className="text-xs text-neutral-500">최대 10MB</p>
          <div className="mt-4 inline-block border border-ink px-3 py-1 font-mono text-xs">
            📁 파일 업로드하기
          </div>
        </div>
      )}

      {/* TEXT 모드 */}
      {tab === 'text' && (
        <div className="border-2 border-t-0 border-ink bg-white">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="강의 내용을 직접 붙여넣으세요. 최소 30자 이상."
            className="w-full p-5 text-sm leading-relaxed bg-transparent outline-none resize-none"
            rows={9}
          />
          <div className="border-t border-neutral-200 px-5 py-2 flex justify-between items-center">
            <span className="font-mono text-xs text-neutral-500">
              {text.length} / 50000
            </span>
            <button
              onClick={() => setText(SAMPLE_TEXT)}
              className="font-mono text-xs underline-offset-4 hover:underline"
            >
              샘플 텍스트
            </button>
          </div>
        </div>
      )}

      {/* 다음 버튼 */}
      <button
        onClick={handleSubmit}
        disabled={!canSubmit}
        className={`mt-6 w-full py-4 border-2 border-ink font-medium text-base tracking-wide transition ${
          canSubmit
            ? 'bg-ink text-paper hover:bg-neutral-800'
            : 'bg-neutral-100 text-neutral-400 cursor-not-allowed border-neutral-300'
        }`}
      >
        다음 →
      </button>
    </div>
  );
}
