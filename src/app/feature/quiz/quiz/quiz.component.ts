import { ChangeDetectionStrategy, Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { QuizService } from '../services/quiz.service';
import {
  QuestionComponent,
  QuizResultComponent,
} from '../components';
import { ProgressBarComponent } from '@app/shared';
import { DE_LABELS } from '@app/shared/labels';

@Component({
  selector: 'app-quiz',
  templateUrl: './quiz.component.html',
  styleUrl: './quiz.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatProgressSpinnerModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    ProgressBarComponent,
    QuestionComponent,
    QuizResultComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizComponent implements OnInit {
  protected readonly quizService = inject(QuizService);
  private readonly router = inject(Router);

  labels = DE_LABELS;

  ngOnInit(): void {
    // Only initialize if not already initialized
    if (!this.quizService.quiz()) {
      const category = this.quizService.getSelectedCategory();
      const difficulty = this.quizService.getSelectedDifficulty();
      const isInfinite = this.quizService.isInfiniteMode();
      this.quizService.initializeQuiz(10, category || undefined, difficulty, isInfinite);
    }
  }

  submitAnswer(answer: string): void {
    this.quizService.submitAnswer(answer);
  }

  nextQuestion(): void {
    this.quizService.moveToNext();
  }

  stopQuiz(): void {
    const quiz = this.quizService.quiz();
    if (quiz) {
      quiz.isCompleted = true;
      this.quizService.quizState.set({ ...quiz });
    }
  }

  retakeQuiz(): void {
    this.quizService.resetQuiz();
    this.router.navigate(['/quiz/setup']);
  }

  goHome(): void {
    this.quizService.resetQuiz();
    this.router.navigate(['/quiz/setup']);
  }

  tryAgain(): void {
    this.quizService.resetQuiz();
    const category = this.quizService.getSelectedCategory();
    const difficulty = this.quizService.getSelectedDifficulty();
    const isInfinite = this.quizService.isInfiniteMode();
    this.quizService.initializeQuiz(10, category || undefined, difficulty, isInfinite);
  }
}

