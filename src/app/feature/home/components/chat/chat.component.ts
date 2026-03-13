import {
  Component,
  signal,
  ElementRef,
  ViewChild,
  AfterViewChecked,
  ChangeDetectionStrategy,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';

interface ChatMessage {
  id: number;
  text: string;
  sender: 'user' | 'kai';
  timestamp: Date;
}

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule, MatIconModule, MatButtonModule],
  templateUrl: './chat.component.html',
  styleUrl: './chat.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatComponent implements AfterViewChecked {
  @ViewChild('chatContainer') private chatContainer!: ElementRef;

  messages = signal<ChatMessage[]>([
    {
      id: 0,
      text: 'Hey! Ich bin Kai. Schreib mir etwas! 👋',
      sender: 'kai',
      timestamp: new Date(),
    },
  ]);

  newMessage = signal('');
  isTyping = signal(false);

  private kaiResponses = [
    'Interessant! Erzähl mir mehr.',
    'Das klingt cool!',
    'Hmm, darüber muss ich nachdenken...',
    'Verstanden!',
    'Ich bin immer noch dabei, das zu verarbeiten.',
    'Weißt du, ich bin eigentlich nur Code, aber ich finds trotzdem faszinierend!',
    'Lass uns über Spiele reden!',
    'Was denkst du über die Spiele hier?',
    'Ich bin gespannt auf dein Feedback!',
    'Das ist eine interessante Perspektive.',
  ];

  private keywordResponses: Record<string, string[]> = {
    hallo: ['Hey! Wie gehts?', 'Hi! Schön, dass du schreibst! 👋', 'Hallo! Was gibt es?'],
    name: ['Ich bin Kai, dein virtueller Spiele-Entwickler!', 'Mein Name ist Kai.'],
    wer: [
      'Ich bin Kai, ein KI-Assistent, der diese Spiele für dich entwickelt hat.',
      'Ich bin hier, um dir bei den Spielen zu helfen!',
    ],
    spiel: [
      'Welches Spiel magst du am liebsten?',
      'Ich hab Memory, Quiz und Wordle gebaut!',
      'Probier doch mal Memory aus!',
    ],
    memory: [
      'Memory ist klasse! Trainiert das Gedächtnis.',
      'Ich hab 3 Schwierigkeiten: 4x4, 6x6 und 8x8!',
    ],
    quiz: [
      'Das Quiz kommt von OpenTDB!',
      'Wähle Kategorien und Schwierigkeit, dann kann es losgehen!',
    ],
    wordle: ['Wordle - errate das Wort in 6 Versuchen!', 'Bei Wordle zählt jede Menge Logik!'],
    help: [
      'Ich kann mit dir chatten oder dir bei den Spielen helfen!',
      'Schreib mir einfach, was du wissen möchtest!',
    ],
    danke: ['Gerne! 😊', 'Kein Problem!', 'Immer wieder gerne!'],
    frage: ['Stell mir eine Frage!', 'Was möchtest du wissen?'],
    code: ['Ich liebe sauberen Code!', 'Programmieren ist meine Leidenschaft.'],
    gut: ['Freut mich! 😊', 'Das freut mich zu hören!'],
    schlecht: ['Schade... Kann ich helfen?', 'Was ist los?'],
    neu: ['Ich arbeite ständig an neuen Features!', 'Bald kommen mehr Spiele!'],
    feedback: ['Ich bin gespannt auf dein Feedback!', 'Sag mir, was besser werden soll!'],
  };

  private getResponse(text: string): string {
    const lower = text.toLowerCase();

    for (const [keyword, responses] of Object.entries(this.keywordResponses)) {
      if (lower.includes(keyword)) {
        return responses[Math.floor(Math.random() * responses.length)];
      }
    }

    return this.kaiResponses[Math.floor(Math.random() * this.kaiResponses.length)];
  }

  sendMessage(): void {
    const text = this.newMessage().trim();
    if (!text) return;

    const userMsg: ChatMessage = {
      id: this.messages().length,
      text,
      sender: 'user',
      timestamp: new Date(),
    };

    this.messages.update((msgs) => [...msgs, userMsg]);
    this.newMessage.set('');
    this.isTyping.set(true);

    setTimeout(
      () => {
        const response = this.getResponse(text);
        const kaiMsg: ChatMessage = {
          id: this.messages().length,
          text: response,
          sender: 'kai',
          timestamp: new Date(),
        };
        this.messages.update((msgs) => [...msgs, kaiMsg]);
        this.isTyping.set(false);
      },
      1000 + Math.random() * 1500
    );
  }

  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked(): void {
    this.scrollToBottom();
  }

  private scrollToBottom(): void {
    try {
      this.chatContainer.nativeElement.scrollTop = this.chatContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }
}
