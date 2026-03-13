# Trivia Game - Deutsch Version 🇩🇪

## Neue Features

### 1. 🌐 Deutsche Benutzeroberfläche
Alle UI-Texte sind jetzt auf Deutsch:
- Quiz-Setup Seite
- Frage-Komponente
- Ergebnis-Anzeige
- Buttons und Labels

### 2. 📚 Kategorie-Wahl
Benutzer können aus **30+ vordefinierten Kategorien** wählen:
- Allgemeinwissen (General Knowledge)
- Entertainment (Bücher, Filme, Musik, TV, Spiele)
- Wissenschaft (Natur, Computer, Mathematik, Gadgets)
- Sport, Geographie, Geschichte, Politik
- Und viele mehr!

**Zufallskategorie**: Option um zufällig eine Kategorie zu wählen

### 3. 🎯 Schwierigkeit-Wahl
Drei Schwierigkeitsstufen wählbar:
- **Einfach** (easy)
- **Mittel** (medium)  
- **Schwer** (hard)
- **Zufällig** (wenn leer gelassen)

### 4. 📱 Verbesserte Flow

```
Start (http://localhost:4200)
  ↓
Quiz-Setup (/quiz/setup)
  ├─ Kategorie wählen (aus Liste oder zufällig)
  ├─ Schwierigkeit wählen
  └─ "Quiz starten" Button
     ↓
Quiz (/quiz)
  ├─ Frage mit Schwierigkeit anzeigen
  ├─ Antworten wählen und abschicken
  └─ Weiter zur nächsten Frage
     ↓
Ergebnisse
  ├─ Score anzeigen
  ├─ Genauigkeit berechnen
  └─ Buttons: "Neues Quiz" oder "Einstellung"

```

## Technische Änderungen

### Services
**TriviaApiService** - Erweitert um:
```typescript
// Neue Methode
getCategories(): Observable<ITriviaCategory[]>

// Bereits vorhanden mit Parametern
getQuestions(amount, category?, difficulty?)
```

**QuizService** - Erweitert um:
```typescript
// Signals für Einstellungen
selectedCategory = signal<number | null>(null);
selectedDifficulty = signal<string>('');

// Neue Methoden
loadCategories(): void
setCategory(categoryId: number | null): void
setDifficulty(difficulty: string): void
```

### Neue Komponenten
**QuizSetupComponent** (Smart Container)
- Lädt Kategorien beim Initialisieren
- Reaktive Form mit FormBuilder
- Validierung der Eingaben
- Navigiert zu Quiz mit Parametern

```typescript
setupForm = FormGroup {
  category: FormControl<number | null>,
  difficulty: FormControl<string>
}
```

### Routen
```typescript
/quiz/setup       → QuizSetupComponent
/quiz             → QuizComponent
/                 → Redirect zu /quiz/setup
```

## Models

Neue Interfaces in `fundamentale/models/quiz.model.ts`:

```typescript
interface ITriviaCategory {
  id: number;
  name: string;
}

interface ITriviaCategoryResponse {
  trivia_categories: ITriviaCategory[];
}

interface IQuizConfig {
  categoryId: number;
  categoryName: string;
  difficulty: string;
}
```

## German Labels

Alle Components verwenden eine `DE_LABELS` Konstante für zentrale Verwaltung:

```typescript
const DE_LABELS = {
  title: 'Allgemeinwissen Quiz',
  selectCategory: 'Kategorie',
  selectDifficulty: 'Schwierigkeit',
  startQuiz: 'Quiz starten',
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
  random: 'Zufällig',
  // ... weitere Labels
};
```

## Verwendung

### Entwicklung
```bash
pnpm start
```
Öffne http://localhost:4200

### Build
```bash
pnpm run build
```

### Flow-Test
1. Starten Sie die App
2. Auf Setup-Seite landen
3. Wählen Sie eine Kategorie (oder leer lassen für zufällig)
4. Wählen Sie eine Schwierigkeit
5. Klicken Sie "Quiz starten"
6. Beantworten Sie die Fragen
7. Sehen Sie Ihre Ergebnisse

## Browser Compatibility
- Chrome/Edge 120+
- Firefox 121+
- Safari 17+
- Mobile responsive ✅

## Accessibility
- ✅ ARIA Labels auf allen Elementen
- ✅ Fokus-Management
- ✅ Keyboard Navigation
- ✅ Screen Reader Support
- ✅ Color Contrast (WCAG AA)

## Deployment Checklist

- [x] Kategorien-API integriert
- [x] Schwierigkeit-Parameter implementiert
- [x] Deutsche Benutzeroberfläche
- [x] Quiz-Setup Component
- [x] Routing aktualisiert
- [x] Build erfolgreich (387.80 kB)
- [x] Lazy Loading funktioniert
- [x] Accessibility überprüft
- [x] Material 3 Styling

## Nächste Möglichkeiten

- [ ] Dark/Light Mode Toggle
- [ ] Quiz-Statistiken speichern (LocalStorage)
- [ ] Leaderboard Feature
- [ ] Timer für Fragen
- [ ] Schwierigkeits-Filter nach Kategorie
- [ ] Export von Ergebnissen (PDF)
- [ ] Multiplayer Quiz
- [ ] i18n für mehrere Sprachen

---

**Created**: März 2026  
**Angular**: 21.2.0  
**Material**: 21.2.2  
**Build Size**: 387.80 kB (104.18 kB gzipped)

