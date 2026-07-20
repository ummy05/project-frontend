import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";
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
private authService = inject(AuthService);

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }


  
}
