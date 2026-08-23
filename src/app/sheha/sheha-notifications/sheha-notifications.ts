import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import {
  NotificationResponse,
  NotificationService
} from '../../services/notification.service';

import { AlertService } from '../../services/alert.service';


@Component({

  selector: 'app-sheha-notifications',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './sheha-notifications.html',

  styleUrl: './sheha-notifications.css'

})
export class ShehaNotifications implements OnInit {


  private notificationService =
    inject(NotificationService);

  private alert =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);

  private router =
    inject(Router);


  notifications: NotificationResponse[] = [];

  loading = false;

  unreadCount = 0;


  ngOnInit(): void {

    this.loadNotifications();

  }


  // =====================================================
  // LOAD NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.loading = true;

    this.alert.loading(
      'Loading notifications...'
    );


    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (response: NotificationResponse[]) => {

          this.notifications =
            response || [];

          this.calculateUnread();

          this.loading = false;

          this.alert.close();

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          this.loading = false;

          this.alert.close();

          console.error(
            'Failed to load notifications:',
            error
          );

          this.alert.error(
            'Failed to Load Notifications',
            'Unable to retrieve your notifications. Please try again.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CALCULATE UNREAD
  // =====================================================

  calculateUnread(): void {

    this.unreadCount =
      this.notifications.filter(
        notification => !notification.read
      ).length;

  }


  // =====================================================
  // MARK SINGLE AS READ
  // =====================================================

  openNotification(
    notification: NotificationResponse
  ): void {

    if (notification.read) {

      return;

    }


    this.notificationService
      .markRead(notification.id)
      .subscribe({

        next: () => {

          notification.read = true;

          this.calculateUnread();

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          console.error(
            'Failed to mark notification as read:',
            error
          );

        }

      });

  }


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  markAllAsRead(): void {

    if (this.unreadCount === 0) {

      this.alert.info(
        'All Notifications Read',
        'There are no unread notifications.'
      );

      return;

    }


    this.alert.loading(
      'Marking notifications as read...'
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

          this.calculateUnread();

          this.alert.close();

          this.alert.success(
            'Notifications Updated',
            'All notifications have been marked as read.'
          );

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          this.alert.close();

          console.error(
            'Failed to mark all notifications:',
            error
          );

          this.alert.error(
            'Update Failed',
            'Unable to mark all notifications as read.'
          );

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // DELETE NOTIFICATION
  // =====================================================

  async deleteNotification(
    notification: NotificationResponse
  ): Promise<void> {

    const confirmed =
      await this.alert.confirm(
        'Delete Notification?',
        'This notification will be permanently removed.',
        'Delete'
      );


    if (!confirmed) {

      return;

    }


    this.alert.loading(
      'Deleting notification...'
    );


    this.notificationService
      .delete(notification.id)
      .subscribe({

        next: () => {

          this.notifications =
            this.notifications.filter(
              item => item.id !== notification.id
            );

          this.calculateUnread();

          this.alert.close();

          this.alert.success(
            'Notification Deleted'
          );

          this.cdr.detectChanges();

        },

        error: (error: unknown) => {

          this.alert.close();

          console.error(
            'Delete notification failed:',
            error
          );

          this.alert.error(
            'Delete Failed',
            'Unable to delete this notification.'
          );

        }

      });

  }


  // =====================================================
  // REFRESH
  // =====================================================

  refresh(): void {

    this.loadNotifications();

  }


  // =====================================================
  // NOTIFICATION ICON
  // =====================================================

  getNotificationIcon(
    type: string
  ): string {

    switch (
      type?.toUpperCase()
    ) {

      case 'SUCCESS':
        return 'fas fa-check-circle';

      case 'WARNING':
        return 'fas fa-exclamation-triangle';

      case 'ERROR':
        return 'fas fa-times-circle';

      case 'PAYMENT':
        return 'fas fa-credit-card';

      case 'PERMIT':
        return 'fas fa-file-circle-check';

      case 'LICENSE':
        return 'fas fa-id-card';

      default:
        return 'fas fa-bell';

    }

  }


  // =====================================================
  // NOTIFICATION TYPE CLASS
  // =====================================================

  getNotificationClass(
    type: string
  ): string {

    return type
      ?.toLowerCase() || 'info';

  }


  // =====================================================
  // FORMAT DATE
  // =====================================================

  formatDate(
    date: string
  ): string {

    if (!date) {

      return '';

    }


    return new Date(date)
      .toLocaleString(
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

}