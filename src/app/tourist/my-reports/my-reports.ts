import {
  CommonModule
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
  ComplaintService
} from '../../services/complaint.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-my-reports',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './my-reports.html',

  styleUrl: './my-reports.css'

})
export class MyReports
  implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private complaintService =
    inject(ComplaintService);

  private alertService =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // REPORT DATA
  // =====================================================

  reports: any[] = [];

  filteredReports: any[] = [];


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;

  submitting = false;


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  searchTerm = '';

  selectedStatus = 'ALL';


  // =====================================================
  // VIEW MODAL
  // =====================================================

  showViewModal = false;

  selectedReport: any = null;


  // =====================================================
  // REPORT MODAL
  // =====================================================

  showReportModal = false;


  // =====================================================
  // NEW COMPLAINT
  // =====================================================

  newComplaint = {

    title: '',

    description: '',

    category: '',

    location: '',

    imageUrl: ''

  };


  // =====================================================
  // CATEGORIES
  // Must match ComplaintCategory enum
  // =====================================================

  categories = [

    {
      value: 'POLLUTION',
      label: 'Beach / Environmental Pollution'
    },

    {
      value: 'ILLEGAL_FISHING',
      label: 'Illegal Fishing'
    },

    {
      value: 'ILLEGAL_ACTIVITY',
      label: 'Illegal Activity'
    },

    {
      value: 'WASTE_DISPOSAL',
      label: 'Waste Disposal'
    },

    {
      value: 'MARINE_DAMAGE',
      label: 'Marine / Coastal Damage'
    },

    {
      value: 'OTHER',
      label: 'Other'
    }

  ];


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadReports();

  }


  // =====================================================
  // LOAD MY REPORTS
  // =====================================================

  loadReports(): void {

    this.loading = true;

    this.alertService.loading(
      'Loading your reports...'
    );


    this.complaintService
      .getMyComplaints()
      .subscribe({

        next: (response) => {

          console.log(
            'MY COMPLAINTS:',
            response
          );


          this.reports =
            Array.isArray(response)
              ? response
              : [];


          this.applyFilters();


          this.loading = false;

          this.alertService.close();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'MY COMPLAINTS ERROR:',
            error
          );


          this.loading = false;

          this.alertService.close();


          let message =
            'We could not retrieve your reports. Please try again.';


          if (
            error?.status === 401
          ) {

            message =
              'Your login session has expired. Please login again.';

          }

          else if (
            error?.status === 403
          ) {

            message =
              'You are not authorized to view your reports.';

          }


          this.alertService.error(

            'Unable to Load Reports',

            message

          );


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


    this.filteredReports =
      this.reports.filter(
        (report) => {

          const matchesSearch =

            !search ||

            String(
              report.complaintNumber || ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              report.title || ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              report.location || ''
            )
              .toLowerCase()
              .includes(search) ||

            String(
              report.category || ''
            )
              .toLowerCase()
              .includes(search);


          const matchesStatus =

            this.selectedStatus === 'ALL' ||

            report.status ===
              this.selectedStatus;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );

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
  // TOTAL
  // =====================================================

  get totalReports(): number {

    return this.reports.length;

  }


  // =====================================================
  // PENDING
  // =====================================================

  get pendingReports(): number {

    return this.reports.filter(
      report =>
        report.status === 'PENDING'
    ).length;

  }


  // =====================================================
  // IN PROGRESS
  // =====================================================

  get inProgressReports(): number {

    return this.reports.filter(
      report =>
        report.status === 'IN_PROGRESS'
    ).length;

  }


  // =====================================================
  // RESOLVED
  // =====================================================

  get resolvedReports(): number {

    return this.reports.filter(
      report =>
        report.status === 'RESOLVED'
    ).length;

  }


  // =====================================================
  // REJECTED
  // =====================================================

  get rejectedReports(): number {

    return this.reports.filter(
      report =>
        report.status === 'REJECTED'
    ).length;

  }


  // =====================================================
  // OPEN REPORT MODAL
  // =====================================================

  openReportModal(): void {

    if (this.submitting) {

      return;

    }


    this.resetComplaintForm();

    this.showReportModal = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE REPORT MODAL
  // =====================================================

  closeReportModal(): void {

    if (this.submitting) {

      return;

    }


    this.showReportModal = false;

    this.cdr.detectChanges();

  }


  // =====================================================
  // RESET FORM
  // =====================================================

  resetComplaintForm(): void {

    this.newComplaint = {

      title: '',

      description: '',

      category: '',

      location: '',

      imageUrl: ''

    };

  }


  // =====================================================
  // SUBMIT COMPLAINT
  // =====================================================

  submitComplaint(): void {


    // =================================================
    // TITLE
    // =================================================

    if (
      !this.newComplaint.title.trim()
    ) {

      this.alertService.warning(

        'Title Required',

        'Please enter the title of the issue.'

      );

      return;

    }


    // =================================================
    // DESCRIPTION
    // =================================================

    if (
      !this.newComplaint.description.trim()
    ) {

      this.alertService.warning(

        'Description Required',

        'Please describe the environmental issue.'

      );

      return;

    }


    // =================================================
    // CATEGORY
    // =================================================

    if (
      !this.newComplaint.category
    ) {

      this.alertService.warning(

        'Category Required',

        'Please select an issue category.'

      );

      return;

    }


    // =================================================
    // LOCATION
    // =================================================

    if (
      !this.newComplaint.location.trim()
    ) {

      this.alertService.warning(

        'Location Required',

        'Please enter where the issue occurred.'

      );

      return;

    }


    // =================================================
    // PREVENT DOUBLE SUBMISSION
    // =================================================

    if (this.submitting) {

      return;

    }


    this.submitting = true;


    this.alertService.loading(
      'Submitting your report...'
    );


    // =================================================
    // PAYLOAD
    // =================================================

    const payload = {

      title:
        this.newComplaint.title.trim(),

      description:
        this.newComplaint.description.trim(),

      category:
        this.newComplaint.category,

      location:
        this.newComplaint.location.trim(),

      imageUrl:
        this.newComplaint.imageUrl.trim() ||
        null

    };


    console.log(
      'COMPLAINT PAYLOAD:',
      payload
    );


    // =================================================
    // SEND
    // =================================================

    this.complaintService
      .create(payload)
      .subscribe({

        next: (response) => {

          console.log(
            'COMPLAINT CREATED:',
            response
          );


          this.submitting = false;

          this.alertService.close();


          this.showReportModal = false;

          this.resetComplaintForm();


          this.alertService.success(

            'Report Submitted',

            `Your report ${
              response?.complaintNumber
                ? response.complaintNumber
                : ''
            } has been submitted successfully and is awaiting review.`

          );


          // ============================================
          // RELOAD
          // ============================================

          this.loadReports();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'COMPLAINT SUBMISSION ERROR:',
            error
          );

          console.error(
            'STATUS:',
            error?.status
          );

          console.error(
            'ERROR BODY:',
            error?.error
          );

          console.error(
            'REQUEST URL:',
            error?.url
          );


          this.submitting = false;

          this.alertService.close();


          let message =
            'Unable to submit your report. Please try again.';


          if (
            error?.status === 400
          ) {

            message =
              typeof error?.error === 'string'
                ? error.error
                : error?.error?.message ||
                  'Please check the information you entered.';

          }

          else if (
            error?.status === 401
          ) {

            message =
              'Your login session has expired. Please login again.';

          }

          else if (
            error?.status === 403
          ) {

            message =
              'You are not authorized to submit a report.';

          }


          this.alertService.error(

            'Report Submission Failed',

            message

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // VIEW REPORT
  // =====================================================

  viewReport(
    report: any
  ): void {

    this.selectedReport =
      report;

    this.showViewModal = true;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE VIEW
  // =====================================================

  closeViewModal(): void {

    this.showViewModal = false;

    this.selectedReport = null;

    this.cdr.detectChanges();

  }


  // =====================================================
  // STATUS LABEL
  // =====================================================

  getStatusLabel(
    status: string
  ): string {

    switch (status) {

      case 'PENDING':
        return 'Pending';

      case 'IN_PROGRESS':
        return 'Under Review';

      case 'RESOLVED':
        return 'Resolved';

      case 'REJECTED':
        return 'Rejected';

      default:
        return status || 'Unknown';

    }

  }


  // =====================================================
  // CATEGORY LABEL
  // =====================================================

  getCategoryLabel(
    category: string
  ): string {

    const found =
      this.categories.find(
        item =>
          item.value === category
      );


    return found
      ? found.label
      : category || 'Other';

  }


  // =====================================================
  // STATUS CLASS
  // =====================================================

  getStatusClass(
    status: string
  ): string {

    switch (status) {

      case 'PENDING':
        return 'pending';

      case 'IN_PROGRESS':
        return 'review';

      case 'RESOLVED':
        return 'resolved';

      case 'REJECTED':
        return 'rejected';

      default:
        return '';

    }

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '-';

    }


    const parsed =
      new Date(date);


    if (
      Number.isNaN(
        parsed.getTime()
      )
    ) {

      return date;

    }


    return parsed.toLocaleDateString(

      'en-GB',

      {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      }

    );

  }

}