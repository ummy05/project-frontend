import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-forgot-pssword',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './forgot-pssword.html',
  styleUrl: './forgot-pssword.css',
})
export class ForgotPssword {

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  email = '';

  emailSent = false;

  loading = false;

  success = '';

  error = '';


  // ==========================================
  // SEND OTP
  // ==========================================

  sendResetLink(): void {

    // ------------------------------------------
    // BASIC VALIDATION
    // ------------------------------------------

    if (!this.email || !this.email.trim()) {

      this.alertService.warning(
        'Email Required',
        'Please enter your email address.'
      );

      return;
    }


    // ------------------------------------------
    // EMAIL FORMAT
    // ------------------------------------------

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(this.email.trim())) {

      this.alertService.warning(
        'Invalid Email',
        'Please enter a valid email address.'
      );

      return;
    }


    this.loading = true;

    this.emailSent = false;

    this.success = '';

    this.error = '';


    // ------------------------------------------
    // SWEET ALERT LOADING
    // ------------------------------------------

    this.alertService.loading(
      'Sending verification code...'
    );


    // ------------------------------------------
    // SEND REQUEST
    // ------------------------------------------

    this.authService.forgotPassword({

      email: this.email.trim()

    }).subscribe({

      // ========================================
      // SUCCESS
      // ========================================

      next: (response) => {

        this.loading = false;

        this.emailSent = true;


        // Close loading
        this.alertService.close();


        // Success alert
        this.alertService.success(
          'Verification Code Sent',
          'A verification code has been sent to your email address.'
        );


        // ======================================
        // GO TO VERIFY OTP
        // ======================================

        this.router.navigate(
          ['/verify-otp'],
          {
            queryParams: {
              email: this.email.trim()
            }
          }
        );

      },


      // ========================================
      // ERROR
      // ========================================

      error: (err) => {

        this.loading = false;


        // Close loading
        this.alertService.close();


        let message =
          'Unable to send verification code.';


        if (typeof err.error === 'string') {

          message = err.error;

        }
        else if (err.error?.message) {

          message = err.error.message;

        }


        this.error = message;


        this.alertService.error(
          'Unable to Send Code',
          message
        );

      }

    });

  }

}