import { Component, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DE_LABELS } from '@app/shared/labels';
import { getGameIcon } from '@app/shared/constants';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  available: boolean;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  labels = DE_LABELS;
  getGameIcon = getGameIcon;

  games: GameCard[] = [
    {
      id: 'quiz',
      title: 'Allgemeinwissen Quiz',
      description: 'Teste dein Wissen in verschiedenen Kategorien',
      icon: 'quiz',
      color: '#6200ee',
      route: '/quiz/setup',
      available: true,
    },
    {
      id: 'wordle',
      title: 'Wordle',
      description: 'Errate das Wort in 6 Versuchen',
      icon: 'text_fields',
      color: '#ff9800',
      route: '/wordle',
      available: true,
    },
    {
      id: 'memory',
      title: 'Memory',
      description: 'Finde die passenden Paare',
      icon: 'psychology',
      color: '#009688',
      route: '/memory',
      available: false,
    },
  ];

  constructor(private router: Router) {}

  playGame(game: GameCard): void {
    if (game.available) {
      this.router.navigate([game.route]);
    }
  }
}
