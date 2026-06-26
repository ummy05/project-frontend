import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-report-issue',
  imports: [CommonModule,FormsModule],
  templateUrl: './report-issue.html',
  styleUrl: './report-issue.css',
})
export class ReportIssue implements OnInit, OnDestroy {
  currentSlide = 0;
  interval: any;

  slides = [

  {
    number: '01',
    title: 'Beach Pollution',
    description:
      'Plastic and waste pollution damages our beaches and marine life.',
    image:
      'https://images.unsplash.com/photo-1621451537084-482c73073a0f'
  },

  {
    number: '02',
    title: 'Illegal Fishing',
    description:
      'Unauthorized fishing activities harm marine ecosystems.',
    image:
      'https://images.unsplash.com/photo-1516939884455-1445c8652f83'
  },

  {
    number: '03',
    title: 'Coral Reef Damage',
    description:
      'Damage to coral reefs affects marine biodiversity.',
    image:
      'https://images.unsplash.com/photo-1544551763-46a013bb70d5'
  },

  {
    number: '04',
    title: 'Oil Spill',
    description:
      'Oil spills pollute water and threaten coastal communities.',
    image:
      'https://images.unsplash.com/photo-1473773508845-188df298d2d1'
  },

  {
    number: '05',
    title: 'Coastal Erosion',
    description:
      'Coastal erosion threatens beaches, infrastructure and local communities.',
    image:
      'https://images.unsplash.com/photo-1500375592092-40eb2168fd21'
  },

  {
    number: '06',
    title: 'Illegal Waste Dumping',
    description:
      'Improper disposal of waste pollutes beaches and damages ecosystems.',
    image:
      'https://images.unsplash.com/photo-1532996122724-e3c354a0b15b'
  }

];

  ngOnInit(): void {

    this.interval = setInterval(() => {
      this.nextSlide();
    }, 1000);

  }

  ngOnDestroy(): void {

    if (this.interval) {
      clearInterval(this.interval);
    }

  }

  nextSlide() {

    if (this.currentSlide < this.slides.length - 1) {
      this.currentSlide++;
    } else {
      this.currentSlide = 0;
    }

  }

  prevSlide() {

  if (this.currentSlide > 0) {
    this.currentSlide--;
  } else {
    this.currentSlide = this.slides.length - 4;
  }

}

  goToSlide(index: number) {
    this.currentSlide = index;
  }

  selectedFile = '';

  submitted = false;

  onFileChange(event: any) {

    const file = event.target.files[0];

    if (file) {
      this.selectedFile = file.name;
    }

  }

  submitReport() {
    this.submitted = true;

    setTimeout(() => {
      this.submitted = false;
    }, 4000);
  }

  

}
