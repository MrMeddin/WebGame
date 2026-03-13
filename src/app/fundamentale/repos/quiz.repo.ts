import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { TriviaApiService } from '../services';
import { IQuestion, IQuiz, ITriviaQuestion } from '../models';

@Injectable({
  providedIn: 'root'
})
export class QuizRepository {
  private readonly triviaApi = inject(TriviaApiService);

  /**
   * Creates a quiz from API questions
   */
  createQuiz(
    amount: number = 10,
    category?: number,
    difficulty?: string,
    isInfinite: boolean = false
  ): Observable<IQuiz> {
    return this.triviaApi.getQuestions(amount, category, difficulty).pipe(
      map(apiQuestions => this.mapToQuiz(apiQuestions, difficulty || 'mixed', isInfinite))
    );
  }

  /**
   * Maps Trivia API questions to internal IQuestion format
   */
  private mapToQuiz(apiQuestions: ITriviaQuestion[], difficulty: string, isInfinite: boolean = false): IQuiz {
    const questions = apiQuestions.map((q, index) =>
      this.mapToQuestion(q, index.toString())
    );

    return {
      id: this.generateId(),
      questions,
      currentQuestionIndex: 0,
      score: 0,
      totalQuestions: questions.length,
      isCompleted: false,
      difficulty,
      isInfinite,
      answeredCount: 0,
      apiSource: 'opentdb'
    };
  }

  /**
   * Maps single API question to IQuestion format
   */
  private mapToQuestion(apiQuestion: ITriviaQuestion, id: string): IQuestion {
    const allAnswers = this.shuffleAnswers([
      apiQuestion.correct_answer,
      ...apiQuestion.incorrect_answers
    ]);

    return {
      id,
      category: apiQuestion.category,
      difficulty: apiQuestion.difficulty,
      type: apiQuestion.type,
      question: this.triviaApi.decodeHtmlEntity(apiQuestion.question),
      correctAnswer: this.triviaApi.decodeHtmlEntity(
        apiQuestion.correct_answer
      ),
      incorrectAnswers: apiQuestion.incorrect_answers.map(a =>
        this.triviaApi.decodeHtmlEntity(a)
      ),
      allAnswers: allAnswers.map(a => this.triviaApi.decodeHtmlEntity(a)),
      selectedAnswer: null,
      isAnswered: false
    };
  }

  /**
   * Fisher-Yates shuffle algorithm
   */
  private shuffleAnswers(answers: string[]): string[] {
    const shuffled = [...answers];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  /**
   * Generates unique ID
   */
  private generateId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
