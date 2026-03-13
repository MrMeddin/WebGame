import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, catchError, map, of, tap, delay } from 'rxjs';

import { WORDLE_CONFIG, WORDLE_API_URL, FALLBACK_WORDS, LetterState } from '@app/shared/constants';

export interface LetterResult {
  letter: string;
  state: LetterState;
}

interface WordApiResponse {
  word: string;
  score: number;
  tags: string[];
}

type GameStatus = 'loading' | 'playing' | 'won' | 'lost';

@Injectable({ providedIn: 'root' })
export class WordleService {
  private readonly httpClient = inject(HttpClient);

  private readonly targetWord = signal<string>('');
  private readonly guesses = signal<string[]>([]);
  private readonly currentGuess = signal<string>('');
  private readonly gameStatus = signal<GameStatus>('loading');
  private readonly errorMessage = signal<string>('');

  readonly targetWord$ = computed(() => this.targetWord());
  readonly guesses$ = computed(() => this.guesses());
  readonly currentGuess$ = computed(() => this.currentGuess());
  readonly gameStatus$ = computed(() => this.gameStatus());
  readonly errorMessage$ = computed(() => this.errorMessage());

  readonly currentRow = computed(() => this.guesses().length);
  readonly isGameOver = computed(() => this.gameStatus() !== 'playing' && this.gameStatus() !== 'loading');
  readonly hasWon = computed(() => this.gameStatus() === 'won');
  readonly wordLength = WORDLE_CONFIG.WORD_LENGTH;
  readonly maxGuesses = WORDLE_CONFIG.MAX_GUESSES;

  initialize(): void {
    this.loadRandomWord();
  }

  private loadRandomWord(): void {
    this.gameStatus.set('loading');
    this.guesses.set([]);
    this.currentGuess.set('');
    this.errorMessage.set('');

    this.fetchRandomWords().subscribe({
      next: (words) => {
        const word = words?.length 
          ? words[Math.floor(Math.random() * words.length)].toUpperCase()
          : this.getRandomFallbackWord();
        
        this.targetWord.set(word);
        this.gameStatus.set('playing');
      },
      error: () => {
        this.targetWord.set(this.getRandomFallbackWord());
        this.gameStatus.set('playing');
      }
    });
  }

  private fetchRandomWords(): Observable<string[]> {
    return this.httpClient.get<WordApiResponse[]>(
      `${WORDLE_API_URL}?sp=??????&max=100&md=p`
    ).pipe(
      map(response => response
        .filter(w => w.word.length === WORDLE_CONFIG.WORD_LENGTH)
        .map(w => w.word)
      ),
      catchError(() => of([]))
    );
  }

  private getRandomFallbackWord(): string {
    return FALLBACK_WORDS[Math.floor(Math.random() * FALLBACK_WORDS.length)];
  }

  addLetter(letter: string): void {
    if (this.gameStatus() !== 'playing') return;
    if (this.currentGuess().length >= WORDLE_CONFIG.WORD_LENGTH) return;

    this.currentGuess.update(current => current + letter.toUpperCase());
  }

  removeLetter(): void {
    if (this.gameStatus() !== 'playing') return;
    this.currentGuess.update(current => current.slice(0, -1));
  }

  submitGuess(): boolean {
    if (this.gameStatus() !== 'playing') return false;

    const guess = this.currentGuess();

    if (guess.length < WORDLE_CONFIG.WORD_LENGTH) {
      this.showError('wordleTooShort');
      return false;
    }

    this.guesses.update(guesses => [...guesses, guess]);
    this.currentGuess.set('');

    if (guess === this.targetWord()) {
      this.gameStatus.set('won');
    } else if (this.guesses().length >= WORDLE_CONFIG.MAX_GUESSES) {
      this.gameStatus.set('lost');
    }

    return true;
  }

  getGuessResults(guess: string): LetterResult[] {
    const target = this.targetWord();
    const results: LetterResult[] = [];
    const targetLetters = target.split('');
    const guessLetters = guess.split('');
    const usedIndices = new Set<number>();

    for (let i = 0; i < guessLetters.length; i++) {
      if (guessLetters[i] === targetLetters[i]) {
        results[i] = { letter: guessLetters[i], state: 'correct' };
        usedIndices.add(i);
      }
    }

    for (let i = 0; i < guessLetters.length; i++) {
      if (results[i]) continue;

      const letter = guessLetters[i];
      let foundIndex = -1;

      for (let j = 0; j < targetLetters.length; j++) {
        if (!usedIndices.has(j) && targetLetters[j] === letter) {
          foundIndex = j;
          break;
        }
      }

      if (foundIndex !== -1) {
        results[i] = { letter, state: 'present' };
        usedIndices.add(foundIndex);
      } else {
        results[i] = { letter, state: 'absent' };
      }
    }

    return results;
  }

  private showError(key: string): void {
    this.errorMessage.set(key);
    setTimeout(() => this.errorMessage.set(''), 2000);
  }

  playAgain(): void {
    this.initialize();
  }
}
