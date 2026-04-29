import type { QuizType, QuizCount } from './types';

const COMMON_RULES = (count: number) => `
주어진 자료에서 핵심 개념을 추출해 학습용 퀴즈를 생성하세요.

규칙:
- 자료의 실제 내용에 근거할 것 (자료에 없는 내용 추측 금지)
- 한국어로 작성
- 핵심 개념·정의·관계 위주, 사소한 디테일 회피
- 정확히 ${count}개의 문제를 생성
- 문제끼리 중복되지 않게 다양한 영역에서 출제
- explanation은 1~2문장 간결하게

응답은 반드시 순수 JSON만. 마크다운 코드블록(\`\`\`)이나 다른 설명 절대 포함 금지.
`.trim();

const mcPrompt = (count: number) => `
${COMMON_RULES(count)}

객관식 4지선다 ${count}문제를 만드세요. 다음 JSON 구조를 정확히 따르세요:

{
  "quizzes": [
    {
      "type": "multiple_choice",
      "question": "질문 내용",
      "options": ["보기1", "보기2", "보기3", "보기4"],
      "answer_index": 0,
      "explanation": "정답 해설 1~2문장"
    }
  ]
}

총 ${count}개 문제를 quizzes 배열에 담으세요. 정답은 보기 중 정확히 1개여야 합니다.
`.trim();

const oxPrompt = (count: number) => `
${COMMON_RULES(count)}

O/X 진위 판단 ${count}문제를 만드세요. 다음 JSON 구조를 정확히 따르세요:

{
  "quizzes": [
    {
      "type": "ox",
      "statement": "진위를 판단할 진술",
      "answer": "O",
      "explanation": "해설 1~2문장"
    }
  ]
}

총 ${count}개 문제를 quizzes 배열에 담으세요. answer는 "O" 또는 "X"만 가능합니다.
참(O)과 거짓(X) 비율을 적절히 섞으세요.
`.trim();

export function getQuizPrompt(quizType: QuizType, count: QuizCount): string {
  return quizType === 'multiple_choice' ? mcPrompt(count) : oxPrompt(count);
}

export const USER_INSTRUCTION = '위 자료를 기반으로 퀴즈를 생성해주세요.';
