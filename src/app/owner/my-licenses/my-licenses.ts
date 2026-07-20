import { CommonModule, DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LicenseService } from '../../services/license.service';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-licenses',
  imports: [CommonModule,FormsModule,DatePipe],
  templateUrl: './my-licenses.html',
  styleUrl: './my-licenses.css',
})
export class MyLicenses implements OnInit {

  showViewModal = false;
  selectedLicense: any = null;
  licenses:any[]=[];
  filteredLicenses:any[]=[];
  search='';
  status='ALL';

  constructor(
    private licenseService:LicenseService,
    private cdr:ChangeDetectorRef
  ){}
  
   ngOnInit():void{

   this.loadLicenses();

  }

  loadLicenses(){

  this.licenseService

  .myLicenses()

  .subscribe({

    next:(res)=>{

      console.log("MY LICENSES =",res);

      this.licenses=res;

      this.filteredLicenses=res;
      this.cdr.detectChanges();

    },

    error:(err)=>{

      console.log(err);

    }

  });

}

  openView(license: any) {
    this.selectedLicense = license;
    this.showViewModal = true;
  }

  filterLicenses(){

this.filteredLicenses=

this.licenses.filter(l=>{

const matchesSearch=

!this.search ||

l.businessName

.toLowerCase()

.includes(this.search.toLowerCase())

||

l.licenseNumber

.toLowerCase()

.includes(this.search.toLowerCase());

const matchesStatus=

this.status==='ALL'

||

l.status===this.status;

return matchesSearch && matchesStatus;

});

}

  closeModal() {
    this.showViewModal = false;
  }

  

}

 