export const CATEGORY_ICONS: Record<string, string> = {
  'General Knowledge': '🧠',
  'Entertainment: Books': '📚',
  'Entertainment: Film': '🎬',
  'Entertainment: Music': '🎵',
  'Entertainment: Musicals & Theatres': '🎭',
  'Entertainment: Television': '📺',
  'Entertainment: Video Games': '🎮',
  'Entertainment: Board Games': '🎲',
  'Science & Nature': '🌳',
  'Science: Computers': '💻',
  'Science: Mathematics': '📐',
  'Mythology': '⚡',
  'Sports': '⚽',
  'Geography': '🌍',
  'History': '🏛️',
  'Politics': '🗳️',
  'Art': '🎨',
  'Celebrities': '⭐',
  'Animals': '🐻',
  'Vehicles': '🚗',
  'Entertainment: Comics': '💭',
  'Science: Gadgets': '⚙️',
  'Entertainment: Japanese Anime & Manga': '🎌',
  'Entertainment: Cartoon & Animations': '🎪'
};

export const GAME_ICONS: Record<string, string> = {
  quiz: 'quiz',
  psychology: 'psychology',
  text_fields: 'text_fields',
};

export const getCategoryIcon = (categoryName: string): string => {
  return CATEGORY_ICONS[categoryName] || '❓';
};

export const getGameIcon = (icon: string): string => {
  return GAME_ICONS[icon] || 'games';
};
