import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { LicenseService } from '../../services/license.service';
import { AuthService } from '../../services/auth.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-apply-license',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './apply-license.html',
  styleUrl: './apply-license.css'
})
export class ApplyLicense implements OnInit {

  /* =========================================
     UI STATE
  ========================================= */

  loading = false;

  feeLoading = false;

  selectedFileName = '';

  accepted = false;

  fee = 0;


  /* =========================================
     APPLICATION DATA
  ========================================= */

  application = {

    businessName: '',

    phoneNumber: '',

    licenseType: '',

    district: '',

    location: '',

    durationMonths: 12

  };


  constructor(

    private licenseService: LicenseService,

    private auth: AuthService,

    private router: Router,

    private alert: AlertService

  ) {}


  /* =========================================
     INIT
  ========================================= */

  ngOnInit(): void {

    this.loadProfile();

  }


  /* =========================================
     LOAD CURRENT USER PROFILE
  ========================================= */

  loadProfile(): void {

    this.auth.getProfile().subscribe({

      next: (res: any) => {

        this.application.phoneNumber =
          res?.phoneNumber ?? '';

      },

      error: () => {

        this.alert.error(
          'Unable to load your profile information.'
        );

      }

    });

  }


  /* =========================================
     FILE SELECTION
  ========================================= */

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedFileName =
        input.files[0].name;

    }

  }


  /* =========================================
     CALCULATE LICENSE FEE
  ========================================= */

  calculateFee(): void {

    if (
      !this.application.licenseType ||
      !this.application.durationMonths
    ) {

      this.fee = 0;

      return;

    }

    this.feeLoading = true;

    this.licenseService

      .calculateFee(

        this.application.licenseType,

        this.application.durationMonths

      )

      .subscribe({

        next: (res: number) => {

          this.fee = Number(res);

          this.feeLoading = false;

        },

        error: () => {

          this.fee = 0;

          this.feeLoading = false;

          this.alert.error(
            'Unable to calculate license fee.'
          );

        }

      });

  }


  /* =========================================
     VALIDATION
  ========================================= */

  validateForm(): boolean {

    if (!this.application.businessName.trim()) {

      this.alert.warning(
        'Please enter the business name.'
      );

      return false;

    }


    if (!this.application.phoneNumber.trim()) {

      this.alert.warning(
        'Phone number is required.'
      );

      return false;

    }


    if (!this.application.licenseType) {

      this.alert.warning(
        'Please select a business/license type.'
      );

      return false;

    }


    if (!this.application.district.trim()) {

      this.alert.warning(
        'Please enter the business district.'
      );

      return false;

    }


    if (!this.application.location.trim()) {

      this.alert.warning(
        'Please enter the business location.'
      );

      return false;

    }


    if (!this.application.durationMonths) {

      this.alert.warning(
        'Please select license duration.'
      );

      return false;

    }


    if (!this.accepted) {

      this.alert.warning(
        'Please accept the terms and conditions.'
      );

      return false;

    }


    return true;

  }


  /* =========================================
     SUBMIT APPLICATION
  ========================================= */

  submit(): void {

    if (!this.validateForm()) {

      return;

    }


    /*
      IMPORTANT:

      Do NOT send:
      - ownerName
      - licenseFee
      - ownerEmail
      - status

      Backend generates these values.
    */

    const payload = {

      businessName:
        this.application.businessName.trim(),

      phoneNumber:
        this.application.phoneNumber.trim(),

      licenseType:
        this.application.licenseType,

      district:
        this.application.district.trim(),

      location:
        this.application.location.trim(),

      durationMonths:
        Number(this.application.durationMonths)

    };


    this.loading = true;


    this.licenseService

      .apply(payload)

      .subscribe({

        next: (license: any) => {

          this.loading = false;


          this.alert.success(
            'License application submitted successfully.'
          );


          /*
             Navigate to payment page after
             backend creates the license.

             The backend response contains:
             - licenseNumber
             - controlNumber
             - licenseFee
             - status
             etc.
          */

          this.router.navigate(

            ['/owner/payments'],

            {

              state: {

                license: license

              }

            }

          );

        },


        error: (error) => {

          this.loading = false;

          console.error(
            'LICENSE APPLICATION ERROR:',
            error
          );


          let message =
            'License application failed.';


          if (error?.error) {

            if (typeof error.error === 'string') {

              message = error.error;

            }

            else if (error.error?.message) {

              message = error.error.message;

            }

          }


          this.alert.error(message);

        }

      });

  }


  /* =========================================
     SAVE DRAFT
  ========================================= */

  saveDraft(): void {

    /*
      Backend currently has no
      /licenses/draft endpoint.

      Therefore we do NOT pretend to save
      a draft to the backend.
    */

    this.alert.info(
      'Draft saving is not available yet.'
    );

  }

}