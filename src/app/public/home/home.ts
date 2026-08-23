import { CommonModule } from '@angular/common';

import {
  Component,
  inject
} from '@angular/core';

import {
  RouterLink
} from '@angular/router';

import {
  Language,
  LanguageService
} from '../../services/language.service';
import { TranslatePipe } from './pipes/translate.pipe';




@Component({

  selector: 'app-home',

  imports: [
    CommonModule,
    RouterLink,
    TranslatePipe
  ],

  templateUrl: './home.html',

  styleUrl: './home.css'

})
export class Home {

  isMenuOpen = false;

  languageService =
    inject(LanguageService);


  toggleMenu(): void {

    this.isMenuOpen =
      !this.isMenuOpen;

  }


  changeLanguage(
    language: Language
  ): void {

    this.languageService
      .setLanguage(language);

  }


  get currentLanguage(): Language {

    return this.languageService
      .currentLanguage;

  }

}