export interface IQuestion {
  id: string;
  category: string;
  difficulty: string;
  type: 'multiple' | 'boolean';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];
  selectedAnswer: string | null;
  isAnswered: boolean;
}

export interface IQuiz {
  id: string;
  questions: IQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  difficulty: string;
  isInfinite: boolean;
  answeredCount: number;
  apiSource: string;
}

export interface ITriviaApiResponse {
  response_code: number;
  results: ITriviaQuestion[];
}

export interface ITriviaQuestion {
  category: string;
  type: 'multiple' | 'boolean';
  difficulty: string;
  question: string;
  correct_answer: string;
  incorrect_answers: string[];
}

export interface ITriviaCategory {
  id: number;
  name: string;
}

export interface ITriviaCategoryResponse {
  trivia_categories: ITriviaCategory[];
}

export interface IQuizConfig {
  categoryId: number;
  categoryName: string;
  difficulty: string;
  isInfinite: boolean;
}

export interface IQuizApi {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  questionsUrl: string;
  categoriesUrl: string;
  questionType: string;
}
