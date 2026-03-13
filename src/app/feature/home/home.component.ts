import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

import { DE_LABELS } from '@app/shared/labels';
import { getGameIcon } from '@app/shared/constants';
import { ChatComponent } from './components/chat/chat.component';

interface GameCard {
  id: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  route: string;
  available: boolean;
  isKaiTip?: boolean;
}

interface TeamMember {
  name: string;
  role: string;
  description: string;
  avatar: string;
  facts: string[];
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, ChatComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HomeComponent {
  labels = DE_LABELS;
  getGameIcon = getGameIcon;
  menuOpen = signal(false);
  showChat = signal(false);

  team: TeamMember[] = [
    {
      name: 'Kai',
      role: 'IT-Abteilung',
      description:
        'Entwickelt innovative Web-Lösungen mit Leidenschaft und Präzision. Immer auf der Suche nach eleganten Lösungen für komplexe Probleme.',
      avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=kai&backgroundColor=0f3460',
      facts: [
        'Liebt sauberen Code',
        '16 Programmiersprachen',
        'Hat keine Angst vor Deadlines',
        'Trinkt am liebsten digitalen Kaffee',
      ],
    },
  ];

  kaiFacts = [
    'Hey! Ich bin Kai 👋',
    'Ich entwickle diese Spiele für dich!',
    'Mehr Games coming soon...',
    ' Hast du Feedback für mich?',
  ];

  currentFactIndex = signal(0);
  private factInterval: any;

  games: GameCard[] = [
    {
      id: 'snake',
      title: 'Snake',
      description: 'Klassisches Schlangenspiel',
      icon: 'sports_esports',
      color: '#4ade80',
      route: '/snake',
      available: true,
      isKaiTip: true,
    },
    {
      id: 'quiz',
      title: 'Allgemeinwissen Quiz',
      description: 'Teste dein Wissen',
      icon: 'quiz',
      color: '#6200ee',
      route: '/quiz/setup',
      available: true,
    },
    {
      id: 'wordle',
      title: 'Wordle',
      description: 'Errate das Wort',
      icon: 'text_fields',
      color: '#ff9800',
      route: '/wordle',
      available: true,
    },
    {
      id: 'memory',
      title: 'Memory',
      description: 'Finde Paare',
      icon: 'psychology',
      color: '#009688',
      route: '/memory',
      available: true,
    },
  ];

  constructor(private router: Router) {
    this.startFactRotation();
  }

  private startFactRotation(): void {
    this.factInterval = setInterval(() => {
      this.currentFactIndex.update((i) => (i + 1) % this.kaiFacts.length);
    }, 4000);
  }

  toggleMenu(): void {
    this.menuOpen.update((v) => !v);
    if (!this.menuOpen()) {
      this.showChat.set(false);
    }
  }

  openChat(): void {
    this.showChat.set(true);
  }

  closeChat(): void {
    this.showChat.set(false);
  }

  playGame(game: GameCard): void {
    if (game.available) {
      this.router.navigate([game.route]);
    }
  }
}
