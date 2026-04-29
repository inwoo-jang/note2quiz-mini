import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenAI } from '@google/genai';
import { getQuizPrompt, USER_INSTRUCTION } from '@/lib/prompts';
import type { QuizResponse, QuizType, InputType, QuizCount } from '@/lib/types';

export const runtime = 'nodejs';
export const maxDuration = 60;

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = 'gemini-2.5-flash-lite';

const VALID_COUNTS: QuizCount[] = [5, 10, 20];

/**
 * POST /api/generate-quiz
 *
 * Body (multipart/form-data):
 * - inputType: 'pdf' | 'text'
 * - quizType:  'multiple_choice' | 'ox'
 * - quizCount: '5' | '10' | '20'
 * - file:      PDF 파일 (inputType === 'pdf')
 * - text:      텍스트 (inputType === 'text')
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const inputType = formData.get('inputType') as InputType;
    const quizType = formData.get('quizType') as QuizType;
    const quizCountRaw = formData.get('quizCount') as string;
    const quizCount = parseInt(quizCountRaw, 10) as QuizCount;

    // 1. 입력 유효성 검증
    if (!['pdf', 'text'].includes(inputType)) {
      return NextResponse.json({ error: 'inputType은 pdf 또는 text여야 해요.' }, { status: 400 });
    }
    if (!['multiple_choice', 'ox'].includes(quizType)) {
      return NextResponse.json({ error: 'quizType은 multiple_choice 또는 ox여야 해요.' }, { status: 400 });
    }
    if (!VALID_COUNTS.includes(quizCount)) {
      return NextResponse.json({ error: 'quizCount는 5, 10, 20 중 하나여야 해요.' }, { status: 400 });
    }

    // 2. 입력 컨텐츠 구성
    let userContent: any[];

    if (inputType === 'pdf') {
      const file = formData.get('file');
      if (!file || !(file instanceof File)) {
        return NextResponse.json({ error: 'PDF 파일이 첨부되지 않았어요.' }, { status: 400 });
      }
      if (file.size > 10 * 1024 * 1024) {
        return NextResponse.json({ error: 'PDF는 10MB 이하만 가능해요.' }, { status: 400 });
      }
      if (file.type !== 'application/pdf') {
        return NextResponse.json({ error: 'PDF 파일만 업로드 가능해요.' }, { status: 400 });
      }
      const buffer = Buffer.from(await file.arrayBuffer());
      const base64 = buffer.toString('base64');

      userContent = [
        { inlineData: { mimeType: 'application/pdf', data: base64 } },
        { text: USER_INSTRUCTION },
      ];
    } else {
      const text = formData.get('text') as string;
      if (!text || text.trim().length < 30) {
        return NextResponse.json({ error: '텍스트는 30자 이상 입력해주세요.' }, { status: 400 });
      }
      if (text.length > 50000) {
        return NextResponse.json({ error: '텍스트는 50,000자 이하로 입력해주세요.' }, { status: 400 });
      }
      userContent = [
        { text: `다음 자료를 기반으로 퀴즈를 생성하세요:\n\n${text}\n\n${USER_INSTRUCTION}` },
      ];
    }

    // 3. Gemini 호출 (문제수가 많을수록 출력 토큰 한도도 늘림)
    const systemInstruction = getQuizPrompt(quizType, quizCount);
    const maxTokens = quizCount === 20 ? 6000 : quizCount === 10 ? 3500 : 2048;

// 503 자동 재시도 (Google 서버 과부하 대응)
    const callGemini = async () => {
      return await ai.models.generateContent({
        model: MODEL,
        contents: [{ role: 'user', parts: userContent }],
        config: {
          systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.7,
          maxOutputTokens: maxTokens,
        },
      });
    };

    let response;
    const MAX_RETRIES = 3;
    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        response = await callGemini();
        break; // 성공하면 루프 탈출
      } catch (e: any) {
        const msg = e?.message ?? String(e);
        const is503 = msg.includes('503') || msg.includes('UNAVAILABLE') || msg.includes('overloaded');
        const isLastAttempt = attempt === MAX_RETRIES;

        console.log(`[Gemini] 시도 ${attempt}/${MAX_RETRIES} 실패: ${msg.slice(0, 100)}`);

        if (!is503 || isLastAttempt) throw e; // 503 아니거나 마지막이면 에러 전파

        // 지수 백오프: 1초, 2초, 4초 대기
        const wait = Math.pow(2, attempt - 1) * 1000;
        console.log(`[Gemini] ${wait}ms 후 재시도...`);
        await new Promise((r) => setTimeout(r, wait));
      }
    }

    if (!response) {
      return NextResponse.json(
        { error: 'Gemini 서버가 일시적으로 과부하 상태예요. 1~2분 후 다시 시도해주세요.' },
        { status: 503 }
      );
    }

    // 4. 응답 파싱
    const rawText = response.text;
    if (!rawText) {
      return NextResponse.json({ error: 'Gemini가 빈 응답을 반환했어요. 다시 시도해주세요.' }, { status: 502 });
    }

    let cleaned = rawText.trim();
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, '').replace(/```\s*$/i, '');

    let parsed: QuizResponse;
    try {
      parsed = JSON.parse(cleaned);
    } catch (e) {
      console.error('JSON parse failed. raw:', cleaned.slice(0, 500));
      return NextResponse.json(
        { error: '응답 형식 오류. 다시 시도해주세요.', detail: cleaned.slice(0, 200) },
        { status: 502 }
      );
    }

    if (!parsed.quizzes || !Array.isArray(parsed.quizzes) || parsed.quizzes.length === 0) {
      return NextResponse.json(
        { error: '퀴즈가 생성되지 않았어요. 자료를 더 풍부하게 입력해주세요.' },
        { status: 502 }
      );
    }

    return NextResponse.json(parsed);
  } catch (err) {
    console.error('generate-quiz error:', err);
    const message = err instanceof Error ? err.message : '알 수 없는 오류';

    if (message.includes('quota') || message.includes('429')) {
      return NextResponse.json(
        { error: '오늘의 무료 사용량을 모두 썼어요. 내일 다시 시도하거나 결제카드를 등록하면 한도가 늘어납니다.' },
        { status: 429 }
      );
    }

    return NextResponse.json({ error: '서버 오류가 발생했어요.', detail: message }, { status: 500 });
  }
}
