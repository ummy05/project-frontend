import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {

  const token = localStorage.getItem('token');


  // ==========================================
  // PUBLIC AUTH ENDPOINTS
  // ==========================================

  const isPublicAuthEndpoint =
    req.url.includes('/api/auth/login') ||
    req.url.includes('/api/auth/register') ||
    req.url.includes('/api/auth/forgot-password') ||
    req.url.includes('/api/auth/verify-otp') ||
    req.url.includes('/api/auth/reset-password');


  // =A=========================================
  // ATTACH TOKEN ONLY TO PROTECTED REQUESTS
  // ==========================================

  if (token && !isPublicAuthEndpoint) {

    return next(
      req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      })
    );

  }


  return next(req);

};