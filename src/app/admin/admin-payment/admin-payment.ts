import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PaymentService } from '../../services/payment.service';

@Component({
  selector: 'app-admin-payment',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl:'./admin-payment.html',
  styleUrl:'./admin-payment.css'
})
export class AdminPayment implements OnInit{

  private paymentService=inject(PaymentService);

  constructor(private cdr:ChangeDetectorRef){}

  payments:any[]=[];

  filteredPayments:any[]=[];

  selectedPayment:any=null;

  loading=false;

  error='';

  search='';

  status='ALL';

  remarks='';

  showViewModal=false;

  showEditModal=false;

  totalRevenue=0;

  approvedCount=0;

  pendingCount=0;

  rejectedCount=0;

  ngOnInit(){

    this.loadPayments();

  }

  loadPayments(){

    this.loading=true;

    this.paymentService.getAll()

    .subscribe({

      next:(res)=>{

        this.payments=res;

        this.filteredPayments=res;

        this.loading=false;

        this.calculateSummary();

        this.cdr.detectChanges();

      },

      error:()=>{

        this.loading=false;

        this.error='Failed to load payments';

      }

    });

  }

  calculateSummary(){

    this.totalRevenue=0;

    this.approvedCount=0;

    this.pendingCount=0;

    this.rejectedCount=0;

    this.payments.forEach(payment=>{

      this.totalRevenue+=Number(payment.amount);

      if(payment.status==="APPROVED"){

        this.approvedCount++;

      }

      if(payment.status==="PENDING"){

        this.pendingCount++;

      }

      if(payment.status==="REJECTED"){

        this.rejectedCount++;

      }

    });

  }

  filterPayments(){

    this.filteredPayments=this.payments.filter(payment=>{

      const matchesSearch=

      payment.paymentNumber

      .toLowerCase()

      .includes(this.search.toLowerCase())

      ||

      payment.licenseNumber

      .toLowerCase()

      .includes(this.search.toLowerCase());

      const matchesStatus=

      this.status==="ALL"

      ||

      payment.status===this.status;

      return matchesSearch && matchesStatus;

    });

  }

  openView(payment:any){

    this.selectedPayment=payment;

    this.showViewModal=true;

  }

  openReview(payment:any){

    this.selectedPayment=payment;

    this.remarks='';

    this.showEditModal=true;

  }

  approve(){

    this.paymentService

    .approve(

      this.selectedPayment.id,

      this.remarks

    )

    .subscribe(()=>{

      this.closeModals();

      this.loadPayments();

    });

  }

  reject(){

    this.paymentService

    .reject(

      this.selectedPayment.id,

      this.remarks

    )

    .subscribe(()=>{

      this.closeModals();

      this.loadPayments();

    });

  }

  delete(payment:any){

    if(!confirm("Delete payment?")) return;

    this.paymentService

    .delete(payment.id)

    .subscribe(()=>{

      this.loadPayments();

    });

  }

  closeModals(){

    this.showViewModal=false;

    this.showEditModal=false;

  }

}