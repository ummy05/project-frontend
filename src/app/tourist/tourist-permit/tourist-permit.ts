import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  PermitService
} from '../../services/permit.service';

import {
  AlertService
} from '../../services/alert.service';

import {
  Permit
} from '../../models/permit.model';


@Component({
  selector: 'app-tourist-permit',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule,
    RouterLink
  ],

  templateUrl: './tourist-permit.html',

  styleUrl: './tourist-permit.css'
})
export class TouristPermit implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private permitService = inject(PermitService);

  private alertService = inject(AlertService);

  private cdr = inject(ChangeDetectorRef);

  private router = inject(Router);


  // =====================================================
  // DATA
  // =====================================================

  permits: Permit[] = [];

  selectedPermit: Permit | null = null;


  // =====================================================
  // UI STATES
  // =====================================================

  loading = false;

  submitting = false;

  paymentLoading = false;

  showApplicationForm = false;

  showPaymentModal = false;


  // =====================================================
  // APPLICATION FORM
  // =====================================================

  application: {
    permitType: Permit['permitType'] | '';
    eventName: string;
    description: string;
    eventDate: string;
    eventTime: string;
    location: string;
    shehia: string;
  } = {

    permitType: '',

    eventName: '',

    description: '',

    eventDate: '',

    eventTime: '',

    location: '',

    shehia: ''

  };


  // =====================================================
  // PAYMENT FORM
  // =====================================================

  payment = {

    controlNumber: '',

    amount: 0

  };


  // =====================================================
  // PERMIT TYPES
  // =====================================================

  permitTypes: {
    value: Permit['permitType'];
    label: string;
    fee: number;
  }[] = [

    {
      value: 'WEDDING_EVENT',
      label: 'Wedding Event',
      fee: 150000
    },

    {
      value: 'MUSIC_EVENT',
      label: 'Music Event',
      fee: 100000
    },

    {
      value: 'BEACH_EVENT',
      label: 'Beach Event',
      fee: 100000
    },

    {
      value: 'CULTURAL_EVENT',
      label: 'Cultural Event',
      fee: 100000
    },

    {
      value: 'PRIVATE_EVENT',
      label: 'Private Event',
      fee: 100000
    },

    {
      value: 'SPORTS_EVENT',
      label: 'Sports Event',
      fee: 100000
    },

    {
      value: 'OTHER_EVENT',
      label: 'Other Event',
      fee: 100000
    }

  ];


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPermits();

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

        next: (response: Permit[]) => {

          this.permits = response || [];

          this.loading = false;

          this.alertService.close();

          this.cdr.detectChanges();

        },

        error: (error) => {

          this.loading = false;

          this.alertService.close();

          this.cdr.detectChanges();

          const message =
            error?.error;

          this.alertService.error(

            'Failed to Load Permits',

            typeof message === 'string'
              ? message
              : 'Unable to load your permits. Please try again.'

          );

        }

      });

  }


  // =====================================================
  // OPEN APPLICATION FORM
  // =====================================================

  openApplicationForm(): void {

    this.resetApplication();

    this.showApplicationForm = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE APPLICATION FORM
  // =====================================================

  closeApplicationForm(): void {

    this.showApplicationForm = false;

    this.cdr.detectChanges();

  }


  // =====================================================
  // SELECTED PERMIT FEE
  // =====================================================

  getSelectedFee(): number {

    if (!this.application.permitType) {

      return 0;

    }


    const selected =
      this.permitTypes.find(
        type =>
          type.value === this.application.permitType
      );


    return selected?.fee || 0;

  }

 // =====================================================
// APPLY FOR PERMIT
// =====================================================

applyForPermit(): void {

  // -----------------------------------------------------
  // VALIDATE FORM
  // -----------------------------------------------------

  if (
    !this.application.permitType ||
    !this.application.eventName.trim() ||
    !this.application.description.trim() ||
    !this.application.eventDate ||
    !this.application.eventTime ||
    !this.application.location.trim() ||
    !this.application.shehia.trim()
  ) {

    this.alertService.warning(
      'Incomplete Form',
      'Please fill in all required permit information.'
    );

    return;
  }


  // -----------------------------------------------------
  // TYPE-SAFE PERMIT TYPE
  // -----------------------------------------------------

  const permitType: Permit['permitType'] =
    this.application.permitType;


  // -----------------------------------------------------
  // BUILD REQUEST BEFORE CLOSING MODAL
  // -----------------------------------------------------

  const request: {
    permitType: Permit['permitType'];
    eventName: string;
    description: string;
    eventDate: string;
    eventTime: string;
    location: string;
    shehia: string;
  } = {

    permitType,

    eventName:
      this.application.eventName.trim(),

    description:
      this.application.description.trim(),

    eventDate:
      this.application.eventDate,

    eventTime:
      this.application.eventTime,

    location:
      this.application.location.trim(),

    shehia:
      this.application.shehia.trim()

  };


  // -----------------------------------------------------
  // START SUBMISSION STATE
  // -----------------------------------------------------

  this.submitting = true;


  // -----------------------------------------------------
  // CLOSE APPLICATION MODAL FIRST
  // -----------------------------------------------------

  this.showApplicationForm = false;

  this.cdr.detectChanges();


  // -----------------------------------------------------
  // NOW SHOW LOADING
  // -----------------------------------------------------

  this.alertService.loading(
    'Submitting permit application...'
  );


  // -----------------------------------------------------
  // SEND REQUEST
  // -----------------------------------------------------

  this.permitService
    .applyPermit(request)
    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: (permit: Permit) => {

        this.submitting = false;


        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alertService.close();


        // -----------------------------------------------
        // ADD NEW PERMIT TO LIST
        // -----------------------------------------------

        this.permits = [
          permit,
          ...this.permits
        ];


        // -----------------------------------------------
        // RESET FORM
        // -----------------------------------------------

        this.resetApplication();


        // -----------------------------------------------
        // UPDATE VIEW
        // -----------------------------------------------

        this.cdr.detectChanges();


        // -----------------------------------------------
        // SHOW SUCCESS ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alertService.success(
            'Application Submitted',
            `Your permit application has been created successfully. ` +
            `Please make payment using control number ` +
            `${permit.controlNumber}.`
          );

        }, 100);

      },


      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        this.submitting = false;


        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alertService.close();


        // -----------------------------------------------
        // UPDATE VIEW
        // -----------------------------------------------

        this.cdr.detectChanges();


        const message =
          error?.error;


        // -----------------------------------------------
        // SHOW ERROR
        // -----------------------------------------------

        setTimeout(() => {

          this.alertService.error(
            'Application Failed',
            typeof message === 'string'
              ? message
              : 'Unable to submit permit application. Please try again.'
          );

        }, 100);

      }

    });

}

  // =====================================================
  // OPEN PAYMENT
  // =====================================================

  openPayment(
    permit: Permit
  ): void {

    this.selectedPermit = permit;


    this.payment = {

      controlNumber:
        permit.controlNumber,

      amount:
        Number(permit.permitFee)

    };


    this.showPaymentModal = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE PAYMENT
  // =====================================================

  closePayment(): void {

    this.showPaymentModal = false;

    this.selectedPermit = null;

    this.payment = {

      controlNumber: '',

      amount: 0

    };

    this.cdr.detectChanges();

  }


  // =====================================================
  // PAY PERMIT
  // =====================================================
  payPermit(permit: Permit): void {

  if (
    permit.status !== 'WAITING_PAYMENT'
  ) {

    this.alertService.info(
      'Payment Not Available',
      'This permit is not currently waiting for payment.'
    );

    return;
  }

  this.router.navigate(
    ['/tourist/payments'],
    {
      state: {

        permitId:
          permit.id,

        controlNumber:
          permit.controlNumber,

        amount:
          permit.permitFee

      }
    }
  );

}

  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: Permit['status']
  ): string {

    switch (status) {

      case 'APPROVED':

        return 'status-approved';


      case 'PENDING':

        return 'status-pending';


      case 'WAITING_PAYMENT':

        return 'status-payment';


      case 'REJECTED':

        return 'status-rejected';


      case 'EXPIRED':

        return 'status-expired';


      default:

        return 'status-default';

    }

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
  // PERMIT TYPE LABEL
  // =====================================================

  getPermitTypeLabel(
    type: Permit['permitType']
  ): string {

    const permit =
      this.permitTypes.find(

        item =>
          item.value === type

      );


    return permit?.label || type;

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

      Number(amount || 0)

    );

  }


  // =====================================================
  // RESET APPLICATION
  // =====================================================

  resetApplication(): void {

    this.application = {

      permitType: '',

      eventName: '',

      description: '',

      eventDate: '',

      eventTime: '',

      location: '',

      shehia: ''

    };

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