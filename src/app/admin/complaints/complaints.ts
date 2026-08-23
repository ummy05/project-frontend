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

  selector: 'app-complaints',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './complaints.html',

  styleUrl: './complaints.css'

})


export class Complaints implements OnInit {


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
  // DATA
  // =====================================================

  complaints: any[] = [];

  filteredComplaints: any[] = [];


  // =====================================================
  // SELECTED COMPLAINT
  // =====================================================

  selectedComplaint: any = null;


  // =====================================================
  // SEARCH / FILTER
  // =====================================================

  search = '';

  status = 'ALL';


  // =====================================================
  // ADMIN RESPONSE
  // =====================================================

  response = '';


  // =====================================================
  // MODALS
  // =====================================================

  showViewModal = false;

  showResponseModal = false;


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;

  actionLoading = false;


  // =====================================================
  // SUMMARY
  // =====================================================

  total = 0;

  pending = 0;

  progress = 0;

  resolved = 0;

  rejected = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.load();

  }


  // =====================================================
  // LOAD COMPLAINTS
  // =====================================================

  load(): void {

    if (this.actionLoading) {
      return;
    }


    this.loading = true;

    this.cdr.detectChanges();


    this.alertService.loading(
      'Loading complaints...'
    );


    this.complaintService
      .getAll()
      .subscribe({

        next: (data) => {

          this.complaints =
            Array.isArray(data)
              ? data
              : [];


          this.calculate();

          this.filter();


          this.loading = false;

          this.alertService.close();


          this.cdr.detectChanges();

        },


        error: (error) => {

          console.error(
            'LOAD COMPLAINTS ERROR:',
            error
          );


          this.loading = false;

          this.alertService.close();


          let message =
            'Unable to load complaints. Please try again.';


          if (error?.status === 401) {

            message =
              'Your session has expired. Please login again.';

          }

          else if (error?.status === 403) {

            message =
              'You are not authorized to access complaints.';

          }

          else if (error?.status === 404) {

            message =
              'Complaint service could not be found.';

          }

          else if (error?.status >= 500) {

            message =
              'The server encountered an error. Please try again later.';

          }


          this.alertService.error(

            'Unable to Load Complaints',

            message

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CALCULATE SUMMARY
  // =====================================================

  calculate(): void {

    this.total =
      this.complaints.length;


    this.pending =
      this.complaints.filter(
        complaint =>
          complaint.status === 'PENDING'
      ).length;


    this.progress =
      this.complaints.filter(
        complaint =>
          complaint.status === 'IN_PROGRESS'
      ).length;


    this.resolved =
      this.complaints.filter(
        complaint =>
          complaint.status === 'RESOLVED'
      ).length;


    this.rejected =
      this.complaints.filter(
        complaint =>
          complaint.status === 'REJECTED'
      ).length;

  }


  // =====================================================
  // FILTER
  // =====================================================

  filter(): void {

    const search =
      this.search
        .trim()
        .toLowerCase();


    this.filteredComplaints =
      this.complaints.filter(
        complaint => {


          const complaintNumber =
            String(
              complaint.complaintNumber || ''
            ).toLowerCase();


          const title =
            String(
              complaint.title || ''
            ).toLowerCase();


          const location =
            String(
              complaint.location || ''
            ).toLowerCase();


          const category =
            String(
              complaint.category || ''
            ).toLowerCase();


          const matchesSearch =
            !search ||

            complaintNumber.includes(search) ||

            title.includes(search) ||

            location.includes(search) ||

            category.includes(search);


          const matchesStatus =
            this.status === 'ALL' ||

            complaint.status ===
              this.status;


          return (
            matchesSearch &&
            matchesStatus
          );

        }
      );


    this.cdr.detectChanges();

  }


  // =====================================================
  // OPEN VIEW MODAL
  // =====================================================

  openView(
    complaint: any
  ): void {

    this.selectedComplaint =
      complaint;

    this.showViewModal = true;

    this.showResponseModal = false;


    this.cdr.detectChanges();

  }


  // =====================================================
  // OPEN RESPONSE MODAL
  // =====================================================

  openResponse(
    complaint: any
  ): void {

    this.selectedComplaint =
      complaint;


    this.response =
      complaint.adminResponse || '';


    this.showResponseModal = true;

    this.showViewModal = false;


    this.cdr.detectChanges();

  }


  // =====================================================
  // MARK IN PROGRESS
  // =====================================================

  progressComplaint(): void {

    if (!this.selectedComplaint) {
      return;
    }


    if (this.actionLoading) {
      return;
    }


    this.actionLoading = true;


    this.alertService.loading(
      'Updating complaint...'
    );


    this.complaintService
      .progress(
        this.selectedComplaint.id
      )
      .subscribe({

        next: (response) => {

          console.log(
            'COMPLAINT PROGRESSED:',
            response
          );


          this.actionLoading = false;

          this.alertService.close();


          this.close();


          this.alertService.success(

            'Complaint Under Review',

            `Complaint ${
              this.selectedComplaint?.complaintNumber || ''
            } has been moved to In Progress.`

          );


          this.load();

        },


        error: (error) => {

          console.error(
            'PROGRESS COMPLAINT ERROR:',
            error
          );


          this.actionLoading = false;

          this.alertService.close();


          this.handleActionError(
            error,
            'Unable to update the complaint.'
          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // RESOLVE COMPLAINT
  // =====================================================

  resolveComplaint(): void {

    if (!this.selectedComplaint) {
      return;
    }


    if (!this.response.trim()) {

      this.alertService.warning(

        'Response Required',

        'Please write an administrator response before resolving the complaint.'

      );

      return;

    }


    if (this.actionLoading) {
      return;
    }


    this.actionLoading = true;


    this.alertService.loading(
      'Resolving complaint...'
    );


    this.complaintService
      .resolve(

        this.selectedComplaint.id,

        this.response.trim()

      )
      .subscribe({

        next: (response) => {

          console.log(
            'COMPLAINT RESOLVED:',
            response
          );


          this.actionLoading = false;

          this.alertService.close();


          const number =
            this.selectedComplaint?.complaintNumber || '';


          this.close();


          this.alertService.success(

            'Complaint Resolved',

            `Complaint ${number} has been resolved successfully.`

          );


          this.load();

        },


        error: (error) => {

          console.error(
            'RESOLVE COMPLAINT ERROR:',
            error
          );


          this.actionLoading = false;

          this.alertService.close();


          this.handleActionError(

            error,

            'Unable to resolve the complaint.'

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // REJECT COMPLAINT
  // =====================================================

  rejectComplaint(): void {

    if (!this.selectedComplaint) {
      return;
    }


    if (!this.response.trim()) {

      this.alertService.warning(

        'Response Required',

        'Please provide a reason before rejecting the complaint.'

      );

      return;

    }


    if (this.actionLoading) {
      return;
    }


    this.actionLoading = true;


    this.alertService.loading(
      'Rejecting complaint...'
    );


    this.complaintService
      .reject(

        this.selectedComplaint.id,

        this.response.trim()

      )
      .subscribe({

        next: (response) => {

          console.log(
            'COMPLAINT REJECTED:',
            response
          );


          this.actionLoading = false;

          this.alertService.close();


          const number =
            this.selectedComplaint?.complaintNumber || '';


          this.close();


          this.alertService.success(

            'Complaint Rejected',

            `Complaint ${number} has been rejected.`

          );


          this.load();

        },


        error: (error) => {

          console.error(
            'REJECT COMPLAINT ERROR:',
            error
          );


          this.actionLoading = false;

          this.alertService.close();


          this.handleActionError(

            error,

            'Unable to reject the complaint.'

          );


          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // DELETE
  // =====================================================

  delete(
    complaint: any
  ): void {

    if (!complaint?.id) {
      return;
    }


    if (this.actionLoading) {
      return;
    }


    this.alertService
      .confirm(

        'Delete Complaint?',

        `Are you sure you want to permanently delete ${
          complaint.complaintNumber || 'this complaint'
        }? This action cannot be undone.`,

        'Delete'

      )
      .then((confirmed) => {

        if (!confirmed) {
          return;
        }


        this.actionLoading = true;


        this.alertService.loading(
          'Deleting complaint...'
        );


        this.complaintService
          .delete(complaint.id)
          .subscribe({

            next: () => {

              this.actionLoading = false;

              this.alertService.close();


              this.alertService.success(

                'Complaint Deleted',

                `${complaint.complaintNumber || 'Complaint'} has been deleted successfully.`

              );


              this.load();

            },


            error: (error) => {

              console.error(
                'DELETE COMPLAINT ERROR:',
                error
              );


              this.actionLoading = false;

              this.alertService.close();


              this.handleActionError(

                error,

                'Unable to delete the complaint.'

              );


              this.cdr.detectChanges();

            }

          });

      });

  }


  // =====================================================
  // ERROR HANDLER
  // =====================================================

  private handleActionError(
    error: any,
    defaultMessage: string
  ): void {

    let message =
      defaultMessage;


    if (error?.status === 400) {

      message =
        typeof error?.error === 'string'
          ? error.error
          : error?.error?.message ||
            'Invalid request. Please check the information.';

    }

    else if (error?.status === 401) {

      message =
        'Your login session has expired. Please login again.';

    }

    else if (error?.status === 403) {

      message =
        'You are not authorized to perform this action.';

    }

    else if (error?.status === 404) {

      message =
        'The complaint could not be found.';

    }

    else if (error?.status >= 500) {

      message =
        'A server error occurred. Please try again later.';

    }


    this.alertService.error(

      'Action Failed',

      message

    );

  }


  // =====================================================
  // CLOSE MODALS
  // =====================================================

  close(): void {

    if (this.actionLoading) {
      return;
    }


    this.showViewModal = false;

    this.showResponseModal = false;

    this.selectedComplaint = null;

    this.response = '';


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
        return 'In Progress';

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

    switch (category) {

      case 'POLLUTION':
        return 'Pollution';

      case 'ILLEGAL_FISHING':
        return 'Illegal Fishing';

      case 'ILLEGAL_ACTIVITY':
        return 'Illegal Activity';

      case 'WASTE_DISPOSAL':
        return 'Waste Disposal';

      case 'MARINE_DAMAGE':
        return 'Marine / Coastal Damage';

      case 'OTHER':
        return 'Other';

      default:
        return category || 'Other';

    }

  }


  // =====================================================
  // IMAGE CHECK
  // =====================================================

  hasImage(
    complaint: any
  ): boolean {

    return !!(
      complaint?.imageUrl &&
      complaint.imageUrl.trim()
    );

  }

}