import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../environment/environment';
import { ChangePasswordRequest, ForgotPasswordRequest, LoginRequest, LoginResponse, RegisterRequest, ResetPasswordRequest, UserProfile, VerifyOtpRequest } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private http = inject(HttpClient);

  private api = `${environment.apiUrl}/auth`;

  // ==========================
  // LOGIN
  // ==========================

  login(data: LoginRequest): Observable<LoginResponse>{

    return this.http.post<LoginResponse>(
      `${this.api}/login`,
      data
    ).pipe(

      tap(response => {

        localStorage.setItem(
          'token',
          response.token
        );

        localStorage.setItem(
          'role',
          response.role
        );

        localStorage.setItem(
          'fullName',
          response.fullName
        );

        localStorage.setItem(
          'email',
          response.email
        );

      })

    );

  }

  // ==========================
  // REGISTER
  // ==========================

  register(data: RegisterRequest){

    return this.http.post(
      `${this.api}/register`,
      data
    );

  }

  // ==========================
  // PROFILE
  // ==========================

  getProfile(): Observable<UserProfile>{

    return this.http.get<UserProfile>(
      `${this.api}/me`
    );

  }

  updateProfile(data:any){

    return this.http.put(
      `${this.api}/me`,
      data
    );

  }

  // ==========================
  // CHANGE PASSWORD
  // ==========================

  changePassword(
      data: ChangePasswordRequest){

    return this.http.patch(
      `${this.api}/change-password`,
      data
    );

  }

  // ==========================
  // FORGOT PASSWORD
  // ==========================

  forgotPassword(
      data: ForgotPasswordRequest){

    return this.http.post(
      `${this.api}/forgot-password`,
      data
    );

  }

  // ==========================
  // VERIFY OTP
  // ==========================

  verifyOtp(
      data: VerifyOtpRequest){

    return this.http.post(
      `${this.api}/verify-otp`,
      data
    );

  }

  // ==========================
  // RESET PASSWORD
  // ==========================

  resetPassword(
      data: ResetPasswordRequest){

    return this.http.post(
      `${this.api}/reset-password`,
      data
    );

  }

  // ==========================
  // TOKEN
  // ==========================

  getToken(): string | null{

    return localStorage.getItem(
      'token'
    );

  }

  // ==========================
  // ROLE
  // ==========================

  getRole(): string | null{

    return localStorage.getItem(
      'role'
    );

  }

  // ==========================
  // LOGIN STATUS
  // ==========================

  isLoggedIn(): boolean{

    return !!localStorage.getItem(
      'token'
    );

  }

  // ==========================
  // LOGOUT
  // ==========================

  logout(){

    localStorage.clear();

  }

}