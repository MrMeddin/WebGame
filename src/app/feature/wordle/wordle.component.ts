import { Component, inject, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { WordleService, LetterResult } from './services/wordle.service';
import { DE_LABELS } from '@app/shared/labels';
import { WORDLE_CONFIG } from '@app/shared/constants';

@Component({
  selector: 'app-wordle',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule, MatProgressSpinnerModule],
  templateUrl: './wordle.component.html',
  styleUrl: './wordle.component.scss'
})
export class WordleComponent implements OnInit {
  private readonly wordleService = inject(WordleService);
  private readonly router = inject(Router);

  labels = DE_LABELS;
  wordLength = WORDLE_CONFIG.WORD_LENGTH;
  maxGuesses = WORDLE_CONFIG.MAX_GUESSES;

  guesses$ = this.wordleService.guesses$;
  currentGuess$ = this.wordleService.currentGuess$;
  gameStatus$ = this.wordleService.gameStatus$;
  currentRow = this.wordleService.currentRow;
  hasWon = this.wordleService.hasWon;
  targetWord$ = this.wordleService.targetWord$;
  errorMessage$ = this.wordleService.errorMessage$;

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (this.gameStatus$() !== 'playing') return;

    const key = event.key.toUpperCase();

    if (key === 'ENTER') {
      event.preventDefault();
      this.wordleService.submitGuess();
    } else if (key === 'BACKSPACE') {
      this.wordleService.removeLetter();
    } else if (/^[A-ZÄÖÜ]$/.test(key)) {
      this.wordleService.addLetter(key);
    }
  }

  ngOnInit(): void {
    this.wordleService.initialize();
  }

  getRows(): number[] {
    return Array(this.maxGuesses).fill(0);
  }

  getCols(): number[] {
    return Array(this.wordLength).fill(0);
  }

  getGuessResults(guess: string): LetterResult[] {
    return this.wordleService.getGuessResults(guess);
  }

  addLetter(letter: string): void {
    this.wordleService.addLetter(letter);
  }

  removeLetter(): void {
    this.wordleService.removeLetter();
  }

  submitGuess(): void {
    this.wordleService.submitGuess();
  }

  getErrorMessage(): string {
    const key = this.errorMessage$();
    return key ? DE_LABELS[key as keyof typeof DE_LABELS] || key : '';
  }

  playAgain(): void {
    this.wordleService.playAgain();
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
