import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  ActivatedRoute,
  Router,
  RouterLink
} from '@angular/router';

import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-verify-otp',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css'
})
export class VerifyOtp {

  private authService = inject(AuthService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private alertService = inject(AlertService);

  email = '';
  otp = '';

  loading = false;
  error = '';


  ngOnInit(): void {

    this.route.queryParams.subscribe(params => {

      this.email = params['email'] || '';

    });

  }


  verifyOtp(): void {

    this.error = '';

    const otp = this.otp.trim();


    // ==========================================
    // VALIDATION
    // ==========================================

    if (!this.email) {

      this.alertService.error(
        'Invalid Request',
        'Email address is missing.'
      );

      return;

    }


    if (!otp) {

      this.alertService.warning(
        'OTP Required',
        'Please enter the verification code.'
      );

      return;

    }


    if (otp.length !== 6) {

      this.alertService.warning(
        'Invalid OTP',
        'Please enter the complete 6-digit verification code.'
      );

      return;

    }


    this.loading = true;

    this.alertService.loading(
      'Verifying code...'
    );


    // ==========================================
    // API
    // ==========================================

    this.authService.verifyOtp({

      email: this.email,

      otp: otp

    }).subscribe({

      next: () => {

        this.loading = false;

        this.alertService.close();


        this.alertService.success(
          'OTP Verified',
          'Your verification code is correct.'
        );


        setTimeout(() => {

          this.router.navigate(
            ['/reset-password'],
            {
              queryParams: {
                email: this.email,
                otp: otp
              }
            }
          );

        }, 1200);

      },


      error: (err) => {

        this.loading = false;

        this.alertService.close();


        this.error =
          typeof err.error === 'string'
            ? err.error
            : err.error?.message ||
              'Invalid verification code.';


        this.alertService.error(
          'Verification Failed',
          this.error
        );

      }

    });

  }

}