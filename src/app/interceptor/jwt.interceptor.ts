import {
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest
} from '@angular/common/http';

import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (

req: HttpRequest<unknown>,
next: HttpHandlerFn

): Observable<HttpEvent<unknown>> => {

  const router = inject(Router);

  const token = localStorage.getItem('token');

  let request = req;

  if(token){

    request = req.clone({

      setHeaders:{

        Authorization:`Bearer ${token}`

      }

    });

  }

  return next(request).pipe(

    catchError((error:HttpErrorResponse)=>{

      if(error.status===401){

        localStorage.clear();

        alert("Your session has expired. Please login again.");

        router.navigate(['/login']);

      }

      return throwError(()=>error);

    })

  );

};