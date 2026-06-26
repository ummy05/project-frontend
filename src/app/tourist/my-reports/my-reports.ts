import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-reports',
  imports: [CommonModule],
  templateUrl: './my-reports.html',
  styleUrl: './my-reports.css',
})
export class MyReports {

  showViewModal = false;
  selectedReport: any = null;

  reports = [

    {
      id: 'REP-001',
      issue: 'Beach Pollution',
      location: 'Nungwi Beach',
      date: '24 Jun 2026',
      priority: 'High',
      status: 'Resolved'
    },

    {
      id: 'REP-002',
      issue: 'Illegal Fishing',
      location: 'Paje Beach',
      date: '20 Jun 2026',
      priority: 'Medium',
      status: 'Under Review'
    },

    {
      id: 'REP-003',
      issue: 'Oil Spill',
      location: 'Kendwa Beach',
      date: '18 Jun 2026',
      priority: 'Critical',
      status: 'Pending'
    }

  ];

  viewReport(report: any) {
    this.selectedReport = report;
    this.showViewModal = true;
  }

  closeModal() {
    this.showViewModal = false;
  }

}
