import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { UserService } from '../../services/user.service';

@Component({
  selector: 'app-users',
  imports: [CommonModule,FormsModule],
  templateUrl: './users.html',
  styleUrl: './users.css',
})
export class Users implements OnInit {
  showViewModal = false;
  showEditModal = false;
  showAddModal = false;
  selectedUser: any = null;
  users:any[]=[];
  filteredUsers:any[]=[];
  search='';
  role='ALL';
  summary:any={};

   newUser:any={

fullName:'',

email:'',

phoneNumber:'',

password:'',

age:null,

gender:'Male',

address:'',

profileImage:'',

role:'BUSINESS_OWNER',

enabled:true

};

  constructor(
   private userService:UserService,
   private cdr:ChangeDetectorRef
  ){}


  ngOnInit(): void {

   this.loadUsers();

}
   
   loadUsers(){

   this.userService.getAll()

   .subscribe({

      next:(res)=>{

         this.users=res;

         this.filteredUsers=res;

         this.calculateSummary();

         this.cdr.detectChanges();

      }

   });

}  

   calculateSummary(){

   this.summary.total=this.users.length;

   this.summary.businessOwners=

   this.users.filter(

      x=>x.role=='BUSINESS_OWNER'

   ).length;

   this.summary.tourists=

   this.users.filter(

      x=>x.role=='TOURIST'

   ).length;

   this.summary.active=

   this.users.filter(

      x=>x.enabled

   ).length;

}

filterUsers(){

   this.filteredUsers=this.users.filter(u=>{

      const matchesSearch=

      !this.search ||

      u.fullName

      .toLowerCase()

      .includes(this.search.toLowerCase())

      ||

      u.email

      .toLowerCase()

      .includes(this.search.toLowerCase());

      const matchesRole=

      this.role==='ALL'

      ||

      u.role===this.role;

      return matchesSearch && matchesRole;

   });

}

delete(user:any){

if(!confirm(

'Delete this user?'

)){

return;

}

this.userService.delete(user.id)

.subscribe(()=>{

this.loadUsers();

});

}

changeStatus(user:any){

this.userService

.changeStatus(user.id)

.subscribe(()=>{

this.loadUsers();

});

}

updateUser(){

this.userService

.update(

this.selectedUser.id,

this.selectedUser

)

.subscribe({

next:()=>{

this.closeModals();

this.loadUsers();

}

});

}

saveUser(){

this.userService

.create(this.newUser)

.subscribe({

next:()=>{

this.closeModals();

this.loadUsers();

this.newUser={

fullName:'',

email:'',

phoneNumber:'',

password:'',

age:null,

gender:'Male',

address:'',

profileImage:'',

role:'BUSINESS_OWNER',

enabled:true

};

},

error:(err)=>{

alert(err.error);

}

});

}

  openView(user: any) {
    this.selectedUser = { ...user };
    this.showViewModal = true;
  }

  openEdit(user: any) {
    this.selectedUser = { ...user };
    this.showEditModal = true;
  }

  closeModals(){

this.showViewModal=false;

this.showEditModal=false;

this.showAddModal=false;

this.newUser={

fullName:'',

email:'',

phoneNumber:'',

password:'',

age:null,

gender:'Male',

address:'',

profileImage:'',

role:'BUSINESS_OWNER',

enabled:true

};

}

}
