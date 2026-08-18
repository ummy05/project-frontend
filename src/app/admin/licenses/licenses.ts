import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { LicenseService } from '../../services/license.service';
import { License } from '../../models/license.model';

@Component({

selector:'app-licenses',

standalone:true,

imports:[CommonModule,FormsModule],

templateUrl:'./licenses.html',

styleUrl:'./licenses.css'

})

export class Licenses implements OnInit{
    showRejectModal = false;

rejectReason = '';

licenseToRejectId!: number;

private service=inject(LicenseService);

constructor(private cdr:ChangeDetectorRef){}

licenses:License[]=[];

filteredLicenses:License[]=[];

search='';

status='';

loading=false;

selectedLicense!:License;

showViewModal=false;

showEditModal=false;

showAddModal=false;

ngOnInit(){

this.loadLicenses();

}

loadLicenses(){

this.loading=true;

this.service.getAll().subscribe({

next:(res)=>{

this.licenses=res;

this.filteredLicenses=res;

this.cdr.detectChanges();

this.loading=false;

},

error:()=>{

this.loading=false;

}

});

}

filter(){

this.filteredLicenses=this.licenses.filter(l=>{

const searchMatch=

l.businessName.toLowerCase().includes(

this.search.toLowerCase()

)

||

l.ownerName.toLowerCase().includes(

this.search.toLowerCase()

)

||

l.licenseNumber.toLowerCase().includes(

this.search.toLowerCase()

);

const statusMatch=

!this.status||

l.status==this.status;

return searchMatch&&statusMatch;

});

}

openView(item:License){

this.selectedLicense=item;

this.showViewModal=true;

}

openEdit(item:License){

this.selectedLicense={...item};

this.showEditModal=true;

}

approve(id:number){

this.service.approve(id).subscribe(()=>{

this.loadLicenses();

});

}

openReject(id:number){

this.licenseToRejectId = id;

this.rejectReason = '';

this.showRejectModal = true;

}

confirmReject(){

if(!this.rejectReason.trim()){

alert("Please enter rejection reason.");

return;

}

this.service

.reject(

this.licenseToRejectId,

this.rejectReason

)

.subscribe({

next:()=>{

this.showRejectModal = false;

this.loadLicenses();

},

error:()=>{

alert("Failed to reject license.");

}

});

}

cancelReject(){

this.showRejectModal = false;

this.rejectReason = '';

}

delete(id:number){

if(confirm('Delete this license?')){

this.service.delete(id).subscribe(()=>{

this.loadLicenses();

});

}

}

closeModals(){

this.showAddModal=false;

this.showViewModal=false;

this.showEditModal=false;

}

}