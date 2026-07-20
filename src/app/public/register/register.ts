import { Component, inject } from '@angular/core';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterLink,
    RouterModule
  ],
  templateUrl: './register.html',
  styleUrl: './register.css'
})

export class Register {
  acceptedTerms=false;

  private authService = inject(AuthService);

  private router = inject(Router);

  showPassword=false;

  success = '';

  loading=false;

  error='';

  registerData={

    fullName:'',

    email:'',

    phoneNumber:'',

    password:'',

    age: 0,

    gender:'',

    address:'',

    role:''

  };

  togglePassword(){

    this.showPassword=!this.showPassword;

  }

  register() {

  if (this.loading) return;

  this.loading = true;
  this.error = '';
  this.success = '';

  this.authService.register(this.registerData).subscribe({

    next: (response: any) => {

  this.loading = false;

  this.success =
      typeof response === 'string'
      ? response
      : 'Registration completed successfully.';

  setTimeout(() => {

      this.router.navigateByUrl('/login');

  },1500);

},

    error: (err) => {

      this.loading = false;

      this.error =

        typeof err.error === 'string'
          ? err.error
          : err.error?.message || 'Registration failed.';

    }

  });

}
}