import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../services/auth.service';
import { UserService } from '../../services/user.service';
import { NotificationService } from '../../services/notification.service';
import { filter } from 'rxjs';

@Component({
  selector: 'app-admin-layout',
  standalone: true,
  imports: [RouterOutlet,CommonModule,RouterLinkActive,RouterLink,RouterModule],
  templateUrl: './admin-layout.html',
  styleUrl: './admin-layout.css',
})
export class AdminLayout implements OnInit{
  
  sidebarOpen = false;

  sidebarCollapsed = false;

  profile:any={};

  unreadCount = 0;
  showNotifications=false;

  showLogoutModal = false;

latestNotifications:any[]=[];

  constructor(

    private auth:AuthService,

    private router:Router,

    private notificationService:NotificationService,

    private cdr:ChangeDetectorRef

  ){

    // Close sidebar automatically on mobile after navigation
    this.router.events

    .pipe(

      filter(event => event instanceof NavigationEnd)

    )

    .subscribe(()=>{

      if(window.innerWidth < 992){

        this.sidebarOpen = false;

      }

    });

  }

  ngOnInit(){

    this.loadProfile();

    this.loadUnread();

    this.loadNotifications();

  }

  toggleNotifications(){

this.showNotifications=

!this.showNotifications;

}

openNotification(notification:any){

if(!notification.read){

this.notificationService

.markRead(notification.id)

.subscribe(()=>{

this.loadNotifications();

});

}

this.showNotifications=false;

this.router.navigate(

['/admin/notifications']

);

}

markAllRead(){

this.notificationService

.markAllRead()

.subscribe(()=>{

this.loadNotifications();

});

}

  loadProfile(){

    this.auth.getProfile()

    .subscribe({

      next:(res)=>{

        this.profile = res;
        this.cdr.detectChanges();

      }

    });

  }

  loadUnread(){

  this.notificationService
    .unreadCount()
    .subscribe({

      next:(count)=>{

        console.log("Unread Count:", count);

        this.unreadCount = Number(count);

        this.cdr.detectChanges();

      },

      error:(err)=>{
        console.log(err);
      }

    });

}

  loadNotifications(){

this.notificationService

.getAll()

.subscribe({

next:(res)=>{

this.latestNotifications=res.slice(0,5);

this.loadUnread();

this.cdr.detectChanges();

}

});

}

  toggleSidebar(){

    if(window.innerWidth < 992){

      this.sidebarOpen = !this.sidebarOpen;

    }else{

      this.sidebarCollapsed = !this.sidebarCollapsed;

    }

  }

  logout(){

  this.showLogoutModal = true;

}

confirmLogout(){

  this.showLogoutModal = false;

  this.auth.logout();

  this.router.navigate(['/login']);

}

}