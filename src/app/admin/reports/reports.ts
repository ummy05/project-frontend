import { CommonModule, DecimalPipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AnalyticsService } from '../../services/analytics.service';

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
export class Reports implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    private cdr:ChangeDetectorRef
  ) {}

  report: any = {};

  fromDate = '';

  toDate = '';

  performance: any[] = [];

  revenueChart: any;

  licenseChart: any;

  complaintChart: any;

  ngOnInit(): void {

    this.loadReport();

    this.loadRevenueChart();

    this.loadLicenseChart();

    this.loadComplaintChart();

  }

  //================================================

  loadReport() {

    this.analytics.reports().subscribe({

      next: (res) => {

        this.report = res;

        this.performance = [

          {

            month: 'Approved',

            revenue: res.totalRevenue,

            licenses: res.approvedLicenses,

            complaints: res.resolvedComplaints

          },

          {

            month: 'Pending',

            revenue: '-',

            licenses: res.pendingLicenses,

            complaints: res.pendingComplaints

          },

          {

            month: 'Rejected',

            revenue: '-',

            licenses: res.rejectedLicenses,

            complaints: res.rejectedComplaints

          }

        ];
        this.cdr.detectChanges();

      }
      

    });

  }

  //================================================

  loadRevenueChart() {

    this.analytics.monthlyRevenue().subscribe({

      next: (data: any) => {

        const labels = Object.keys(data);

        const values = Object.values(data);

        if (this.revenueChart) {

          this.revenueChart.destroy();

        }

        this.revenueChart = new Chart("revenueChart", {

          type: 'line',

          data: {

            labels,

            datasets: [

              {

                label: 'Revenue',

                data: values,

                fill: true,

                tension: .4,

                borderWidth: 3

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                display: false

              }

            }

          }

        });
        this.cdr.detectChanges();

      }

    });

  }

  //================================================

  loadLicenseChart() {

    this.analytics.reports().subscribe({

      next: (res: any) => {

        if (this.licenseChart) {

          this.licenseChart.destroy();

        }

        this.licenseChart = new Chart("licenseChart", {

          type: 'pie',

          data: {

            labels: [

              'Approved',

              'Pending',

              'Rejected'

            ],

            datasets: [

              {

                data: [

                  res.approvedLicenses,

                  res.pendingLicenses,

                  res.rejectedLicenses

                ]

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false

          }

        });
        this.cdr.detectChanges();

      }

    });

  }

  //================================================

  loadComplaintChart() {

    this.analytics.reports().subscribe({

      next: (res: any) => {

        if (this.complaintChart) {

          this.complaintChart.destroy();

        }

        this.complaintChart = new Chart("complaintChart", {

          type: 'bar',

          data: {

            labels: [

              'Resolved',

              'Pending',

              'Rejected'

            ],

            datasets: [

              {

                data: [

                  res.resolvedComplaints,

                  res.pendingComplaints,

                  res.rejectedComplaints

                ]

              }

            ]

          },

          options: {

            responsive: true,

            maintainAspectRatio: false,

            plugins: {

              legend: {

                display: false

              }

            }

          }

        });
        this.cdr.detectChanges();

      }

    });

  }

  //================================================

  generateReport() {

    this.loadReport();

    this.loadRevenueChart();

    this.loadLicenseChart();

    this.loadComplaintChart();

  }

  exportPdf() {

  this.analytics.exportPdf().subscribe({

    next: (file: Blob) => {

      const url = window.URL.createObjectURL(file);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'Coastal-Conservation-Report.pdf';

      a.click();

      window.URL.revokeObjectURL(url);

    }

  });

}

  exportExcel() {

  this.analytics.exportExcel().subscribe({

    next: (file: Blob) => {

      const url = window.URL.createObjectURL(file);

      const a = document.createElement('a');

      a.href = url;

      a.download = 'Coastal-Conservation-Report.xlsx';

      a.click();

      window.URL.revokeObjectURL(url);

    }

  });

}

}