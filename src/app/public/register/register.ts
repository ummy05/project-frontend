import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

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

    age: null as number | null,

    gender: '',

    nationality: '',

    address: '',

    businessName: '',

    businessType: '',

    businessAddress: '',

    password: ''

  };


  // ==============================
  // SELECT TYPE
  // ==============================

  selectType(
    type: 'TOURIST' | 'BUSINESS_OWNER'
  ) {

    this.selectedType = type;

    this.acceptedTerms = false;

    this.showPassword = false;

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

    if (this.loading) {
      return;
    }


    // ==============================
    // TYPE CHECK
    // ==============================

    if (!this.selectedType) {

      Swal.fire({
        icon: 'warning',
        title: 'Registration Type Required',
        text: 'Please select whether you want to register as a Tourist or Business Owner.',
        confirmButtonColor: '#F28B65'
      });

      return;
    }


    // ==============================
    // TERMS CHECK
    // ==============================

    if (!this.acceptedTerms) {

      Swal.fire({
        icon: 'warning',
        title: 'Terms & Conditions',
        text: 'Please accept the Terms and Conditions before creating your account.',
        confirmButtonColor: '#F28B65'
      });

      return;
    }


    let data: any;


    // ==============================
    // TOURIST
    // ==============================

    if (this.selectedType === 'TOURIST') {

      data = {

        fullName: this.touristData.fullName.trim(),

        email: this.touristData.email.trim(),

        phoneNumber: this.touristData.phoneNumber.trim(),

        age: this.touristData.age,

        gender: this.touristData.gender,

        nationality: this.touristData.nationality.trim(),

        address: this.touristData.address.trim(),

        password: this.touristData.password,

        role: 'TOURIST'

      };

    }


    // ==============================
    // BUSINESS OWNER
    // ==============================

    else {

      data = {

        fullName: this.businessData.fullName.trim(),

        email: this.businessData.email.trim(),

        phoneNumber: this.businessData.phoneNumber.trim(),

        age: this.businessData.age,

        gender: this.businessData.gender,

        nationality: this.businessData.nationality.trim(),

        address: this.businessData.address.trim(),

        businessName: this.businessData.businessName.trim(),

        businessType: this.businessData.businessType,

        businessAddress: this.businessData.businessAddress.trim(),

        password: this.businessData.password,

        role: 'BUSINESS_OWNER'

      };

    }


    // ==============================
    // LOADING
    // ==============================

    this.loading = true;

    Swal.fire({

      title: 'Creating Account',

      text: 'Please wait while we create your account...',

      allowOutsideClick: false,

      allowEscapeKey: false,

      showConfirmButton: false,

      didOpen: () => {

        Swal.showLoading();

      }

    });


    // ==============================
    // API
    // ==============================

    this.authService.register(data).subscribe({

      next: (response: any) => {

        this.loading = false;


        Swal.fire({

          icon: 'success',

          title: 'Registration Successful',

          text:
            typeof response === 'string'
              ? response
              : 'Your account has been created successfully.',

          confirmButtonText: 'Continue to Login',

          confirmButtonColor: '#F28B65',

          allowOutsideClick: false

        }).then(() => {

          this.router.navigateByUrl('/login');

        });

      },


      error: (err) => {

        this.loading = false;


        let message = 'Registration failed. Please try again.';


        if (typeof err.error === 'string') {

          message = err.error;

        }
        else if (err.error?.message) {

          message = err.error.message;

        }


        // ==============================
        // EMAIL EXISTS
        // ==============================

        if (
          message.toLowerCase().includes('email already exists') ||
          message.toLowerCase().includes('email already registered')
        ) {

          Swal.fire({

            icon: 'error',

            title: 'Email Already Registered',

            text: 'An account with this email address already exists. Please use another email or sign in.',

            confirmButtonColor: '#F28B65'

          });

          return;
        }


        // ==============================
        // PHONE EXISTS
        // ==============================

        if (
          message.toLowerCase().includes('phone number already exists') ||
          message.toLowerCase().includes('phone already exists')
        ) {

          Swal.fire({

            icon: 'error',

            title: 'Phone Number Already Registered',

            text: 'This phone number is already associated with another account.',

            confirmButtonColor: '#F28B65'

          });

          return;
        }


        // ==============================
        // GENERAL ERROR
        // ==============================

        Swal.fire({

          icon: 'error',

          title: 'Registration Failed',

          text: message,

          confirmButtonColor: '#F28B65'

        });

      }

    });

  }

}