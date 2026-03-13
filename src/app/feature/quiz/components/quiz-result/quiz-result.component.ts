import { ChangeDetectionStrategy, Component, computed, input, output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

import { QuizCardComponent, ProgressBarComponent } from '../../../../shared/components';
import { DE_LABELS } from '@app/shared/labels';

interface ResultMessage {
  text: string;
  class: 'perfect' | 'excellent' | 'good' | 'try-again';
}

@Component({
  selector: 'app-quiz-result',
  templateUrl: './quiz-result.component.html',
  styleUrl: './quiz-result.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    QuizCardComponent,
    ProgressBarComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizResultComponent {
  score = input.required<number>();
  total = input.required<number>();

  retake = output<void>();
  goHome = output<void>();

  labels = DE_LABELS;

  accuracy = computed(() => Math.round((this.score() / this.total()) * 100));

  resultMessage = computed<ResultMessage>(() => {
    const acc = this.accuracy();

    if (acc === 100) {
      return { text: DE_LABELS.perfectScore, class: 'perfect' };
    }

    if (acc >= 80) {
      return { text: DE_LABELS.excellentScore, class: 'excellent' };
    }

    if (acc >= 60) {
      return { text: DE_LABELS.goodScore, class: 'good' };
    }

    return { text: DE_LABELS.tryAgainScore, class: 'try-again' };
  });

  onRetake(): void {
    this.retake.emit();
  }

  onGoHome(): void {
    this.goHome.emit();
  }
}
