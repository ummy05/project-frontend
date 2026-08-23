// src/app/services/auth.service.ts

import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';

import { environment } from '../environment/environment';

import {
  ChangePasswordRequest,
  ForgotPasswordRequest,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  ResetPasswordRequest,
  UserProfile,
  VerifyOtpRequest
} from '../models/auth.model';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/auth`;


  // =====================================================
  // LOGIN
  // =====================================================

  login(data: LoginRequest): Observable<LoginResponse> {

    return this.http
      .post<LoginResponse>(
        `${this.api}/login`,
        data
      )
      .pipe(

        tap(response => {

          // =================================================
          // SESSION STORAGE
          // Each browser tab gets its own authentication
          // session.
          // =================================================

          sessionStorage.setItem(
            'token',
            response.token
          );

          sessionStorage.setItem(
            'role',
            response.role
          );

          sessionStorage.setItem(
            'fullName',
            response.fullName
          );

          sessionStorage.setItem(
            'email',
            response.email
          );

        })

      );
  }


  // =====================================================
  // REGISTER
  // =====================================================

  register(
    data: RegisterRequest
  ): Observable<string> {

    return this.http.post(
      `${this.api}/register`,
      data,
      {
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // GET CURRENT USER
  // =====================================================

  getProfile(): Observable<UserProfile> {

    return this.http.get<UserProfile>(
      `${this.api}/me`
    );
  }


  // =====================================================
  // UPDATE CURRENT USER
  // =====================================================

  updateProfile(
    data: Partial<UserProfile>
  ): Observable<UserProfile> {

    return this.http.put<UserProfile>(
      `${this.api}/me`,
      data
    );
  }


  // =====================================================
  // CHANGE PASSWORD
  // =====================================================

  changePassword(
    data: ChangePasswordRequest
  ): Observable<string> {

    return this.http.patch(
      `${this.api}/change-password`,
      data,
      {
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // FORGOT PASSWORD
  // =====================================================

  forgotPassword(
    data: ForgotPasswordRequest
  ): Observable<string> {

    return this.http.post(
      `${this.api}/forgot-password`,
      data,
      {
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // VERIFY OTP
  // =====================================================

  verifyOtp(
    data: VerifyOtpRequest
  ): Observable<string> {

    return this.http.post(
      `${this.api}/verify-otp`,
      data,
      {
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // RESET PASSWORD
  // =====================================================

  resetPassword(
    data: ResetPasswordRequest
  ): Observable<string> {

    return this.http.post(
      `${this.api}/reset-password`,
      data,
      {
        responseType: 'text'
      }
    );
  }


  // =====================================================
  // GET TOKEN
  // =====================================================

  getToken(): string | null {

    return sessionStorage.getItem('token');

  }


  // =====================================================
  // GET ROLE
  // =====================================================

  getRole(): string | null {

    return sessionStorage.getItem('role');

  }


  // =====================================================
  // GET FULL NAME
  // =====================================================

  getFullName(): string | null {

    return sessionStorage.getItem('fullName');

  }


  // =====================================================
  // GET EMAIL
  // =====================================================

  getEmail(): string | null {

    return sessionStorage.getItem('email');

  }


  // =====================================================
  // LOGIN STATUS
  // =====================================================

  isLoggedIn(): boolean {

    return !!this.getToken();

  }


  // =====================================================
  // CHECK ROLE
  // =====================================================

  hasRole(role: string): boolean {

    return this.getRole() === role;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    sessionStorage.removeItem('token');

    sessionStorage.removeItem('role');

    sessionStorage.removeItem('fullName');

    sessionStorage.removeItem('email');

  }

}