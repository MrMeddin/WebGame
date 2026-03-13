export const DE_LABELS = {
  // Home
  homeTitle: 'Spielewiese',
  homeSubtitle: 'Wähle ein Spiel zum Starten',
  comingSoon: 'Coming Soon',
  play: 'Spielen',

  // Quiz Setup
  quizSetupTitle: 'Allgemeinwissen Quiz',
  quizSetupSubtitle: 'Wähle eine oder mehrere Kategorien und die Schwierigkeit',
  selectApi: 'Quiz-Quelle',
  selectCategory: 'Kategorie',
  selectCategories: 'Kategorien (Mehrfachauswahl)',
  selectDifficulty: 'Schwierigkeit',
  startQuiz: 'Quiz starten',
  easy: 'Einfach',
  medium: 'Mittel',
  hard: 'Schwer',
  random: 'Zufällig',
  loading: 'Wird geladen...',
  noCategory: 'Alle Kategorien',
  searchCategories: 'Kategorien durchsuchen...',
  categoriesLoading: 'Kategorien werden geladen...',
  noCategoriesFound: 'Keine Kategorien gefunden',
  quizMode: 'Quiz-Modus',
  limitedMode: 'Begrenzt (10 Fragen)',
  infiniteMode: 'Unendlich ∞',
  categoryHint: 'Klicke auf eine oder mehrere Kategorien',

  // Quiz
  quizTitle: 'Allgemeinwissen Quiz',
  loadingQuiz: 'Quiz wird geladen...',
  errorLoading: 'Fehler beim Laden des Quiz',
  tryAgain: 'Erneut versuchen',
  backToSetup: 'Zurück zur Einstellung',
  score: 'Score',
  answered: 'Beantwortet',
  stopQuiz: 'Quiz beenden',

  // Question
  submitAnswer: 'Antwort einreichen',
  difficulty: 'Schwierigkeit',
  selectAnswer: 'Bitte wählen Sie eine Antwort',
  nextQuestion: 'Weiter',
  correctAnswer: 'Richtige Antwort',
  yourAnswer: 'Deine Antwort',
  wellDone: 'Gut gemacht!',
  incorrect: 'Leider falsch',

  // Result
  resultTitle: 'Ergebnis',
  accuracy: 'Genauigkeit',
  perfect: 'Perfekt!',
  excellent: 'Ausgezeichnet!',
  good: 'Gut gemacht!',
  tryAgainResult: 'Versuch es noch einmal!',
  perfectScore: 'Perfekter Score! Erstaunlich!',
  excellentScore: 'Ausgezeichnet! Großartig gemacht!',
  goodScore: 'Guter Einsatz! Weiter so!',
  tryAgainScore: 'Weiter üben!',
  playAgain: 'Nochmal spielen',
  goHomeResult: 'Zurück zur Startseite',

  // A11y
  backToHome: 'Zurück zur Startseite',
  searchCategoriesAria: 'Kategorien durchsuchen',
  answerOptions: 'Antwortoptionen',

  // Wordle
  wordleTitle: 'Wordle',
  wordleLoading: 'Wort wird geladen...',
  wordleTooShort: 'Wort ist zu kurz',
  wordleNotInList: 'Wort nicht in Liste',
  wordleWon: 'Gewonnen!',
  wordleLost: 'Verloren',
  wordleWas: 'Das Wort war',
  wordlePlayAgain: 'Nochmal spielen',
};

export type LabelKey = keyof typeof DE_LABELS;
