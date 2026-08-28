import { CommonModule } from '@angular/common';

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

  selector: 'app-owner-permits',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './owner-permits.html',

  styleUrl: './owner-permits.css'

})
export class OwnerPermits implements OnInit {


  private permitService =
    inject(PermitService);

  private alertService =
    inject(AlertService);

  private router =
    inject(Router);
  
  private cdr = 
    inject(ChangeDetectorRef); 


  // =====================================================
  // DATA
  // =====================================================

  permits: Permit[] = [];


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  showApplyModal = false;

  selectedPermit: Permit | null = null;


  // =====================================================
  // FORM
  // =====================================================

  permitForm: {
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

    this.permitService
      .getMyPermits()
      .subscribe({

        next: (response) => {

          this.permits = response || [];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Failed to load permits:',
            error
          );

          this.loading = false;

          this.alertService.error(
            'Failed to Load Permits',
            'Unable to load your permit applications.'
          );

        }

      });

  }


  // =====================================================
  // STATUS COUNTERS
  // =====================================================

  getStatusCount(
    status: Permit['status']
  ): number {

    return this.permits.filter(
      permit => permit.status === status
    ).length;

  }


  // =====================================================
  // OPEN APPLY MODAL
  // =====================================================

  openApplyModal(): void {

    this.resetForm();

    this.showApplyModal = true;

  }


  // =====================================================
  // CLOSE APPLY MODAL
  // =====================================================

  closeApplyModal(): void {

    this.showApplyModal = false;

    this.resetForm();

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetForm(): void {

    this.permitForm = {

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
  // GET SELECTED FEE
  // =====================================================

  getSelectedFee(): number {

    if (!this.permitForm.permitType) {

      return 0;

    }

    const selectedType =
      this.permitTypes.find(
        item =>
          item.value ===
          this.permitForm.permitType
      );

    return selectedType?.fee || 0;

  }


  // =====================================================
  // FORMAT CURRENCY
  // =====================================================

  formatAmount(
    amount: number
  ): string {

    return new Intl.NumberFormat(
      'en-TZ'
    ).format(amount);

  }


  // =====================================================
// APPLY PERMIT
// =====================================================

submitApplication(): void {

  // -----------------------------------------------------
  // VALIDATE FORM
  // -----------------------------------------------------

  if (
    !this.permitForm.permitType ||
    !this.permitForm.eventName.trim() ||
    !this.permitForm.description.trim() ||
    !this.permitForm.eventDate ||
    !this.permitForm.eventTime ||
    !this.permitForm.location.trim() ||
    !this.permitForm.shehia.trim()
  ) {

    this.alertService.warning(
      'Incomplete Form',
      'Please fill in all required permit information.'
    );

    return;
  }


  // -----------------------------------------------------
  // GET PERMIT TYPE
  // -----------------------------------------------------

  const permitType =
    this.permitForm.permitType;


  if (!permitType) {

    return;

  }


  // -----------------------------------------------------
  // BUILD REQUEST BEFORE CLOSING MODAL
  // -----------------------------------------------------

  const request = {

    permitType,

    eventName:
      this.permitForm.eventName.trim(),

    description:
      this.permitForm.description.trim(),

    eventDate:
      this.permitForm.eventDate,

    eventTime:
      this.permitForm.eventTime,

    location:
      this.permitForm.location.trim(),

    shehia:
      this.permitForm.shehia.trim()

  };


  // -----------------------------------------------------
  // CLOSE APPLY MODAL FIRST
  // -----------------------------------------------------

  this.showApplyModal = false;

  this.cdr.detectChanges();


  // -----------------------------------------------------
  // SHOW LOADING AFTER MODAL IS CLOSED
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

      next: (permit) => {

        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alertService.close();


        // -----------------------------------------------
        // RESET FORM
        // -----------------------------------------------

        this.resetForm();


        // -----------------------------------------------
        // ADD NEW PERMIT TO LIST
        // -----------------------------------------------

        this.permits.unshift(permit);


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
            `Control Number: ${permit.controlNumber}. ` +
            `Please proceed to payment.`

          );

        }, 100);

      },


      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alertService.close();


        // -----------------------------------------------
        // UPDATE VIEW
        // -----------------------------------------------

        this.cdr.detectChanges();


        console.error(
          'Permit application error:',
          error
        );


        const message =

          typeof error?.error === 'string'

            ? error.error

            : error?.error?.message

              ? error.error.message

              : 'Unable to submit permit application.';


        // -----------------------------------------------
        // SHOW ERROR ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alertService.error(

            'Application Failed',

            message

          );

        }, 100);

      }

    });

}

  // =====================================================
  // OPEN PAYMENT
  // =====================================================

  payPermit(
    permit: Permit
  ): void {

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


    /*
     * Send permit information to
     * the existing payment page.
     */

    this.router.navigate(

      ['/owner/payments'],

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
  // VIEW PERMIT
  // =====================================================

  viewPermit(
    permit: Permit
  ): void {

    this.selectedPermit = permit;

  }


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  closeDetails(): void {

    this.selectedPermit = null;

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: Permit['status']
  ): string {

    switch (status) {

      case 'WAITING_PAYMENT':
        return 'Waiting Payment';

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

}