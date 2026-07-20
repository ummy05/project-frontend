import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [

    CommonModule,

    FormsModule,

    RouterLink

  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(AuthService);

  private router = inject(Router);

  showPassword = false;

  loading = false;

  errorMessage = '';

  loginData = {

    email: '',

    password: ''

  };

  togglePassword(){

    this.showPassword = !this.showPassword;

  }

  login(){

    this.loading = true;

    this.errorMessage = '';

    this.authService.login(

      this.loginData

    ).subscribe({

      next: (response)=>{

        this.loading = false;

        switch(response.role){

          case 'ADMIN':

            this.router.navigate(['/admin']);

            break;

          case 'BUSINESS_OWNER':

            this.router.navigate(['/owner']);

            break;

          case 'TOURIST':

            this.router.navigate(['/tourist']);

            break;

          default:

            this.router.navigate(['/']);

        }

      },

      error: (err)=>{

        this.loading = false;

        this.errorMessage =

        err.error || 'Invalid email or password';

      }

    });

  }

}