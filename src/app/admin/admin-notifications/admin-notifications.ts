import { CommonModule, DatePipe } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  OnInit
} from '@angular/core';

import {
  NotificationService,
  NotificationResponse
} from '../../services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone: true,
  imports: [
    CommonModule,
    DatePipe
  ],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css'
})
export class AdminNotifications implements OnInit {

  constructor(
    private notificationService: NotificationService,
    private cdr: ChangeDetectorRef
  ) {}

  notifications: NotificationResponse[] = [];

  loading = false;

  error = '';

  summary = {

    total: 0,

    unread: 0,

    alerts: 0

  };


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadNotifications();

  }


  // =====================================================
  // LOAD ALL NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.loading = true;

    this.error = '';

    this.notificationService
      .getAll()
      .subscribe({

        next: (res) => {

          this.notifications = res;

          this.calculateSummary();

          this.loading = false;

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'NOTIFICATION ERROR:',
            err
          );

          this.loading = false;

          if (err.status === 401) {

            this.error =
              'Authentication required. Please login again.';

          }

          else if (err.status === 403) {

            this.error =
              'Access denied. Administrator permission required.';

          }

          else {

            this.error =
              'Failed to load notifications.';

          }

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // CALCULATE SUMMARY
  // =====================================================

  calculateSummary(): void {

    this.summary.total =
      this.notifications.length;


    this.summary.unread =
      this.notifications.filter(
        notification => !notification.read
      ).length;


    this.summary.alerts =
      this.notifications.filter(
        notification =>
          notification.type === 'ALERT'
      ).length;

  }


  // =====================================================
  // MARK ALL AS READ
  // =====================================================

  markAll(): void {

    this.notificationService
      .markAllRead()
      .subscribe({

        next: () => {

          this.loadNotifications();

        },

        error: (err) => {

          console.error(
            'MARK ALL ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // MARK SINGLE AS READ
  // =====================================================

  markRead(
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

          this.calculateSummary();

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'MARK READ ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // DELETE
  // =====================================================

  delete(
    notification: NotificationResponse
  ): void {

    if (
      !confirm(
        'Delete notification?'
      )
    ) {

      return;

    }

    this.notificationService
      .delete(notification.id)
      .subscribe({

        next: () => {

          this.loadNotifications();

        },

        error: (err) => {

          console.error(
            'DELETE NOTIFICATION ERROR:',
            err
          );

        }

      });

  }

}