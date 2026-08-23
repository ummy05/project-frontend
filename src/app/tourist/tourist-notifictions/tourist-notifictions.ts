import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { NotificationService, NotificationResponse } from '../../services/notification.service';
import { AlertService } from '../../services/alert.service';

@Component({
  selector: 'app-tourist-notifictions',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './tourist-notifictions.html',
  styleUrl: './tourist-notifictions.css'
})
export class TouristNotifictions implements OnInit {

  // =====================================================
  // SERVICES
  // =====================================================

  private notificationService = inject(NotificationService);

  private alertService = inject(AlertService);

  private cdr = inject(ChangeDetectorRef);


  // =====================================================
  // DATA
  // =====================================================

  notifications: NotificationResponse[] = [];

  loading = false;

  markingAllRead = false;

  markingReadId: number | null = null;


  // =====================================================
  // SUMMARY
  // =====================================================

  totalNotifications = 0;

  unreadNotifications = 0;

  alertNotifications = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadNotifications();

  }


  // =====================================================
  // LOAD MY NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.loading = true;

    this.alertService.loading(
      'Loading your notifications...'
    );

    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (response) => {

          this.notifications =
            response || [];

          this.calculateSummary();

          this.loading = false;

          this.alertService.close();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'TOURIST NOTIFICATIONS ERROR:',
            error
          );

          this.loading = false;

          this.alertService.close();

          const message =
            typeof error?.error === 'string'
              ? error.error
              : error?.error?.message ||
                'Unable to load your notifications.';

          this.alertService.error(
            'Failed to Load Notifications',
            message
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


    this.unreadNotifications =
      this.notifications.filter(
        notification =>
          !notification.read
      ).length;


    /*
     * Count alert-type notifications.
     *
     * Backend may return:
     * ALERT
     * alert
     * ENVIRONMENTAL_ALERT
     */

    this.alertNotifications =
      this.notifications.filter(
        notification => {

          const type =
            String(
              notification.type || ''
            ).toLowerCase();

          return (
            type.includes('alert') ||
            type.includes('warning')
          );

        }
      ).length;

  }


  // =====================================================
  // MARK SINGLE NOTIFICATION AS READ
  // =====================================================

  markAsRead(
    notification: NotificationResponse
  ): void {

    if (
      !notification ||
      notification.read
    ) {

      return;

    }


    this.markingReadId =
      notification.id;


    this.alertService.loading(
      'Marking notification as read...'
    );


    this.notificationService
      .markRead(notification.id)
      .subscribe({

        next: () => {

          notification.read = true;

          this.calculateSummary();

          this.markingReadId = null;

          this.alertService.close();

          this.cdr.detectChanges();

        },

        error: (error) => {

          console.error(
            'MARK NOTIFICATION READ ERROR:',
            error
          );

          this.markingReadId = null;

          this.alertService.close();

          const message =
            typeof error?.error === 'string'
              ? error.error
              : error?.error?.message ||
                'Unable to mark notification as read.';

          this.alertService.error(
            'Action Failed',
            message
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  markAllAsRead(): void {

    if (
      this.unreadNotifications === 0
    ) {

      this.alertService.info(
        'No Unread Notifications',
        'All your notifications are already marked as read.'
      );

      return;

    }


    this.alertService.confirm(

      'Mark All as Read',

      'Are you sure you want to mark all notifications as read?',

      'Mark All as Read'

    ).then(
      (confirmed: boolean) => {

        if (!confirmed) {

          return;

        }


        this.markingAllRead = true;


        this.alertService.loading(
          'Marking all notifications as read...'
        );


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

              this.markingAllRead = false;

              this.alertService.close();


              this.alertService.success(
                'Notifications Updated',
                'All your notifications have been marked as read.'
              );


              this.cdr.detectChanges();

            },

            error: (error) => {

              console.error(
                'MARK ALL NOTIFICATIONS ERROR:',
                error
              );

              this.markingAllRead = false;

              this.alertService.close();


              const message =
                typeof error?.error === 'string'
                  ? error.error
                  : error?.error?.message ||
                    'Unable to mark all notifications as read.';


              this.alertService.error(
                'Action Failed',
                message
              );


              this.cdr.detectChanges();

            }

          });

      }

    );

  }


  // =====================================================
  // GET TITLE
  // =====================================================

  getNotificationTitle(
    notification: NotificationResponse
  ): string {

    return notification.title ||
      'Notification';

  }


  // =====================================================
  // GET TYPE
  // =====================================================

  getNotificationType(
    notification: NotificationResponse
  ): string {

    const type =
      String(
        notification.type || ''
      ).toLowerCase();


    if (
      type.includes('success') ||
      type.includes('approved') ||
      type.includes('resolved')
    ) {

      return 'success';

    }


    if (
      type.includes('review') ||
      type.includes('pending')
    ) {

      return 'review';

    }


    if (
      type.includes('alert') ||
      type.includes('warning')
    ) {

      return 'alert';

    }


    if (
      type.includes('thanks') ||
      type.includes('thank')
    ) {

      return 'thanks';

    }


    return 'system';

  }


  // =====================================================
  // GET ICON
  // =====================================================

  getNotificationIcon(
    notification: NotificationResponse
  ): string {

    switch (
      this.getNotificationType(
        notification
      )
    ) {

      case 'success':
        return 'fas fa-circle-check';

      case 'review':
        return 'fas fa-hourglass-half';

      case 'alert':
        return 'fas fa-triangle-exclamation';

      case 'thanks':
        return 'fas fa-heart';

      default:
        return 'fas fa-bullhorn';

    }

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