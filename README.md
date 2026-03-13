# 🎮 WebGame - Casual Games Collection

Eine moderne Spielesammlung mit Angular 21+, Signals und Material Design.

---

## ✨ Features

### Spiele

- **Quiz** - Allgemeinwissen Quiz mit OpenTDB API
  - Kategorie-Auswahl
  - Schwierigkeit: Einfach, Mittel, Schwer
  - Unbegrenzter Modus
- **Wordle** - Errate das Wort in 6 Versuchen
- **Memory** - Finde die passenden Paare
  - 3 Schwierigkeiten: 4x4, 6x6, 8x8
  - 4 Themen: Emojis, Essen, Sport, Natur
  - Timer & Züge-Zähler

### KI-Chat

- **Kai** - Dein virtueller Assistent
  - Keyword-basierte Antworten
  - Sprechblase mit Facts
  - Direkter Chat

### Technisch

- ✅ Angular 21+ mit Standalone Components
- ✅ Signals für State Management
- ✅ OnPush Change Detection
- ✅ Material Design
- ✅ Responsive (Mobile-First)
- ✅ Lazy Loading
- ✅ Strict TypeScript

---

## 🚀 Installation & Ausführung

### Anforderungen

- Node.js 20+
- pnpm 10+

### Setup

```bash
# Dependencies installieren
pnpm install

# Development Server
pnpm start
# Öffne http://localhost:4200
```

### Build

```bash
# Production Build
pnpm build

# Output: dist/trivia-game/
```

---

## 📁 Projektstruktur

```
src/app/
├── feature/
│   ├── home/              # Startseite mit Spielen & Kai-Chat
│   ├── quiz/              # Quiz (lazy loaded)
│   ├── wordle/           # Wordle (lazy loaded)
│   └── memory/           # Memory (lazy loaded)
├── fundamentale/          # Core Models & Services
├── shared/               # Labels, Constants, Components
├── app.routes.ts         # Routing
└── app.config.ts         # App Config
```

---

## 🌐 Routing

| Pfad      | Komponente          |
| --------- | ------------------- |
| `/`       | Home (Spielauswahl) |
| `/quiz`   | Quiz Setup & Spiel  |
| `/wordle` | Wordle              |
| `/memory` | Memory              |

---

## 🎨 Design

- **Dark Theme** - Dunkler Hintergrund mit Gradient
- **Farben**:
  - Primary: #6200ee (Purple)
  - Secondary: #03dac6 (Teal)
  - Quiz: #6200ee
  - Wordle: #ff9800
  - Memory: #009688
- **Responsive**: Mobile-optimiert mit Media Queries

---

## 🔧 Technologie-Stack

- Angular 21.2.4
- Angular Material 21.2.4
- TypeScript (strict)
- SCSS
- pnpm

---

## 📄 Lizenz

ISC

---

## 👨‍💻 Team

**Kai** - IT-Abteilung
Entwickelt innovative Web-Lösungen mit Leidenschaft und Präzision.

---

Erstellt: März 2026  
Letzte Aktualisierung: März 2026
