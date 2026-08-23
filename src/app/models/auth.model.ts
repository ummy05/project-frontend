export interface LoginRequest {

  email: string;

  password: string;

}

export interface LoginResponse {

  token: string;

  fullName: string;

  email: string;

  role: string;

}

export interface RegisterRequest {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  age?: number;
  gender?: string;
  address?: string;
  nationality?: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  role: string;
}
export interface ForgotPasswordRequest {

  email: string;

}

export interface VerifyOtpRequest {

  email: string;

  otp: string;

}

export interface ResetPasswordRequest {

  email: string;

  otp: string;

  newPassword: string;

}

export interface ChangePasswordRequest {

  currentPassword: string;

  newPassword: string;

}

export interface UserProfile {
  id: number;
  fullName: string;
  email: string;
  phoneNumber: string;
  age?: number;
  gender?: string;
  address?: string;
  enabled: boolean;
  role: string;
  profileImage?: string;
  businessName?: string;
  businessType?: string;
  businessAddress?: string;
  businessRegistrationNumber?: string;
  shehia?: string;
  nationality?: string;
}