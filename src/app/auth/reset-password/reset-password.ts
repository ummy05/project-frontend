import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-reset-password',
  imports: [CommonModule,FormsModule,RouterModule,RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
   private authService=inject(AuthService);

private router=inject(Router);

private route=inject(ActivatedRoute);

email='';

otp='';

newPassword='';

confirmPassword='';

loading=false;

error='';

ngOnInit(){

this.route.queryParams.subscribe(

params=>{

this.email=params['email'];

this.otp=params['otp'];

}

);

}

resetPassword(){

if(this.newPassword!==this.confirmPassword){

this.error="Passwords do not match.";

return;

}

this.loading=true;

this.authService.resetPassword({

email:this.email,

otp:this.otp,

newPassword:this.newPassword

}).subscribe({

next:()=>{

alert("Password changed successfully.");

this.router.navigate(['/login']);

},

error:(err)=>{

this.loading=false;

this.error=err.error;

}

});

}
}
