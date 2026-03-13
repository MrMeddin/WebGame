import { IQuizApi } from '../../fundamentale/models';

export const API_CONFIGS: Record<string, IQuizApi> = {
  opentdb: {
    id: 'opentdb',
    name: 'Open Trivia DB',
    description: 'Große Datenbank mit verschiedenen Kategorien',
    icon: 'quiz',
    color: '#6200ee',
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    questionType: 'multiple'
  },
  trivia: {
    id: 'trivia',
    name: 'Quick Trivia',
    description: 'Schnelle Fragen für zwischendurch',
    icon: 'bolt',
    color: '#ff9800',
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    questionType: 'multiple'
  },
  jeopardy: {
    id: 'jeopardy',
    name: 'Jeopardy Style',
    description: 'Klassische Jeopardy-Fragen',
    icon: 'sports_esports',
    color: '#009688',
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    questionType: 'multiple'
  }
};

export const getApiConfig = (apiId: string): IQuizApi => {
  return API_CONFIGS[apiId] || API_CONFIGS['opentdb'];
};

export const getAvailableApis = (): IQuizApi[] => {
  return Object.values(API_CONFIGS);
};
