import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-apply-license',
  imports: [CommonModule],
  templateUrl: './apply-license.html',
  styleUrl: './apply-license.css',
})
export class ApplyLicense {

  selectedFileName = '';

  onFileSelected(event: any) {

    if (event.target.files.length > 0) {
      this.selectedFileName = event.target.files[0].name;
    }

  }

}