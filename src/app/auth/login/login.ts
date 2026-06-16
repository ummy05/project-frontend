import { Component } from '@angular/core';

@Component({
  selector: 'app-login',
  imports: [],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
   menuOpen = false;

  showPassword = false;

  toggleMenu(): void {
    this.menuOpen = !this.menuOpen;
  }

  togglePassword(): void {
    this.showPassword = !this.showPassword;
  }

}
