import { Routes } from '@angular/router';

import { QuizComponent } from './quiz/quiz.component';
import { QuizSetupComponent } from './components';

export const quizRoutes: Routes = [
  {
    path: 'setup',
    component: QuizSetupComponent,
  },
  {
    path: '',
    component: QuizComponent,
  },
];
