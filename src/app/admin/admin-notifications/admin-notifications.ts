import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-notifications',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-notifications.html',
  styleUrl: './admin-notifications.css',
})
export class AdminNotifications {

  notifications = [

    {
      title: 'New License Application',
      message: 'Paje Beach Resort submitted a new license application.',
      time: '5 minutes ago',
      type: 'license',
      unread: true
    },

    {
      title: 'New Complaint Received',
      message: 'Water pollution complaint reported at Nungwi Beach.',
      time: '20 minutes ago',
      type: 'complaint',
      unread: true
    },

    {
      title: 'Payment Completed',
      message: 'Payment of TZS 450,000 has been successfully completed.',
      time: '1 hour ago',
      type: 'payment',
      unread: false
    },

    {
      title: 'System Alert',
      message: 'High erosion risk detected at Kendwa Beach.',
      time: '2 hours ago',
      type: 'alert',
      unread: false
    },

    {
      title: 'User Registration',
      message: 'A new business owner account has been created.',
      time: 'Yesterday',
      type: 'user',
      unread: false
    }

  ];

}
