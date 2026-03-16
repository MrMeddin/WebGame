import { Component, inject, signal, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

interface BoredState {
  xp: number;
  level: number;
  completed: number;
  xpPerLevel: number;
}

interface BoredActivity {
  activity: string;
  type: string;
  participants: number;
}

const CATEGORY_NAMES: Record<string, string> = {
  education: 'Bildung',
  recreational: 'Freizeit',
  social: 'Soziales',
  diy: 'DIY',
  charity: 'Charity',
  cooking: 'Kochen',
  relaxation: 'Entspannung',
  music: 'Musik',
  busywork: 'Arbeit',
};

const FALLBACK_ACTIVITIES: BoredActivity[] = [
  { activity: 'Mach 10 Liegestütze', type: 'recreational', participants: 1 },
  { activity: 'Lies ein Buch für 30 Minuten', type: 'education', participants: 1 },
  { activity: 'Räum dein Zimmer auf', type: 'diy', participants: 1 },
  { activity: 'Koche etwas Leckeres', type: 'cooking', participants: 1 },
  { activity: 'Hör dein Lieblingslied', type: 'music', participants: 1 },
  { activity: 'Mach einen Spaziergang', type: 'relaxation', participants: 1 },
  { activity: 'Ruf einen Freund an', type: 'social', participants: 2 },
  { activity: 'Meditiere für 10 Minuten', type: 'relaxation', participants: 1 },
  { activity: 'Schreibe einen Brief an dich selbst', type: 'education', participants: 1 },
  { activity: 'Mach eine Yoga-Session', type: 'relaxation', participants: 1 },
];

@Component({
  selector: 'app-bored',
  standalone: true,
  imports: [CommonModule, MatButtonModule, MatIconModule],
  templateUrl: './bored.component.html',
  styleUrl: './bored.component.scss',
})
export class BoredComponent implements OnInit {
  private readonly router = inject(Router);

  xp = signal(0);
  level = signal(1);
  completed = signal(0);
  xpPerLevel = signal(100);

  currentActivity = signal<BoredActivity | null>(null);
  loading = signal(false);
  hasActivity = signal(false);

  ngOnInit(): void {
    this.loadState();
  }

  private loadState(): void {
    const saved = localStorage.getItem('boredState');
    if (saved) {
      const state: BoredState = JSON.parse(saved);
      this.xp.set(state.xp);
      this.level.set(state.level);
      this.completed.set(state.completed);
      this.xpPerLevel.set(state.xpPerLevel);
    }
  }

  private saveState(): void {
    const state: BoredState = {
      xp: this.xp(),
      level: this.level(),
      completed: this.completed(),
      xpPerLevel: this.xpPerLevel(),
    };
    localStorage.setItem('boredState', JSON.stringify(state));
  }

  private addXP(amount: number): void {
    let newXp = this.xp() + amount;
    let newLevel = this.level();
    let newXpPerLevel = this.xpPerLevel();

    while (newXp >= newXpPerLevel) {
      newXp -= newXpPerLevel;
      newLevel++;
      newXpPerLevel = Math.floor(newXpPerLevel * 1.2);
    }

    this.xp.set(newXp);
    this.level.set(newLevel);
    this.xpPerLevel.set(newXpPerLevel);
    this.completed.update((c) => c + 1);
    this.saveState();
  }

  getCategoryName(type: string): string {
    return CATEGORY_NAMES[type] || type;
  }

  async fetchActivity(): Promise<void> {
    this.loading.set(true);

    try {
      const res = await fetch('https://bored-api.appbrewery.com/random');
      if (!res.ok) throw new Error('API Error');
      const data: BoredActivity = await res.json();
      this.currentActivity.set(data);
      this.hasActivity.set(true);
    } catch {
      const fallback = FALLBACK_ACTIVITIES[Math.floor(Math.random() * FALLBACK_ACTIVITIES.length)];
      this.currentActivity.set({ ...fallback });
      this.hasActivity.set(true);
    } finally {
      this.loading.set(false);
    }
  }

  markDone(): void {
    this.addXP(25);
    this.currentActivity.set(null);
    this.hasActivity.set(false);
  }

  goHome(): void {
    this.router.navigate(['/']);
  }
}
