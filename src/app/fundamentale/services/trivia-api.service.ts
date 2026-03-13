import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, map, throwError, of } from 'rxjs';

import { ITriviaQuestion, ITriviaCategoryResponse, ITriviaCategory, IQuizApi } from '../models';

const API_CONFIGS: Record<string, { questionsUrl: string; categoriesUrl: string; type: string }> = {
  opentdb: {
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    type: 'multiple'
  },
  trivia: {
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    type: 'multiple'
  },
  jeopardy: {
    questionsUrl: 'https://opentdb.com/api.php',
    categoriesUrl: 'https://opentdb.com/api_category.php',
    type: 'multiple'
  }
};

interface ITriviaApiResponse {
  response_code: number;
  results: ITriviaQuestion[];
}

/**
 * Service para comunicarse con la API de Open Trivia Database.
 * Responsable de obtener preguntas y decodificar entidades HTML.
 */
@Injectable({
  providedIn: 'root',
})
export class TriviaApiService {
  private readonly httpClient = inject(HttpClient);
  private currentApi: string = 'opentdb';

  /**
   * Set the current API to use
   */
  setApi(apiId: string): void {
    this.currentApi = apiId;
  }

  /**
   * Get the current API configuration
   */
  private getApiConfig() {
    return API_CONFIGS[this.currentApi] || API_CONFIGS['opentdb'];
  }

  /**
   * Obtiene la lista de categorías disponibles de Open Trivia Database.
   * @returns Observable con array de categorías
   */
  getCategories(): Observable<ITriviaCategory[]> {
    const config = this.getApiConfig();
    const url = config.categoriesUrl;

    if (this.currentApi === 'trivia') {
      return this.getQuickTriviaCategories();
    }
    
    if (this.currentApi === 'jeopardy') {
      return this.getJeopardyCategories();
    }

    return this.httpClient.get<ITriviaCategoryResponse>(url).pipe(
      map((response) => response.trivia_categories),
      catchError((error: unknown) => this.handleError(error))
    );
  }

  /**
   * Get categories for Quick Trivia (subset of categories)
   */
  private getQuickTriviaCategories(): Observable<ITriviaCategory[]> {
    const quickCategories: ITriviaCategory[] = [
      { id: 9, name: 'General Knowledge' },
      { id: 17, name: 'Science & Nature' },
      { id: 21, name: 'Sports' },
      { id: 22, name: 'Geography' },
      { id: 23, name: 'History' },
    ];
    return of(quickCategories);
  }

  /**
   * Get categories for Jeopardy Style
   */
  private getJeopardyCategories(): Observable<ITriviaCategory[]> {
    const jeopardyCategories: ITriviaCategory[] = [
      { id: 11, name: 'Entertainment: Film' },
      { id: 12, name: 'Entertainment: Music' },
      { id: 14, name: 'Entertainment: Television' },
      { id: 15, name: 'Entertainment: Video Games' },
      { id: 31, name: 'Entertainment: Japanese Anime & Manga' },
      { id: 32, name: 'Entertainment: Cartoon & Animations' },
    ];
    return of(jeopardyCategories);
  }

  /**
   * Obtiene preguntas de trivia de la API de Open Trivia Database.
   * @param amount - Cantidad de preguntas (default: 10)
   * @param category - ID de categoría (opcional)
   * @param difficulty - Nivel de dificultad (opcional)
   * @returns Observable con array de preguntas
   */
  getQuestions(
    amount: number = 10,
    category?: number,
    difficulty?: string
  ): Observable<ITriviaQuestion[]> {
    const config = this.getApiConfig();
    const params = this.buildQueryParams(amount, category, difficulty);
    const url = `${config.questionsUrl}${params}`;

    return this.httpClient.get<ITriviaApiResponse>(url).pipe(
      map((response) => {
        if (response.response_code !== 0) {
          throw new Error(`API Error: ${response.response_code}`);
        }
        return response.results;
      }),
      catchError((error: unknown) => this.handleError(error))
    );
  }

  /**
   * Decodifica entidades HTML en strings (ej: &rsquo; → ')
   * @param htmlText - String con entidades HTML
   * @returns String decodificado
   */
  decodeHtmlEntity(htmlText: string): string {
    const textarea = document.createElement('textarea');
    textarea.innerHTML = htmlText;
    return textarea.value;
  }

  private buildQueryParams(
    amount: number,
    category?: number,
    difficulty?: string
  ): string {
    const config = this.getApiConfig();
    const params = [`amount=${amount}`, `type=${config.type}`];

    if (category) {
      params.push(`category=${category}`);
    }

    if (difficulty) {
      params.push(`difficulty=${difficulty.toLowerCase()}`);
    }

    return `?${params.join('&')}`;
  }

  private handleError(error: unknown): Observable<never> {
    let errorMessage = 'Error fetching trivia questions';

    if (error instanceof HttpErrorResponse) {
      if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        const apiError = error.error as ITriviaApiResponse;
        errorMessage = `API Error Code: ${apiError.response_code}`;
      }
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }

    console.error(errorMessage, error);
    return throwError(() => new Error(errorMessage));
  }
}
