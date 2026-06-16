import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-login',
  imports: [RouterLink],
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
