import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-notifications',
  imports: [CommonModule],
  templateUrl: './owner-notifications.html',
  styleUrl: './owner-notifications.css',
})
export class OwnerNotifications {

  notifications = [

    {
      title: 'License Approved',
      message: 'Your Tourism License application has been approved successfully.',
      time: '10 minutes ago',
      type: 'success',
      unread: true
    },

    {
      title: 'Payment Received',
      message: 'Payment of TZS 500,000 has been received successfully.',
      time: '1 hour ago',
      type: 'payment',
      unread: true
    },

    {
      title: 'License Renewal Reminder',
      message: 'Your Boat Service License will expire in 15 days.',
      time: 'Today',
      type: 'warning',
      unread: false
    },

    {
      title: 'Application Under Review',
      message: 'Your Water Sports License application is currently under review.',
      time: 'Yesterday',
      type: 'info',
      unread: false
    },

    {
      title: 'System Announcement',
      message: 'System maintenance is scheduled for Sunday from 10:00 PM.',
      time: '2 days ago',
      type: 'system',
      unread: false
    }

  ];

}
