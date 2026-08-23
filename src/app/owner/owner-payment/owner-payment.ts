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
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  PaymentService
} from '../../services/payment.service';

import {
  LicenseService
} from '../../services/license.service';

import {
  PermitService
} from '../../services/permit.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-owner-payment',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],

  templateUrl: './owner-payment.html',

  styleUrl: './owner-payment.css'
})
export class OwnerPayment implements OnInit {


  // =====================================================
  // MODALS
  // =====================================================

  showPaymentModal = false;

  showReceiptModal = false;


  // =====================================================
  // DATA
  // =====================================================

  payments: any[] = [];

  licenses: any[] = [];

  permits: any[] = [];

  payableLicenses: any[] = [];

  payablePermits: any[] = [];


  // =====================================================
  // SELECTED ITEMS
  // =====================================================

  selectedLicense: any = null;

  selectedPermit: any = null;

  selectedPayment: any = null;


  // =====================================================
  // SUMMARY
  // =====================================================

  totalPaid = 0;

  pendingCount = 0;

  approvedCount = 0;


  // =====================================================
  // STATE
  // =====================================================

  loading = false;


  // =====================================================
  // PAYMENT FORM
  // =====================================================

  paymentForm = {

    paymentType:
      '' as 'LICENSE' | 'PERMIT' | '',

    licenseId:
      null as number | null,

    permitId:
      null as number | null,

    amount:
      0,

    paymentMethod:
      '',

    controlNumber:
      ''

  };


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private paymentService:
      PaymentService,

    private licenseService:
      LicenseService,

    private permitService:
      PermitService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef,

    private router:
      Router

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPayments();

    this.loadLicenses();

    this.loadPermits();

    /*
     * Check whether the owner arrived here
     * from License or Permit payment button.
     */

