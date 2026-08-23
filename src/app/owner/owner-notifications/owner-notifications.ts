import {
  CommonModule,
  DatePipe
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  NotificationService,
  NotificationResponse
} from '../../services/notification.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({
  selector: 'app-owner-notifications',

  standalone: true,

  imports: [
    CommonModule,
    DatePipe
  ],

  templateUrl: './owner-notifications.html',

  styleUrl: './owner-notifications.css'
})
export class OwnerNotifications implements OnInit {


  // =====================================================
  // DATA
  // =====================================================

  notifications: NotificationResponse[] = [];


  // =====================================================
  // SUMMARY
  // =====================================================

  totalNotifications = 0;

  unreadCount = 0;

  importantAlerts = 0;


  // =====================================================
  // STATE
  // =====================================================

  loading = false;

  markingAll = false;


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private notificationService:
      NotificationService,

    private alert:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadNotifications();

  }


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.loading = true;


    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (response) => {

          this.notifications =
            response || [];

          this.calculateSummary();

          this.loading = false;

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'OWNER NOTIFICATIONS ERROR:',
            err
          );

          this.notifications = [];

          this.calculateSummary();

          this.loading = false;

          this.alert.error(

            'Failed to Load Notifications',

            err?.error?.message ||
            err?.error ||
            'Unable to load your notifications. Please try again later.'

          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CALCULATE SUMMARY
  // =====================================================

  calculateSummary(): void {

    this.totalNotifications =
      this.notifications.length;


    this.unreadCount =
      this.notifications.filter(

        notification =>
          !notification.read

      ).length;


    this.importantAlerts =
      this.notifications.filter(

        notification =>

          notification.type === 'warning' ||

          notification.type === 'system'

      ).length;

  }


  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================

  markAsRead(
    notification: NotificationResponse
  ): void {

    /*
     * Already read.
     */

    if (notification.read) {

      return;

    }


    this.notificationService
      .markRead(notification.id)
      .subscribe({

        next: () => {

          notification.read = true;

          this.calculateSummary();

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'MARK NOTIFICATION READ ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  markAllAsRead(): void {

    /*
     * Nothing to mark.
     */

    if (this.unreadCount === 0) {

      return;

    }


    this.markingAll = true;


    this.notificationService
      .markAllRead()
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.map(

              notification => ({

                ...notification,

                read: true

              })

            );


          this.calculateSummary();

          this.markingAll = false;

          this.cdr.detectChanges();

        },


        error: (err) => {

          console.error(
            'MARK ALL NOTIFICATIONS ERROR:',
            err
          );

          this.markingAll = false;

          this.alert.error(

            'Failed',

            err?.error?.message ||
            err?.error ||
            'Unable to mark notifications as read.'

          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // NOTIFICATION TYPE
  // =====================================================

  getNotificationType(
    type: string
  ): string {

    if (!type) {

      return 'info';

    }


    const normalized =
      type.toLowerCase();


    /*
     * Backend may use different
     * notification type names.
     */

    if (

      normalized.includes('success') ||

      normalized.includes('approved') ||

      normalized.includes('approval')

    ) {

      return 'success';

    }


    if (

      normalized.includes('payment') ||

      normalized.includes('paid') ||

      normalized.includes('transaction')

    ) {

      return 'payment';

    }


    if (

      normalized.includes('warning') ||

      normalized.includes('expiry') ||

      normalized.includes('expired') ||

      normalized.includes('renewal') ||

      normalized.includes('rejected')

    ) {

      return 'warning';

    }


    if (

      normalized.includes('system') ||

      normalized.includes('announcement')

    ) {

      return 'system';

    }


    return 'info';

  }


  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  getNotificationIcon(
    type: string
  ): string {

    const notificationType =
      this.getNotificationType(type);


    switch (notificationType) {

      case 'success':

        return 'fas fa-check-circle';


      case 'payment':

        return 'fas fa-credit-card';


      case 'warning':

        return 'fas fa-triangle-exclamation';


      case 'system':

        return 'fas fa-bullhorn';


      default:

        return 'fas fa-info-circle';

    }

  }


  // =====================================================
  // DATE FORMAT
  // =====================================================

  formatNotificationDate(
    createdAt: string
  ): string {

    if (!createdAt) {

      return 'N/A';

    }


    const date =
      new Date(createdAt);


    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return 'N/A';

    }


    return date.toLocaleString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }
    );

  }


  // =====================================================
  // TRACK BY
  // =====================================================

  trackByNotificationId(
    index: number,
    notification: NotificationResponse
  ): number {

    return notification.id;

  }

}