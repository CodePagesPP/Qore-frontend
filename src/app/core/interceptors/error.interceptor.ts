import { HttpInterceptorFn} from '@angular/common/http';
import { inject} from '@angular/core';
import { ErrorService } from '../services/error-service';
import { catchError, throwError } from 'rxjs';

export const ErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const errorService = inject(ErrorService);

  return next(req).pipe(
    catchError((err) => {
      if (err.status === 403) {
        const msg = err.error?.message || 'No tienes permisos para esta acción';
        errorService.showError(msg);
      }

      return throwError(() => err);
    })
  );
};
