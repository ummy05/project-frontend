import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  FormsModule
} from '@angular/forms';

import {
  LicenseService
} from '../../services/license.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-my-licenses',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DatePipe,
    RouterLink
  ],

  templateUrl: './my-licenses.html',

  styleUrl: './my-licenses.css'
})
export class MyLicenses implements OnInit {

  // =====================================================
  // VARIABLES
  // =====================================================

  showViewModal = false;

  selectedLicense: any = null;

  licenses: any[] = [];

  filteredLicenses: any[] = [];

  search = '';

  status = 'ALL';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private licenseService: LicenseService,

    private alert: AlertService,

    private router: Router,

    private cdr: ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadLicenses();

  }


  // =====================================================
  // LOAD LICENSES
  // =====================================================

  loadLicenses(): void {

    this.alert.loading(
      'Loading your licenses...'
    );


    this.licenseService
      .myLicenses()
      .subscribe({

        next: (res) => {

          this.alert.close();


          this.licenses =
            res || [];


          this.filteredLicenses =
            [...this.licenses];


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'MY LICENSES ERROR:',
            err
          );


          this.alert.close();


          this.alert.error(
            'Failed to load your licenses.',
            'Please try again.'
          );

        }

      });

  }


  // =====================================================
  // FILTER LICENSES
  // =====================================================

  filterLicenses(): void {

    const keyword =
      this.search
        .trim()
        .toLowerCase();


    this.filteredLicenses =
      this.licenses.filter(
        (license) => {


          const businessName =
            String(
              license.businessName || ''
            ).toLowerCase();


          const licenseNumber =
            String(
              license.licenseNumber || ''
            ).toLowerCase();


          const matchesSearch =

            !keyword ||

            businessName.includes(
              keyword
            ) ||

            licenseNumber.includes(
              keyword
            );


          const matchesStatus =

            this.status === 'ALL' ||

            license.status ===
              this.status;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  // =====================================================
  // VIEW LICENSE
  // =====================================================

  openView(
    license: any
  ): void {

    this.selectedLicense =
      license;

    this.showViewModal =
      true;

  }


  // =====================================================
  // CLOSE MODAL
  // =====================================================

  closeModal(): void {

    this.showViewModal =
      false;

    this.selectedLicense =
      null;

  }


  // =====================================================
  // FORMAT STATUS
  // =====================================================

  formatStatus(
    status: string
  ): string {

    switch (status) {

      case 'APPROVED':
        return 'Approved';

      case 'PENDING':
        return 'Pending';

      case 'UNDER_REVIEW':
        return 'Under Review';

      case 'REJECTED':
        return 'Rejected';

      case 'EXPIRED':
        return 'Expired';

      default:
        return status || '';

    }

  }


  // =====================================================
  // CAN PAY
  // =====================================================

  canPay(
    license: any
  ): boolean {

    if (!license) {
      return false;
    }


    if (
      license.status !==
      'APPROVED'
    ) {

      return false;

    }


    const fee =
      Number(
        license.licenseFee || 0
      );


    const paid =
      Number(
        license.paidAmount || 0
      );


    return paid < fee;

  }


  // =====================================================
  // PAYMENT PENDING
  // =====================================================

  isPaymentPending(
    license: any
  ): boolean {

    if (!license) {
      return false;
    }


    const fee =
      Number(
        license.licenseFee || 0
      );


    const paid =
      Number(
        license.paidAmount || 0
      );


    return (

      license.status ===
        'APPROVED' &&

      paid > 0 &&

      paid < fee

    );

  }


  // =====================================================
  // CAN DOWNLOAD
  // =====================================================

  canDownload(
    license: any
  ): boolean {

    if (!license) {
      return false;
    }


    if (
      license.status !==
      'APPROVED'
    ) {

      return false;

    }


    const fee =
      Number(
        license.licenseFee || 0
      );


    const paid =
      Number(
        license.paidAmount || 0
      );


    return paid >= fee;

  }


  // =====================================================
  // PAY LICENSE
  // =====================================================

  payLicense(
    license: any
  ): void {

    if (
      !this.canPay(license)
    ) {

      this.alert.warning(
        'This license is not available for payment.'
      );

      return;

    }


    this.router.navigate(

      ['/owner/payments'],

      {
        state: {
          license: license
        }
      }

    );

  }


  // =====================================================
  // CAN RENEW
  // =====================================================

  canRenew(
    license: any
  ): boolean {

    if (!license) {
      return false;
    }


    return (

      (
        license.status ===
          'APPROVED' ||

        license.status ===
          'EXPIRED'
      )

      &&

      !license.renewal

    );

  }


  // =====================================================
  // RENEW LICENSE
  // =====================================================

  renewLicense(
    license: any
  ): void {

    if (
      !this.canRenew(license)
    ) {

      this.alert.warning(
        'This license cannot be renewed at the moment.'
      );

      return;

    }


    this.alert
      .confirm(
        'Renew License',
        'Are you sure you want to renew this license?',
        'Yes, Renew'
      )
      .then(
        (confirmed: boolean) => {


          // ===========================================
          // USER CANCELLED
          // ===========================================

          if (!confirmed) {

            return;

          }


          // ===========================================
          // SHOW LOADING
          // ===========================================

          this.alert.loading(
            'Submitting renewal request...'
          );


          const months =
            Number(
              license.durationMonths || 12
            );


          // ===========================================
          // RENEW API
          // ===========================================

          this.licenseService
            .renew(
              license.id,
              months
            )
            .subscribe({

              next: () => {

                this.alert.close();


                this.alert.success(
                  'License renewal request submitted successfully.'
                );


                this.loadLicenses();

              },


              error: (err) => {

                console.error(
                  'RENEW LICENSE ERROR:',
                  err
                );


                this.alert.close();


                this.alert.error(
                  'Failed to renew license.',
                  err?.error ||
                  'Please try again.'
                );

              }

            });

        }
      );

  }


  // =====================================================
  // DOWNLOAD LICENSE PDF
  // =====================================================

  downloadLicense(
    license: any
  ): void {

    if (
      !this.canDownload(license)
    ) {

      this.alert.warning(
        'Please complete the license payment before downloading the license.'
      );

      return;

    }


    this.alert.loading(
      'Preparing your license PDF...'
    );


    this.licenseService
      .downloadPdf(
        license.id
      )
      .subscribe({

        next: (blob: Blob) => {

          this.alert.close();


          // ==========================================
          // CREATE DOWNLOAD URL
          // ==========================================

          const url =
            window.URL.createObjectURL(
              blob
            );


          // ==========================================
          // CREATE DOWNLOAD LINK
          // ==========================================

          const link =
            document.createElement(
              'a'
            );


          link.href = url;


          link.download =
            `${license.licenseNumber}.pdf`;


          document.body
            .appendChild(link);


          link.click();


          document.body
            .removeChild(link);


          // ==========================================
          // RELEASE MEMORY
          // ==========================================

          window.URL.revokeObjectURL(
            url
          );


          // ==========================================
          // SUCCESS ALERT
          // ==========================================

          this.alert.success(
            'License downloaded successfully.'
          );

        },


        error: (err) => {

          console.error(
            'LICENSE PDF ERROR:',
            err
          );


          this.alert.close();


          this.alert.error(
            'Failed to download license PDF.',
            'Please try again later.'
          );

        }

      });

  }

}