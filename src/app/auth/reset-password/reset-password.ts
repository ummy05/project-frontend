import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword {

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  email = '';
  otp = '';

  newPassword = '';
  confirmPassword = '';

  loading = false;

  // THIS WAS MISSING
  error = '';


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.email = params['email'] || '';
      this.otp = params['otp'] || '';

    });

  }


  resetPassword(): void {

    this.error = '';


    // ==========================================
    // VALIDATE NEW PASSWORD
    // ==========================================

    if (!this.newPassword.trim()) {

      this.alertService.warning(
        'Password Required',
        'Please enter your new password.'
      );

      return;

    }


    // ==========================================
    // CONFIRM PASSWORD
    // ==========================================

    if (!this.confirmPassword.trim()) {

      this.alertService.warning(
        'Confirm Password',
        'Please confirm your new password.'
      );

      return;

    }


    // ==========================================
    // PASSWORD MATCH
    // ==========================================

    if (this.newPassword !== this.confirmPassword) {

      this.alertService.error(
        'Passwords Do Not Match',
        'Please make sure both passwords are the same.'
      );

      return;

    }


    // ==========================================
    // CHECK EMAIL + OTP
    // ==========================================

    if (!this.email || !this.otp) {

      this.alertService.error(
        'Invalid Reset Request',
        'Your verification session is invalid or has expired.'
      );

      return;

    }


    this.loading = true;


    this.alertService.loading(
      'Resetting your password...'
    );


    // ==========================================
    // API
    // ==========================================

    this.authService.resetPassword({

      email: this.email,

      otp: this.otp,

      newPassword: this.newPassword

    }).subscribe({

      // ========================================
      // SUCCESS
      // ========================================

      next: () => {

        this.loading = false;

        this.alertService.close();

        this.alertService.success(
          'Password Changed Successfully',
          'Your password has been reset successfully.'
        );

        setTimeout(() => {

          this.router.navigate(['/login']);

        }, 1500);

      },


      // ========================================
      // ERROR
      // ========================================

      error: (err) => {

        this.loading = false;

        this.alertService.close();


        this.error =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message ||
              'Unable to reset your password. Please try again.';


        this.alertService.error(
          'Password Reset Failed',
          this.error
        );

      }

    });

  }

}