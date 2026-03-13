# 📁 Projektstruktur nach Angular 20 Best Practices

## Ordnerorganisation

Jede Komponente hat seinen **eigenen Ordner** mit:
- `component.ts` - TypeScript Logik
- `component.html` - HTML Template
- `component.scss` - Komponentenspezifische Styles

```
src/app/
│
├── app.ts                          # Root Component
├── app.config.ts                   # Angular Configuration
├── app.routes.ts                   # Main Routes
├── app.html                        # Root Template
├── app.scss                        # Root Styles
│
├── fundamentale/                   # 🎯 Core Business Logic Layer
│   ├── models/
│   │   ├── quiz.model.ts          # Interfaces: IQuestion, IQuiz
│   │   ├── difficulty.enum.ts     # Enums: Difficulty
│   │   └── index.ts               # Barrel Export
│   │
│   ├── services/
│   │   ├── trivia-api.service.ts  # Open Trivia DB HTTP Client
│   │   ├── trivia-api.service.spec.ts
│   │   └── index.ts
│   │
│   ├── repos/
│   │   ├── quiz.repo.ts           # Data Mapper: API → Domain
│   │   └── index.ts
│   │
│   └── index.ts                   # Barrel Export (Root)
│
├── shared/                         # 🔧 Reusable UI Components
│   ├── components/
│   │   ├── quiz-card/
│   │   │   ├── quiz-card.component.ts
│   │   │   ├── quiz-card.component.html
│   │   │   └── quiz-card.component.scss
│   │   │
│   │   ├── progress-bar/
│   │   │   ├── progress-bar.component.ts
│   │   │   ├── progress-bar.component.html
│   │   │   └── progress-bar.component.scss
│   │   │
│   │   └── index.ts               # Barrel Export
│   │
│   ├── pipes/                      # (Future: Custom Pipes)
│   ├── directives/                 # (Future: Custom Directives)
│   └── index.ts                   # Root Export
│
├── feature/                        # 🎮 Feature Modules (Lazy Loaded)
│   └── quiz/
│       ├── quiz-routing.ts         # Feature Routes
│       │
│       ├── quiz/
│       │   ├── quiz.component.ts   # Main Container Component
│       │   ├── quiz.component.html
│       │   └── quiz.component.scss
│       │
│       ├── components/             # Dumb/Presentational Components
│       │   ├── question/
│       │   │   ├── question.component.ts
│       │   │   ├── question.component.html
│       │   │   └── question.component.scss
│       │   │
│       │   ├── quiz-result/
│       │   │   ├── quiz-result.component.ts
│       │   │   ├── quiz-result.component.html
│       │   │   └── quiz-result.component.scss
│       │   │
│       │   └── index.ts
│       │
│       └── services/               # Feature-Specific Services
│           ├── quiz.service.ts     # Quiz State (Signals)
│           └── index.ts
│
└── styles/                         # 🎨 Global SCSS
    ├── variables.scss              # Design Tokens (Colors, Spacing)
    ├── mixins.scss                 # SCSS Utilities
    └── index.scss                  # (for imports)
```

## 📋 Komponenten-Kategorien

### **Shared Components** (Wiederverwendbar)
- `quiz-card/` - Wrapper für Karteninhalte
- `progress-bar/` - Fortschrittsbalken

### **Feature Components** (Quiz-Spezifisch)
- `quiz/` - Haupt-Container (Smart Component)
- `question/` - Einzelne Frage (Dumb Component)
- `quiz-result/` - Ergebnisseite (Dumb Component)

## 🏗️ Naming Conventions

### Files
- **Komponenten**: `kebab-case` - `quiz-card.component.ts`
- **Services**: `kebab-case` - `trivia-api.service.ts`
- **Models**: `kebab-case` - `quiz.model.ts`

### Classes
- **Komponenten**: `PascalCase` - `export class QuizCardComponent`
- **Services**: `PascalCase` - `export class TriviaApiService`

### Selectors
- `app-quiz-card` (aus `QuizCardComponent`)
- `app-progress-bar` (aus `ProgressBarComponent`)
- `app-question` (aus `QuestionComponent`)

## 📦 Exports (Barrel Pattern)

### `src/app/shared/components/index.ts`
```typescript
export { QuizCardComponent } from './quiz-card/quiz-card.component';
export { ProgressBarComponent } from './progress-bar/progress-bar.component';
```

### `src/app/fundamentale/models/index.ts`
```typescript
export * from './quiz.model';
export * from './difficulty.enum';
```

## 🎯 Best Practices Applied

✅ **One Component Per Folder**
- Jede Komponente hat ihren eigenen Ordner
- Alle zugehörigen Dateien (TS, HTML, SCSS) zusammen

✅ **Barrel Exports**
- `index.ts` für einfache Imports
- `import { QuizCardComponent } from '@app/shared/components'`

✅ **Standalone Components**
- Kein NgModule nötig
- Direkte Imports in anderen Komponenten

✅ **Smart/Dumb Komponenten**
- Smart: `QuizComponent` (mit Service Injection)
- Dumb: `QuestionComponent`, `QuizResultComponent` (nur @input/@output)

✅ **Lazy Loading**
- Feature Module lazy-loaded
- `loadChildren: () => import('...quiz-routing')`

✅ **Strict TypeScript**
- Keine `any`-Typen
- Strenge Typisierung überall

## 🔄 Dependency Flow

```
App Component
  ↓
Feature Routes (Lazy)
  ↓
Quiz Component (Smart)
  ├→ Question Component (Dumb)
  ├→ QuizResult Component (Dumb)
  └→ QuizService (Signals)
       └→ QuizRepository
            └→ TriviaApiService
                 └→ HttpClient
```

## �� Ordner-Tree (Kommando)

```bash
tree src/app -I node_modules
```

Output:
```
src/app/
├── fundamentale/
│   ├── models/
│   ├── repos/
│   ├── services/
│   └── index.ts
├── shared/
│   ├── components/
│   │   ├── quiz-card/
│   │   └── progress-bar/
│   └── index.ts
├── feature/
│   └── quiz/
│       ├── components/
│       │   ├── question/
│       │   └── quiz-result/
│       ├── services/
│       ├── quiz/
│       └── quiz-routing.ts
├── app.ts
├── app.config.ts
├── app.routes.ts
├── app.html
└── app.scss
```
