import { CommonModule } from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { FormsModule } from '@angular/forms';

import { PaymentService } from '../../services/payment.service';

import { AlertService } from '../../services/alert.service';


@Component({

  selector: 'app-admin-payment',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './admin-payment.html',

  styleUrl: './admin-payment.css'

})
export class AdminPayment implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private paymentService =
    inject(PaymentService);

  private alertService =
    inject(AlertService);


  // =====================================================
  // DATA
  // =====================================================

  payments: any[] = [];

  filteredPayments: any[] = [];

  selectedPayment: any = null;


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  search = '';

  status = 'ALL';

  remarks = '';


  // =====================================================
  // MODALS
  // =====================================================

  showViewModal = false;

  showEditModal = false;


  // =====================================================
  // SUMMARY
  // =====================================================

  totalRevenue = 0;

  approvedCount = 0;

  pendingCount = 0;

  rejectedCount = 0;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(
    private cdr: ChangeDetectorRef
  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPayments();

  }


  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  loadPayments(): void {

    this.loading = true;

    this.alertService.loading(
      'Loading payments...'
    );


    this.paymentService
      .getAll()
      .subscribe({

        next: (res) => {

          this.payments =
            res ?? [];

          this.filterPayments();

          this.calculateSummary();

          this.loading = false;

          this.alertService.close();

          this.cdr.detectChanges();

        },


        error: (error) => {

          this.loading = false;

          this.alertService.close();

          console.error(
            'Load payments error:',
            error
          );

          this.alertService.error(
            'Failed to Load Payments',
            this.getErrorMessage(
              error,
              'Unable to retrieve payment records.'
            )
          );

        }

      });

  }


  // =====================================================
  // SUMMARY
  // =====================================================

  calculateSummary(): void {

    this.totalRevenue = 0;

    this.approvedCount = 0;

    this.pendingCount = 0;

    this.rejectedCount = 0;


    this.payments.forEach(
      payment => {

        const paymentStatus =
          String(
            payment.status ?? ''
          ).toUpperCase();


        if (
          paymentStatus ===
          'APPROVED'
        ) {

          this.totalRevenue +=
            Number(
              payment.amount ?? 0
            );

          this.approvedCount++;

        }


        else if (
          paymentStatus ===
          'PENDING'
        ) {

          this.pendingCount++;

        }


        else if (
          paymentStatus ===
          'REJECTED'
        ) {

          this.rejectedCount++;

        }

      }
    );

  }


  // =====================================================
  // FILTER
  // =====================================================

  filterPayments(): void {

    const searchValue =
      this.search
        .toLowerCase()
        .trim();


    this.filteredPayments =
      this.payments.filter(
        payment => {

          const paymentNumber =
            String(
              payment.paymentNumber ?? ''
            ).toLowerCase();


          const licenseNumber =
            String(
              payment.licenseNumber ?? ''
            ).toLowerCase();


          const permitNumber =
            String(
              payment.permitNumber ?? ''
            ).toLowerCase();


          const matchesSearch =

            !searchValue ||

            paymentNumber.includes(
              searchValue
            ) ||

            licenseNumber.includes(
              searchValue
            ) ||

            permitNumber.includes(
              searchValue
            );


          const paymentStatus =
            String(
              payment.status ?? ''
            ).toUpperCase();


          const matchesStatus =

            this.status === 'ALL' ||

            paymentStatus ===
              this.status;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  // =====================================================
  // VIEW PAYMENT
  // =====================================================

  openView(
    payment: any
  ): void {

    this.selectedPayment = {
      ...payment
    };

    this.showViewModal = true;

  }


  // =====================================================
  // OPEN REVIEW
  // =====================================================

  openReview(
    payment: any
  ): void {

    if (
      payment.status !==
      'PENDING'
    ) {

      this.alertService.info(
        'Already Reviewed',
        'This payment has already been processed.'
      );

      return;

    }


    this.selectedPayment = {
      ...payment
    };

    this.remarks = '';

    this.showEditModal = true;

  }


  // =====================================================
  // APPROVE PAYMENT
  // =====================================================

  async approve(): Promise<void> {

    if (
      !this.selectedPayment
    ) {

      return;

    }


    const paymentId =
      this.selectedPayment.id;


    const paymentNumber =
      this.selectedPayment
        .paymentNumber;


    console.log(
      'Approving payment:',
      {
        id: paymentId,
        paymentNumber,
        remarks: this.remarks
      }
    );


    const confirmed =
      await this.alertService.confirm(

        'Approve Payment?',

        `Are you sure you want to approve ${paymentNumber}?`,

        'Approve Payment'

      );


    if (!confirmed) {

      return;

    }


    // =================================================
    // LOADING
    // =================================================

    this.alertService.loading(
      'Approving payment...'
    );


    this.loading = true;


    // =================================================
    // API
    // =================================================

    this.paymentService
      .approve(
        paymentId,
        this.remarks.trim()
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Approve payment response:',
            response
          );


          this.loading = false;

          this.alertService.close();


          // ===========================================
          // UPDATE CURRENT PAYMENT IMMEDIATELY
          // ===========================================

          const index =
            this.payments.findIndex(
              payment =>
                payment.id ===
                paymentId
            );


          if (index !== -1) {

            this.payments[index] = {
              ...this.payments[index],

              status:
                response?.status ??
                'APPROVED',

              adminRemarks:
                response?.adminRemarks ??
                this.remarks,

              verifiedAt:
                response?.verifiedAt ??
                new Date().toISOString()

            };

          }


          // ===========================================
          // RECALCULATE UI
          // ===========================================

          this.calculateSummary();

          this.filterPayments();


          // ===========================================
          // CLOSE MODAL
          // ===========================================

          this.closeModals();


          this.cdr.detectChanges();


          // ===========================================
          // SUCCESS
          // ===========================================

          this.alertService.success(

            'Payment Approved',

            `${paymentNumber} has been approved successfully.`

          );


          // ===========================================
          // RELOAD FROM DATABASE
          // ===========================================

          this.loadPayments();

        },


        error: (error) => {

          this.loading = false;

          this.alertService.close();


          console.error(
            'Approve payment error:',
            error
          );


          this.alertService.error(

            'Approval Failed',

            this.getErrorMessage(
              error,
              'Unable to approve this payment.'
            )

          );

        }

      });

  }


  // =====================================================
  // REJECT PAYMENT
  // =====================================================

  async reject(): Promise<void> {

    if (
      !this.selectedPayment
    ) {

      return;

    }


    if (
      !this.remarks.trim()
    ) {

      this.alertService.warning(

        'Remarks Required',

        'Please provide a reason for rejecting this payment.'

      );

      return;

    }


    const paymentId =
      this.selectedPayment.id;


    const paymentNumber =
      this.selectedPayment
        .paymentNumber;


    const confirmed =
      await this.alertService.confirm(

        'Reject Payment?',

        `Are you sure you want to reject ${paymentNumber}?`,

        'Reject Payment'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Rejecting payment...'
    );


    this.loading = true;


    this.paymentService
      .reject(
        paymentId,
        this.remarks.trim()
      )
      .subscribe({

        next: (response) => {

          console.log(
            'Reject payment response:',
            response
          );


          this.loading = false;

          this.alertService.close();


          const index =
            this.payments.findIndex(
              payment =>
                payment.id ===
                paymentId
            );


          if (index !== -1) {

            this.payments[index] = {

              ...this.payments[index],

              status:
                response?.status ??
                'REJECTED',

              adminRemarks:
                response?.adminRemarks ??
                this.remarks,

              verifiedAt:
                response?.verifiedAt ??
                new Date().toISOString()

            };

          }


          this.calculateSummary();

          this.filterPayments();


          this.closeModals();


          this.cdr.detectChanges();


          this.alertService.success(

            'Payment Rejected',

            `${paymentNumber} has been rejected successfully.`

          );


          this.loadPayments();

        },


        error: (error) => {

          this.loading = false;

          this.alertService.close();


          console.error(
            'Reject payment error:',
            error
          );


          this.alertService.error(

            'Rejection Failed',

            this.getErrorMessage(
              error,
              'Unable to reject this payment.'
            )

          );

        }

      });

  }


  // =====================================================
  // DELETE
  // =====================================================

  async delete(
    payment: any
  ): Promise<void> {

    const paymentNumber =
      payment.paymentNumber;


    const confirmed =
      await this.alertService.confirm(

        'Delete Payment?',

        `Are you sure you want to permanently delete ${paymentNumber}?`,

        'Delete Payment'

      );


    if (!confirmed) {

      return;

    }


    this.alertService.loading(
      'Deleting payment...'
    );


    this.loading = true;


    this.paymentService
      .delete(payment.id)
      .subscribe({

        next: () => {

          this.loading = false;

          this.alertService.close();


          this.alertService.success(

            'Payment Deleted',

            `${paymentNumber} has been deleted successfully.`

          );


          this.loadPayments();

        },


        error: (error) => {

          this.loading = false;

          this.alertService.close();


          console.error(
            'Delete payment error:',
            error
          );


          this.alertService.error(

            'Delete Failed',

            this.getErrorMessage(
              error,
              'Unable to delete this payment.'
            )

          );

        }

      });

  }


  // =====================================================
  // CLOSE MODALS
  // =====================================================

  closeModals(): void {

    this.showViewModal = false;

    this.showEditModal = false;

    this.selectedPayment = null;

    this.remarks = '';

  }


  // =====================================================
  // ERROR MESSAGE
  // =====================================================

  private getErrorMessage(
    error: any,
    fallback: string
  ): string {

    if (
      typeof error?.error ===
      'string'
    ) {

      return error.error;

    }


    if (
      error?.error?.message
    ) {

      return error.error.message;

    }


    if (
      error?.message
    ) {

      return error.message;

    }


    if (
      error?.status === 403
    ) {

      return 'You are not authorized to perform this action.';

    }


    if (
      error?.status === 404
    ) {

      return 'Payment record was not found.';

    }


    return fallback;

  }

}