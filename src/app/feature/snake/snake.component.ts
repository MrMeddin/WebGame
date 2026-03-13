import {
  Component,
  ChangeDetectionStrategy,
  signal,
  inject,
  OnDestroy,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface SnakeSegment {
  x: number;
  y: number;
}

interface GameCell {
  x: number;
  y: number;
  type: 'empty' | 'snake' | 'food' | 'bomb';
}

@Component({
  selector: 'app-snake',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './snake.component.html',
  styleUrl: './snake.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SnakeComponent implements OnDestroy {
  private readonly router = inject(Router);

  gameStarted = signal(false);
  gameOver = signal(false);
  gameWon = signal(false);
  score = signal(0);
  highScore = signal(0);

  private gridSize = 15;
  private snake: SnakeSegment[] = [];
  private direction = { x: 1, y: 0 };
  private nextDirection = { x: 1, y: 0 };
  private food = { x: 0, y: 0 };
  private gameInterval: any;
  private speed = 150;

  grid = signal<GameCell[][]>([]);

  @HostListener('window:keydown', ['$event'])
  handleKeydown(event: KeyboardEvent): void {
    if (!this.gameStarted() || this.gameOver()) return;

    switch (event.key) {
      case 'ArrowUp':
        this.setDirection('up');
        break;
      case 'ArrowDown':
        this.setDirection('down');
        break;
      case 'ArrowLeft':
        this.setDirection('left');
        break;
      case 'ArrowRight':
        this.setDirection('right');
        break;
    }
  }

  private touchStartX = 0;
  private touchStartY = 0;

  handleTouchStart(event: TouchEvent): void {
    this.touchStartX = event.touches[0].clientX;
    this.touchStartY = event.touches[0].clientY;
  }

  handleTouchMove(event: TouchEvent): void {
    if (!this.gameStarted() || this.gameOver()) return;
    event.preventDefault();

    const touchEndX = event.touches[0].clientX;
    const touchEndY = event.touches[0].clientY;
    const diffX = touchEndX - this.touchStartX;
    const diffY = touchEndY - this.touchStartY;
    const minSwipe = 30;

    if (Math.abs(diffX) > Math.abs(diffY)) {
      if (diffX > minSwipe) {
        this.setDirection('right');
        this.touchStartX = touchEndX;
        this.touchStartY = touchEndY;
      } else if (diffX < -minSwipe) {
        this.setDirection('left');
        this.touchStartX = touchEndX;
        this.touchStartY = touchEndY;
      }
    } else {
      if (diffY > minSwipe) {
        this.setDirection('down');
        this.touchStartX = touchEndX;
        this.touchStartY = touchEndY;
      } else if (diffY < -minSwipe) {
        this.setDirection('up');
        this.touchStartX = touchEndX;
        this.touchStartY = touchEndY;
      }
    }
  }

  setDirection(dir: 'up' | 'down' | 'left' | 'right'): void {
    if (!this.gameStarted() || this.gameOver()) return;

    switch (dir) {
      case 'up':
        if (this.direction.y !== 1) this.nextDirection = { x: 0, y: -1 };
        break;
      case 'down':
        if (this.direction.y !== -1) this.nextDirection = { x: 0, y: 1 };
        break;
      case 'left':
        if (this.direction.x !== 1) this.nextDirection = { x: -1, y: 0 };
        break;
      case 'right':
        if (this.direction.x !== -1) this.nextDirection = { x: 1, y: 0 };
        break;
    }
  }

  startGame(): void {
    this.snake = [
      { x: Math.floor(this.gridSize / 2), y: Math.floor(this.gridSize / 2) },
      { x: Math.floor(this.gridSize / 2) - 1, y: Math.floor(this.gridSize / 2) },
      { x: Math.floor(this.gridSize / 2) - 2, y: Math.floor(this.gridSize / 2) },
    ];
    this.direction = { x: 1, y: 0 };
    this.nextDirection = { x: 1, y: 0 };
    this.score.set(0);
    this.speed = 150;
    this.spawnFood();
    this.gameStarted.set(true);
    this.gameOver.set(false);
    this.gameWon.set(false);
    this.updateGrid();

    if (this.gameInterval) clearInterval(this.gameInterval);
    this.gameInterval = setInterval(() => this.gameLoop(), this.speed);
  }

  private spawnFood(): void {
    let validPosition = false;
    while (!validPosition) {
      this.food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize),
      };
      validPosition = !this.snake.some((s) => s.x === this.food.x && s.y === this.food.y);
    }
  }

  private gameLoop(): void {
    this.direction = { ...this.nextDirection };

    const head = { x: this.snake[0].x + this.direction.x, y: this.snake[0].y + this.direction.y };

    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      this.endGame(false);
      return;
    }

    if (this.snake.some((s) => s.x === head.x && s.y === head.y)) {
      this.endGame(false);
      return;
    }

    this.snake.unshift(head);

    if (head.x === this.food.x && head.y === this.food.y) {
      this.score.update((s) => s + 10);
      this.speed = Math.max(50, this.speed - 5);
      clearInterval(this.gameInterval);
      this.gameInterval = setInterval(() => this.gameLoop(), this.speed);

      if (this.snake.length === this.gridSize * this.gridSize) {
        this.endGame(true);
        return;
      }
      this.spawnFood();
    } else {
      this.snake.pop();
    }

    this.updateGrid();
  }

  private updateGrid(): void {
    const newGrid: GameCell[][] = [];
    for (let y = 0; y < this.gridSize; y++) {
      const row: GameCell[] = [];
      for (let x = 0; x < this.gridSize; x++) {
        let type: GameCell['type'] = 'empty';
        if (this.snake.some((s) => s.x === x && s.y === y)) type = 'snake';
        if (this.food.x === x && this.food.y === y) type = 'food';
        row.push({ x, y, type });
      }
      newGrid.push(row);
    }
    this.grid.set(newGrid);
  }

  private endGame(won: boolean): void {
    clearInterval(this.gameInterval);
    this.gameOver.set(true);
    this.gameWon.set(won);
    if (this.score() > this.highScore()) {
      this.highScore.set(this.score());
    }
  }

  restartGame(): void {
    this.gameStarted.set(false);
    this.gameOver.set(false);
    this.gameWon.set(false);
  }

  goHome(): void {
    clearInterval(this.gameInterval);
    this.router.navigate(['/']);
  }

  ngOnDestroy(): void {
    if (this.gameInterval) clearInterval(this.gameInterval);
  }
}
