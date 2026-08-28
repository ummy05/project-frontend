import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { PermitService } from '../../services/permit.service';
import { AlertService } from '../../services/alert.service';
import { Permit } from '../../models/permit.model';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-permits',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './permits.html',
  styleUrl: './permits.css'
})
export class Permits implements OnInit {

  private permitService = inject(PermitService);

  private alert = inject(AlertService);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // DATA
  // =====================================================

  permits: Permit[] = [];

  filteredPermits: Permit[] = [];


  // =====================================================
  // UI STATE
  // =====================================================

  loading = false;

  selectedPermit: Permit | null = null;

  showDetailsModal = false;


  // =====================================================
  // FILTERS
  // =====================================================

  searchTerm = '';

  selectedStatus = 'ALL';


  // =====================================================
  // PAGINATION
  // =====================================================

  currentPage = 1;

  pageSize = 8;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadPermits();

  }


  // =====================================================
  // LOAD SHEHA PERMITS
  // =====================================================

  loadPermits(
    showLoadingAlert: boolean = true
  ): void {

    this.loading = true;


    // -----------------------------------------------------
    // Only show loading alert when explicitly requested.
    // This prevents refresh after approve/reject from
    // covering the success alert.
    // -----------------------------------------------------

    if (showLoadingAlert) {

      this.alert.loading(
        'Loading permit applications...'
      );

    }


    this.permitService
      .getShehaPermits()
      .subscribe({

        next: (response: Permit[]) => {

          this.permits = response || [];

          this.applyFilters();


          this.loading = false;


          if (showLoadingAlert) {

            this.alert.close();

          }


          this.cdr.detectChanges();

        },


        error: (err: unknown) => {

          console.error(
            'Failed to load permits:',
            err
          );


          this.loading = false;


          if (showLoadingAlert) {

            this.alert.close();


            this.alert.error(
              'Failed to Load Permits',
              'Unable to retrieve permit applications. Please try again.'
            );

          }


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // FILTER
  // =====================================================

  applyFilters(): void {

    const search =
      this.searchTerm
        .trim()
        .toLowerCase();


    this.filteredPermits =
      this.permits.filter(
        permit => {

          const matchesSearch =

            !search ||

            (permit.permitNumber || '')
              .toLowerCase()
              .includes(search) ||

            (permit.businessName || '')
              .toLowerCase()
              .includes(search) ||

            (permit.ownerName || '')
              .toLowerCase()
              .includes(search) ||

            (permit.eventName || '')
              .toLowerCase()
              .includes(search) ||

            (permit.location || '')
              .toLowerCase()
              .includes(search) ||

            (permit.shehia || '')
              .toLowerCase()
              .includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            permit.status === this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );


    this.currentPage = 1;


    this.cdr.detectChanges();

  }


  // =====================================================
  // SEARCH
  // =====================================================

  onSearch(): void {

    this.applyFilters();

  }


  // =====================================================
  // STATUS FILTER
  // =====================================================

  onStatusChange(): void {

    this.applyFilters();

  }


  // =====================================================
  // RESET FILTERS
  // =====================================================

  resetFilters(): void {

    this.searchTerm = '';

    this.selectedStatus = 'ALL';

    this.applyFilters();

  }


  // =====================================================
  // VIEW DETAILS
  // =====================================================

  viewDetails(
    permit: Permit
  ): void {

    this.selectedPermit = permit;

    this.showDetailsModal = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE DETAILS
  // =====================================================

  closeDetails(): void {

    this.showDetailsModal = false;

    this.selectedPermit = null;

    this.cdr.detectChanges();

  }

  // =====================================================
// APPROVE
// =====================================================

async approvePermit(
  permit: Permit
): Promise<void> {

  // -----------------------------------------------------
  // CLOSE DETAILS MODAL IMMEDIATELY
  // -----------------------------------------------------

  this.showDetailsModal = false;

  this.selectedPermit = null;

  this.cdr.detectChanges();


  // -----------------------------------------------------
  // WAIT FOR ANGULAR TO REMOVE MODAL FROM DOM
  // BEFORE OPENING CONFIRMATION ALERT
  // -----------------------------------------------------

  await new Promise<void>(resolve => {

    setTimeout(() => {

      resolve();

    }, 0);

  });


  // -----------------------------------------------------
  // CONFIRM APPROVAL
  // -----------------------------------------------------

  const confirmed =
    await this.alert.confirm(

      'Approve Permit?',

      `Are you sure you want to approve permit ${permit.permitNumber}?`,

      'Approve'

    );


  // -----------------------------------------------------
  // USER CANCELLED
  // -----------------------------------------------------

  if (!confirmed) {

    return;

  }


  // -----------------------------------------------------
  // START LOADING
  // -----------------------------------------------------

  this.alert.loading(
    'Approving permit...'
  );


  // -----------------------------------------------------
  // API REQUEST
  // -----------------------------------------------------

  this.permitService
    .approve(permit.id)
    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: () => {

        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alert.close();


        // -----------------------------------------------
        // UPDATE LOCAL PERMIT
        // -----------------------------------------------

        permit.status = 'APPROVED';


        this.applyFilters();


        this.cdr.detectChanges();


        // -----------------------------------------------
        // SHOW SUCCESS ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alert.success(

            'Permit Approved',

            `Permit ${permit.permitNumber} has been approved successfully.`

          );

        }, 50);


        // -----------------------------------------------
        // SILENT REFRESH
        // -----------------------------------------------

        this.loadPermits(false);

      },


      // =================================================
      // ERROR
      // =================================================

      error: (err: unknown) => {

        console.error(
          'Approve permit error:',
          err
        );


        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alert.close();


        this.cdr.detectChanges();


        // -----------------------------------------------
        // SHOW ERROR ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alert.error(

            'Approval Failed',

            'The permit could not be approved. Please try again.'

          );

        }, 50);

      }

    });

}


