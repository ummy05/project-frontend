import {
  CommonModule
} from '@angular/common';

import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
  RouterOutlet
} from '@angular/router';

import {
  AuthService
} from '../../services/auth.service';

import {
  NotificationService,
  NotificationItem
} from '../../services/notification.service';

import {
  environment
} from '../../environment/environment';


@Component({

  selector: 'app-owner-layout',

  standalone: true,

  imports: [

    CommonModule,

    RouterModule,

    RouterOutlet,

    RouterLink,

    RouterLinkActive

  ],

  templateUrl:
    './owner-layout.html',

  styleUrl:
    './owner-layout.css'

})
export class OwnerLayout
  implements OnInit {


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarOpen = false;


  // =====================================================
  // LOGOUT
  // =====================================================

  showLogoutModal = false;


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  latestNotifications:
    NotificationItem[] = [];

  unreadCount = 0;

  notificationOpen = false;


  // =====================================================
  // USER
  // =====================================================

  user: any = null;

  profileImage =
    'assets/images/default-profile.png';


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private auth:
      AuthService,

    private notificationService:
      NotificationService,

    private router:
      Router,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadProfile();

    this.loadNotifications();

  }


  // =====================================================
  // LOAD PROFILE
  // =====================================================

  loadProfile(): void {

    this.auth
      .getProfile()
      .subscribe({

        next: (response) => {

          this.user = response;

          this.profileImage =
            this.buildProfileImage(
              response?.profileImage
            );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'OWNER LAYOUT PROFILE ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // PROFILE IMAGE URL
  // =====================================================

  buildProfileImage(
    image: string | null | undefined
  ): string {

    if (!image) {

      return 'assets/images/default-profile.png';

    }


    if (
      image.startsWith('http://') ||
      image.startsWith('https://')
    ) {

      return image;

    }


    const serverUrl =
      environment.apiUrl.replace(
        '/api',
        ''
      );


    const cleanImage =
      image.startsWith('/')
        ? image
        : `/${image}`;


    return `${serverUrl}${cleanImage}`;

  }


  // =====================================================
  // NOTIFICATIONS
  // =====================================================

  loadNotifications(): void {

    this.notificationService
      .getUnreadCount()
      .subscribe({

        next: (response) => {

          this.unreadCount =
            this.extractUnreadCount(
              response
            );

          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'UNREAD COUNT ERROR:',
            err
          );

          this.unreadCount = 0;

        }

      });


    this.notificationService
      .getMyNotifications()
      .subscribe({

        next: (response) => {

          this.latestNotifications =
            (response || [])

              .sort(
                (a, b) =>
                  this.getTime(
                    b.createdAt
                  ) -
                  this.getTime(
                    a.createdAt
                  )
              )

              .slice(0, 5);


          this.cdr.detectChanges();

        },

        error: (err) => {

          console.error(
            'NOTIFICATIONS ERROR:',
            err
          );

        }

      });

  }


  // =====================================================
  // EXTRACT COUNT
  // =====================================================

  extractUnreadCount(
    response: any
  ): number {

    if (
      typeof response === 'number'
    ) {

      return response;

    }


    if (
      typeof response === 'string'
    ) {

      const value =
        Number(response);

      return Number.isNaN(value)
        ? 0
        : value;

    }


    if (
      response &&
      typeof response.count === 'number'
    ) {

      return response.count;

    }


    if (
      response &&
      typeof response.unreadCount === 'number'
    ) {

      return response.unreadCount;

    }


    if (
      response &&
      typeof response.total === 'number'
    ) {

      return response.total;

    }


    return 0;

  }


  // =====================================================
  // TOGGLE NOTIFICATION
  // =====================================================

  toggleNotifications(
    event?: Event
  ): void {

    event?.stopPropagation();

    this.notificationOpen =
      !this.notificationOpen;

  }


  // =====================================================
  // CLOSE NOTIFICATIONS
  // =====================================================

  closeNotifications(): void {

    this.notificationOpen = false;

  }


  // =====================================================
  // VIEW ALL
  // =====================================================

  viewAllNotifications(): void {

    this.notificationOpen = false;

    this.router.navigate([
      '/owner/notifications'
    ]);

  }


  // =====================================================
  // OPEN PROFILE
  // =====================================================

  openProfile(): void {

    this.router.navigate([
      '/owner/profile'
    ]);

  }


  // =====================================================
  // SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  logout(): void {

    this.showLogoutModal = true;

  }


  // =====================================================
  // CONFIRM LOGOUT
  // =====================================================

  confirmLogout(): void {

    this.showLogoutModal = false;

    this.auth.logout();

    this.router.navigate([
      '/login'
    ]);

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
  // DATE
  // =====================================================

  formatDate(
    value: string | null | undefined
  ): string {

    if (!value) {

      return '';

    }

    const date =
      new Date(value);

    if (
      Number.isNaN(
        date.getTime()
      )
    ) {

      return '';

    }

    return date.toLocaleDateString(
      'en-GB',
      {
        day: '2-digit',
        month: 'short'
      }
    );

  }

}