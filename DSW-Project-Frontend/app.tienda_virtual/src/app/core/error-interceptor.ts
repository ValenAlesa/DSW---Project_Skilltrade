import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) =>
  next(req).pipe(
    catchError(err => {
      if (err.status === 401) {
        // Ej: window.location.href = '/login';
      }
      return throwError(() => err);
    })
  );

