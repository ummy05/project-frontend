import { Component, inject } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { ActivatedRoute, Router, RouterLink, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-otp',
  imports: [CommonModule,FormsModule,RouterLink,RouterModule],
  templateUrl: './verify-otp.html',
  styleUrl: './verify-otp.css',
})
export class VerifyOtp {
   private authService=inject(AuthService);

  private router=inject(Router);

  private route=inject(ActivatedRoute);

  email='';

  otp='';

  loading=false;

  error='';

  ngOnInit(){

    this.route.queryParams.subscribe(

      params=>{

        this.email=params['email'];

      }

    );

  }

  verifyOtp(){

    this.loading=true;

    this.authService.verifyOtp({

      email:this.email,

      otp:this.otp

    }).subscribe({

      next:()=>{

        this.router.navigate(

          ['/reset-password'],

          {

            queryParams:{

              email:this.email,

              otp:this.otp

            }

          }

        );

      },

      error:(err)=>{

        this.loading=false;

        this.error=err.error;

      }

    });

  }

}
