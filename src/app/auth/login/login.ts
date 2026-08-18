import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private router = inject(Router);
  private alertService = inject(AlertService);

  showPassword = false;

  loading = false;

  loginData = {
    email: '',
    password: ''
  };

  togglePassword() {

    this.showPassword = !this.showPassword;

  }

  login() {

    // =========================
    // BASIC VALIDATION
    // =========================

    if (!this.loginData.email || !this.loginData.password) {

      this.alertService.warning(
        'Missing Information',
        'Please enter your email address and password.'
      );

      return;
    }

    // =========================
    // START LOADING
    // =========================

    this.loading = true;

    this.alertService.loading(
      'Signing you in...'
    );

    // =========================
    // LOGIN REQUEST
    // =========================

    this.authService.login(
      this.loginData
    ).subscribe({

      next: (response) => {

        /*
         * SweetAlert loading should remain visible
         * for approximately 3 seconds as requested.
         */

        setTimeout(() => {

          this.loading = false;

          this.alertService.close();

          // =========================
          // SUCCESS ALERT
          // =========================

          this.alertService.success(
            'Login Successful',
            'Welcome back. You have been successfully signed in.'
          );

          // =========================
          // REDIRECT BY ROLE
          // =========================

          setTimeout(() => {

            switch (response.role) {

              case 'ADMIN':

                this.router.navigate(['/admin']);

                break;

              case 'BUSINESS_OWNER':

                this.router.navigate(['/owner']);

                break;

              case 'TOURIST':

                this.router.navigate(['/tourist']);

                break;

              default:

                this.router.navigate(['/']);

                break;

            }

          }, 1200);

        }, 3000);

      },

      error: (err) => {

        setTimeout(() => {

          this.loading = false;

          this.alertService.close();

          // =========================
          // ERROR MESSAGE
          // =========================

          let message =
            'Invalid email or password. Please check your credentials and try again.';

          if (err?.status === 401) {

            message =
              'The email or password you entered is incorrect.';

          } else if (err?.status === 403) {

            message =
              'You are not authorized to access this system.';

          } else if (err?.status === 0) {

            message =
              'Unable to connect to the server. Please try again later.';

          } else if (typeof err?.error === 'string') {

            message = err.error;

          } else if (err?.error?.message) {

            message = err.error.message;

          }

          // =========================
          // ERROR ALERT
          // =========================

          this.alertService.error(
            'Login Failed',
            message
          );

        }, 3000);

      }

    });

  }

}