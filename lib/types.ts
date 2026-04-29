export type QuizType = 'multiple_choice' | 'ox';
export type InputType = 'pdf' | 'text';
export type QuizCount = 5 | 10 | 20;

export interface MultipleChoiceQuiz {
  type: 'multiple_choice';
  question: string;
  options: string[];
  answer_index: number;
  explanation: string;
}

export interface OXQuiz {
  type: 'ox';
  statement: string;
  answer: 'O' | 'X';
  explanation: string;
}

export type Quiz = MultipleChoiceQuiz | OXQuiz;

export interface QuizResponse {
  quizzes: Quiz[];
}