// =====================================================
// REJECT
// =====================================================

async rejectPermit(
  permit: Permit
): Promise<void> {

  // -----------------------------------------------------
  // CLOSE DETAILS MODAL IMMEDIATELY
  // -----------------------------------------------------

  this.showDetailsModal = false;

  this.selectedPermit = null;

  this.cdr.detectChanges();


  // -----------------------------------------------------
  // WAIT FOR ANGULAR TO REMOVE MODAL FROM DOM
  // -----------------------------------------------------

  await new Promise<void>(resolve => {

    setTimeout(() => {

      resolve();

    }, 0);

  });


  // -----------------------------------------------------
  // CONFIRM REJECTION
  // -----------------------------------------------------

  const confirmed =
    await this.alert.confirm(

      'Reject Permit?',

      `Are you sure you want to reject permit ${permit.permitNumber}?`,

      'Reject'

    );


  // -----------------------------------------------------
  // USER CANCELLED
  // -----------------------------------------------------

  if (!confirmed) {

    return;

  }


  // -----------------------------------------------------
  // START LOADING
  // -----------------------------------------------------

  this.alert.loading(
    'Rejecting permit...'
  );


  // -----------------------------------------------------
  // API REQUEST
  // -----------------------------------------------------

  this.permitService
    .reject(permit.id)
    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: () => {

        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alert.close();


        // -----------------------------------------------
        // UPDATE LOCAL PERMIT
        // -----------------------------------------------

        permit.status = 'REJECTED';


        this.applyFilters();


        this.cdr.detectChanges();


        // -----------------------------------------------
        // SHOW SUCCESS ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alert.success(

            'Permit Rejected',

            `Permit ${permit.permitNumber} has been rejected.`

          );

        }, 50);


        // -----------------------------------------------
        // SILENT REFRESH
        // -----------------------------------------------

        this.loadPermits(false);

      },


      // =================================================
      // ERROR
      // =================================================

      error: (err: unknown) => {

        console.error(
          'Reject permit error:',
          err
        );


        // -----------------------------------------------
        // CLOSE LOADING
        // -----------------------------------------------

        this.alert.close();


        this.cdr.detectChanges();


        // -----------------------------------------------
        // SHOW ERROR ALERT
        // -----------------------------------------------

        setTimeout(() => {

          this.alert.error(

            'Rejection Failed',

            'The permit could not be rejected. Please try again.'

          );

        }, 50);

      }

    });

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

        return 'Pending';


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

    return type

      .replace(/_/g, ' ')

      .replace(
        /\b\w/g,
        char => char.toUpperCase()
      );

  }


  // =====================================================
  // FORMAT MONEY
  // =====================================================

  formatMoney(
    amount: number
  ): string {

    return new Intl.NumberFormat(

      'en-TZ',

      {
        minimumFractionDigits: 0,

        maximumFractionDigits: 0
      }

    ).format(

      amount || 0

    );

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(
    date: string | null
  ): string {

    if (!date) {

      return '—';

    }


    const parsedDate =
      new Date(date);


    if (
      isNaN(
        parsedDate.getTime()
      )
    ) {

      return date;

    }


    return new Intl.DateTimeFormat(

      'en-GB',

      {
        day: '2-digit',

        month: 'short',

        year: 'numeric'
      }

    ).format(parsedDate);

  }


  // =====================================================
  // COUNTERS
  // =====================================================

  get totalPermits(): number {

    return this.permits.length;

  }


  get pendingPermits(): number {

    return this.permits.filter(

      permit =>
        permit.status === 'PENDING'

    ).length;

  }


  get approvedPermits(): number {

    return this.permits.filter(

      permit =>
        permit.status === 'APPROVED'

    ).length;

  }


  get rejectedPermits(): number {

    return this.permits.filter(

      permit =>
        permit.status === 'REJECTED'

    ).length;

  }


  // =====================================================
  // PAGINATION
  // =====================================================

  get totalPages(): number {

    return Math.ceil(

      this.filteredPermits.length /
      this.pageSize

    );

  }


  get paginatedPermits(): Permit[] {

    const start =
      (this.currentPage - 1) *
      this.pageSize;


    return this.filteredPermits.slice(

      start,

      start + this.pageSize

    );

  }


  nextPage(): void {

    if (
      this.currentPage <
      this.totalPages
    ) {

      this.currentPage++;

      this.cdr.detectChanges();

    }

  }


  previousPage(): void {

    if (
      this.currentPage > 1
    ) {

      this.currentPage--;

      this.cdr.detectChanges();

    }

  }


  goToPage(
    page: number
  ): void {

    if (

      page >= 1 &&

      page <= this.totalPages

    ) {

      this.currentPage = page;

      this.cdr.detectChanges();

    }

  }


  get visiblePages(): number[] {

    const pages: number[] = [];


    for (

      let i = 1;

      i <= this.totalPages;

      i++

    ) {

      pages.push(i);

    }


    return pages;

  }

}