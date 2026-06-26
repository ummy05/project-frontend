import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-payment',
  imports: [CommonModule,FormsModule],
  templateUrl: './admin-payment.html',
  styleUrl: './admin-payment.css',
})
export class AdminPayment {

  showAddModal = false;
  showViewModal = false;
  showEditModal = false;

  selectedPayment: any = null;

  payments = [
    {
      id: 'PAY-001',
      payer: 'Paje Beach Resort',
      amount: 'TZS 500,000',
      method: 'Mobile Money',
      date: '25 Jun 2026',
      status: 'Completed'
    },

    {
      id: 'PAY-002',
      payer: 'Kendwa Watersport',
      amount: 'TZS 350,000',
      method: 'Bank Transfer',
      date: '24 Jun 2026',
      status: 'Pending'
    },

    {
      id: 'PAY-003',
      payer: 'Nungwi Sea Foods',
      amount: 'TZS 200,000',
      method: 'Cash',
      date: '23 Jun 2026',
      status: 'Failed'
    }
  ];

  openView(payment: any) {
    this.selectedPayment = { ...payment };
    this.showViewModal = true;
  }

  openEdit(payment: any) {
    this.selectedPayment = { ...payment };
    this.showEditModal = true;
  }

  closeModals() {
    this.showAddModal = false;
    this.showViewModal = false;
    this.showEditModal = false;
  }

}