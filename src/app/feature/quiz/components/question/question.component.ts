import {
  ChangeDetectionStrategy,
  Component,
  computed,
  input,
  output,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatIconModule } from '@angular/material/icon';

import { IQuestion } from '../../../../fundamentale/models';
import { DE_LABELS } from '@app/shared/labels';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrl: './question.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuestionComponent {
  question = input.required<IQuestion>();

  submitAnswer = output<string>();
  answerSelected = output<string>();
  nextQuestion = output<void>();

  selectedAnswer = signal<string>('');
  labels = DE_LABELS;

  difficultyBadge = computed(() => {
    const difficulty = this.question().difficulty.toLowerCase();
    const labels: Record<string, string> = {
      easy: DE_LABELS.easy,
      medium: DE_LABELS.medium,
      hard: DE_LABELS.hard,
    };
    return `${DE_LABELS.difficulty}: ${labels[difficulty] || difficulty}`;
  });

  isAnswerCorrect = computed(() => {
    const question = this.question();
    const selected = this.selectedAnswer();

    if (!question.isAnswered || !selected) {
      return false;
    }

    return selected === question.correctAnswer;
  });

  onAnswerSelect(answer: string): void {
    this.selectedAnswer.set(answer);
    this.answerSelected.emit(answer);
  }

  onSubmit(): void {
    const answer = this.selectedAnswer();

    if (answer) {
      this.submitAnswer.emit(answer);
    }
  }

  onNext(): void {
    this.nextQuestion.emit();
    this.selectedAnswer.set('');
  }
}
