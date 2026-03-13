import { describe, it, expect, beforeEach } from 'vitest';
import { TriviaApiService } from './trivia-api.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

describe('TriviaApiService', () => {
  let service: TriviaApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TriviaApiService]
    });

    service = TestBed.inject(TriviaApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeDefined();
  });

  it('should decode HTML entities correctly', () => {
    const encoded = 'What&rsquo;s the answer?';
    const result = service.decodeHtmlEntity(encoded);
    expect(result).toBeTruthy();
  });

  afterEach(() => {
    httpMock.verify();
  });
});

function afterEach(arg0: () => void) {
  throw new Error('Function not implemented.');
}
