import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-quiz-card',
  templateUrl: './quiz-card.component.html',
  styleUrl: './quiz-card.component.scss',
  standalone: true,
  imports: [MatCardModule, MatButtonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class QuizCardComponent {
  title = input<string>('Card Title');
  subtitle = input<string>('');
  showActions = input<boolean>(true);
  primaryBtnLabel = input<string>('');
  secondaryBtnLabel = input<string>('');
  primaryBtnDisabled = input<boolean>(false);

  primaryAction = output<void>();
  secondaryAction = output<void>();

  onPrimaryClick(): void {
    this.primaryAction.emit();
  }

  onSecondaryClick(): void {
    this.secondaryAction.emit();
  }
}
