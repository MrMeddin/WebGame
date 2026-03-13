export const WORDLE_CONFIG = {
  WORD_LENGTH: 5,
  MAX_GUESSES: 6,
} as const;

export const WORDLE_API_URL = 'https://api.datamuse.com/words';

export const FALLBACK_WORDS = [
  'APPEL', 'BAUM', 'HAUS', 'MAUS', 'RAUM',
  'STUHL', 'TISCH', 'BETT', 'FENSTER', 'TUER',
  'WASSER', 'FEUER', 'ERDE', 'LUFT', 'STROM',
  'BUCH', 'STIFT', 'PAPIER', 'LINEAL', 'RADIER',
  'SCHULE', 'KLASSE', 'LEHRER', 'SCHUELER', 'MATHE',
  'DEUTSCH', 'ENGLISCH', 'MUSIK', 'SPORT', 'KUNST',
  'FREUND', 'FAMILIE', 'ELTERN', 'BRUDER', 'SISTER',
  'MUTTER', 'VATER', 'ONKEL', 'TANTE', 'OPPA',
  'SAMSTAG', 'SONNTAG', 'MONTAG', 'DIENSTAG', 'MITTWOCH',
  'DONNER', 'FREITAG', 'JANUAR', 'FEBRUAR', 'MAERZ',
  'APRIL', 'MAI', 'JUNI', 'JULI', 'AUGUST',
  'SEPTEM', 'OKTOBER', 'NOVEMB', 'DEZEMB', 'FRUEHL',
  'SOMMER', 'HERBST', 'WINTER', 'SONNE', 'MOND',
  'STERN', 'WOLKE', 'REGEN', 'SCHNEE', 'WIND',
  'BERGE', 'TAL', 'FLUSS', 'SEE', 'INSEL',
  'DEUTSCH', 'OESTER', 'SCHWEIZ', 'FRANKRE', 'ITALIEN',
  'SPANIEN', 'PORTUGAL', 'POLEN', 'NIEDERL', 'BELGIEN',
  'GROSS', 'KLEIN', 'SCHWER', 'LEICHT', 'SCHNELL',
  'LANGSAM', 'HEISS', 'KALT', 'NEU', 'ALT',
  'SCHOEN', 'HASSLICH', 'REICH', 'ARM', 'STARK',
  'SCHWACH', 'LAUT', 'LEISE', 'HELL', 'DUNKEL'
];

export type LetterState = 'correct' | 'present' | 'absent' | 'empty';
