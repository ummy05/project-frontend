import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';

import { InspectionService } from '../../services/inspection.service';
import { Inspection } from '../../models/inspection.model';


@Component({

selector:'app-inspections',

standalone:true,

imports:[CommonModule,FormsModule],

templateUrl:'./inspections.html',

styleUrl:'./inspections.css'

})

export class Inspections implements OnInit{

private service=inject(InspectionService);
constructor(private cdr:ChangeDetectorRef){}

inspections:Inspection[]=[];

filteredInspections:Inspection[]=[];

selected!:Inspection;

showModal=false;

search='';

status='';

ngOnInit(){

this.load();

}

load(){

this.service.getAll().subscribe(res=>{

this.inspections=res;

this.filteredInspections=res;
this.cdr.detectChanges();

});

}

filter(){

this.filteredInspections=this.inspections.filter(i=>{

const searchMatch=

i.inspectionNumber

.toLowerCase()

.includes(this.search.toLowerCase());

const statusMatch=

!this.status||

i.status==this.status;

return searchMatch&&statusMatch;

});

}

view(item:Inspection){

this.selected=item;

this.showModal=true;

}

passInspection(id:number){

this.service.pass(id)

.subscribe(()=>{

this.load();

});

}

failInspection(id:number){

this.service.fail(id)

.subscribe(()=>{

this.load();

});

}

deleteInspection(id:number){

if(confirm('Delete inspection?')){

this.service.delete(id)

.subscribe(()=>{

this.load();

});

}

}

}