    this.readNavigationState();

  }


  // =====================================================
  // READ ROUTER STATE
  // =====================================================

  readNavigationState(): void {

    const navigation =
      this.router.getCurrentNavigation();


    const state =
      navigation?.extras?.state ||
      history.state;


    if (!state) {

      return;

    }


    // =================================================
    // PERMIT PAYMENT
    // =================================================

    if (state['permitId']) {

      this.paymentForm.paymentType =
        'PERMIT';


      this.paymentForm.permitId =
        Number(
          state['permitId']
        );


      this.paymentForm.controlNumber =
        state['controlNumber'] || '';


      this.paymentForm.amount =
        Number(
          state['amount'] || 0
        );


      /*
       * Permit list may still be loading.
       * The loadPermits() method will call
       * selectPermitFromNavigation() again.
       */

      setTimeout(() => {

        this.selectPermitFromNavigation();

      }, 300);

    }


    // =================================================
    // LICENSE PAYMENT
    // =================================================

    if (state['licenseId']) {

      this.paymentForm.paymentType =
        'LICENSE';


      this.paymentForm.licenseId =
        Number(
          state['licenseId']
        );


      this.paymentForm.controlNumber =
        state['controlNumber'] || '';


      this.paymentForm.amount =
        Number(
          state['amount'] || 0
        );


      setTimeout(() => {

        this.selectLicenseFromNavigation();

      }, 300);

    }

  }


  // =====================================================
  // SELECT PERMIT FROM NAVIGATION
  // =====================================================

  selectPermitFromNavigation(): void {

    if (
      !this.paymentForm.permitId
    ) {

      return;

    }


    this.selectedPermit =
      this.payablePermits.find(

        permit =>

          Number(permit.id) ===
          Number(
            this.paymentForm.permitId
          )

      ) || null;


    if (this.selectedPermit) {

      this.selectedLicense =
        null;


      this.paymentForm.paymentType =
        'PERMIT';


      this.paymentForm.permitId =
        Number(
          this.selectedPermit.id
        );


      this.paymentForm.licenseId =
        null;


      this.paymentForm.amount =
        Number(
          this.selectedPermit.permitFee || 0
        );


      this.paymentForm.controlNumber =
        this.selectedPermit.controlNumber ||
        this.paymentForm.controlNumber ||
        '';


      /*
       * Automatically open the payment modal
       * when coming from My Permits -> Pay.
       */

      this.showPaymentModal =
        true;


      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // SELECT LICENSE FROM NAVIGATION
  // =====================================================

  selectLicenseFromNavigation(): void {

    if (
      !this.paymentForm.licenseId
    ) {

      return;

    }


    this.selectedLicense =
      this.payableLicenses.find(

        license =>

          Number(license.id) ===
          Number(
            this.paymentForm.licenseId
          )

      ) || null;


    if (this.selectedLicense) {

      this.selectedPermit =
        null;


      this.paymentForm.paymentType =
        'LICENSE';


      this.paymentForm.licenseId =
        Number(
          this.selectedLicense.id
        );


      this.paymentForm.permitId =
        null;


      this.paymentForm.amount =
        Number(
          this.selectedLicense.licenseFee || 0
        );


      this.paymentForm.controlNumber =
        this.selectedLicense.controlNumber ||
        this.paymentForm.controlNumber ||
        '';


      /*
       * Automatically open the payment modal
       * when coming from My Licenses -> Pay.
       */

      this.showPaymentModal =
        true;


      this.cdr.detectChanges();

    }

  }


  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  loadPayments(): void {

    this.loading = true;


    this.alert.loading(
      'Loading your payments...'
    );


    this.paymentService
      .getMyPayments()
      .subscribe({

        next: (res) => {

          this.payments =
            res || [];


          this.calculateSummary();


          this.loading =
            false;


          this.alert.close();


          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'MY PAYMENTS ERROR:',
            err
          );


          this.loading =
            false;


          this.alert.close();


          this.alert.error(

            'Failed to load payments.',

            err?.error ||
            'Please try again later.'

          );

        }

      });

  }


  // =====================================================
  // LOAD LICENSES
  // =====================================================

  loadLicenses(): void {

    this.licenseService
      .myLicenses()
      .subscribe({

        next: (res) => {

          this.licenses =
            res || [];


          this.preparePayableLicenses();


          this.cdr.detectChanges();


          /*
           * If owner came from License -> Pay,
           * select the license after data loads.
           */

          this.selectLicenseFromNavigation();

        },


        error: (err) => {

          console.error(
            'MY LICENSES ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD PERMITS
  // =====================================================

  loadPermits(): void {

    this.permitService
      .getMyPermits()
      .subscribe({

        next: (res) => {

          this.permits =
            res || [];


          this.preparePayablePermits();


          this.cdr.detectChanges();


          /*
           * If owner came from Permit -> Pay,
           * select the permit after data loads.
           */

          this.selectPermitFromNavigation();

        },


        error: (err) => {

          console.error(
            'MY PERMITS ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // PREPARE PAYABLE LICENSES
  // =====================================================

  preparePayableLicenses(): void {

    this.payableLicenses =

      this.licenses.filter(
        license => {

          if (!license) {

            return false;

          }


          /*
           * License must be approved
           * before owner can pay.
           */

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


          /*
           * Only unpaid / partially unpaid
           * licenses are payable.
           */

          return paid < fee;

        }
      );

  }


  // =====================================================
  // PREPARE PAYABLE PERMITS
  // =====================================================

  preparePayablePermits(): void {

    this.payablePermits =

      this.permits.filter(
        permit => {

          if (!permit) {

            return false;

          }


          /*
           * Permit must be waiting for payment.
           *
           * This means the permit has already
           * passed the required approval stage.
           */

          if (
            permit.status !==
            'WAITING_PAYMENT'
          ) {

            return false;

          }


          const fee =
            Number(
              permit.permitFee || 0
            );


          const paid =
            Number(
              permit.paidAmount || 0
            );


          /*
           * Only unpaid / partially unpaid
           * permits are payable.
           */

          return paid < fee;

        }
      );

  }


  // =====================================================
  // SUMMARY
  // =====================================================

  calculateSummary(): void {

    this.totalPaid =

      this.payments

        .filter(
          payment =>
            payment.status ===
            'APPROVED'
        )

        .reduce(

          (total, payment) =>

            total +
            Number(
              payment.amount || 0
            ),

          0

        );


    this.pendingCount =

      this.payments.filter(

        payment =>
          payment.status ===
          'PENDING'

      ).length;


    this.approvedCount =

      this.payments.filter(

        payment =>
          payment.status ===
          'APPROVED'

      ).length;

  }


  // =====================================================
  // OPEN PAYMENT MODAL
  // =====================================================

  openPaymentModal(): void {

    this.preparePayableLicenses();

    this.preparePayablePermits();


    this.resetPaymentForm();


    this.showPaymentModal =
      true;


    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE PAYMENT MODAL
  // =====================================================

  closePaymentModal(
    event?: Event
  ): void {

    if (event) {

      const target =
        event.target as HTMLElement;


      const currentTarget =
        event.currentTarget as HTMLElement;


      if (
        target !== currentTarget
      ) {

        return;

      }

    }


    this.showPaymentModal =
      false;


    this.resetPaymentForm();

  }


  // =====================================================
  // CLOSE RECEIPT
  // =====================================================

  closeReceiptModal(
    event?: Event
  ): void {

    if (event) {

      const target =
        event.target as HTMLElement;


      const currentTarget =
        event.currentTarget as HTMLElement;


      if (
        target !== currentTarget
      ) {

        return;

      }

    }


    this.showReceiptModal =
      false;


    this.selectedPayment =
      null;

  }


  // =====================================================
  // GENERAL CLOSE
  // =====================================================

  closeModal(): void {

    this.showPaymentModal =
      false;


    this.showReceiptModal =
      false;


    this.selectedPayment =
      null;


    this.resetPaymentForm();

  }


  // =====================================================
  // PAYMENT TYPE CHANGE
  // =====================================================

  onPaymentTypeChange(): void {

    this.selectedLicense =
      null;


    this.selectedPermit =
      null;


    this.paymentForm.licenseId =
      null;


    this.paymentForm.permitId =
      null;


    this.paymentForm.amount =
      0;


    this.paymentForm.controlNumber =
      '';


    /*
     * Make sure payable lists are up to date.
     */

    this.preparePayableLicenses();

    this.preparePayablePermits();


    this.cdr.detectChanges();

  }


  // =====================================================
  // SELECT LICENSE FOR PAYMENT
  // =====================================================

  selectLicenseForPayment(
    license: any
  ): void {

    if (!license) {

      return;

    }


    this.selectedLicense =
      license;


    this.selectedPermit =
      null;


    this.paymentForm.paymentType =
      'LICENSE';


    this.paymentForm.licenseId =
      Number(
        license.id
      );


    this.paymentForm.permitId =
      null;


    this.paymentForm.amount =
      Number(
        license.licenseFee || 0
      );


    this.paymentForm.controlNumber =
      license.controlNumber || '';


    this.cdr.detectChanges();

  }


  // =====================================================
  // SELECT PERMIT FOR PAYMENT
  // =====================================================

  selectPermitForPayment(
    permit: any
  ): void {

    if (!permit) {

      return;

    }


    this.selectedPermit =
      permit;


    this.selectedLicense =
      null;


    this.paymentForm.paymentType =
      'PERMIT';


    this.paymentForm.permitId =
      Number(
        permit.id
      );


    this.paymentForm.licenseId =
      null;


    this.paymentForm.amount =
      Number(
        permit.permitFee || 0
      );


    this.paymentForm.controlNumber =
      permit.controlNumber || '';


    this.cdr.detectChanges();

  }


  // =====================================================
  // LICENSE CHANGE
  // =====================================================

  onLicenseChange(): void {

    this.selectedLicense =

      this.payableLicenses.find(

        license =>

          Number(license.id) ===
          Number(
            this.paymentForm.licenseId
          )

      ) || null;


    this.selectedPermit =
      null;


    if (this.selectedLicense) {

      this.paymentForm.paymentType =
        'LICENSE';


      this.paymentForm.permitId =
        null;


      this.paymentForm.amount =
        Number(
          this.selectedLicense.licenseFee || 0
        );


      this.paymentForm.controlNumber =
        this.selectedLicense.controlNumber ||
        '';

    }

  }


  // =====================================================
  // PERMIT CHANGE
  // =====================================================

  onPermitChange(): void {

    this.selectedPermit =

      this.payablePermits.find(

        permit =>

          Number(permit.id) ===
          Number(
            this.paymentForm.permitId
          )

      ) || null;


    this.selectedLicense =
      null;


    if (this.selectedPermit) {

      this.paymentForm.paymentType =
        'PERMIT';


      this.paymentForm.licenseId =
        null;


      this.paymentForm.amount =
        Number(
          this.selectedPermit.permitFee || 0
        );


      this.paymentForm.controlNumber =
        this.selectedPermit.controlNumber ||
        '';

    }

  }


  // =====================================================
  // VALIDATE PAYMENT FORM
  // =====================================================

  isPaymentFormValid(): boolean {

    /*
     * Common validation.
     */

    if (
      !this.paymentForm.paymentType
    ) {

      return false;

    }


    if (
      this.paymentForm.amount <= 0
    ) {

      return false;

    }


    if (
      !this.paymentForm.paymentMethod
    ) {

      return false;

    }


    if (
      !this.paymentForm.controlNumber.trim()
    ) {

      return false;

    }


    /*
     * License must have selected license.
     */

    if (
      this.paymentForm.paymentType ===
      'LICENSE'
    ) {

      return !!this.selectedLicense;

    }


    /*
     * Permit must have selected permit.
     */

    if (
      this.paymentForm.paymentType ===
      'PERMIT'
    ) {

      return !!this.selectedPermit;

    }


    return false;

  }


  // =====================================================
  // SUBMIT PAYMENT
  // =====================================================

  submitPayment(): void {

    if (
      !this.isPaymentFormValid()
    ) {

      this.alert.warning(
        'Please complete all payment fields.'
      );

      return;

    }


    const amount =
      Number(
        this.paymentForm.amount
      );


    let requiredAmount =
      0;


    let itemNumber =
      '';


    let itemName =
      '';


    // =================================================
    // LICENSE PAYMENT
    // =================================================

    if (
      this.paymentForm.paymentType ===
      'LICENSE'
    ) {

      if (!this.selectedLicense) {

        this.alert.warning(
          'Please select a license.'
        );

        return;

      }


      requiredAmount =
        Number(
          this.selectedLicense.licenseFee || 0
        );


      itemNumber =
        this.selectedLicense.licenseNumber ||
        'License';


      itemName =
        'license';

    }


    // =================================================
    // PERMIT PAYMENT
    // =================================================

    if (
      this.paymentForm.paymentType ===
      'PERMIT'
    ) {

      if (!this.selectedPermit) {

        this.alert.warning(
          'Please select a permit.'
        );

        return;

      }


      requiredAmount =
        Number(
          this.selectedPermit.permitFee || 0
        );


      itemNumber =
        this.selectedPermit.permitNumber ||
        'Permit';


      itemName =
        'permit';

    }


    // =================================================
    // AMOUNT VALIDATION
    // =================================================

    if (
      amount !== requiredAmount
    ) {

      this.alert.error(

        'Invalid Payment Amount',

        `The required ${itemName} fee is TZS ${requiredAmount.toLocaleString()}.`

      );

      return;

    }


    // =================================================
    // CONTROL NUMBER VALIDATION
    // =================================================

    const controlNumber =
      this.paymentForm.controlNumber
        .trim();


    if (!controlNumber) {

      this.alert.warning(
        'Control Number Required',
        'Please enter the control number.'
      );

      return;

    }


    // =================================================
    // CONFIRM PAYMENT
    // =================================================

    this.alert.confirm(

      'Submit Payment',

      `Are you sure you want to submit payment of TZS ${amount.toLocaleString()} for ${itemNumber}?`,

      'Submit Payment'

    ).then(
      (confirmed: boolean) => {

        if (!confirmed) {

          return;

        }


        this.alert.loading(
          'Submitting payment...'
        );


        // =================================================
        // PAYMENT REQUEST
        // =================================================

        const request = {

          controlNumber:
            controlNumber,

          amount:
            amount,

          paymentMethod:
            this.paymentForm.paymentMethod

        };


        // =================================================
        // COMMON PAYMENT API
        // =================================================

        this.paymentService
          .makePayment(request)
          .subscribe({

            next: (response) => {

              console.log(
                'PAYMENT RESPONSE:',
                response
              );


              this.alert.close();


              this.showPaymentModal =
                false;


              this.resetPaymentForm();


              this.alert.success(

                'Payment Submitted',

                'Your payment has been submitted successfully and is awaiting verification.'

              );


              /*
               * Reload everything so the new
               * payment status is reflected.
               */

              this.loadPayments();

              this.loadLicenses();

              this.loadPermits();

            },


            error: (err) => {

              console.error(
                'MAKE PAYMENT ERROR:',
                err
              );


              this.alert.close();


              let message =
                'Failed to submit payment.';


              if (
                typeof err?.error ===
                'string'
              ) {

                message =
                  err.error;

              }

              else if (
                err?.error?.message
              ) {

                message =
                  err.error.message;

              }


              this.alert.error(

                'Payment Failed',

                message

              );

            }

          });

      }
    );

  }


  // =====================================================
  // OPEN RECEIPT
  // =====================================================

  openReceipt(
    payment: any
  ): void {

    this.selectedPayment =
      payment;


    this.showReceiptModal =
      true;

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetPaymentForm(): void {

    this.paymentForm = {

      paymentType:
        '',

      licenseId:
        null,

      permitId:
        null,

      amount:
        0,

      paymentMethod:
        '',

      controlNumber:
        ''

    };


    this.selectedLicense =
      null;


    this.selectedPermit =
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


      case 'REJECTED':

        return 'Rejected';


      default:

        return status ||
          'Unknown';

    }

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'APPROVED':

        return 'approved-status';


      case 'PENDING':

        return 'pending-status';


      case 'REJECTED':

        return 'rejected-status';


      default:

        return '';

    }

  }


  // =====================================================
  // STATUS ICON
  // =====================================================

  getStatusIcon(
    status: string
  ): string {

    switch (status) {

      case 'APPROVED':

        return 'fas fa-circle-check';


      case 'PENDING':

        return 'fas fa-clock';


      case 'REJECTED':

        return 'fas fa-circle-xmark';


      default:

        return 'fas fa-circle-question';

    }

  }


  // =====================================================
  // PAYMENT METHOD FORMAT
  // =====================================================

  formatPaymentMethod(
    method: string
  ): string {

    switch (method) {

      case 'MOBILE_MONEY':

        return 'Mobile Money';


      case 'BANK_TRANSFER':

        return 'Bank Transfer';


      case 'CASH':

        return 'Cash';


      default:

        return method ||
          'N/A';

    }

  }


  // =====================================================
  // PAYMENT METHOD ICON
  // =====================================================

  getPaymentMethodIcon(
    method: string
  ): string {

    switch (method) {

      case 'MOBILE_MONEY':

        return 'fas fa-mobile-screen-button';


      case 'BANK_TRANSFER':

        return 'fas fa-building-columns';


      case 'CASH':

        return 'fas fa-money-bill';


      default:

        return 'fas fa-wallet';

    }

  }

}