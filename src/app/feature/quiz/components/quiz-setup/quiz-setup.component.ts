import {
  Component,
  ChangeDetectionStrategy,
  inject,
  computed,
  signal
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { QuizService } from '@app/feature/quiz/services';
import { ITriviaCategory } from '@app/fundamentale/models';
import { DE_LABELS } from '@app/shared/labels';
import { getAvailableApis, getCategoryIcon } from '@app/shared/constants';

@Component({
  selector: 'app-quiz-setup',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatFormFieldModule,
    MatProgressSpinnerModule,
    MatInputModule,
    MatIconModule
  ],
  templateUrl: './quiz-setup.component.html',
  styleUrl: './quiz-setup.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class QuizSetupComponent {
  private readonly quizService = inject(QuizService);
  private readonly router = inject(Router);
  private readonly fb = inject(FormBuilder);

  labels = DE_LABELS;
  getCategoryIcon = getCategoryIcon;
  searchQuery = signal<string>('');
  availableApis = getAvailableApis();

  setupForm: FormGroup;

  quizModes = [
    { value: false, label: DE_LABELS.limitedMode },
    { value: true, label: DE_LABELS.infiniteMode },
  ];

  categories = this.quizService.getCategories;
  categoriesLoading = this.quizService.getCategoriesLoading;

  difficulties = [
    { value: 'easy', label: DE_LABELS.easy, color: 'accent' },
    { value: 'medium', label: DE_LABELS.medium, color: 'warn' },
    { value: 'hard', label: DE_LABELS.hard, color: 'primary' },
  ];

  constructor() {
    this.setupForm = this.fb.group({
      api: ['opentdb', Validators.required],
      categories: [[]],
      difficulty: ['easy', Validators.required],
      isInfinite: [false]
    });

    this.quizService.setApi('opentdb');
  }

  filteredCategories = computed(() => {
    const all = this.categories();
    const query = this.searchQuery().toLowerCase();

    if (!query) return all;

    return all.filter(cat =>
      cat.name.toLowerCase().includes(query)
    );
  });

  selectedCategories = computed(() => {
    const categoryIds: number[] = this.setupForm.get('categories')?.value || [];
    const allCategories = this.categories();
    return allCategories.filter(c => categoryIds.includes(c.id));
  });

  startQuiz(): void {
    if (this.setupForm.invalid) return;

    const apiId = this.setupForm.get('api')?.value;
    const categoryIds: number[] = this.setupForm.get('categories')?.value || [];
    const difficulty = this.setupForm.get('difficulty')?.value;
    const isInfinite = this.setupForm.get('isInfinite')?.value ?? false;

    this.quizService.resetQuiz();
    this.quizService.setApi(apiId);
    this.quizService.setCategories(categoryIds);
    this.quizService.setDifficulty(difficulty);
    this.quizService.setInfiniteMode(isInfinite);

    let finalCategoryId: number | undefined;
    const cats = this.quizService.getCategories();
    if (categoryIds.length > 0) {
      finalCategoryId = categoryIds[Math.floor(Math.random() * categoryIds.length)];
    } else if (cats.length > 0) {
      finalCategoryId = cats[Math.floor(Math.random() * cats.length)].id;
    }

    const amount = isInfinite ? 20 : 10;
    this.quizService.initializeQuiz(amount, finalCategoryId, difficulty, isInfinite);
    this.router.navigate(['/quiz']);
  }

  selectApi(apiId: string): void {
    this.setupForm.patchValue({ api: apiId, categories: [] });
    this.quizService.setApi(apiId);
  }

  toggleCategory(categoryId: number): void {
    const current: number[] = this.setupForm.get('categories')?.value || [];
    const index = current.indexOf(categoryId);
    
    if (index === -1) {
      this.setupForm.patchValue({ categories: [...current, categoryId] });
    } else {
      const updated = current.filter(id => id !== categoryId);
      this.setupForm.patchValue({ categories: updated });
    }
  }

  isCategorySelected(categoryId: number): boolean {
    const current: number[] = this.setupForm.get('categories')?.value || [];
    return current.includes(categoryId);
  }

  selectDifficulty(difficulty: string): void {
    this.setupForm.patchValue({ difficulty });
  }

  onSearchChange(query: string): void {
    this.searchQuery.set(query);
  }

  selectQuizMode(isInfinite: boolean): void {
    this.setupForm.patchValue({ isInfinite });
  }

  isFormValid(): boolean {
    return this.setupForm.valid;
  }

  getSelectedCategoryName(): string {
    const categoryId = this.setupForm.get('category')?.value;
    if (!categoryId) return DE_LABELS.noCategory;
    const category = this.quizService
      .getCategories()
      .find((c: ITriviaCategory) => c.id === categoryId);
    return category ? category.name : DE_LABELS.noCategory;
  }

  getSelectedDifficultyLabel(): string {
    const difficulty = this.setupForm.get('difficulty')?.value;
    const option = this.difficulties.find((d) => d.value === difficulty);
    return option ? option.label : DE_LABELS.random;
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
