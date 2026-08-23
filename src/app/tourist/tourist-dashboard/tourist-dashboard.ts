import {
  ChangeDetectorRef,
  Component,
  OnInit,
  inject
} from '@angular/core';

import { CommonModule } from '@angular/common';

import { RouterLink } from '@angular/router';

import { AlertService } from '../../services/alert.service';


@Component({

  selector: 'app-tourist-dashboard',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl: './tourist-dashboard.html',

  styleUrl: './tourist-dashboard.css'

})
export class TouristDashboard implements OnInit {


  // =====================================================
  // SERVICES
  // =====================================================

  private alert =
    inject(AlertService);

  private cdr =
    inject(ChangeDetectorRef);


  // =====================================================
  // USER
  // =====================================================

  fullName = 'Tourist';


  // =====================================================
  // DASHBOARD STATISTICS
  // These are intentionally 0 until backend data
  // is connected.
  // =====================================================

  totalReports = 0;

  resolvedReports = 0;

  notifications = 0;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // =====================================================
  // LOAD DASHBOARD
  // =====================================================

  loadDashboard(): void {

    this.fullName =
      localStorage.getItem('fullName') ||
      'Tourist';


    /*
     * Backend integration will be added here.
     *
     * For now we deliberately DO NOT use
     * fake/dummy statistics or reports.
     */


    this.totalReports = 0;

    this.resolvedReports = 0;

    this.notifications = 0;


    this.cdr.detectChanges();

  }


  // =====================================================
  // INFORMATION
  // =====================================================

  showComingSoon(
    feature: string
  ): void {

    this.alert.info(

      feature,

      'This feature will be connected to the backend shortly.'

    );

  }

}