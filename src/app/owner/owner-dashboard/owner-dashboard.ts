import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-dashboard',
  imports: [CommonModule],
  templateUrl: './owner-dashboard.html',
  styleUrl: './owner-dashboard.css',
})
export class OwnerDashboard {

  activities = [
    {
      icon: 'fas fa-file-signature',
      title: 'License application submitted',
      time: '2 hours ago'
    },
    {
      icon: 'fas fa-credit-card',
      title: 'Payment of TZS 350,000 completed',
      time: 'Yesterday'
    },
    {
      icon: 'fas fa-check-circle',
      title: 'Tourism license approved',
      time: '3 days ago'
    }
  ];

}
