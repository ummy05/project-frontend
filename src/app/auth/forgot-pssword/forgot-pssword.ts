import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink, RouterModule } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-forgot-pssword',
  imports: [CommonModule,FormsModule,RouterLink,RouterModule],
  templateUrl: './forgot-pssword.html',
  styleUrl: './forgot-pssword.css',
})
export class ForgotPssword {

  email = '';
  emailSent = false;
  loading=false;
   success='';
   error='';

  private authService = inject(AuthService);

private router = inject(Router);

  sendResetLink(){

this.loading=true;
this.error='';
this.success='';

this.authService.forgotPassword({

email:this.email

}).subscribe({

next: () => {

    this.emailSent = true;

    setTimeout(() => {

        this.router.navigate(

            ['/verify-otp'],

            {

              queryParams:{

                email:this.email

              }

            }

        );

    },1000);

},

error:(err)=>{

this.loading=false;

this.error=

typeof err.error==='string'
? err.error
: err.error?.message ||
"Unable to send verification code.";

}

});

}

}
