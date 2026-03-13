import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressBarModule } from '@angular/material/progress-bar';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrl: './progress-bar.component.scss',
  standalone: true,
  imports: [CommonModule, MatProgressBarModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressBarComponent {
  label = input<string>('Progress');
  value = input<number>(0);
  max = input<number>(10);

  percentage = computed(() => (this.value() / this.max()) * 100);
  ariaLabel = computed(
    () => `${this.label()}: ${this.value()} of ${this.max()}`
  );
}
