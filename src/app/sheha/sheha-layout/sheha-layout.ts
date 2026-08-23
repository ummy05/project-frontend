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
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  NotificationService,
  NotificationResponse
} from '../../services/notification.service';

import {
  AlertService
} from '../../services/alert.service';


@Component({

  selector: 'app-sheha-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],

  templateUrl: './sheha-layout.html',

  styleUrl: './sheha-layout.css'

})
export class ShehaLayout implements OnInit {


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarOpen = false;


  // =====================================================
  // LOGOUT
  // =====================================================

  showLogoutModal = false;


  // =====================================================
  // USER
  // =====================================================

  fullName = 'Sheha';

  email = '';

  profileImage =
    'assets/images/default-profile.png';


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  unreadNotifications = 0;

  notifications: NotificationResponse[] = [];

  notificationDropdown = false;

  notificationLoading = false;


  constructor(

    private auth: AuthService,

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

    this.loadUser();

    this.loadNotifications();

  }


  // =====================================================
  // LOAD USER
  // =====================================================

  loadUser(): void {

    this.fullName =
      this.auth.getFullName() ||
      'Sheha';

    this.email =
      this.auth.getEmail() ||
      '';

    this.auth
      .getProfile()
      .subscribe({

        next: (user) => {

          this.fullName =
            user.fullName ||
            this.fullName;

          this.email =
            user.email ||
            this.email;

          if (user.profileImage) {

            this.profileImage =
              this.getProfileImage(
                user.profileImage
              );

          }

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.error(
            'SHEHA PROFILE ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // PROFILE IMAGE
  // =====================================================

  getProfileImage(
    image: string
  ): string {

    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }

    return image.startsWith('/')
      ? image
      : `/${image}`;

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.notificationLoading = true;

    this.notificationService
      .unreadCount()
      .subscribe({

        next: (count: number) => {

          this.unreadNotifications =
            count || 0;

          this.notificationLoading =
            false;

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.error(
            'UNREAD COUNT ERROR:',
            err
          );

          this.unreadNotifications = 0;

          this.notificationLoading =
            false;

          this.cdr.detectChanges();

        }

      });

  }


  // =====================================================
  // OPEN NOTIFICATION DROPDOWN
  // =====================================================

  toggleNotifications(): void {

    this.notificationDropdown =
      !this.notificationDropdown;

    if (
      this.notificationDropdown
    ) {

      this.loadLatestNotifications();

    }

  }


  // =====================================================
  // LATEST NOTIFICATIONS
  // =====================================================

  loadLatestNotifications(): void {

    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (
          response: NotificationResponse[]
        ) => {

          this.notifications =
            response
              .filter(
                notification =>
                  !notification.read
              )
              .slice(0, 5);

          this.cdr.detectChanges();

        },

        error: (err: any) => {

          console.error(
            'NOTIFICATION LOAD ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // OPEN NOTIFICATION
  // =====================================================

  openNotification(
    notification: NotificationResponse
  ): void {

    if (!notification.read) {

      this.notificationService
        .markRead(notification.id)
        .subscribe({

          next: () => {

            this.unreadNotifications =
              Math.max(
                0,
                this.unreadNotifications - 1
              );

            notification.read = true;

            this.cdr.detectChanges();

          },

          error: (err: any) => {

            console.error(
              'MARK NOTIFICATION ERROR:',
              err
            );

          }

        });

    }

    this.router.navigate([
      '/sheha/notifications'
    ]);

    this.notificationDropdown =
      false;

  }


  // =====================================================
  // VIEW ALL NOTIFICATIONS
  // =====================================================

  viewAllNotifications(): void {

    this.notificationDropdown =
      false;

    this.router.navigate([
      '/sheha/notifications'
    ]);

  }


  // =====================================================
  // PROFILE
  // =====================================================

  openProfile(): void {

    this.router.navigate([
      '/sheha/profile'
    ]);

  }


  // =====================================================
  // SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  closeSidebar(): void {

    this.sidebarOpen = false;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.showLogoutModal = true;

  }


  confirmLogout(): void {

    this.showLogoutModal = false;

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);

  }

}