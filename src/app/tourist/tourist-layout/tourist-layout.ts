import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterModule, RouterOutlet } from "@angular/router";

@Component({
  selector: 'app-tourist-layout',
  imports: [
    RouterOutlet,
    RouterLinkActive,
    CommonModule,
    RouterModule,
    RouterLink],
  templateUrl: './tourist-layout.html',
  styleUrl: './tourist-layout.css',
})
export class TouristLayout {

  sidebarOpen = false;

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

}