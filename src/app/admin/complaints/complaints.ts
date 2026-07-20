import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ComplaintService } from '../../services/complaint.service';

@Component({
  selector: 'app-complaints',
  standalone:true,
  imports:[
    CommonModule,
    FormsModule
  ],
  templateUrl:'./complaints.html',
  styleUrl:'./complaints.css'
})

export class Complaints implements OnInit{

  private complaintService=inject(ComplaintService);


  constructor(private cdr:ChangeDetectorRef){}

  complaints:any[]=[];

  filteredComplaints:any[]=[];

  selectedComplaint:any;

  search='';

  status='ALL';

  response='';

  showViewModal=false;

  showResponseModal=false;

  total=0;

  pending=0;

  progress=0;

  resolved=0;

  ngOnInit(){

    this.load();

  }

  load(){

    this.complaintService

    .getAll()

    .subscribe({

      next:(data:any)=>{

        this.complaints=data;

        this.filteredComplaints=data;

        this.calculate();
        this.cdr.detectChanges();

      }

    });

  }

  calculate(){

    this.total=this.complaints.length;

    this.pending=this.complaints

      .filter(x=>x.status=='PENDING')

      .length;

    this.progress=this.complaints

      .filter(x=>x.status=='IN_PROGRESS')

      .length;

    this.resolved=this.complaints

      .filter(x=>x.status=='RESOLVED')

      .length;

  }

  filter(){

    this.filteredComplaints=this.complaints.filter(c=>{

      const text=

      c.complaintNumber.toLowerCase().includes(this.search.toLowerCase())

      ||

      c.title.toLowerCase().includes(this.search.toLowerCase())

      ||

      c.location.toLowerCase().includes(this.search.toLowerCase());

      const state=

      this.status=='ALL'

      ||

      c.status==this.status;

      return text && state;

    });

  }

  openView(c:any){

    this.selectedComplaint=c;

    this.showViewModal=true;

  }

  openResponse(c:any){

    this.selectedComplaint=c;

    this.response='';

    this.showResponseModal=true;

  }

  progressComplaint(){

    this.complaintService

    .progress(this.selectedComplaint.id)

    .subscribe(()=>{

      this.close();

      this.load();

    });

  }

  resolveComplaint(){

    this.complaintService

    .resolve(

      this.selectedComplaint.id,

      this.response

    )

    .subscribe(()=>{

      this.close();

      this.load();

    });

  }

  rejectComplaint(){

    this.complaintService

    .reject(

      this.selectedComplaint.id,

      this.response

    )

    .subscribe(()=>{

      this.close();

      this.load();

    });

  }

  delete(c:any){

    if(!confirm('Delete complaint?'))

    return;

    this.complaintService

    .delete(c.id)

    .subscribe(()=>{

      this.load();

    });

  }

  close(){

    this.showViewModal=false;

    this.showResponseModal=false;

  }

}