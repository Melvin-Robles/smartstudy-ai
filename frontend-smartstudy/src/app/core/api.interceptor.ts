import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { AuthStore } from './auth.store';
import { API_BASE_URL } from './api.config';

interface HttpError {
  status?: number;
}

export const apiInterceptor: HttpInterceptorFn = (request, next) => {
  const auth = inject(AuthStore);
  const token = auth.token();
  const isApiRequest = request.url.startsWith(API_BASE_URL);
  const authorizedRequest = token && isApiRequest
    ? request.clone({ setHeaders: { Authorization: `Bearer ${token}` } })
    : request;

  return next(authorizedRequest).pipe(
    catchError((error: unknown) => {
      if (isApiRequest && (error as HttpError).status === 401) {
        auth.clearSession();
      }
      return throwError(() => error);
    }),
  );
};
