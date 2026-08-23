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

import {
  AlertService
} from '../services/alert.service';


export const jwtInterceptor: HttpInterceptorFn = (

  req: HttpRequest<unknown>,

  next: HttpHandlerFn

): Observable<HttpEvent<unknown>> => {

  const router =
    inject(Router);

  const alertService =
    inject(AlertService);


  // =====================================================
  // GET TOKEN
  // =====================================================

  const token =
    localStorage.getItem('token');


  // =====================================================
  // PUBLIC ENDPOINTS
  // =====================================================

  const isPublicEndpoint =

    // Authentication
    req.url.includes('/api/auth/login') ||

    req.url.includes('/api/auth/register') ||

    req.url.includes('/api/auth/forgot-password') ||

    req.url.includes('/api/auth/verify-otp') ||

    req.url.includes('/api/auth/reset-password') ||

    // Language
    req.url.includes('/api/languages/');


  // =====================================================
  // REQUEST
  // =====================================================

  let request = req;


  // =====================================================
  // ATTACH JWT
  // =====================================================

  if (
    token &&
    !isPublicEndpoint
  ) {

    request =
      req.clone({

        setHeaders: {

          Authorization:
            `Bearer ${token}`

        }

      });

  }


  // =====================================================
  // SEND REQUEST
  // =====================================================

  return next(request).pipe(

    catchError(

      (error: HttpErrorResponse) => {

        // =================================================
        // SESSION EXPIRED
        // =================================================

        if (
          error.status === 401 &&
          !isPublicEndpoint &&
          !!token
        ) {

          localStorage.removeItem('token');

          localStorage.removeItem('user');

          localStorage.removeItem('role');

          alertService.error(
            'Session Expired',
            'Your session has expired. Please login again.'
          );

          router.navigate(['/login']);

        }

        return throwError(
          () => error
        );

      }

    )

  );

};