import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  AlertService
} from '../../services/alert.service';

import {
  NotificationService
} from '../../services/notification.service';

import {
  PermitService
} from '../../services/permit.service';


@Component({

  selector: 'app-sheha-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './sheha-dashboard.html',

  styleUrl: './sheha-dashboard.css'

})
export class ShehaDashboard implements OnInit {


  // =====================================================
  // USER
  // =====================================================

  fullName = 'Sheha';


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // PERMITS
  // =====================================================

  permits: any[] = [];


  // =====================================================
  // COUNTERS
  // =====================================================

  totalPermits = 0;

  pendingPermits = 0;

  approvedPermits = 0;

  rejectedPermits = 0;


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  unreadNotifications = 0;


  constructor(

    private auth:
      AuthService,

    private permitService:
      PermitService,

    private notificationService:
      NotificationService,

    private alert:
      AlertService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.fullName =
      this.auth.getFullName() ||
      'Sheha';

    this.loadDashboard();

    this.loadUnreadNotifications();

  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    this.loading = true;

    this.alert.loading(
      'Loading Sheha dashboard...'
    );


    this.permitService
      .getShehaPermits()
      .subscribe({

        next: (response: any[]) => {

          this.permits =
            Array.isArray(response)
              ? response
              : [];

          this.calculateStatistics();

          this.loading = false;

          this.alert.close();

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.error(
            'SHEHA DASHBOARD ERROR:',
            err
          );

          this.permits = [];

          this.calculateStatistics();

          this.loading = false;

          this.alert.close();

          this.alert.error(

            'Failed to Load Dashboard',

            err?.error?.message ||
            err?.error ||
            'Unable to load permit information.'

          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CALCULATE STATISTICS
  // =====================================================

  calculateStatistics(): void {

    this.totalPermits =
      this.permits.length;


    this.pendingPermits =
      this.permits.filter(
        permit =>
          this.getStatus(permit) ===
          'PENDING'
      ).length;


    this.approvedPermits =
      this.permits.filter(
        permit =>
          this.getStatus(permit) ===
          'APPROVED'
      ).length;


    this.rejectedPermits =
      this.permits.filter(
        permit =>
          this.getStatus(permit) ===
          'REJECTED'
      ).length;

  }


  // =====================================================
  // STATUS
  // =====================================================

  getStatus(
    permit: any
  ): string {

    return String(
      permit?.status ||
      ''
    ).toUpperCase();

  }


  // =====================================================
  // UNREAD NOTIFICATIONS
  // =====================================================

  loadUnreadNotifications(): void {

    this.notificationService
      .unreadCount()
      .subscribe({

        next: (count: number) => {

          this.unreadNotifications =
            count || 0;

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.error(
            'UNREAD COUNT ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // APPROVE
  // =====================================================

  async approvePermit(
    permit: any
  ): Promise<void> {

    const confirmed =
      await this.alert.confirm(

        'Approve Permit?',

        `Are you sure you want to approve permit ${this.getPermitNumber(permit)}?`,

        'Approve'

      );


    if (!confirmed) {

      return;

    }


    this.alert.loading(
      'Approving permit...'
    );


    this.permitService
      .approve(permit.id)
      .subscribe({

        next: () => {

          this.alert.close();

          this.alert.success(

            'Permit Approved',

            'The permit has been successfully approved.'

          );

          this.loadDashboard();

        },

        error: (err: any) => {

          console.error(
            'APPROVE PERMIT ERROR:',
            err
          );

          this.alert.close();

          this.alert.error(

            'Approval Failed',

            err?.error?.message ||
            err?.error ||
            'Unable to approve this permit.'

          );

        }

      });

  }


  // =====================================================
  // REJECT
  // =====================================================

  async rejectPermit(
    permit: any
  ): Promise<void> {

    const confirmed =
      await this.alert.confirm(

        'Reject Permit?',

        `Are you sure you want to reject permit ${this.getPermitNumber(permit)}?`,

        'Reject'

      );


    if (!confirmed) {

      return;

    }


    this.alert.loading(
      'Rejecting permit...'
    );


    this.permitService
      .reject(permit.id)
      .subscribe({

        next: () => {

          this.alert.close();

          this.alert.success(

            'Permit Rejected',

            'The permit has been successfully rejected.'

          );

          this.loadDashboard();

        },

        error: (err: any) => {

          console.error(
            'REJECT PERMIT ERROR:',
            err
          );

          this.alert.close();

          this.alert.error(

            'Rejection Failed',

            err?.error?.message ||
            err?.error ||
            'Unable to reject this permit.'

          );

        }

      });

  }


  // =====================================================
  // PERMIT NUMBER
  // =====================================================

  getPermitNumber(
    permit: any
  ): string {

    return (
      permit?.permitNumber ||
      permit?.referenceNumber ||
      `#${permit?.id || ''}`
    );

  }


  // =====================================================
  // BUSINESS NAME
  // =====================================================

  getBusinessName(
    permit: any
  ): string {

    return (
      permit?.businessName ||
      permit?.business?.businessName ||
      permit?.user?.businessName ||
      'Business Owner'
    );

  }


  // =====================================================
  // APPLICANT
  // =====================================================

  getApplicant(
    permit: any
  ): string {

    return (
      permit?.applicantName ||
      permit?.user?.fullName ||
      permit?.ownerName ||
      'N/A'
    );

  }


  // =====================================================
  // DATE
  // =====================================================

  getDate(
    permit: any
  ): string {

    return (
      permit?.createdAt ||
      permit?.applicationDate ||
      permit?.date ||
      ''
    );

  }


  // =====================================================
  // VIEW ALL
  // =====================================================

  viewAllPermits(): void {

    this.router.navigate([
      '/sheha/permits'
    ]);

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loadDashboard();

    this.loadUnreadNotifications();

  }

}