import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { AnalyticsService } from '../../services/analytics.service';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin-dashboard.html',
  styleUrl: './admin-dashboard.css',
})
export class AdminDashboard implements OnInit {

  constructor(
    private analytics: AnalyticsService,
    
    private cdr:ChangeDetectorRef
  ){}

  dashboard: any = {};

  revenueChart: any;
  licenseChart: any;
  complaintChart: any;
  overviewChart: any;

  today = new Date();

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard() {

    this.analytics.adminDashboard().subscribe({

      next: (res) => {

        this.dashboard = res;

        this.loadRevenue();
        this.loadLicenses();
        this.loadComplaints();
        this.loadOverview();
        this.cdr.detectChanges();

      }

    });

  }

  loadRevenue() {

    this.analytics.monthlyRevenue().subscribe(data => {

      const labels = Object.keys(data);
      const values = Object.values(data);

      if (this.revenueChart) {
        this.revenueChart.destroy();
      }

      this.revenueChart = new Chart("revenueChart", {

        type: 'line',

        data: {

          labels,

          datasets: [{

            label: 'Revenue',

            data: values,

            fill: true,

            tension: .4,

            borderWidth: 3

          }]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              display: false

            }
            

          }
          

        }
        

      });
      this.cdr.detectChanges();

    });

  }

  loadLicenses() {

    this.analytics.monthlyLicenses().subscribe(data => {

      const labels = Object.keys(data);
      const values = Object.values(data);

      if (this.licenseChart) {
        this.licenseChart.destroy();
      }

      this.licenseChart = new Chart("licenseChart", {

        type: 'bar',

        data: {

          labels,

          datasets: [{

            data: values

          }]

        },

        options: {

          responsive: true,

          plugins: {

            legend: {

              display: false

            }

          }

        }

      });
      this.cdr.detectChanges();

    });

  }

  loadComplaints() {

    this.analytics.reports().subscribe(res => {

      if (this.complaintChart) {
        this.complaintChart.destroy();
      }

      this.complaintChart = new Chart("complaintChart", {

        type: 'doughnut',

        data: {

          labels: [

            'Resolved',

            'Pending',

            'Rejected'

          ],

          datasets: [{

            data: [

              res.resolvedComplaints,

              res.pendingComplaints,

              res.rejectedComplaints

            ]

          }]

        },

        options: {

          responsive: true

        }

      });
      this.cdr.detectChanges();

    });

  }

  loadOverview() {

    this.analytics.reports().subscribe(res => {

      if (this.overviewChart) {
        this.overviewChart.destroy();
      }

      this.overviewChart = new Chart("overviewChart", {

        type: 'pie',

        data: {

          labels: [

            'Approved Licenses',

            'Pending Licenses',

            'Resolved Complaints',

            'Approved Payments'

          ],

          datasets: [{

            data: [

              res.approvedLicenses,

              res.pendingLicenses,

              res.resolvedComplaints,

              res.approvedPayments

            ]

          }]

        },

        options: {

          responsive: true

        }

      });
      this.cdr.detectChanges();

    });

  }

}