import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-pssword',
  imports: [CommonModule,FormsModule,RouterLink],
  templateUrl: './forgot-pssword.html',
  styleUrl: './forgot-pssword.css',
})
export class ForgotPssword {

  email = '';
  emailSent = false;

  sendResetLink() {
    this.emailSent = true;
  }

}
