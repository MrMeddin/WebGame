import { Component, ChangeDetectionStrategy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

import { DE_LABELS } from '@app/shared/labels';

interface MemoryCard {
  id: number;
  symbol: string;
  isFlipped: boolean;
  isMatched: boolean;
}

interface Theme {
  id: string;
  name: string;
  icon: string;
  symbols: string[];
}

interface Difficulty {
  value: string;
  label: string;
  gridSize: number;
}

@Component({
  selector: 'app-memory',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatFormFieldModule,
    MatRadioModule,
  ],
  templateUrl: './memory.component.html',
  styleUrl: './memory.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MemoryComponent {
  private readonly router = inject(Router);

  labels = DE_LABELS;
  gameStarted = signal(false);
  gameWon = signal(false);

  selectedDifficulty = signal<string>('easy');
  selectedTheme = signal<string>('emoji');

  cards = signal<MemoryCard[]>([]);
  flippedCards = signal<number[]>([]);
  moves = signal(0);
  timer = signal(0);
  private timerInterval: any;
  private canFlip = true;

  difficulties: Difficulty[] = [
    { value: 'easy', label: 'Einfach', gridSize: 4 },
    { value: 'medium', label: 'Mittel', gridSize: 6 },
    { value: 'hard', label: 'Schwer', gridSize: 8 },
  ];

  themes: Theme[] = [
    {
      id: 'emoji',
      name: 'Emojis',
      icon: 'sentiment_satisfied',
      symbols: [
        '🐶',
        '🐱',
        '🐭',
        '🐹',
        '🐰',
        '🦊',
        '🐻',
        '🐼',
        '🐨',
        '🐯',
        '🦁',
        '🐮',
        '🐷',
        '🐸',
        '🐵',
        '🐔',
      ],
    },
    {
      id: 'food',
      name: 'Essen',
      icon: 'restaurant',
      symbols: [
        '🍕',
        '🍔',
        '🍟',
        '🌭',
        '🍿',
        '🍩',
        '🍪',
        '🎂',
        '🍰',
        '🧁',
        '🍫',
        '🍬',
        '🍭',
        '🍮',
        '🍯',
        '🍺',
      ],
    },
    {
      id: 'sports',
      name: 'Sport',
      icon: 'sports_soccer',
      symbols: [
        '⚽',
        '🏀',
        '🏈',
        '⚾',
        '🎾',
        '🏐',
        '🏉',
        '🎱',
        '🪀',
        '🏓',
        '🏸',
        '🏒',
        '🏑',
        '🥍',
        '🏏',
        '🥊',
      ],
    },
    {
      id: 'nature',
      name: 'Natur',
      icon: 'park',
      symbols: [
        '🌸',
        '🌺',
        '🌻',
        '🌼',
        '🌷',
        '🌹',
        '🥀',
        '💐',
        '🍀',
        '🌿',
        '🌴',
        '🌵',
        '🍁',
        '🍂',
        '🌾',
        '🌊',
      ],
    },
  ];

  gridSize = computed(() => {
    const diff = this.difficulties.find((d) => d.value === this.selectedDifficulty());
    return diff ? diff.gridSize : 4;
  });

  formattedTime = computed(() => {
    const seconds = this.timer();
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  });

  startGame(): void {
    const diff = this.difficulties.find((d) => d.value === this.selectedDifficulty());
    const theme = this.themes.find((t) => t.id === this.selectedTheme());

    if (!diff || !theme) return;

    const gridSize = diff.gridSize;
    const pairCount = (gridSize * gridSize) / 2;
    const shuffledSymbols = [...theme.symbols].sort(() => Math.random() - 0.5).slice(0, pairCount);

    const cardPairs = [...shuffledSymbols, ...shuffledSymbols]
      .sort(() => Math.random() - 0.5)
      .map((symbol, index) => ({
        id: index,
        symbol,
        isFlipped: false,
        isMatched: false,
      }));

    this.cards.set(cardPairs);
    this.flippedCards.set([]);
    this.moves.set(0);
    this.timer.set(0);
    this.gameStarted.set(true);
    this.gameWon.set(false);
    this.canFlip = true;

    this.startTimer();
  }

  private startTimer(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
    this.timerInterval = setInterval(() => {
      this.timer.update((t) => t + 1);
    }, 1000);
  }

  private stopTimer(): void {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
      this.timerInterval = null;
    }
  }

  flipCard(card: MemoryCard): void {
    if (!this.canFlip || card.isFlipped || card.isMatched) return;
    if (this.flippedCards().length >= 2) return;

    const updatedCards = this.cards().map((c) =>
      c.id === card.id ? { ...c, isFlipped: true } : c
    );
    this.cards.set(updatedCards);
    this.flippedCards.update((fc) => [...fc, card.id]);

    if (this.flippedCards().length === 2) {
      this.moves.update((m) => m + 1);
      this.checkMatch();
    }
  }

  private checkMatch(): void {
    this.canFlip = false;
    const [firstId, secondId] = this.flippedCards();
    const firstCard = this.cards().find((c) => c.id === firstId);
    const secondCard = this.cards().find((c) => c.id === secondId);

    if (firstCard?.symbol === secondCard?.symbol) {
      const updatedCards = this.cards().map((c) =>
        c.id === firstId || c.id === secondId ? { ...c, isMatched: true } : c
      );
      this.cards.set(updatedCards);
      this.flippedCards.set([]);
      this.canFlip = true;
      this.checkWin();
    } else {
      setTimeout(() => {
        const updatedCards = this.cards().map((c) =>
          c.id === firstId || c.id === secondId ? { ...c, isFlipped: false } : c
        );
        this.cards.set(updatedCards);
        this.flippedCards.set([]);
        this.canFlip = true;
      }, 1000);
    }
  }

  private checkWin(): void {
    const allMatched = this.cards().every((c) => c.isMatched);
    if (allMatched) {
      this.stopTimer();
      this.gameWon.set(true);
    }
  }

  restartGame(): void {
    this.stopTimer();
    this.gameStarted.set(false);
    this.gameWon.set(false);
    this.cards.set([]);
    this.flippedCards.set([]);
    this.moves.set(0);
    this.timer.set(0);
  }

  goHome(): void {
    this.stopTimer();
    this.router.navigate(['/']);
  }

  getThemeIcon(themeId: string): string {
    const theme = this.themes.find((t) => t.id === themeId);
    return theme ? theme.icon : 'help';
  }
}
