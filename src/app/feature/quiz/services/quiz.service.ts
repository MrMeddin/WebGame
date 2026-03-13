import {
  Injectable,
  inject,
  signal,
  computed,
  effect
} from '@angular/core';
import { Router } from '@angular/router';
import { QuizRepository } from '@app/fundamentale/repos';
import { IQuestion, IQuiz, ITriviaCategory } from '@app/fundamentale/models';
import { TriviaApiService } from '@app/fundamentale/services';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private readonly quizRepo = inject(QuizRepository);
  private readonly triviaApi = inject(TriviaApiService);
  private readonly router = inject(Router);

  // Signals
  readonly quizState = signal<IQuiz | null>(null);
  private readonly isLoading = signal<boolean>(false);
  private readonly error = signal<string | null>(null);
  private readonly categories = signal<ITriviaCategory[]>([]);
  private readonly selectedCategory = signal<number | null>(null);
  private readonly selectedCategories = signal<number[]>([]);
  private readonly selectedDifficulty = signal<string>('');
  readonly isInfiniteMode = signal<boolean>(false);
  private readonly categoriesLoading = signal<boolean>(false);
  private readonly selectedApi = signal<string>('opentdb');

  // Computed
  readonly quiz = computed(() => this.quizState());
  readonly currentQuestion = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.questions[quiz.currentQuestionIndex] : null;
  });
  readonly progress = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.currentQuestionIndex + 1 : 0;
  });
  readonly totalQuestions = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.totalQuestions : 0;
  });
  readonly score = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.score : 0;
  });
  readonly isCompleted = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.isCompleted : false;
  });
  readonly answeredCount = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.answeredCount : 0;
  });
  readonly isInfinite = computed(() => {
    const quiz = this.quizState();
    return quiz ? quiz.isInfinite : false;
  });

  loading$ = computed(() => this.isLoading());
  error$ = computed(() => this.error());
  getCategories = computed(() => this.categories());
  getCategoriesLoading = computed(() => this.categoriesLoading());
  getSelectedCategory = computed(() => this.selectedCategory());
  getSelectedCategories = computed(() => this.selectedCategories());
  getSelectedDifficulty = computed(() => this.selectedDifficulty());
  getSelectedApi = computed(() => this.selectedApi());

  /**
   * Load available categories from API
   */
  loadCategories(): void {
    this.categoriesLoading.set(true);
    this.triviaApi.getCategories().subscribe({
      next: (cats: ITriviaCategory[]) => {
        this.categories.set(cats);
        this.categoriesLoading.set(false);
      },
      error: (err: unknown) => {
        console.error('Failed to load categories:', err);
        this.categoriesLoading.set(false);
      }
    });
  }

  /**
   * Set selected category
   */
  setCategory(categoryId: number | null): void {
    this.selectedCategory.set(categoryId);
  }

  /**
   * Set selected categories (for multi-select)
   */
  setCategories(categoryIds: number[]): void {
    this.selectedCategories.set(categoryIds);
  }

  /**
   * Set selected difficulty
   */
  setDifficulty(difficulty: string): void {
    this.selectedDifficulty.set(difficulty);
  }

  /**
   * Set selected API
   */
  setApi(apiId: string): void {
    this.selectedApi.set(apiId);
    this.triviaApi.setApi(apiId);
    this.loadCategories();
  }

  /**
   * Set infinite mode
   */
  setInfiniteMode(isInfinite: boolean): void {
    this.isInfiniteMode.set(isInfinite);
  }

  /**
   * Initialize quiz with API questions
   */
  initializeQuiz(
    amount: number = 10,
    category?: number,
    difficulty?: string,
    isInfinite: boolean = false
  ): void {
    this.isLoading.set(true);
    this.error.set(null);

    this.quizRepo.createQuiz(amount, category, difficulty, isInfinite).subscribe({
      next: (quiz: IQuiz) => {
        this.quizState.set(quiz);
        this.isLoading.set(false);
      },
      error: (err: unknown) => {
        this.error.set('Failed to load quiz. Please try again.');
        this.isLoading.set(false);
        console.error('Quiz initialization error:', err);
      }
    });
  }

  /**
   * Load more questions for infinite mode
   */
  loadMoreQuestions(): void {
    const quiz = this.quizState();
    if (!quiz || !quiz.isInfinite) return;

    const category = this.selectedCategory();
    const difficulty = this.selectedDifficulty();

    this.quizRepo.createQuiz(10, category || undefined, difficulty, true).subscribe({
      next: (newQuiz: IQuiz) => {
        // Append new questions to existing quiz
        quiz.questions.push(...newQuiz.questions);
        quiz.totalQuestions += newQuiz.totalQuestions;
        this.quizState.set({ ...quiz });
      },
      error: (err: unknown) => {
        console.error('Failed to load more questions:', err);
      }
    });
  }

  /**
   * Submit answer for current question
   */
  submitAnswer(answer: string): void {
    const quiz = this.quizState();
    if (!quiz) return;

    const question = quiz.questions[quiz.currentQuestionIndex];
    const isCorrect = answer === question.correctAnswer;

    // Update question
    question.selectedAnswer = answer;
    question.isAnswered = true;

    // Update quiz score
    if (isCorrect) {
      quiz.score++;
    }

    // Increment answered count
    quiz.answeredCount = (quiz.answeredCount || 0) + 1;

    // Update state - don't move to next automatically
    this.quizState.set({ ...quiz });
  }

  /**
   * Move to next question
   */
  moveToNext(): void {
    const quiz = this.quizState();
    if (!quiz) return;

    if (quiz.currentQuestionIndex < quiz.questions.length - 1) {
      quiz.currentQuestionIndex++;
      this.quizState.set({ ...quiz });

      // Load more questions if infinite mode and getting close to end
      if (quiz.isInfinite && quiz.questions.length - quiz.currentQuestionIndex <= 5) {
        this.loadMoreQuestions();
      }
    } else if (quiz.isInfinite) {
      // Load more questions for infinite mode
      this.loadMoreQuestions();
      quiz.currentQuestionIndex++;
      this.quizState.set({ ...quiz });
    } else {
      quiz.isCompleted = true;
      this.quizState.set({ ...quiz });
    }
  }

  /**
   * Reset quiz
   */
  resetQuiz(): void {
    this.quizState.set(null);
    this.error.set(null);
  }
}
