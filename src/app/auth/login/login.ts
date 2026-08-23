import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);
  private alertService = inject(AlertService);
  private router = inject(Router);

  // =====================================================
  // LOGIN DATA
  // =====================================================

  loginData = {
    email: '',
    password: ''
  };

  // =====================================================
  // UI STATE
  // =====================================================

  showPassword = false;

  loading = false;

  // =====================================================
  // TOGGLE PASSWORD
  // =====================================================

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  // =====================================================
  // LOGIN
  // =====================================================

  login(): void {

    // ===================================================
    // VALIDATION
    // ===================================================

    if (!this.loginData.email.trim()) {

      this.alertService.warning(
        'Email Required',
        'Please enter your email address.'
      );

      return;
    }

    if (!this.loginData.password.trim()) {

      this.alertService.warning(
        'Password Required',
        'Please enter your password.'
      );

      return;
    }

    // ===================================================
    // LOADING
    // ===================================================

    this.loading = true;

    this.alertService.loading(
      'Signing you in...'
    );

    // ===================================================
    // LOGIN REQUEST
    // ===================================================

    this.authService.login({

      email: this.loginData.email.trim(),

      password: this.loginData.password

    }).subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: response => {

        this.loading = false;

        this.alertService.close();

        this.alertService.success(
          'Login Successful',
          `Welcome back, ${response.fullName}.`
        );

        // ===============================================
        // ROLE REDIRECTION
        // ===============================================

        switch (response.role) {

          case 'ADMIN':

            this.router.navigate([
              '/admin/dashboard'
            ]);

            break;


          case 'SHEHA':

            this.router.navigate([
              '/sheha/dashboard'
            ]);

            break;


          case 'BUSINESS_OWNER':

            this.router.navigate([
              '/owner/dashboard'
            ]);

            break;


          case 'TOURIST':

            this.router.navigate([
              '/tourist/dashboard'
            ]);

            break;


          default:

            this.alertService.error(
              'Unknown Role',
              'Your account role is not recognized by the system.'
            );

            this.authService.logout();

            this.router.navigate(['/login']);

            break;
        }

      },

      // =================================================
      // ERROR
      // =================================================

      error: error => {

        this.loading = false;

        this.alertService.close();

        let message =
          'Invalid email or password.';

        if (
          typeof error?.error === 'string'
        ) {

          message = error.error;

        }
        else if (
          error?.error?.message
        ) {

          message = error.error.message;

        }

        this.alertService.error(
          'Login Failed',
          message
        );

      }

    });

  }

}