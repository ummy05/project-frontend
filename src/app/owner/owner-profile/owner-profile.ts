import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-owner-profile',
  imports: [CommonModule,FormsModule],
  standalone: true,
  templateUrl: './owner-profile.html',
  styleUrl: './owner-profile.css',
})
export class OwnerProfile {

  selectedImage = '/img/businessman.jpg';

  user = {
    fullName: 'Ali Hassan',
    email: 'alihassan@gmail.com',
    phone: '+255 712 345 678',
    gender: 'Male',
    address: 'Paje, Zanzibar',

    businessName: 'Paje Beach Resort',
    businessType: 'Tourism Business',
    businessLocation: 'Paje Beach'
  };

  onImageChange(event: any) {

    const file = event.target.files[0];

    if(file){
      this.selectedImage = URL.createObjectURL(file);
    }

  }

}
