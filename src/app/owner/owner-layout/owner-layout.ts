import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-owner-layout',
  imports: [CommonModule, 
  RouterModule,
  RouterOutlet,
  RouterLink,
  RouterLinkActive],
  templateUrl: './owner-layout.html',
  styleUrl: './owner-layout.css',
})
export class OwnerLayout {

sidebarOpen = false;

showLogoutModal = false;

latestNotifications:any[]=[];

  constructor(
   private auth:AuthService,
   private router:Router
  ){}

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
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
