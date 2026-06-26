import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-my-profile',
  imports: [CommonModule,FormsModule],
  templateUrl: './my-profile.html',
  styleUrl: './my-profile.css',
})
export class MyProfile {

  selectedImage = '/img/tourist.jpg';

  user = {
    fullName: 'John Smith',
    email: 'johnsmith@gmail.com',
    phone: '+255 777 123 456',
    gender: 'Male',
    nationality: 'United Kingdom',
    passportNumber: 'UK12345678',
    currentLocation: 'Nungwi, Zanzibar'
  };

  onImageChange(event: any) {

    const file = event.target.files[0];

    if(file){
      this.selectedImage = URL.createObjectURL(file);
    }

  }

}
