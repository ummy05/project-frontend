import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-my-licenses',
  imports: [CommonModule],
  templateUrl: './my-licenses.html',
  styleUrl: './my-licenses.css',
})
export class MyLicenses {

  showViewModal = false;
  selectedLicense: any = null;

  licenses = [

    {
      id: 'LIC-2026-001',
      type: 'Tourism License',
      business: 'Paje Beach Resort',
      issuedDate: '15 Jan 2026',
      expiryDate: '15 Jan 2027',
      status: 'Active'
    },

    {
      id: 'LIC-2026-002',
      type: 'Boat Service License',
      business: 'Blue Ocean Tours',
      issuedDate: '20 Feb 2026',
      expiryDate: '20 Feb 2027',
      status: 'Pending'
    },

    {
      id: 'LIC-2026-003',
      type: 'Water Sports License',
      business: 'Kendwa Water Sports',
      issuedDate: '10 Mar 2026',
      expiryDate: '10 Mar 2027',
      status: 'Expired'
    }

  ];

  openView(license: any) {
    this.selectedLicense = license;
    this.showViewModal = true;
  }

  closeModal() {
    this.showViewModal = false;
  }

}
