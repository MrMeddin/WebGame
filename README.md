# 🎯 Trivia Quiz App - Modern Angular 19+

Eine moderne, vollständig refaktorierte **Allgemeinwissen-Quiz-Anwendung** mit Angular 19+, Standalone Components, Signals und Material 3 Design.

---

## 📋 Features

✅ **Open Trivia DB Integration** - Echte Quiz-Fragen von [opentdb.com](https://opentdb.com)  
✅ **Standalone Components** - Kein Module nötig  
✅ **Signals & Computed** - State Management ohne RxJS Boilerplate  
✅ **OnPush ChangeDetection** - Optimale Performance  
✅ **Material 3 Design** - Modernes UI mit Design Tokens  
✅ **WCAG AA Accessibility** - Barrierefreie Bedienung  
✅ **Responsive Design** - Mobile-First Approach  
✅ **Strict TypeScript** - Keine `any`-Typen  
✅ **Vitest Setup** - Unit Test Ready  

---

## ��️ Projektstruktur

```
src/app/
├── fundamentale/                    # Core Business Logic
│   ├── models/
│   │   ├── quiz.model.ts           # IQuestion, IQuiz, ITriviaQuestion
│   │   ├── difficulty.enum.ts      # Difficulty Levels
│   │   └── index.ts
│   ├── services/
│   │   ├── trivia-api.service.ts   # Open Trivia DB HTTP Client
│   │   └── index.ts
│   ├── repos/
│   │   ├── quiz.repo.ts            # Quiz Data Mapper (API → Domain)
│   │   └── index.ts
│   └── index.ts
├── shared/                          # Reusable Components & Utils
│   ├── components/
│   │   ├── quiz-card.component.ts
│   │   ├── progress-bar.component.ts
│   │   └── index.ts
│   └── index.ts
├── feature/quiz/                    # Quiz Feature (Lazy Loaded)
│   ├── components/
│   │   ├── question.component.ts
│   │   ├── quiz-result.component.ts
│   │   └── index.ts
│   ├── services/
│   │   ├── quiz.service.ts         # Quiz State Management (Signals)
│   │   └── index.ts
│   ├── quiz.component.ts           # Main Container
│   └── quiz-routing.ts
├── app.ts                           # Root Component
├── app.routes.ts                    # Route Configuration
├── app.config.ts                    # Angular Config + Providers
└── app.html                         # Root Template
├── styles/
│   ├── variables.scss              # Design Tokens
│   ├── mixins.scss                 # SCSS Utilities
│   └── index.scss
└── styles.scss                      # Global Styles
```

---

## 🚀 Installation & Ausführung

### Anforderungen
- Node.js 22+ (empfohlen)
- pnpm 10.32.1+

### Setup

```bash
cd trivia-game

# Dependencies installieren
pnpm install

# Development Server starten
pnpm start

# Browser: http://localhost:4200
```

### Bauen

```bash
# Production Build
pnpm run build

# Output: dist/trivia-game/
```

### Tests

```bash
pnpm test
```

---

## 🎨 Design System

### Material 3 Tokens (src/styles/variables.scss)

```scss
$primary-color: #6200ee;        // Purple
$secondary-color: #03dac6;      // Teal
$error-color: #b3261e;          // Red
$surface-color: #fffbfe;        // Off-White
```

### Responsive Breakpoints

- **sm**: 640px
- **md**: 768px
- **lg**: 1024px
- **xl**: 1280px

### Spacing System

```
$spacing-xs: 0.25rem   // 4px
$spacing-sm: 0.5rem    // 8px
$spacing-md: 1rem      // 16px
$spacing-lg: 1.5rem    // 24px
$spacing-xl: 2rem      // 32px
```

---

## 📦 Core Modules

### 1. **TriviaApiService** (Fundamentale)
Kommuniziert mit Open Trivia DB API.

```typescript
constructor(private http = inject(HttpClient)) {}

getQuestions(amount: 10, category?: number, difficulty?: string): Observable<ITriviaQuestion[]>
decodeHtmlEntity(text: string): string
```

### 2. **QuizRepository** (Fundamentale)
Mappt API-Daten zu Domain Models.

```typescript
createQuiz(amount: 10, category?, difficulty?): Observable<IQuiz>
private mapToQuestion(apiQuestion: ITriviaQuestion, id: string): IQuestion
private shuffleAnswers(answers: string[]): string[]
```

### 3. **QuizService** (Feature)
State Management mit Signals.

```typescript
// Signals
quizState = signal<IQuiz | null>(null)
isLoading = signal<boolean>(false)
error = signal<string | null>(null)

// Computed
currentQuestion = computed(() => ...)
progress = computed(() => ...)
score = computed(() => ...)

// Methods
initializeQuiz(amount, category?, difficulty?): void
submitAnswer(answer: string): void
moveToNext(): void
resetQuiz(): void
```

### 4. **QuizComponent** (Feature - Main Container)
Orchestriert Quiz-Flow mit Quiz-, Question- und Result-Components.

---

## 🎯 Models

### IQuestion
```typescript
{
  id: string;
  category: string;
  difficulty: string;
  type: 'multiple' | 'boolean';
  question: string;
  correctAnswer: string;
  incorrectAnswers: string[];
  allAnswers: string[];           // Shuffled
  selectedAnswer: string | null;
  isAnswered: boolean;
}
```

### IQuiz
```typescript
{
  id: string;
  questions: IQuestion[];
  currentQuestionIndex: number;
  score: number;
  totalQuestions: number;
  isCompleted: boolean;
  difficulty: string;
}
```

---

## ♿ Accessibility Features

- ✅ ARIA Labels auf interaktiven Elementen
- ✅ Focus Management mit `:focus-visible`
- ✅ Semantisches HTML (`<button>`, `<label>`, roles)
- ✅ Screen Reader Support
- ✅ Keyboard Navigation
- ✅ Reduced Motion Preferences

---

## 🔐 Security & Best Practices

✅ **Strict TypeScript** - Keine `any`-Typen  
✅ **OnPush ChangeDetection** - Optimale Performance  
✅ **RxJS Best Practices** - switchMap, catchError  
✅ **No Mutating Signals** - Nur `.set()` und `.update()`  
✅ **Lazy Loading** - Feature Routes via loadChildren  
✅ **Dependency Injection** - `inject()` statt Constructor DI  

---

## 🌐 Routing

```typescript
// Lazy Loading
{
  path: 'quiz',
  loadChildren: () => import('./feature/quiz/quiz-routing').then(m => m.quizRoutes)
}

// Default Redirect
{
  path: '',
  redirectTo: 'quiz',
  pathMatch: 'full'
}
```

---

## 📚 Angular 19+ Features verwendet

- **Standalone Components** - Keine Module
- **Signals** - `signal()`, `computed()`, `effect()`
- **Change Detection** - `ChangeDetectionStrategy.OnPush`
- **Control Flow** - `@if`, `@for`, `@switch`
- **Input/Output** - `input()`, `output()`, `input.required()`
- **Dependency Injection** - `inject()` Funktion
- **HTTP Client** - Neue API mit RxJS
- **Routing** - Lazy Loading mit `loadChildren`

---

## 🎯 Next Steps

- [ ] Dark/Light Theme Toggle
- [ ] Quiz Category Selection
- [ ] Score History/Leaderboard
- [ ] Multiplayer Mode
- [ ] PWA Support
- [ ] E2E Tests mit Playwright
- [ ] Performance Monitoring

---

## 📄 Lizenz

ISC

---

## 👨‍💻 Autor

Refactored by **Copilot** für moderne Angular Best Practices.

**Erstellt:** März 2026  
**Angular Version:** 21.2.0  
**Material Version:** 21.2.2  
**Node.js:** v25.8.1+
