// src/app/admin/reports/reports.ts

import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  OnDestroy,
  OnInit
} from '@angular/core';

import {
  CommonModule,
  DecimalPipe
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  forkJoin
} from 'rxjs';

import {
  Chart,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  BarElement,
  DoughnutController,
  PieController,
  BarController,
  LineController,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

import {
  AnalyticsService,
  AnalyticsResponse
} from '../../services/analytics.service';

import {
  AlertService
} from '../../services/alert.service';


// =====================================================
// CHART.JS REGISTRATION
// =====================================================

Chart.register(

  CategoryScale,

  LinearScale,

  PointElement,

  LineElement,

  ArcElement,

  BarElement,

  DoughnutController,

  PieController,

  BarController,

  LineController,

  Tooltip,

  Legend,

  Filler

);


// =====================================================
// PERFORMANCE INTERFACE
// =====================================================

interface PerformanceItem {

  month: string;

  revenue: number | string;

  licenses: number;

  complaints: number;

}


// =====================================================
// COMPONENT
// =====================================================

@Component({

  selector: 'app-reports',

  standalone: true,

  imports: [

    CommonModule,

    FormsModule,

    DecimalPipe

  ],

  templateUrl: './reports.html',

  styleUrl: './reports.css'

})
export class Reports
  implements OnInit, AfterViewInit, OnDestroy {


  // =====================================================
  // CONSTRUCTOR
  // =====================================================

  constructor(

    private analytics:
      AnalyticsService,

    private alertService:
      AlertService,

    private cdr:
      ChangeDetectorRef

  ) {}


  // =====================================================
  // REPORT DATA
  // =====================================================

  report: AnalyticsResponse = {

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


  // =====================================================
  // FILTER DATES
  // =====================================================

  fromDate = '';

  toDate = '';


  // =====================================================
  // LOADING
  // =====================================================

  loading = false;


  // =====================================================
  // PERFORMANCE
  // =====================================================

  performance:
    PerformanceItem[] = [];


  // =====================================================
  // CHARTS
  // =====================================================

  revenueChart:
    Chart | null = null;

  licenseChart:
    Chart | null = null;

  complaintChart:
    Chart | null = null;


  // =====================================================
  // INIT
  // =====================================================

  ngOnInit(): void {

    this.setDefaultDates();

  }


  // =====================================================
  // AFTER VIEW INIT
  // =====================================================

  ngAfterViewInit(): void {

    this.loadReports();

  }


  // =====================================================
  // DEFAULT DATES
  // =====================================================

  private setDefaultDates(): void {

    const now =
      new Date();


    const year =
      now.getFullYear();


    this.fromDate =
      `${year}-01-01`;


    this.toDate =
      now.toISOString()
        .split('T')[0];

  }


  // =====================================================
  // LOAD REPORTS
  // =====================================================

  loadReports(
    showLoading = true
  ): void {

    // ---------------------------------------------------
    // DATE VALIDATION
    // ---------------------------------------------------

    if (

      this.fromDate &&

      this.toDate &&

      this.fromDate > this.toDate

    ) {

      this.alertService.warning(

        'Invalid Date Range',

        'From Date cannot be later than To Date.'

      );

      return;

    }


    // ---------------------------------------------------
    // LOADING
    // ---------------------------------------------------

    if (showLoading) {

      this.alertService.loading(
        'Generating report...'
      );

    }


    this.loading = true;


    // ---------------------------------------------------
    // BACKEND REQUESTS
    // ---------------------------------------------------

    forkJoin({

      report:
        this.analytics.reports(),

      revenue:
        this.analytics.monthlyRevenue(),

      licenses:
        this.analytics.monthlyLicenses(),

      complaints:
        this.analytics.monthlyComplaints()

    })

    .subscribe({

      // =================================================
      // SUCCESS
      // =================================================

      next: (data) => {

        console.log(
          'REPORT DATA:',
          data
        );


        // -----------------------------------------------
        // MAIN REPORT
        // -----------------------------------------------

        this.report =
          data.report;


        // -----------------------------------------------
        // PERFORMANCE
        // -----------------------------------------------

        this.buildPerformanceTable(

          data.revenue,

          data.licenses,

          data.complaints

        );


        // -----------------------------------------------
        // LOADING
        // -----------------------------------------------

        this.loading = false;


        if (showLoading) {

          this.alertService.close();

        }


        this.cdr.detectChanges();


        // -----------------------------------------------
        // CHARTS
        // -----------------------------------------------

        setTimeout(() => {

          this.buildRevenueChart(
            data.revenue
          );


          this.buildLicenseChart(
            data.licenses
          );


          this.buildComplaintChart(
            data.complaints
          );

        }, 100);

      },


      // =================================================
      // ERROR
      // =================================================

      error: (error) => {

        console.error(
          'REPORT ERROR:',
          error
        );


        this.loading = false;


        this.alertService.close();


        let message =
          'Unable to retrieve analytics from the server.';


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
            'You are not authorized to access admin reports.';

        }

        else if (
          error?.error?.message
        ) {

          message =
            error.error.message;

        }


        this.alertService.error(

          'Failed to Load Report',

          message

        );

      }

    });

  }


  // =====================================================
  // GENERATE REPORT
  // =====================================================

  generateReport(): void {

    this.loadReports();

  }


  // =====================================================
  // PERFORMANCE TABLE
  // =====================================================

  private buildPerformanceTable(

    revenueData:
      Record<string, number>,

    licenseData:
      Record<string, number>,

    complaintData:
      Record<string, number>

  ): void {

    const months =
      Object.keys(revenueData);


    this.performance =
      months.map((month) => {

        return {

          month:
            this.formatMonth(month),

          revenue:
            revenueData[month] ?? 0,

          licenses:
            licenseData[month] ?? 0,

          complaints:
            complaintData[month] ?? 0

        };

      });

  }


  // =====================================================
  // FORMAT MONTH
  // =====================================================

  private formatMonth(
    month: string
  ): string {

    return (

      month
        .charAt(0)
        .toUpperCase() +

      month
        .slice(1)
        .toLowerCase()

    );

  }


  // =====================================================
  // REVENUE CHART
  // =====================================================

  private buildRevenueChart(

    data:
      Record<string, number>

  ): void {

    if (this.revenueChart) {

      this.revenueChart.destroy();

    }


    const labels =
      Object.keys(data)
        .map(month =>
          this.formatMonth(month)
        );


    const values =
      Object.values(data);


    const canvas =
      document.getElementById(
        'revenueChart'
      );


    if (!canvas) {

      return;

    }


    this.revenueChart =
      new Chart(

        canvas as HTMLCanvasElement,

        {

          type: 'line',

          data: {

            labels,

            datasets: [

              {

                label:
                  'Revenue',

                data:
                  values,

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


  // =====================================================
  // LICENSE CHART
  // =====================================================

  private buildLicenseChart(

    data:
      Record<string, number>

  ): void {

    if (this.licenseChart) {

      this.licenseChart.destroy();

    }


    const labels =
      Object.keys(data)
        .map(month =>
          this.formatMonth(month)
        );


    const values =
      Object.values(data);


    const canvas =
      document.getElementById(
        'licenseChart'
      );


    if (!canvas) {

      return;

    }


    this.licenseChart =
      new Chart(

        canvas as HTMLCanvasElement,

        {

          type: 'pie',

          data: {

            labels,

            datasets: [

              {

                data:
                  values

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


  // =====================================================
  // COMPLAINT CHART
  // =====================================================

  private buildComplaintChart(

    data:
      Record<string, number>

  ): void {

    if (this.complaintChart) {

      this.complaintChart.destroy();

    }


    const labels =
      Object.keys(data)
        .map(month =>
          this.formatMonth(month)
        );


    const values =
      Object.values(data);


    const canvas =
      document.getElementById(
        'complaintChart'
      );


    if (!canvas) {

      return;

    }


    this.complaintChart =
      new Chart(

        canvas as HTMLCanvasElement,

        {

          type: 'bar',

          data: {

            labels,

            datasets: [

              {

                label:
                  'Complaints',

                data:
                  values,

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


  // =====================================================
  // EXPORT PDF
  // =====================================================

  exportPdf(): void {

    this.alertService.loading(
      'Preparing PDF report...'
    );


    this.analytics
      .exportPdf()
      .subscribe({

        next: (file: Blob) => {

          this.downloadFile(

            file,

            'Coastal-Conservation-Report.pdf'

          );


          this.alertService.close();


          this.alertService.success(

            'PDF Exported',

            'The analytics report has been downloaded successfully.'

          );

        },


        error: (error) => {

          console.error(
            'PDF EXPORT ERROR:',
            error
          );


          this.alertService.close();


          let message =
            'Unable to generate the PDF report.';


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
              'You are not authorized to export reports.';

          }


          this.alertService.error(

            'PDF Export Failed',

            message

          );

        }

      });

  }


  // =====================================================
  // EXPORT EXCEL
  // =====================================================

  exportExcel(): void {

    this.alertService.loading(
      'Preparing Excel report...'
    );


    this.analytics
      .exportExcel()
      .subscribe({

        next: (file: Blob) => {

          this.downloadFile(

            file,

            'Coastal-Conservation-Report.xlsx'

          );


          this.alertService.close();


          this.alertService.success(

            'Excel Exported',

            'The analytics report has been downloaded successfully.'

          );

        },


        error: (error) => {

          console.error(
            'EXCEL EXPORT ERROR:',
            error
          );


          this.alertService.close();


          let message =
            'Unable to generate the Excel report.';


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
              'You are not authorized to export reports.';

          }


          this.alertService.error(

            'Excel Export Failed',

            message

          );

        }

      });

  }


  // =====================================================
  // DOWNLOAD FILE
  // =====================================================

  private downloadFile(

    file:
      Blob,

    fileName:
      string

  ): void {

    const url =
      window.URL.createObjectURL(file);


    const anchor =
      document.createElement('a');


    anchor.href =
      url;


    anchor.download =
      fileName;


    document.body.appendChild(
      anchor
    );


    anchor.click();


    document.body.removeChild(
      anchor
    );


    window.URL.revokeObjectURL(
      url
    );

  }


  // =====================================================
  // DESTROY
  // =====================================================

  ngOnDestroy(): void {

    this.revenueChart?.destroy();

    this.licenseChart?.destroy();

    this.complaintChart?.destroy();

  }

}