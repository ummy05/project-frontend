import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-tourist-dashboard',
  imports: [CommonModule],
  templateUrl: './tourist-dashboard.html',
  styleUrl: './tourist-dashboard.css',
})
export class TouristDashboard {

  reports = [
    {
      title: 'Plastic Waste Report',
      location: 'Nungwi Beach',
      status: 'Resolved',
      date: '24 Jun 2026'
    },

    {
      title: 'Water Pollution',
      location: 'Paje Beach',
      status: 'Under Review',
      date: '20 Jun 2026'
    },

    {
      title: 'Illegal Fishing Activity',
      location: 'Kendwa Beach',
      status: 'Pending',
      date: '18 Jun 2026'
    }
  ];

}