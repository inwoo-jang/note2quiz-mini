'use client';

import { useState } from 'react';
import Acorn from '@/components/Acorn';
import StepUpload from '@/components/StepUpload';
import StepSelectType from '@/components/StepSelectType';
import StepLoading from '@/components/StepLoading';
import CountModal from '@/components/CountModal';
import { QuizList } from '@/components/QuizCards';
import type { Quiz, QuizType, InputType, QuizCount } from '@/lib/types';

type Step = 'upload' | 'select-type' | 'loading' | 'quiz' | 'error';

interface SourceData {
  inputType: InputType;
  file?: File;
  text?: string;
}

export default function Home() {
  const [step, setStep] = useState<Step>('upload');
  const [source, setSource] = useState<SourceData | null>(null);
  const [quizType, setQuizType] = useState<QuizType | null>(null);
  const [showCountModal, setShowCountModal] = useState(false);
  const [count, setCount] = useState<QuizCount>(5);
  const [quizzes, setQuizzes] = useState<Quiz[]>([]);
  const [errorMsg, setErrorMsg] = useState('');

  const handleUpload = (data: SourceData) => {
    setSource(data);
    setStep('select-type');
  };

  const handleSelectType = (type: QuizType) => {
    setQuizType(type);
    setShowCountModal(true);
  };

  const handleConfirmCount = async (n: QuizCount) => {
    if (!source || !quizType) return;
    setCount(n);
    setShowCountModal(false);
    setStep('loading');
    setErrorMsg('');

    try {
      const formData = new FormData();
      formData.append('inputType', source.inputType);
      formData.append('quizType', quizType);
      formData.append('quizCount', String(n));
      if (source.inputType === 'pdf' && source.file) {
        formData.append('file', source.file);
      } else if (source.inputType === 'text' && source.text) {
        formData.append('text', source.text);
      }

      const res = await fetch('/api/generate-quiz', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.error ?? '오류가 발생했어요.');
        setStep('error');
        return;
      }
      setQuizzes(data.quizzes);
      setStep('quiz');
    } catch (err) {
      setErrorMsg('네트워크 오류가 발생했어요.');
      setStep('error');
    }
  };

  const reset = () => {
    setStep('upload');
    setSource(null);
    setQuizType(null);
    setQuizzes([]);
    setErrorMsg('');
    setShowCountModal(false);
  };

  const stepNum = step === 'upload' ? 1 : step === 'select-type' ? 2 : 3;

  return (
    <main className="max-w-xl mx-auto px-5 py-10 sm:py-14">
      <header className="border-b-2 border-ink pb-5 mb-8">
        <div className="flex justify-between items-start">
          <div className="flex items-center gap-3">
            <Acorn size={28} />
            <div>
              <h1 className="font-medium text-lg leading-tight">
                Note2Quiz <span className="text-accent">mini</span>
              </h1>
              <p className="font-mono text-xs text-neutral-500">
                강의노트 → 퀴즈 자동 생성 · v1.0
              </p>
            </div>
          </div>
        </div>

        <div className="mt-5 flex items-center gap-2 font-mono text-xs">
          {['UPLOAD', 'TYPE', 'QUIZ'].map((label, i) => (
            <div key={label} className="flex items-center gap-2">
              <span
                className={`px-2 py-0.5 border ${
                  stepNum > i + 1
                    ? 'border-ink bg-ink text-paper'
                    : stepNum === i + 1
                    ? 'border-accent text-accent'
                    : 'border-neutral-300 text-neutral-400'
                }`}
              >
                0{i + 1}
              </span>
              <span className={stepNum >= i + 1 ? 'text-ink' : 'text-neutral-400'}>
                {label}
              </span>
              {i < 2 && <span className="text-neutral-300 mx-1">─</span>}
            </div>
          ))}
        </div>
      </header>

      <section>
        {step === 'upload' && <StepUpload onSubmit={handleUpload} />}

        {step === 'select-type' && source && (
          <StepSelectType
            source={source}
            onSelect={handleSelectType}
            onBack={() => setStep('upload')}
          />
        )}

        {step === 'loading' && <StepLoading />}

        {step === 'error' && (
          <div className="border-2 border-accent bg-accentSoft p-6">
            <p className="font-medium text-ink mb-3">{errorMsg}</p>
            <button
              onClick={reset}
              className="font-mono text-xs border-2 border-ink px-4 py-2 hover:bg-ink hover:text-paper"
            >
              처음부터 다시 →
            </button>
          </div>
        )}

        {step === 'quiz' && quizType && (
          <QuizList quizzes={quizzes} onReset={reset} quizType={quizType} count={count} />
        )}
      </section>

      <footer className="mt-14 border-t-2 border-ink pt-4 font-mono text-xs text-neutral-500 flex justify-between">
        <span>© INWOO JANG · v1.0</span>
        <span>POWERED BY GEMINI 2.5 FLASH-LITE</span>
      </footer>

      {showCountModal && quizType && (
        <CountModal
          quizType={quizType}
          onConfirm={handleConfirmCount}
          onClose={() => setShowCountModal(false)}
        />
      )}
    </main>
  );
}
