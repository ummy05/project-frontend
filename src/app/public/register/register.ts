import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {

  private authService = inject(AuthService);

  private router = inject(Router);


  // ==============================
  // STATE
  // ==============================

  selectedType: 'TOURIST' | 'BUSINESS_OWNER' | '' = '';

  acceptedTerms = false;

  showPassword = false;

  loading = false;

  success = '';

  error = '';


  // ==============================
  // TOURIST DATA
  // ==============================

  touristData = {

    fullName: '',

    email: '',

    phoneNumber: '',

    age: null as number | null,

    gender: '',

    nationality: '',

    address: '',

    password: ''

  };


  // ==============================
  // BUSINESS DATA
  // ==============================

  businessData = {

    fullName: '',

    email: '',

    phoneNumber: '',

    businessName: '',

    businessType: '',

    businessAddress: '',

    businessRegistrationNumber: '',

    password: ''

  };


  // ==============================
  // SELECT REGISTRATION TYPE
  // ==============================

  selectType(
    type: 'TOURIST' | 'BUSINESS_OWNER'
  ) {

    this.selectedType = type;

    this.error = '';

    this.success = '';

    this.acceptedTerms = false;

  }


  // ==============================
  // PASSWORD
  // ==============================

  togglePassword() {

    this.showPassword = !this.showPassword;

  }


  // ==============================
  // REGISTER
  // ==============================

  register() {

    if (this.loading) return;


    this.error = '';

    this.success = '';


    if (!this.selectedType) {

      this.error =
        'Please select a registration type.';

      return;
    }


    if (!this.acceptedTerms) {

      this.error =
        'Please accept the Terms and Conditions.';

      return;
    }


    this.loading = true;


    let data: any;


    // ==============================
    // TOURIST
    // ==============================

    if (this.selectedType === 'TOURIST') {

      data = {

        ...this.touristData,

        role: 'TOURIST'

      };

    }


    // ==============================
    // BUSINESS OWNER
    // ==============================

    else {

      data = {

        ...this.businessData,

        role: 'BUSINESS_OWNER'

      };

    }


    this.authService.register(data).subscribe({

      next: (response: any) => {

        this.loading = false;

        this.success =
          typeof response === 'string'
            ? response
            : 'Registration completed successfully.';


        setTimeout(() => {

          this.router.navigateByUrl('/login');

        }, 1500);

      },


      error: (err) => {

        this.loading = false;

        this.error =

          typeof err.error === 'string'

            ? err.error

            : err.error?.message ||
              'Registration failed.';

      }

    });

  }

}