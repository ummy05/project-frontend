import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-complaints',
  imports: [CommonModule,FormsModule],
  templateUrl: './complaints.html',
  styleUrl: './complaints.css',
})
export class Complaints {

  showViewModal = false;
  showResponseModal = false;

  selectedComplaint: any = null;

  complaints = [

    {
      id: 'CMP-001',
      reporter: 'John Smith',
      location: 'Nungwi Beach',
      category: 'Water Pollution',
      date: '24 Jun 2026',
      priority: 'High',
      status: 'Pending'
    },

    {
      id: 'CMP-002',
      reporter: 'Amina Omar',
      location: 'Paje Beach',
      category: 'Illegal Fishing',
      date: '23 Jun 2026',
      priority: 'Medium',
      status: 'Investigating'
    },

    {
      id: 'CMP-003',
      reporter: 'David James',
      location: 'Kendwa Beach',
      category: 'Waste Disposal',
      date: '22 Jun 2026',
      priority: 'Low',
      status: 'Resolved'
    }

  ];

  openView(complaint: any) {
    this.selectedComplaint = { ...complaint };
    this.showViewModal = true;
  }

  openResponse(complaint: any) {
    this.selectedComplaint = { ...complaint };
    this.showResponseModal = true;
  }

  closeModals() {
    this.showViewModal = false;
    this.showResponseModal = false;
  }

}
