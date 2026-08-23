import {
  CommonModule
} from '@angular/common';

import {
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  Chart,
  registerables
} from 'chart.js';

import {
  AnalyticsService,
  AdminDashboardResponse,
  AnalyticsResponse
} from '../../services/analytics.service';

import {
  AlertService
} from '../../services/alert.service';


Chart.register(...registerables);


@Component({

  selector: 'app-admin-dashboard',

  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl: './admin-dashboard.html',

  styleUrl: './admin-dashboard.css'

})
export class AdminDashboard
  implements OnInit, OnDestroy {


  // ===================================================
  // CONSTRUCTOR
  // ===================================================

  constructor(

    private analytics:
      AnalyticsService,

    private alertService:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // ===================================================
  // DASHBOARD DATA
  // ===================================================

  dashboard: AdminDashboardResponse = {

    // USERS

    totalUsers: 0,

    totalBusinessOwners: 0,

    totalTourists: 0,


    // LICENSES

    totalLicenses: 0,

    approvedLicenses: 0,

    pendingLicenses: 0,

    rejectedLicenses: 0,


    // PERMITS

    totalPermits: 0,

    approvedPermits: 0,

    pendingPermits: 0,

    rejectedPermits: 0,


    // COMPLAINTS

    totalComplaints: 0,

    resolvedComplaints: 0,

    pendingComplaints: 0,

    rejectedComplaints: 0,


    // PAYMENTS

    totalPayments: 0,

    approvedPayments: 0,

    pendingPayments: 0,

    rejectedPayments: 0,

    totalRevenue: 0

  };


  // ===================================================
  // REPORT DATA
  // ===================================================

  reportsData: AnalyticsResponse = {

    // LICENSES

    approvedLicenses: 0,

    pendingLicenses: 0,

    rejectedLicenses: 0,


    // PERMITS

    approvedPermits: 0,

    pendingPermits: 0,

    rejectedPermits: 0,


    // PAYMENTS

    approvedPayments: 0,

    pendingPayments: 0,

    rejectedPayments: 0,


    // COMPLAINTS

    resolvedComplaints: 0,

    pendingComplaints: 0,

    rejectedComplaints: 0,


    // REVENUE

    totalRevenue: 0

  };


  // ===================================================
  // CHARTS
  // ===================================================

  revenueChart?: Chart;

  licenseChart?: Chart;

  complaintChart?: Chart;

  overviewChart?: Chart;


  // ===================================================
  // TODAY
  // ===================================================

  today = new Date();


  // ===================================================
  // INIT
  // ===================================================

  ngOnInit(): void {

    this.loadDashboard();

  }


  // ===================================================
  // LOAD DASHBOARD
  // ===================================================

  loadDashboard(): void {

    this.alertService.loading(
      'Loading admin dashboard...'
    );


    this.analytics
      .adminDashboard()
      .subscribe({

        // =============================================
        // SUCCESS
        // =============================================

        next: (res) => {

          console.log(
            'ADMIN DASHBOARD DATA:',
            res
          );


          this.dashboard = res;


          this.loadCharts();

        },


        // =============================================
        // ERROR
        // =============================================

        error: (error) => {

          console.error(
            'Admin dashboard error:',
            error
          );


          this.alertService.close();


          let message =
            'Unable to load admin dashboard data from the server.';


          if (
            error?.status === 401
          ) {

            message =
              'Authentication required. Please login again.';

          }

          else if (
            error?.status === 403
          ) {

            message =
              'You are not authorized to access the admin dashboard.';

          }

          else if (
            error?.error?.message
          ) {

            message =
              error.error.message;

          }


          this.alertService.error(

            'Dashboard Error',

            message

          );

        }

      });

  }


  // ===================================================
  // LOAD CHARTS
  // ===================================================

  loadCharts(): void {

    let completedRequests = 0;

    const totalRequests = 4;


    const requestCompleted = (): void => {

      completedRequests++;


      if (
        completedRequests >= totalRequests
      ) {

        this.alertService.close();

        this.cdr.detectChanges();

      }

    };


    // =================================================
    // REVENUE
    // =================================================

    this.analytics
      .monthlyRevenue()
      .subscribe({

        next: (data) => {

          this.createRevenueChart(data);

          requestCompleted();

        },

        error: (error) => {

          console.error(
            'Monthly revenue error:',
            error
          );

          requestCompleted();

        }

      });


    // =================================================
    // LICENSES
    // =================================================

    this.analytics
      .monthlyLicenses()
      .subscribe({

        next: (data) => {

          this.createLicenseChart(data);

          requestCompleted();

        },

        error: (error) => {

          console.error(
            'Monthly licenses error:',
            error
          );

          requestCompleted();

        }

      });


    // =================================================
    // COMPLAINTS
    // =================================================

    this.analytics
      .monthlyComplaints()
      .subscribe({

        next: (data) => {

          this.createComplaintMonthlyChart(
            data
          );

          requestCompleted();

        },

        error: (error) => {

          console.error(
            'Monthly complaints error:',
            error
          );

          requestCompleted();

        }

      });


    // =================================================
    // REPORT
    // =================================================

    this.analytics
      .reports()
      .subscribe({

        next: (res) => {

          console.log(
            'ANALYTICS REPORT DATA:',
            res
          );


          this.reportsData = res;


          this.createOverviewChart(
            res
          );


          this.createComplaintStatusChart();


          requestCompleted();

        },

        error: (error) => {

          console.error(
            'Analytics report error:',
            error
          );

          requestCompleted();

        }

      });

  }


  // ===================================================
  // REVENUE CHART
  // ===================================================

  createRevenueChart(
    data: Record<string, number>
  ): void {

    const canvas =
      document.getElementById(
        'revenueChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {

      return;

    }


    if (this.revenueChart) {

      this.revenueChart.destroy();

    }


    this.revenueChart =
      new Chart(

        canvas,

        {

          type: 'line',

          data: {

            labels:
              Object.keys(data),

            datasets: [

              {

                label:
                  'Revenue',

                data:
                  Object.values(data),

                fill:
                  true,

                tension:
                  0.4,

                borderWidth:
                  3

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              },

              tooltip: {

                callbacks: {

                  label:
                    (context) => {

                      return `TZS ${
                        Number(
                          context.raw
                        ).toLocaleString()
                      }`;

                    }

                }

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  callback:
                    (value) => {

                      return 'TZS ' +
                        Number(value)
                          .toLocaleString();

                    }

                }

              }

            }

          }

        }

      );

  }


  // ===================================================
  // LICENSE CHART
  // ===================================================

  createLicenseChart(
    data: Record<string, number>
  ): void {

    const canvas =
      document.getElementById(
        'licenseChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {

      return;

    }


    if (this.licenseChart) {

      this.licenseChart.destroy();

    }


    this.licenseChart =
      new Chart(

        canvas,

        {

          type: 'bar',

          data: {

            labels:
              Object.keys(data),

            datasets: [

              {

                label:
                  'Licenses',

                data:
                  Object.values(data),

                borderWidth:
                  1

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  precision:
                    0

                }

              }

            }

          }

        }

      );

  }


  // ===================================================
  // MONTHLY COMPLAINT CHART
  // ===================================================

  createComplaintMonthlyChart(
    data: Record<string, number>
  ): void {

    const canvas =
      document.getElementById(
        'complaintMonthlyChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {

      return;

    }


    if (this.complaintChart) {

      this.complaintChart.destroy();

    }


    this.complaintChart =
      new Chart(

        canvas,

        {

          type: 'bar',

          data: {

            labels:
              Object.keys(data),

            datasets: [

              {

                label:
                  'Complaints',

                data:
                  Object.values(data),

                borderWidth:
                  1

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                display:
                  false

              }

            },

            scales: {

              y: {

                beginAtZero:
                  true,

                ticks: {

                  precision:
                    0

                }

              }

            }

          }

        }

      );

  }


  // ===================================================
  // COMPLAINT STATUS CHART
  // ===================================================

  createComplaintStatusChart(): void {

    const canvas =
      document.getElementById(
        'complaintChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {

      return;

    }


    if (this.complaintChart) {

      this.complaintChart.destroy();

    }


    this.complaintChart =
      new Chart(

        canvas,

        {

          type: 'doughnut',

          data: {

            labels: [

              'Resolved',

              'Pending',

              'Rejected'

            ],

            datasets: [

              {

                data: [

                  this.reportsData
                    .resolvedComplaints,

                  this.reportsData
                    .pendingComplaints,

                  this.reportsData
                    .rejectedComplaints

                ]

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                position:
                  'bottom'

              }

            }

          }

        }

      );

  }


  // ===================================================
  // SYSTEM OVERVIEW
  // ===================================================

  createOverviewChart(
    res: AnalyticsResponse
  ): void {

    const canvas =
      document.getElementById(
        'overviewChart'
      ) as HTMLCanvasElement | null;


    if (!canvas) {

      return;

    }


    if (this.overviewChart) {

      this.overviewChart.destroy();

    }


    this.overviewChart =
      new Chart(

        canvas,

        {

          type: 'pie',

          data: {

            labels: [

              'Approved Licenses',

              'Pending Licenses',

              'Approved Permits',

              'Pending Permits',

              'Resolved Complaints',

              'Approved Payments'

            ],

            datasets: [

              {

                data: [

                  res.approvedLicenses,

                  res.pendingLicenses,

                  res.approvedPermits,

                  res.pendingPermits,

                  res.resolvedComplaints,

                  res.approvedPayments

                ]

              }

            ]

          },

          options: {

            responsive:
              true,

            maintainAspectRatio:
              false,

            plugins: {

              legend: {

                position:
                  'bottom'

              }

            }

          }

        }

      );

  }


  // ===================================================
  // DESTROY
  // ===================================================

  ngOnDestroy(): void {

    this.revenueChart?.destroy();

    this.licenseChart?.destroy();

    this.complaintChart?.destroy();

    this.overviewChart?.destroy();

  }

}