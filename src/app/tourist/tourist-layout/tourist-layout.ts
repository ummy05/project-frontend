import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import { AuthService } from '../../services/auth.service';

import { AlertService } from '../../services/alert.service';


@Component({

  selector: 'app-tourist-layout',

  standalone: true,

  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive
  ],

  templateUrl: './tourist-layout.html',

  styleUrl: './tourist-layout.css'

})
export class TouristLayout implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private auth =
    inject(AuthService);

  private router =
    inject(Router);

  private alert =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // SIDEBAR
  // =====================================================

  sidebarOpen = false;


  // =====================================================
  // USER
  // =====================================================

  fullName = 'Tourist';

  email = '';


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadUserInformation();

  }


  // =====================================================
  // LOAD USER INFORMATION
  // =====================================================

  loadUserInformation(): void {

    this.fullName =
      localStorage.getItem('fullName') ||
      'Tourist';

    this.email =
      localStorage.getItem('email') ||
      '';

    this.cdr.detectChanges();

  }


  // =====================================================
  // TOGGLE SIDEBAR
  // =====================================================

  toggleSidebar(): void {

    this.sidebarOpen =
      !this.sidebarOpen;

    this.cdr.detectChanges();

  }


  // =====================================================
  // CLOSE SIDEBAR
  // =====================================================

  closeSidebar(): void {

    this.sidebarOpen = false;

    this.cdr.detectChanges();

  }


  // =====================================================
  // LOGOUT
  // =====================================================

  async logout(): Promise<void> {

    const confirmed =
      await this.alert.confirm(

        'Logout',

        'Are you sure you want to logout?',

        'Logout'

      );


    if (!confirmed) {

      return;

    }


    this.auth.logout();

    this.sidebarOpen = false;

    this.cdr.detectChanges();


    this.alert.success(

      'Logged Out',

      'You have been logged out successfully.'

    );


    setTimeout(() => {

      this.router.navigate(['/login']);

    }, 500);

  }

}