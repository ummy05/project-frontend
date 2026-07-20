import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-admin-notifications',
  standalone:true,
  imports:[
    CommonModule,
    DatePipe
  ],
  templateUrl:'./admin-notifications.html',
  styleUrl:'./admin-notifications.css'
})
export class AdminNotifications implements OnInit{

  constructor(
    private notificationService:NotificationService,
    private cdr:ChangeDetectorRef
  ){}

  notifications:any[]=[];

  summary={

    total:0,

    unread:0,

    alerts:0

  };

  ngOnInit(){

    this.loadNotifications();

  }

  loadNotifications(){

    this.notificationService

    .getAll()

    .subscribe({

      next:(res)=>{

        this.notifications=res;

        this.calculateSummary();
        
        this.cdr.detectChanges();


      }

    });

  }

  calculateSummary(){

    this.summary.total=this.notifications.length;

    this.summary.unread=

    this.notifications.filter(

      x=>!x.read

    ).length;

    this.summary.alerts=

    this.notifications.filter(

      x=>x.type=="ALERT"

    ).length;

  }

  markAll(){

    this.notificationService

    .markAllRead()

    .subscribe(()=>{

      this.loadNotifications();

    });

  }

  markRead(notification:any){

    if(notification.read){

      return;

    }

    this.notificationService

    .markRead(notification.id)

    .subscribe(()=>{

      this.loadNotifications();

    });

  }

  delete(notification:any){

    if(!confirm("Delete notification?")){

      return;

    }

    this.notificationService

    .delete(notification.id)

    .subscribe(()=>{

      this.loadNotifications();

    });

  }

}