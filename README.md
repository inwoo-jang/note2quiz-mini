# Note2Quiz mini · v1.0

> 강의노트(PDF·텍스트)를 업로드하면 Gemini 2.5 Flash-Lite가 객관식 또는 O/X 퀴즈를 자동 생성합니다. 문제 수는 5/10/20개 중 선택. **무료 티어로 100% 동작**합니다.

## 0. 한눈에

| 항목 | 내용 |
| --- | --- |
| 입력 | PDF 파일(10MB 이하) 또는 텍스트(30~50,000자) |
| 퀴즈 타입 | 객관식 4지선다 / O·X 진위 판단 |
| 문제 수 | 5 / 10 / 20개 (모달에서 선택) |
| 출력 | 정답·해설 포함 |
| 모델 | Gemini 2.5 Flash-Lite (무료 티어 1,000 RPD) |
| 스택 | Next.js 14 + TypeScript + Tailwind + @google/genai |
| 비용 | **무료** (결제카드 등록 불필요) |

## 1. Gemini API 키 발급 (5분)

1. https://aistudio.google.com/apikey 접속
2. 구글 계정으로 로그인
3. **Create API Key** 클릭 → 발급된 키 복사
4. 결제카드 등록 X — 무료 티어 그대로 사용

## 2. 로컬에서 실행

```bash
npm install
cp .env.local.example .env.local
# .env.local 열어서 GEMINI_API_KEY=발급받은키 로 교체
npm run dev
```

## 3. Vercel 배포

```bash
git init && git add . && git commit -m "init"
git remote add origin https://github.com/USER/note2quiz.git
git push -u origin main
```

[Vercel Dashboard](https://vercel.com/new)에서 Import → **Environment Variables**에 `GEMINI_API_KEY` 추가 → Deploy.

## 4. 사용 흐름

```
[01 UPLOAD]            [02 TYPE]                        [03 QUIZ]
   ↓                      ↓                                ↓
PDF / TEXT 탭          객관식 / OX 카드 클릭            5/10/20문제 풀이
파일 또는 텍스트         ↓                                해설 즉시 노출
   ↓                   [모달] 5 / 10 / 20 선택
   "다음 →"             ↓
                       시작하기 → (Gemini 호출)
```

## 5. 프로젝트 구조

```
note2quiz-gemini/
├── app/
│   ├── api/generate-quiz/route.ts
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── Acorn.tsx
│   ├── StepUpload.tsx                # 1단계: PDF/텍스트 탭
│   ├── StepSelectType.tsx            # 2단계: 유형 선택 카드
│   ├── CountModal.tsx                # 2-A단계: 문제수 모달
│   ├── StepLoading.tsx               # 3단계: 로딩
│   └── QuizCards.tsx                 # 4단계: 퀴즈
├── lib/
│   ├── prompts.ts                    # 문제수 동적 프롬프트
│   └── types.ts
└── README.md
```

## 6. 무료 티어 한도

| 항목 | 한도 |
| --- | --- |
| 분당 요청 (RPM) | 15회 |
| 일일 요청 (RPD) | 1,000회 |
| 토큰 분당 한도 | 250,000 |
| 컨텍스트 윈도우 | 100만 토큰 |

20문제 생성 시 출력 토큰이 늘어나므로 토큰 한도를 동적으로 조정합니다 (5문제: 2K, 10문제: 3.5K, 20문제: 6K).

## 7. 디자인

- 와이어프레임 톤: 흑백 + 굵은 보더 + 포인트 컬러 1개(#FF6B35)
- 서체: Pretendard(한글) + JetBrains Mono(라벨)
- 마스코트: 흑백 도토리

## 8. 다음 마일스톤

- [ ] 결과 PDF 다운로드
- [ ] 오답 노트 모드 (틀린 문제만 다시)
- [ ] 한 자료에서 객관식 + OX 동시 생성
- [ ] 과목 자동 분류 (Note2Quiz 본 프로젝트의 15개 카테고리)
- [ ] 사용자 인증 + 학습 기록

---

본 데모는 Note2Quiz 사이드 프로젝트(DDD F1팀)의 핵심 로직을 검증하기 위해 제작했습니다. SKALA 4기 · FSK L&S 지원용 포트폴리오.
# note2quiz-mini
