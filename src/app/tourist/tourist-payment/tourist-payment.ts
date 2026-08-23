import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router
} from '@angular/router';

import {
  Permit
} from '../../models/permit.model';

import {
  PermitService
} from '../../services/permit.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-tourist-payment',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    DatePipe
  ],

  templateUrl: './tourist-payment.html',

  styleUrl: './tourist-payment.css'

})
export class TouristPayment implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private permitService =
    inject(PermitService);

  private alertService =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);

  private router =
    inject(Router);


  // =====================================================
  // DATA
  // =====================================================

  permits: Permit[] = [];

  payablePermits: Permit[] = [];

  payments: any[] = [];


  // =====================================================
  // SELECTED PERMIT
  // =====================================================

  selectedPermit: Permit | null = null;


  // =====================================================
  // SELECTED PAYMENT
  // =====================================================

  selectedPayment: any = null;


  // =====================================================
  // MODALS
  // =====================================================

  showPaymentModal = false;

  showReceiptModal = false;


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;

  paymentLoading = false;


  // =====================================================
  // SUMMARY
  // =====================================================

  totalPaid = 0;

  pendingCount = 0;

  approvedCount = 0;


  // =====================================================
  // PAYMENT FORM
  // =====================================================

  paymentForm = {

    permitId:
      null as number | null,

    controlNumber:
      '',

    amount:
      0,

    paymentMethod:
      ''

  };


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPermits();

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


    /*
     * Tourist comes from:
     *
     * My Permits -> Pay
     *
     * with:
     *
     * permitId
     * controlNumber
     * amount
     */

    if (state['permitId']) {

      this.paymentForm.permitId =
        Number(
          state['permitId']
        );


      this.paymentForm.controlNumber =
        String(
          state['controlNumber'] || ''
        );


      this.paymentForm.amount =
        Number(
          state['amount'] || 0
        );


      /*
       * Permit list may still be loading.
       * loadPermits() will call this again.
       */

      setTimeout(() => {

        this.selectPermitFromNavigation();

      }, 300);

    }

  }


  // =====================================================
  // LOAD MY PERMITS
  // =====================================================

  loadPermits(): void {

    this.loading = true;

    this.alertService.loading(
      'Loading your permits...'
    );


    this.permitService
      .getMyPermits()
      .subscribe({

        next: (response) => {

          this.permits =
            response || [];


          this.preparePayablePermits();


          this.loading = false;

          this.alertService.close();


          /*
           * Try to select permit received
           * through router navigation.
           */

          this.selectPermitFromNavigation();


          this.calculateSummary();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'TOURIST PERMITS ERROR:',
            error
          );


          this.loading = false;

          this.alertService.close();


          const message =
            typeof error?.error === 'string'
              ? error.error
              : error?.error?.message
                ? error.error.message
                : 'Unable to load your permits.';


          this.alertService.error(

            'Failed to Load Permits',

            message

          );


          this.cdr.detectChanges();

        }

      });

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
           * Tourist can only pay a permit
           * that is waiting for payment.
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


          return (
            fee > 0 &&
            paid < fee
          );

        }
      );

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


    /*
     * First search all permits.
     *
     * This is important because the permit
     * may have already changed status.
     */

    const permit =
      this.permits.find(

        item =>
          Number(item.id) ===
          Number(
            this.paymentForm.permitId
          )

      ) || null;


    if (!permit) {

      return;

    }


    this.selectPermitForPayment(
      permit,
      true
    );

  }


  // =====================================================
  // SELECT PERMIT FOR PAYMENT
  // =====================================================

  selectPermitForPayment(

    permit: Permit,

    autoOpen = false

  ): void {

    if (!permit) {

      return;

    }


    /*
     * Only WAITING_PAYMENT permits
     * can be paid.
     */

    if (
      permit.status !==
      'WAITING_PAYMENT'
    ) {

      this.alertService.info(

        'Payment Not Available',

        'This permit is not currently waiting for payment.'

      );

      return;

    }


    const fee =
      Number(
        permit.permitFee || 0
      );


    const paid =
      Number(
        permit.paidAmount || 0
      );


    if (
      fee <= 0 ||
      paid >= fee
    ) {

      this.alertService.info(

        'Payment Not Available',

        'This permit has already been paid.'

      );

      return;

    }


    this.selectedPermit =
      permit;


    this.paymentForm.permitId =
      Number(
        permit.id
      );


    /*
     * IMPORTANT:
     *
     * Always take control number directly
     * from the permit returned by backend.
     *
     * Do not allow it to become empty.
     */

    this.paymentForm.controlNumber =
      String(
        permit.controlNumber || ''
      ).trim();


    this.paymentForm.amount =
      fee;


    /*
     * Default payment method.
     *
     * Change this according to your
     * payment UI if necessary.
     */

    if (
      !this.paymentForm.paymentMethod
    ) {

      this.paymentForm.paymentMethod =
        'MOBILE_MONEY';

    }


    if (autoOpen) {

      this.showPaymentModal =
        true;

    }


    this.cdr.detectChanges();

  }


  // =====================================================
  // OPEN PAYMENT MODAL
  // =====================================================

  openPaymentModal(): void {

    this.preparePayablePermits();


    /*
     * If there is only one payable permit,
     * select it automatically.
     */

    if (
      this.payablePermits.length === 1
    ) {

      this.selectPermitForPayment(
        this.payablePermits[0]
      );

    }


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
  // CLOSE ALL MODALS
  // =====================================================

  closeModal(): void {

    this.showPaymentModal =
      false;

    this.showReceiptModal =
      false;

    this.selectedPayment =
      null;

  }


  // =====================================================
  // PERMIT CHANGE
  // =====================================================

  onPermitChange(): void {

    const permitId =
      Number(
        this.paymentForm.permitId
      );


    const permit =
      this.payablePermits.find(

        item =>
          Number(item.id) ===
          permitId

      ) || null;


    if (!permit) {

      this.selectedPermit =
        null;

      this.paymentForm.controlNumber =
        '';

      this.paymentForm.amount =
        0;

      return;

    }


    this.selectPermitForPayment(
      permit
    );

  }


  // =====================================================
  // PAYMENT FORM VALIDATION
  // =====================================================

  isPaymentFormValid(): boolean {

    /*
     * Permit required
     */

    if (
      !this.selectedPermit
    ) {

      return false;

    }


    /*
     * Permit ID required
     */

    if (
      !this.paymentForm.permitId
    ) {

      return false;

    }


    /*
     * Control number required
     */

    if (
      !this.paymentForm.controlNumber ||
      !this.paymentForm.controlNumber.trim()
    ) {

      return false;

    }


    /*
     * Amount required
     */

    if (
      !this.paymentForm.amount ||
      Number(
        this.paymentForm.amount
      ) <= 0
    ) {

      return false;

    }


    /*
     * Payment method required
     */

    if (
      !this.paymentForm.paymentMethod
    ) {

      return false;

    }


    return true;

  }


  // =====================================================
  // SUBMIT PAYMENT
  // =====================================================

  submitPayment(): void {

    /*
     * Make sure selected permit exists.
     */

    if (
      !this.selectedPermit
    ) {

      this.alertService.warning(

        'Permit Required',

        'Please select a permit to pay.'

      );

      return;

    }


    /*
     * Always refresh these values from
     * selected permit.
     *
     * This prevents:
     *
     * amount = 0
     * controlNumber = ''
     */

    const controlNumber =
      String(
        this.selectedPermit.controlNumber || ''
      ).trim();


    const amount =
      Number(
        this.selectedPermit.permitFee || 0
      );


    /*
     * Validate control number.
     */

    if (!controlNumber) {

      this.alertService.error(

        'Control Number Missing',

        'This permit does not have a valid control number.'

      );

      return;

    }


    /*
     * Validate amount.
     */

    if (
      amount <= 0
    ) {

      this.alertService.error(

        'Invalid Permit Fee',

        'The permit does not have a valid payment amount.'

      );

      return;

    }


    /*
     * Keep frontend form synchronized.
     */

    this.paymentForm.controlNumber =
      controlNumber;


    this.paymentForm.amount =
      amount;


    /*
     * Confirm payment.
     */

    this.alertService.confirm(

      'Confirm Payment',

      `Are you sure you want to pay TZS ${this.formatAmount(
        amount
      )} for permit ${this.selectedPermit.permitNumber}?`,

      'Pay Now'

    ).then(
      (confirmed: boolean) => {

        if (!confirmed) {

          return;

        }


        this.paymentLoading =
          true;


        this.alertService.loading(
          'Processing permit payment...'
        );


        /*
         * IMPORTANT:
         *
         * Permit payment DOES NOT use
         * PaymentService.makePayment().
         *
         * It uses:
         *
         * POST /api/permits/pay
         */

        const request = {

          controlNumber:
            controlNumber,

          amount:
            amount

        };


        console.log(
          'TOURIST PERMIT PAYMENT REQUEST:',
          request
        );


        this.permitService
          .payPermit(request)
          .subscribe({

            next: (updatedPermit) => {

              console.log(
                'TOURIST PERMIT PAYMENT RESPONSE:',
                updatedPermit
              );


              this.paymentLoading =
                false;


              this.alertService.close();


              /*
               * Update permit in list.
               */

              const index =
                this.permits.findIndex(

                  permit =>
                    permit.id ===
                    updatedPermit.id

                );


              if (
                index !== -1
              ) {

                this.permits[index] =
                  updatedPermit;

              }


              /*
               * Recalculate payable permits.
               */

              this.preparePayablePermits();


              /*
               * Close modal.
               */

              this.showPaymentModal =
                false;


              this.selectedPermit =
                null;


              this.cdr.detectChanges();


              /*
               * SUCCESS
               */

              this.alertService.success(

                'Payment Successful',

                'Your permit payment has been verified successfully. Your application is now waiting for Sheha approval.'

              );

            },


            error: (error) => {

              console.error(
                'TOURIST PERMIT PAYMENT ERROR:',
                error
              );


              this.paymentLoading =
                false;


              this.alertService.close();


              let message =
                'Unable to process permit payment.';


              if (
                typeof error?.error ===
                'string'
              ) {

                message =
                  error.error;

              }

              else if (
                error?.error?.message
              ) {

                message =
                  error.error.message;

              }


              /*
               * Handle validation error.
               */

              if (
                error?.status === 400
              ) {

                message =
                  message ||
                  'Please check the control number and payment amount.';

              }


              /*
               * Handle authentication.
               */

              if (
                error?.status === 401
              ) {

                message =
                  'Your login session has expired or the authentication token is missing. Please login again.';

              }


              /*
               * Handle forbidden.
               */

              if (
                error?.status === 403
              ) {

                message =
                  'You are not authorized to make this permit payment.';

              }


              this.alertService.error(

                'Payment Failed',

                message

              );


              this.cdr.detectChanges();

            }

          });

      }

    );

  }


  // =====================================================
  // CALCULATE SUMMARY
  // =====================================================

  calculateSummary(): void {

    /*
     * Payments are optional here because the
     * actual permit payment is handled by
     * PermitController.
     *
     * We calculate summary directly from
     * permits to keep tourist payment
     * permit-only.
     */

    this.totalPaid =

      this.permits.reduce(

        (total, permit) =>

          total +
          Number(
            permit.paidAmount || 0
          ),

        0

      );


    this.approvedCount =

      this.permits.filter(

        permit =>
          permit.status ===
          'APPROVED'

      ).length;


    this.pendingCount =

      this.permits.filter(

        permit =>
          permit.status ===
          'PENDING'

      ).length;

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
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: Permit['status']
  ): string {

    switch (status) {

      case 'WAITING_PAYMENT':
        return 'Waiting for Payment';

      case 'PENDING':
        return 'Pending Approval';

      case 'APPROVED':
        return 'Approved';

      case 'REJECTED':
        return 'Rejected';

      case 'EXPIRED':
        return 'Expired';

      default:
        return status;

    }

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: Permit['status']
  ): string {

    switch (status) {

      case 'WAITING_PAYMENT':
        return 'payment-status';

      case 'PENDING':
        return 'pending-status';

      case 'APPROVED':
        return 'approved-status';

      case 'REJECTED':
        return 'rejected-status';

      case 'EXPIRED':
        return 'expired-status';

      default:
        return '';

    }

  }


  // =====================================================
  // STATUS ICON
  // =====================================================

  getStatusIcon(
    status: Permit['status']
  ): string {

    switch (status) {

      case 'WAITING_PAYMENT':
        return 'fas fa-credit-card';

      case 'PENDING':
        return 'fas fa-clock';

      case 'APPROVED':
        return 'fas fa-circle-check';

      case 'REJECTED':
        return 'fas fa-circle-xmark';

      case 'EXPIRED':
        return 'fas fa-calendar-xmark';

      default:
        return 'fas fa-circle-question';

    }

  }


  // =====================================================
  // PERMIT TYPE LABEL
  // =====================================================

  getPermitTypeLabel(
    type: Permit['permitType']
  ): string {

    switch (type) {

      case 'WEDDING_EVENT':
        return 'Wedding Event';

      case 'MUSIC_EVENT':
        return 'Music Event';

      case 'BEACH_EVENT':
        return 'Beach Event';

      case 'CULTURAL_EVENT':
        return 'Cultural Event';

      case 'PRIVATE_EVENT':
        return 'Private Event';

      case 'SPORTS_EVENT':
        return 'Sports Event';

      case 'OTHER_EVENT':
        return 'Other Event';

      default:
        return type;

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
        return method || 'N/A';

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


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-TZ'
    ).format(
      Number(
        amount || 0
      )
    );

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByPermitId(
    index: number,
    permit: Permit
  ): number {

    return permit.id;

  }

}