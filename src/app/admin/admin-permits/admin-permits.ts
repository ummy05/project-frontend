import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  PermitService
} from '../../services/permit.service';

import {
  Permit
} from '../../models/permit.model';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-admin-permits',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule

  ],

  templateUrl: './admin-permits.html',

  styleUrl: './admin-permits.css'

})
export class AdminPermits
  implements OnInit {


  // ===================================================
  // DATA
  // ===================================================

  permits: Permit[] = [];

  filteredPermits: Permit[] = [];


  // ===================================================
  // SEARCH
  // ===================================================

  searchTerm = '';

  selectedStatus = 'ALL';


  // ===================================================
  // LOADING
  // ===================================================

  loading = false;


  // ===================================================
  // SELECTED PERMIT
  // ===================================================

  selectedPermit: Permit | null = null;

  showDetails = false;


  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(

    private permitService: PermitService,
    private alertService: AlertService,
    private cdr:ChangeDetectorRef

  ) {}


  // ===================================================
  // INIT
  // ===================================================

  ngOnInit(): void {

    this.loadPermits();

  }


  // ===================================================
  // LOAD ALL PERMITS
  // ===================================================

  loadPermits(): void {

    this.loading = true;


    this.permitService
      .getAllPermits()
      .subscribe({

        next: (res) => {

          this.permits = res;

          this.filteredPermits = [...res];

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'Unable to load permits:',
            error
          );

          this.loading = false;

          this.alertService.error(
            'Loading Failed',
            'Unable to load permits from the server.'
          );

        }

      });

  }


  // ===================================================
  // FILTER
  // ===================================================

  filterPermits(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredPermits =
      this.permits.filter(
        permit => {

          const matchesSearch =

            !search ||

            this.value(
              permit.permitNumber
            ).includes(search) ||

            this.value(
              permit.controlNumber
            ).includes(search) ||

            this.value(
              permit.eventName
            ).includes(search) ||

            this.value(
              permit.businessName
            ).includes(search) ||

            this.value(
              permit.ownerName
            ).includes(search) ||

            this.value(
              permit.location
            ).includes(search) ||

            this.value(
              permit.shehia
            ).includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            this.value(
              permit.status
            ).toUpperCase()
              === this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

  }


  // ===================================================
  // SAFE VALUE
  // ===================================================

  private value(
    value: any
  ): string {

    return value == null
      ? ''
      : String(value).toLowerCase();

  }


  // ===================================================
  // VIEW DETAILS
  // ===================================================

  viewPermit(
    permit: Permit
  ): void {

    this.selectedPermit = permit;

    this.showDetails = true;

  }


  // ===================================================
  // CLOSE DETAILS
  // ===================================================

  closeDetails(): void {

    this.selectedPermit = null;

    this.showDetails = false;

  }


  // ===================================================
  // DELETE PERMIT
  // ===================================================
  async deletePermit(
  permit: Permit
): Promise<void> {

  // =====================================================
  // SWEETALERT CONFIRMATION
  // =====================================================

  const confirmed =
    await this.alertService.confirm(

      'Delete Permit?',

      `Are you sure you want to delete permit ${permit.permitNumber}? This action cannot be undone.`,

      'Yes, Delete'

    );


  // =====================================================
  // USER CANCELLED
  // =====================================================

  if (!confirmed) {

    return;

  }


  // =====================================================
  // LOADING
  // =====================================================

  this.alertService.loading(
    'Deleting permit...'
  );


  // =====================================================
  // DELETE REQUEST
  // =====================================================

  this.permitService
    .deletePermit(
      permit.id
    )
    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: () => {

        this.alertService.close();


        // -----------------------------------------------
        // REMOVE FROM LOCAL LIST
        // -----------------------------------------------

        this.permits =
          this.permits.filter(
            item =>
              item.id !== permit.id
          );


        // -----------------------------------------------
        // RE-APPLY FILTER
        // -----------------------------------------------

        this.filterPermits();


        // -----------------------------------------------
        // CLOSE DETAILS IF OPEN
        // -----------------------------------------------

        if (
          this.selectedPermit?.id ===
          permit.id
        ) {

          this.closeDetails();

        }


        // -----------------------------------------------
        // SUCCESS MESSAGE
        // -----------------------------------------------

        this.alertService.success(

          'Permit Deleted',

          'The permit has been deleted successfully.'

        );

      },


      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        console.error(
          'Delete permit error:',
          error
        );


        this.alertService.close();


        this.alertService.error(

          'Delete Failed',

          error?.error?.message
            ??
          'Unable to delete this permit.'

        );

      }

    });

}


  // ===================================================
  // STATUS CLASS
  // ===================================================

  statusClass(
    status: string
  ): string {

    switch (
      status?.toUpperCase()
    ) {

      case 'APPROVED':

        return 'status-approved';


      case 'PENDING':

        return 'status-pending';


      case 'WAITING_PAYMENT':

        return 'status-payment';


      case 'REJECTED':

        return 'status-rejected';


      default:

        return 'status-default';

    }

  }


  // ===================================================
  // FORMAT STATUS
  // ===================================================

  formatStatus(
    status: string
  ): string {

    if (!status) {

      return '-';

    }


    return status
      .toLowerCase()
      .replace(
        /_/g,
        ' '
      )
      .replace(
        /\b\w/g,
        letter =>
          letter.toUpperCase()
      );

  }


  // ===================================================
  // TRACK BY
  // ===================================================

  trackByPermit(
    index: number,
    permit: Permit
  ): number {

    return permit.id;

  }

}