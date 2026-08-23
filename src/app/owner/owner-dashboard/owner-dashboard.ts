import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router
} from '@angular/router';

import {
  AnalyticsService,
  BusinessDashboardResponse
} from '../../services/analytics.service';

import {
  PaymentService
} from '../../services/payment.service';

import {
  NotificationService,
  NotificationItem
} from '../../services/notification.service';

import {
  AuthService
} from '../../services/auth.service';


@Component({

  selector: 'app-owner-dashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './owner-dashboard.html',

  styleUrl:
    './owner-dashboard.css'

})
export class OwnerDashboard
  implements OnInit {


  // =====================================================
  // USER
  // =====================================================

  user: any = null;


  // =====================================================
  // DASHBOARD
  // =====================================================

  dashboard:
    BusinessDashboardResponse = {

      myLicenses: 0,

      approvedLicenses: 0,

      pendingLicenses: 0,

      rejectedLicenses: 0,

      myPayments: 0,

      approvedPayments: 0,

      pendingPayments: 0,

      totalPaid: 0

    };


  // =====================================================
  // PAYMENTS
  // =====================================================

  payments: any[] = [];


  // =====================================================
  // NOTIFICATIONS / ACTIVITIES
  // =====================================================

  notifications:
    NotificationItem[] = [];


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private analytics:
      AnalyticsService,

    private paymentService:
      PaymentService,

    private notificationService:
      NotificationService,

    private authService:
      AuthService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadUser();

    this.loadDashboard();

    this.loadPayments();

    this.loadNotifications();

  }


  // =====================================================
  // LOAD USER
  // =====================================================

  loadUser(): void {

    this.authService
      .getProfile()
      .subscribe({

        next: (user) => {

          this.user = user;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'OWNER USER LOAD ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    this.loading = true;

    this.analytics
      .businessOwnerDashboard()
      .subscribe({

        next: (response) => {

          this.dashboard = {

            ...this.dashboard,

            ...response

          };

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'OWNER DASHBOARD ERROR:',
            err
          );

          this.loading = false;

        }

      });

  }


  // =====================================================
  // LOAD PAYMENTS
  // =====================================================

  loadPayments(): void {

    this.paymentService
      .getMyPayments()
      .subscribe({

        next: (response) => {

          this.payments =
            response || [];

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'OWNER PAYMENTS ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (response) => {

          this.notifications =
            (response || [])
              .sort(
                (a, b) =>
                  this.getTime(b.createdAt) -
                  this.getTime(a.createdAt)
              );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'OWNER NOTIFICATIONS ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // RECENT ACTIVITIES
  // =====================================================

  get activities(): NotificationItem[] {

    return this.notifications
      .slice(0, 5);

  }


  // =====================================================
  // RECENT PAYMENTS
  // =====================================================

  get recentPayments(): any[] {

    return [...this.payments]

      .sort(
        (a, b) =>
          this.getTime(
            a.paymentDate
          ) -
          this.getTime(
            b.paymentDate
          )
      )

      .reverse()

      .slice(0, 5);

  }


  // =====================================================
  // FORMAT AMOUNT
  // =====================================================

  formatAmount(
    amount: number | null | undefined
  ): string {

    return new Intl.NumberFormat(
      'en-US'
    ).format(
      Number(amount || 0)
    );

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(
    date: string | null | undefined
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

      return '-';

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


  // =====================================================
  // TIME
  // =====================================================

  getTime(
    value: string | null | undefined
  ): number {

    if (!value) {

      return 0;

    }

    const time =
      new Date(value).getTime();

    return Number.isNaN(time)
      ? 0
      : time;

  }


  // =====================================================
  // LICENSE STATUS
  // =====================================================

  getLicenseStatusText(): string {

    if (
      this.dashboard.approvedLicenses > 0
    ) {

      return 'Active';

    }

    if (
      this.dashboard.pendingLicenses > 0
    ) {

      return 'Pending';

    }

    if (
      this.dashboard.rejectedLicenses > 0
    ) {

      return 'Rejected';

    }

    return 'No License';

  }


  // =====================================================
  // VIEW LICENSES
  // =====================================================

  viewLicenses(): void {

    this.router.navigate([
      '/owner/my-licenses'
    ]);

  }


  // =====================================================
  // APPLY LICENSE
  // =====================================================

  applyLicense(): void {

    this.router.navigate([
      '/owner/apply-license'
    ]);

  }


  // =====================================================
  // PAYMENTS
  // =====================================================

  viewPayments(): void {

    this.router.navigate([
      '/owner/payments'
    ]);

  }


  // =====================================================
  // PROFILE
  // =====================================================

  viewProfile(): void {

    this.router.navigate([
      '/owner/profile'
    ]);

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  viewNotifications(): void {

    this.router.navigate([
      '/owner/notifications'
    ]);

  }

}