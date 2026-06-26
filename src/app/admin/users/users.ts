import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users {
  showViewModal = false;
  showEditModal = false;
  showAddModal = false;

  selectedUser: any = null;

  users = [

    {
      id: 1,
      fullName: 'Ali Hassan',
      email: 'ali@gmail.com',
      phone: '+255712345678',
      role: 'Business Owner',
      status: 'Active'
    },

    {
      id: 2,
      fullName: 'John Smith',
      email: 'john@gmail.com',
      phone: '+255744567890',
      role: 'Tourist',
      status: 'Active'
    },

    {
      id: 3,
      fullName: 'Amina Omar',
      email: 'amina@gmail.com',
      phone: '+255755678901',
      role: 'Business Owner',
      status: 'Blocked'
    }

  ];

  openView(user: any) {
    this.selectedUser = { ...user };
    this.showViewModal = true;
  }

  openEdit(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeModals() {
    this.showViewModal = false;
    this.showEditModal = false;
    this.showAddModal = false;
  }

}
