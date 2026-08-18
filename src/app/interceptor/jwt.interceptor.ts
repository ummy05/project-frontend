import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import {
  Observable,
  catchError,
  throwError
} from 'rxjs';

import { AlertService } from '../services/alert.service';


export const jwtInterceptor: HttpInterceptorFn = (

  req: HttpRequest<unknown>,

  next: HttpHandlerFn

): Observable<HttpEvent<unknown>> => {

  const router = inject(Router);

  const alertService = inject(AlertService);


  const token =
    localStorage.getItem('token');


  let request = req;


  // ==========================================
  // DO NOT ATTACH TOKEN TO PUBLIC AUTH ENDPOINTS
  // ==========================================

  const isPublicAuthEndpoint =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register') ||
    req.url.includes('/api/auth/forgot-password') ||
    req.url.includes('/api/auth/verify-otp') ||
    req.url.includes('/api/auth/reset-password');


  if (
    token &&
    !isPublicAuthEndpoint
  ) {

    request = req.clone({

      setHeaders: {

        Authorization:
          `Bearer ${token}`

      }

    });

  }


  return next(request).pipe(

    catchError(
      (error: HttpErrorResponse) => {

        if (
          error.status === 401 &&
          !isPublicAuthEndpoint
        ) {

          localStorage.clear();

          alertService.error(
            'Session Expired',
            'Your session has expired. Please login again.'
          );

          router.navigate([
            '/login'
          ]);

        }


        return throwError(
          () => error
        );

      }
    )

  );

};