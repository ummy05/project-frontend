import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-licenses',
  imports: [CommonModule,FormsModule
  ],
  templateUrl: './licenses.html',
  styleUrl: './licenses.css',
})
export class Licenses {

  showAddModal = false;
  showViewModal = false;
  showEditModal = false;

  selectedLicense: any = null;

  licenses = [
    {
      id: 'LIC-2026-001',
      business: 'Paje Beach Resort',
      owner: 'Ali Hassan',
      type: 'Tourism License',
      date: '12 Jun 2026',
      status: 'Approved'
    },
    {
      id: 'LIC-2026-002',
      business: 'Nungwi Sea Foods',
      owner: 'Asha Omar',
      type: 'Fishing License',
      date: '14 Jun 2026',
      status: 'Pending'
    },
    {
      id: 'LIC-2026-003',
      business: 'Kendwa Water Sports',
      owner: 'John Salum',
      type: 'Water Activity License',
      date: '15 Jun 2026',
      status: 'Rejected'
    }
  ];

  openView(license: any) {
    this.selectedLicense = { ...license };
    this.showViewModal = true;
  }

  openEdit(license: any) {
    this.selectedLicense = { ...license };
    this.showEditModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showViewModal = false;
    this.showEditModal = false;
  }

}