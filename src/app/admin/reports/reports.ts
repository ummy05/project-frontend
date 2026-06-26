import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-reports',
  imports: [CommonModule],
  templateUrl: './reports.html',
  styleUrl: './reports.css',
})
export class Reports {


  performance = [
    {
      month: 'January',
      revenue: 'TZS 3,200,000',
      licenses: 32,
      complaints: 14
    },
    {
      month: 'February',
      revenue: 'TZS 4,100,000',
      licenses: 41,
      complaints: 10
    },
    {
      month: 'March',
      revenue: 'TZS 5,300,000',
      licenses: 56,
      complaints: 8
    },
    {
      month: 'April',
      revenue: 'TZS 6,200,000',
      licenses: 61,
      complaints: 5
    }
  ];

}
