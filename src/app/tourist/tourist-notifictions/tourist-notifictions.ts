import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tourist-notifictions',
  imports: [CommonModule,FormsModule],
  templateUrl: './tourist-notifictions.html',
  styleUrl: './tourist-notifictions.css',
})
export class TouristNotifictions {

  notifications = [

    {
      title: 'Report Resolved',
      message: 'Your Beach Pollution report at Nungwi Beach has been resolved.',
      time: '10 minutes ago',
      type: 'success',
      unread: true
    },

    {
      title: 'Report Under Review',
      message: 'Your Illegal Fishing report is currently under review.',
      time: '2 hours ago',
      type: 'review',
      unread: true
    },

    {
      title: 'Environmental Alert',
      message: 'High tide warning issued for some coastal areas.',
      time: 'Today',
      type: 'alert',
      unread: false
    },

    {
      title: 'System Announcement',
      message: 'System maintenance scheduled on Sunday at 10 PM.',
      time: 'Yesterday',
      type: 'system',
      unread: false
    },

    {
      title: 'Thank You',
      message: 'Thank you for contributing to coastal conservation.',
      time: '2 days ago',
      type: 'thanks',
      unread: false
    }

  ];

}
