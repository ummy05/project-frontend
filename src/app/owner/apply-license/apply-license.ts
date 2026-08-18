import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-apply-license',
  imports: [CommonModule,FormsModule],
  templateUrl: './apply-license.html',
  styleUrl: './apply-license.css',
})
export class ApplyLicense implements OnInit{

selectedFileName='';

loading=false;

fee=0;

application={

businessName:'',

phoneNumber:'',

licenseType:'',

district:'',

location:'',

durationMonths:12

};

accepted=false;

constructor(

private licenseService:LicenseService,

private auth:AuthService,

private router:Router

){}


  onFileSelected(event: any) {

    if (event.target.files.length > 0) {
      this.selectedFileName = event.target.files[0].name;
    }

  }

  ngOnInit(){

this.auth

.getProfile()

.subscribe(res=>{

this.application.phoneNumber=res.phoneNumber;

});

}

calculateFee(){

if(

!this.application.licenseType ||

!this.application.durationMonths

){

return;

}

this.licenseService

.calculateFee(

this.application.licenseType,

this.application.durationMonths

)

.subscribe(res=>{

this.fee=res;

});

}

submit(){

if(!this.accepted){

alert(

'Please accept terms and conditions.'

);

return;

}

const payload={

...this.application,

licenseFee:this.fee

};

this.loading=true;

this.licenseService

.apply(payload)

.subscribe({

next:(license)=>{

this.loading=false;

this.router.navigate(

['/owner/payments'],

{

state:{

license:license

}

}

);

},

error:()=>{

this.loading=false;

alert(

'Application failed.'

);

}

});

}

}