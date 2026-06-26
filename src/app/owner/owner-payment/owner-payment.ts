import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-owner-payment',
  imports: [CommonModule],
  templateUrl: './owner-payment.html',
  styleUrl: './owner-payment.css',
})
export class OwnerPayment {

  showPaymentModal = false;
  showReceiptModal = false;

  selectedPayment: any = null;

  payments = [

    {
      id: 'PAY-2026-001',
      license: 'Tourism License',
      amount: 'TZS 500,000',
      method: 'Mobile Money',
      date: '20 Jun 2026',
      status: 'Paid'
    },

    {
      id: 'PAY-2026-002',
      license: 'Boat Service License',
      amount: 'TZS 350,000',
      method: 'Bank Transfer',
      date: '15 Jun 2026',
      status: 'Pending'
    },

    {
      id: 'PAY-2026-003',
      license: 'Water Sports License',
      amount: 'TZS 450,000',
      method: 'Cash',
      date: '10 Jun 2026',
      status: 'Failed'
    }

  ];

  openReceipt(payment: any) {
    this.selectedPayment = payment;
    this.showReceiptModal = true;
  }

  closeModal() {
    this.showPaymentModal = false;
    this.showReceiptModal = false;
  }

}